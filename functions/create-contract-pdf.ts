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
type ContractData = {
  parts?: {
    method: "text" | "moveDown";
    argument: string;
    options: PDFKit.Mixins.TextOptions & { font: string };
  }[];
};

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
    (data.parts || []).forEach(
      ({ method = "text", argument = "", options = {} }) => {
        if (method === "text") {
          const { font = "Helvetica", ...opts } = options;
          doc.font(font);
          doc.text(argument, opts);
        } else if (method === "moveDown") {
          doc.moveDown();
        }
      }
    );
    doc.end();
  });
};
export type Handler = typeof handler;
