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
  };
};
type ContractPart = TextPart | MoveDownPart | ListPart | TablePart;
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
        const { indent = 0, columnWidths = [] } = part.options;
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
          row.forEach((cell, c) => {
            const x =
              columnWidths.slice(0, c).reduce((prev, cur) => prev + cur, 0) *
                usableWidth +
              startX;
            const y =
              heights.slice(0, r).reduce((prev, cur) => prev + cur, 0) + startY;
            let height = 0;
            cell.forEach((part) => {
              renderText({
                ...part,
                options: {
                  ...part.options,
                  x,
                  y,
                  width: columnWidths[c] * usableWidth,
                },
              });
              height += doc.heightOfString(part.argument, part.options);
            });
            if (height > maxHeight) {
              maxHeight = height;
            }
          });
          heights.push(maxHeight);
        });
        /*
        const widths = columnWidths.map(c => c*usableWidth); 
        heights.forEach((h, y) => {
          widths.forEach((w, x) => {
            doc.moveTo(startX + x)
          })
        })*/
      }
    });
    doc.end();
  });
};
export type Handler = typeof handler;
