import FUNDRAISE_TYPES from "../app/enums/fundraiseTypes";
import getMysql from "../app/data/mysql.server";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import isa from "../app/enums/isa";
import { targetedDeploy } from "fuegojs/dist/deploy";
import { FE_PUBLIC_DIR } from "fuegojs/dist/common";
import datefnsFormat from "date-fns/format";
import addDays from "date-fns/addDays";
import type { User } from "@clerk/clerk-sdk-node";
import addMonths from "date-fns/addMonths";
import formatAmount from "../app/util/formatAmount";
import { EventEmitter } from "stream";

const contentByType = {
  isa: isa,
  loan: {},
  custom: {},
};

const DEFAULT_FONT = "Helvetica";
type NestedString = string | string[] | NestedString[];
type TextPart = {
  method: "text";
  argument: string;
  options: PDFKit.Mixins.TextOptions & {
    font?: string;
    fontSize?: number;
    x?: number;
    y?: number;
    highlighted?: true;
  };
};
type MoveDownPart = { method: "moveDown" };
type AddPagePart = { method: "addPage" };
type ListPart = {
  method: "list";
  argument: NestedString;
};
type TablePart = {
  method: "table";
  argument: TextPart[][][];
  options: {
    columnWidths?: number[];
    indent?: number;
    paragraphGap?: number;
    hideLines?: boolean;
    padding?: number;
  };
};
type DynamicPart = {
  method: "dynamic";
  argument: string;
};
type ContractPart =
  | TextPart
  | MoveDownPart
  | ListPart
  | TablePart
  | AddPagePart
  | DynamicPart;
type ContractData = {
  parts?: ContractPart[];
};

type ContractDetailData = { [key: string]: string | Date | ContractDetailData };

