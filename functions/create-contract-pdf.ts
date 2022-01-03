import FUNDRAISE_TYPES from "../db/fundraise_types";
import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import isa from "../db/fundraise_content/isa";
import { targetedDeploy } from "fuegojs/dist/deploy";
import { FE_OUT_DIR } from "fuegojs/dist/common";
import datefnsFormat from "date-fns/format";
import { users, User } from "@clerk/clerk-sdk-node";

const contentByType = {
  isa: isa,
  loan: {},
  saft: {},
  safe: {},
};

const prismaClient = new PrismaClient();
const DEFAULT_FONT = "Helvetica";
type NestedString = string | string[] | NestedString[];
type TextPart = {
  method: "text";
  argument: string;
  options: PDFKit.Mixins.TextOptions & {
    font?: string;
    x?: number;
    y?: number;
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
    hideLines?: false;
  };
};
type ContractPart =
  | TextPart
  | MoveDownPart
  | ListPart
  | TablePart
  | AddPagePart;
type ContractData = {
  parts?: ContractPart[];
};

const getFirst = (s: NestedString): string =>
  typeof s === "string" ? s : getFirst(s[0]);

export const handler = ({ uuid }: { uuid: string }) => {
  const outFile = path.join(FE_OUT_DIR, "_contracts", uuid, "draft.pdf");
  return Promise.all([
    prismaClient.contract
      .findFirst({
        select: { type: true, userId: true },
        where: { uuid },
      })
      .then((contract): Promise<{ data: ContractData; user: User }> | null =>
        contract
          ? users.getUser(contract?.userId).then((user) => ({
              data: contentByType[
                FUNDRAISE_TYPES[contract.type].id
              ] as ContractData,
              user,
            }))
          : null
      ),
    prismaClient.contractDetail.findMany({
      select: { label: true, value: true },
      where: { contractUuid: uuid },
    }),
  ])
    .then(([contract, details]) => {
      const doc = new PDFDocument();
      const dirname = path.dirname(outFile);
      if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
      doc.pipe(fs.createWriteStream(outFile));
      if (!contract) {
        doc.end();
        return;
      }
      const { data, user } = contract;
      const detailsData: Record<string, string | Date> = {
        date: new Date(),
        full_name: `${user.firstName} ${user.lastName}`,
        address: `${user.publicMetadata.companyAddressNumber} ${user.publicMetadata.companyAddressStreet}, ${user.publicMetadata.companyAddressCity}, ${user.publicMetadata.companyAddressZip}`,
        ...Object.fromEntries(
          details.map(({ label, value }) => [label, value])
        ),
      };
      const renderText = (part: TextPart) => {
        const { argument = "", options = {} } = part;
        const { font = DEFAULT_FONT, x = 0, y = 0, ...opts } = options;
        doc.font(font);
        const text = argument.replace(
          /{([a-z_]+)(?::([^}]+))?}/g,
          (orig, key: string, format: string = "") => {
            if (key === "multiply") {
              return format
                .split(",")
                .map((s) => detailsData[s] || s)
                .map((s) => Number(s) || 1)
                .reduce((p, c) => p * c, 1)
                .toString();
            } else if (key === "divide") {
              const [a, b = 1] = format
                .split(",")
                .map((s) => detailsData[s] || s)
                .map((s) => Number(s) || 1);
              return `${(a / b).toFixed(0)}`;
            } else if (key === "conditional") {
              const [actualKey, toCompare = "", ifTrue = "", ifFalse = ""] =
                format.split(",");
              if (detailsData[actualKey] === toCompare) {
                return ifTrue;
              } else {
                return ifFalse;
              }
            }
            const value = detailsData[key] || "";
            if (!value) {
              return orig;
            } else if (value instanceof Date) {
              return datefnsFormat(value, format);
            } else if (!isNaN(Number(value))) {
              const [predecimal, postdecimal] = value.split(".");
              const order = predecimal.length;
              return `${predecimal
                .split("")
                .reverse()
                .map((d, i) => (i % 3 === 2 && i !== order ? `,${d}` : d))
                .reverse()
                .join("")}${postdecimal ? `.${postdecimal.slice(0, 2)}` : ""}`;
            } else {
              return value;
            }
          }
        );
        if (x > 0 || y > 0) {
          doc.text(text, x, y, opts);
        } else {
          doc.text(text, opts);
        }
      };
      (data.parts || []).forEach((part) => {
        if (part.method === "text") {
          renderText(part);
        } else if (part.method === "moveDown") {
          doc.moveDown();
        } else if (part.method === "list") {
          const { argument } = part;
          doc.font(DEFAULT_FONT);
          doc.list(typeof argument === "string" ? [argument] : argument);
        } else if (part.method === "table") {
          const {
            indent = 0,
            columnWidths = [],
            paragraphGap = 0,
            hideLines = false,
          } = part.options;
          const startX = doc.page.margins.left + indent;
          const startY = doc.y;
          const usableWidth =
            doc.page.width -
            doc.page.margins.left -
            doc.page.margins.right -
            2 * indent;
          const heights: number[] = [];
          const padding = 8;
          part.argument.forEach((row, r) => {
            let maxHeight = 0;
            const y =
              heights.slice(0, r).reduce((prev, cur) => prev + cur, 0) +
              startY +
              padding;
            row.forEach((cell, c) => {
              const x =
                columnWidths.slice(0, c).reduce((prev, cur) => prev + cur, 0) *
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
                renderText({
                  ...part,
                  options,
                });
                height += doc.heightOfString(part.argument, options);
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
          doc.y = startY + heights.reduce((p, c) => p + c, 0) + paragraphGap;
        } else if (part.method === "addPage") {
          doc.addPage();
        }
      });
      doc.end();
    })
    .then(() => targetedDeploy([outFile]));
};
export type Handler = typeof handler;
