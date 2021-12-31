import FUNDRAISE_TYPES from "../db/fundraise_types";
import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import isa from "../db/fundraise_content/isa";

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
    columnWidths: number[];
    indent: number;
    paragraphGap: number;
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
  const outFile = path.join(
    process.env.FE_DIR_PREFIX || ".",
    "out",
    "_contracts",
    uuid,
    "draft.pdf"
  );
  return Promise.all([
    prismaClient.contract
      .findFirst({
        select: { type: true },
        where: { uuid },
      })
      .then((contract) =>
        contract ? contentByType[FUNDRAISE_TYPES[contract.type].id] : {}
      )
      .then((data) => data as ContractData),
    prismaClient.contractDetail.findMany({
      select: { label: true, value: true },
      where: { contractUuid: uuid },
    }),
  ]).then(([data]) => {
    const doc = new PDFDocument();
    const dirname = path.dirname(outFile);
    if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
    doc.pipe(fs.createWriteStream(outFile));
    const renderText = (part: TextPart) => {
      const { argument = "", options = {} } = part;
      const { font = DEFAULT_FONT, x = 0, y = 0, ...opts } = options;
      doc.font(font);
      if (x > 0 || y > 0) {
        doc.text(argument, x, y, opts);
      } else {
        doc.text(argument, opts);
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
        const widths = columnWidths.map((c) => c * usableWidth);
        doc.lineWidth(0.7).opacity(0.8);
        heights.forEach((h, y, hts) => {
          const offsetY = hts.slice(0, y).reduce((p, c) => p + c, 0) + startY;
          widths.forEach((w, x, wts) => {
            const offsetX = wts.slice(0, x).reduce((p, c) => p + c, 0) + startX;
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
        doc.x = doc.page.margins.left;
        doc.y = startY + heights.reduce((p, c) => p + c, 0) + paragraphGap;
      } else if (part.method === "addPage") {
        doc.addPage();
      }
    });
    doc.end();
  });
};
export type Handler = typeof handler;
