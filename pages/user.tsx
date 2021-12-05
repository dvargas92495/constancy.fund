import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import clerkUserProfileCss from "@dvargas92495/ui/dist/clerkUserProfileCss";
import { SignedIn, UserProfile } from "@clerk/clerk-react";

const UserPage: React.FunctionComponent = () => (
  <Layout>
    <SignedIn>
      <UserProfile />
    </SignedIn>
    <RedirectToLogin />
  </Layout>
);

export const Head = (): React.ReactElement => (
  <LayoutHead
    title={"User"}
    styles={clerkUserProfileCss}
  />
);
export default UserPage;