import React from "react";

export const useToast = () => {
  const [toastOpen, setToastOpen] = React.useState<
    | { open?: boolean; type: any; content: string | React.FC | JSX.Element }
    | undefined
  >(undefined);

  const closeToast = React.useCallback(() => {
    setToastOpen(undefined);
  }, [setToastOpen]);

  return {
    toastOpen,
    setToastOpen,
    closeToast,
  };
};
