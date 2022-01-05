import isr from "fuegojs/dist/isr";
import { targetedDeploy } from "fuegojs/dist/deploy";
import { FE_OUT_DIR } from "fuegojs/dist/common";
import path from "path";
import * as Page from "../pages/creator/[id]";
import * as data from "../pages/creator/[id].data";
import * as _html from "../pages/_html";

export const handler = ({ id }: { id: string }) =>
  isr({ Page, data, _html, params: { id }, path: "creator/[id].js" }).then(() =>
    targetedDeploy([path.join(FE_OUT_DIR, "creator", `${id}.html`)])
  );

export type Handler = typeof handler;
