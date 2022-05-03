import type { Handler as AsyncHandler } from "../../api/create-contract-pdf";
import waitForContract from "./waitForContractDraft.server";
import invokeAsync from "./invokeAsync.server";

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
    })
    .catch(() => {
      return { success: false };
    });

export default refreshContractDraft;
