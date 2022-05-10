import type { LoaderFunction } from "@remix-run/node";

const AdminAgreementsPage = () => {
  return (
    <div>
      <h1>View all of the agreements below.</h1>
    </div>
  );
};

export const loader: LoaderFunction = () => {
  return {
    agreements: [],
  };
};

export default AdminAgreementsPage;
