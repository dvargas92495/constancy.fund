import dotenv from "dotenv";
import deleteFundraiseAsAdmin from "../../app/data/deleteFundraiseAsAdmin.server";
dotenv.config();

console.log("Running setup script...");
import("@clerk/clerk-sdk-node")
  .then((clerk) =>
    clerk.users.getUserList({
      emailAddress: [
        "test-creator@constancy.fund",
        "test-investor@constancy.fund",
      ],
    })
  )
  .then((users) => {
    console.log("found", users.length, "users");
    return Promise.all(
      users.map((u) => deleteFundraiseAsAdmin({ userId: u.id || "" }))
    );
  })
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((e) => {
    console.log("ERROR:");
    console.log(e);
    process.exit(1);
  });
