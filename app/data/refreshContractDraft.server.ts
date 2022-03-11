import invokeAsync from "@dvargas92495/api/invokeAsync";
import type { Handler as AsyncHandler } from "../../functions/create-contract-pdf";
import waitForContract from "./waitForContractDraft.server";

const refreshContractDraft = ({ uuid }: { uuid: string }) =>
  invokeAsync<Parameters<AsyncHandler>[0]>({
    path: "create-contract-pdf",
    data: { uuid },
  })
    .then(() => waitForContract(uuid))
    .then((success) => {
      if (success) {
        return {
          success,
        };
      } else {
        throw new Error(
          `Timed out waiting for contract ${uuid} to finish generating`
        );
      }
    });

export default refreshContractDraft;
