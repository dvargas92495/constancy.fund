import axios from "axios";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";

const logic = ({ id, email }: { id: string, email: string }) =>
  axios
    .post<{ subscription: { subscriber: { id: string } } }>(
      `https://api.convertkit.com/v3/forms/${id}/subscribe`,
      {
        api_key: process.env.CONVERTKIT_API_KEY,
        email,
      }
    )
    .then(() => ({ success: true }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