export const handler = ({
  uuid,
  outfile = "draft",
  inputData = {},
}: {
  uuid: string;
  outfile?: string;
  inputData?: Record<string, string>;
}) => {
  const outFile = path.join(
    FE_PUBLIC_DIR,
    "_contracts",
    uuid,
    `${outfile}.pdf`
  );
  return getMysql().then(({ execute, destroy }) =>
    Promise.all([
      execute(
        `SELECT type, userId
       FROM contract
       WHERE uuid = ?`,
        [uuid]
      ).then((results): Promise<{ data: ContractData; user: User }> | null => {
        const [contract] = results as { type: number; userId: string }[];
        if (!contract) {
          return null;
        }
        return import("@clerk/clerk-sdk-node")
          .then((clerk) => clerk.users.getUser(contract?.userId))
          .then((user) => ({
            data: contentByType[
              FUNDRAISE_TYPES[contract.type].id
            ] as ContractData,
            user,
          }));
      }),
      execute(
        `SELECT label, value
       FROM contractdetail
       WHERE contractUuid = ?`,
        [uuid]
      ).then((res) => res as { label: string; value: string }[]),
      execute(
        `SELECT value
       FROM contractclause
       WHERE contractUuid = ?`,
        [uuid]
      ).then((res) => res as { value: string }[]),
    ])
      .then(
        ([contract, details, clauses]) =>
          new Promise((resolve, reject) => {
            destroy();
            const doc = new PDFDocument();
            const dirname = path.dirname(outFile);
            if (!fs.existsSync(dirname))
              fs.mkdirSync(dirname, { recursive: true });
            if (fs.existsSync(outFile)) fs.rmSync(outFile);
            const stream = fs.createWriteStream(outFile);
            return new Promise<void>((innerResolve) => {
              stream.on("open", () => {
                doc.pipe(stream);
                innerResolve();
              });
              stream.on("error", (e) => {
                stream.close();
                reject(e);
              });
              stream.on("finish", resolve);
            })
              .then(() => {
                if (!contract) {
                  doc.end();
                  return;
                }
                const { data, user } = contract;
                const detailsData: ContractDetailData = {
                  date: new Date(),
                  full_name: `${user.firstName} ${user.lastName}`,
                  address: `${user.publicMetadata.companyAddressNumber} ${user.publicMetadata.companyAddressStreet}, ${user.publicMetadata.companyAddressCity}, ${user.publicMetadata.companyAddressZip}`,
                  ...Object.fromEntries(
                    details.map(({ label, value }) => [label, value])
                  ),
                  clauses: Object.fromEntries(
                    clauses.map((c, i) => [i, c.value])
                  ),
                  clauses_length: clauses.length.toString(),
                  creator_type:
                    (user.publicMetadata.creatorType as string) ||
                    "an individual",
                  country:
                    (user.publicMetadata.registeredCountry as string) ||
                    "the United States",
                  ...inputData,
                };
                const interpolate = (argument: string) =>
                  argument.replace(
                    /{([a-z_.0-9]+)(?::([^}]+))?}/g,
                    (orig, key: string, format: string = "") => {
                      if (key === "multiply") {
                        return format
                          .split(",")
                          .map((s) => detailsData[s] || s)
                          .map((s) => Number(s) || 1)
                          .reduce((p, c) => p * c, 1)
                          .toString();
                      } else if (key === "divide") {
                        const [a, ...b] = format
                          .split(",")
                          .map((s) => detailsData[s] || s)
                          .map((s) => Number(s) || 1);
                        return b.reduce((p, c) => p / c, a).toFixed(2);
                      } else if (key === "conditional") {
                        const [
                          actualKey,
                          toCompare = "",
                          ifTrue = "",
                          ifFalse = "",
                        ] = format.split(",");
                        if (detailsData[actualKey] === toCompare) {
                          return ifTrue;
                        } else {
                          return ifFalse;
                        }
                      }
                      const value =
                        key
                          .split(".")
                          .reduce(
                            (p, k) =>
                              typeof p === "object" && !(p instanceof Date)
                                ? p[k]
                                : p,
                            detailsData as ContractDetailData[string]
                          ) || "";
                      if (!value) {
                        return orig;
                      } else if (value instanceof Date) {
                        const [f, offset = "0", interval = "addDays"] =
                          format.split(":");
                        const numericOffset = Number(offset);
                        const newValue =
                          interval === "addMonths"
                            ? addMonths(value, numericOffset)
                            : addDays(value, numericOffset);
                        return datefnsFormat(newValue, f);
                      } else if (typeof value === "object") {
                        return JSON.stringify(value);
                      } else if (!isNaN(Number(value))) {
                        return formatAmount(Number(value));
                      } else {
                        return value;
                      }
                    }
                  );

                const lineHeight = doc.currentLineHeight();
                const highlights: {
                  x: number;
                  y: number;
                  w: number;
                  h: number;
                }[] = [];
                const watchers = new Set<EventEmitter>();
                let isHighlighted = false;

                const renderText = (part: TextPart) => {
                  const { argument = "", options = {} } = part;
                  const {
                    font = DEFAULT_FONT,
                    x = 0,
                    y = 0,
                    fontSize = 12,
                    highlighted = false,
                    ...opts
                  } = options;
                  doc.font(font);
                  doc.fontSize(fontSize);
                  isHighlighted = highlighted;

                  const text = interpolate(argument);

                  // @ts-ignore hack to get highlighting
                  const watcher = doc._wrapper as EventEmitter;
                  if (opts.continued && !watchers.has(watcher) && watcher) {
                    watchers.add(watcher);
                    watcher.addListener("line", (_, opts) => {
                      if (isHighlighted) {
                        highlights.push({
                          x: doc.x,
                          y: doc.y - lineHeight - 4,
                          w: opts.textWidth,
                          h: lineHeight,
                        });
                      }
                    });
                  }
                  if (x > 0 || y > 0) {
                    doc.text(text, x, y, opts);
                  } else {
                    doc.text(text, opts);
                  }

                  if (!opts.continued) {
                    highlights.forEach((t) => {
                      doc.highlight(t.x, t.y, t.w, t.h, { color: "yellow" });
                    });
                    highlights.splice(0, highlights.length);
                  }
                  return text;
                };
                const parsePart = (part: ContractPart) => {
                  if (part.method === "text") {
                    renderText(part);
                  } else if (part.method === "moveDown") {
                    doc.moveDown();
                  } else if (part.method === "list") {
                    const { argument } = part;
                    doc.font(DEFAULT_FONT);
                    doc.list(
                      typeof argument === "string" ? [argument] : argument
                    );
                  } else if (part.method === "table") {
                    const {
                      indent = 0,
                      columnWidths = [],
                      paragraphGap = 0,
                      hideLines = false,
                      padding = 8,
                    } = part.options;
                    const startX = doc.page.margins.left + indent;
                    const startY = doc.y;
                    const usableWidth =
                      doc.page.width -
                      doc.page.margins.left -
                      doc.page.margins.right -
                      2 * indent;
                    const heights: number[] = [];
                    part.argument.forEach((row, r) => {
                      let maxHeight = 0;
                      const y =
                        heights
                          .slice(0, r)
                          .reduce((prev, cur) => prev + cur, 0) +
                        startY +
                        padding;
                      row.forEach((cell, c) => {
                        const x =
                          columnWidths
                            .slice(0, c)
                            .reduce((prev, cur) => prev + cur, 0) *
                            usableWidth +
                          startX +
                          padding;
                        let height = padding;
                        cell.forEach((part, p) => {
                          const options = {
                            ...part.options,
                            ...(p === 0 ? { x, y } : {}),
                            width: columnWidths[c] * usableWidth - 2 * padding,
                          };
                          const output = renderText({
                            ...part,
                            options,
                          });
                          height += doc.heightOfString(output, options);
                        });
                        if (height > maxHeight) {
                          maxHeight = height;
                        }
                      });
                      heights.push(maxHeight);
                    });
                    if (!hideLines) {
                      const widths = columnWidths.map((c) => c * usableWidth);
                      doc.lineWidth(0.7).opacity(0.8);
                      heights.forEach((h, y, hts) => {
                        const offsetY =
                          hts.slice(0, y).reduce((p, c) => p + c, 0) + startY;
                        widths.forEach((w, x, wts) => {
                          const offsetX =
                            wts.slice(0, x).reduce((p, c) => p + c, 0) + startX;
                          doc
                            .moveTo(offsetX, offsetY)
                            .lineTo(offsetX + w, offsetY)
                            .lineTo(offsetX + w, offsetY + h)
                            .lineTo(offsetX, offsetY + h)
                            .lineTo(offsetX, offsetY)
                            .stroke();
                        });
                      });
                      doc.lineWidth(1.0).opacity(1.0);
                    }
                    doc.x = doc.page.margins.left;
                    doc.y =
                      startY +
                      heights.reduce((p, c) => p + c, 0) +
                      paragraphGap;
                  } else if (part.method === "addPage") {
                    doc.addPage();
                  } else if (part.method === "dynamic") {
                    const newPart = new Function(
                      interpolate(part.argument)
                    )() as ContractPart | ContractPart[];
                    const parts = Array.isArray(newPart) ? newPart : [newPart];
                    parts.forEach(parsePart);
                  }
                };
                (data.parts || []).forEach(parsePart);
                doc.end();
              })
              .catch((e) => {
                stream.close();
                return Promise.reject(e);
              });
          })
      )
      .then(() => {
        console.log("time to deploy");
        return targetedDeploy([outFile]);
      })
  );
};

export type Handler = typeof handler;
