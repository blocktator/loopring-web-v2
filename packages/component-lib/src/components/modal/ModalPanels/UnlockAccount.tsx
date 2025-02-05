import { Trans, WithTranslation } from "react-i18next";
import { UnlockAccountBase, IconType, PanelProps } from "./BasicPanel";
import { Link, Typography } from "@mui/material";

// symbol
export const UnlockAccount_WaitForAuth = (
  props: PanelProps & WithTranslation
) => {
  const propsPatch = {
    iconType: IconType.LoadingIcon,
    describe1: props.t("labelWaitForAuth"),
  };
  return <UnlockAccountBase {...props} {...propsPatch} />;
};

export const UnlockAccount_User_Denied = (
  props: PanelProps & WithTranslation
) => {
  const propsPatch = {
    iconType: IconType.RefuseIcon,
    describe1: <Trans i18nKey={"labelSignDenied"}></Trans>,
  };
  return <UnlockAccountBase {...propsPatch} {...props} />;
};

// symbol
export const UnlockAccount_Success = (props: PanelProps & WithTranslation) => {
  const propsPatch = {
    iconType: IconType.DoneIcon,
    describe1: <Trans i18nKey={"labelUnlockAccountSuccess"}></Trans>,
  };
  return <UnlockAccountBase {...propsPatch} {...props} />;
};

// value symbol
export const UnlockAccount_Failed = (
  props: PanelProps & WithTranslation & { resetAccount: () => void }
) => {
  const propsPatch = {
    iconType: IconType.FailedIcon,
    describe1: (
      <Typography component={"div"} display={"inline-flex"}>
        <Trans i18nKey={"labelUnlockAccountFailed"} />
        <Link onClick={props.resetAccount} paddingLeft={2}>
          {<Trans i18nKey={"labelReActiveAccount"} />}
        </Link>
      </Typography>
    ),
  };
  return <UnlockAccountBase {...propsPatch} {...props} />;
};
