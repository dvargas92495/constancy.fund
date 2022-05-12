const verifyAdminUser = (userId: string) =>
  import("@clerk/clerk-sdk-node")
    .then((clerk) => clerk.users.getUser(userId))
    .then((user) => {
      const isAdmin = user.emailAddresses.find((u) =>
        u.emailAddress?.endsWith("constancy.fund")
      );
      if (!isAdmin) {
        return Promise.reject();
      }
      return Promise.resolve();
    });

export default verifyAdminUser;
