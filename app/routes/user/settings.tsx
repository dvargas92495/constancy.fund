import { UserProfile } from "@clerk/remix";

const UserSettings = () => {
  return <UserProfile />;
};

export const handle = {
  title: "Your Settings",
  // primaryLabel: "Save Edits",
  // secondaryLabel: "View Public Profile",
  // onSecondary: (data: LoaderData) => window.open(`/creator/${data.id}`),
};

export default UserSettings;
