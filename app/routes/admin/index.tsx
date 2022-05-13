import { Link } from "@remix-run/react";

const AdminIndexPage = () => {
  return (
    <div>
      This is the admin home page. <Link to={"/user"}>Click here</Link> to
      return to your user page.
    </div>
  );
};

export default AdminIndexPage;
