import { Link, LoaderFunction, useLoaderData } from "remix";
import getContracts from "~/data/getContracts.server";

const ContractPage = () => {
  const { contracts } =
    useLoaderData<Awaited<ReturnType<typeof getContracts>>>();
  return !contracts?.length ? (
    <div>You do not have any live contracts</div>
  ) : (
    <ul>
      {contracts.map(({ id, agreementUuid }) => (
        <li key={id}>
          <Link to={agreementUuid}>Go to contract</Link>
        </li>
      ))}
    </ul>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await import("@clerk/remix/ssr.server.js").then((clerk) =>
    clerk.getAuth(request)
  );
  console.log(userId);
  return getContracts({ userId });
};

export default ContractPage;
