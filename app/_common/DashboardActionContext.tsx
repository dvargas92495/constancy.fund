import React, { useState, useContext } from "react";

const DashboardActionContext = React.createContext({
  showPrimary: false,
  showSecondary: false,
  setShowPrimary: (_: boolean) => {},
  setShowSecondary: (_: boolean) => {},
});

export const useDashboardActions = () => useContext(DashboardActionContext);

const DashboardActionContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [showPrimary, setShowPrimary] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  return (
    <DashboardActionContext.Provider
      value={{ showPrimary, setShowPrimary, showSecondary, setShowSecondary }}
    >
      {children}
    </DashboardActionContext.Provider>
  );
};

export default DashboardActionContextProvider;
