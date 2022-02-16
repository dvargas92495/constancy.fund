import Box from "@mui/material/Box";
import { Outlet } from "remix";

const UserFundraise = () => {
  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Outlet />
    </Box>
  );
};

export default UserFundraise;
