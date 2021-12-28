import { WithTranslation, withTranslation } from "react-i18next";
import React from "react";
import {
  AccountStatus,
  i18n,
  myLog,
  SagaStatus,
  subMenuHebao,
  subMenuLayer2,
} from "@loopring-web/common-resources";
import { Box, Typography } from "@mui/material";
import {
  Button,
  setShowConnect,
  SubMenu,
  SubMenuList,
  WalletConnectStep,
} from "@loopring-web/component-lib";
import { changeShowModel, useAccount } from "../../stores/account";
import _ from "lodash";
import {
  accountStaticCallBack,
  btnLabel,
} from "../../layouts/connectStatusCallback";
import store from "../../stores";
import { HebaoProtected } from "./HebaoProtected";

import { useRouteMatch } from "react-router-dom";
import { HebaoValidationInfo } from "./HebaoValidationInfo";

const BtnConnect = withTranslation(["common", "layout"], { withRef: true })(
  ({ t }: any) => {
    const { status: accountStatus, account } = useAccount();
    const [label, setLabel] = React.useState(undefined);
    const _btnLabel = Object.assign(_.cloneDeep(btnLabel));
    React.useEffect(() => {
      if (accountStatus === SagaStatus.UNSET) {
        setLabel(accountStaticCallBack(_btnLabel));
      }
    }, [accountStatus, account.readyState, i18n.language]);

    return (
      <Button
        variant={"contained"}
        size={"large"}
        color={"primary"}
        fullWidth={true}
        style={{ maxWidth: "280px" }}
        onClick={() => {
          myLog("UN_CONNECT!");
          store.dispatch(changeShowModel({ _userOnModel: true }));
          store.dispatch(
            setShowConnect({ isShow: true, step: WalletConnectStep.Provider })
          );
        }}
      >
        {t(label)}
      </Button>
    );
  }
) as typeof Button;
export const HebaoPage = withTranslation(["common"])(
  ({ t, ...rest }: WithTranslation) => {
    const { account } = useAccount();
    let match = useRouteMatch("/hebao/:item");
    // @ts-ignore
    const selected = match?.params?.item ?? "myProtected";
    const hebaoRouter = React.useMemo(() => {
      switch (selected) {
        case "hebao-protected":
          return <HebaoProtected />;
        case "hebao-validation-info":
          return <HebaoValidationInfo />;
        default:
          <HebaoProtected />;
      }
    }, [selected]);

    const viewTemplate = React.useMemo(() => {
      switch (account.readyState) {
        case AccountStatus.UN_CONNECT:
          return (
            <Box
              flex={1}
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography marginY={3} variant={"h1"} textAlign={"center"}>
                {t("describeTitleConnectToWallet")}
              </Typography>
              <BtnConnect />
            </Box>
          );
          break;
        case AccountStatus.LOCKED:
        case AccountStatus.NO_ACCOUNT:
        case AccountStatus.NOT_ACTIVE:
        case AccountStatus.DEPOSITING:
        case AccountStatus.ACTIVATED:
          return (
            <>
              <Box
                width={"200px"}
                display={"flex"}
                justifyContent={"stretch"}
                marginRight={3}
                marginBottom={2}
                className={"MuiPaper-elevation2"}
              >
                <SubMenu>
                  <SubMenuList
                    selected={selected}
                    subMenu={subMenuHebao as any}
                  />
                </SubMenu>
              </Box>
              <Box
                minHeight={420}
                display={"flex"}
                alignItems={"stretch"}
                flexDirection={"column"}
                marginTop={0}
                flex={1}
              >
                {hebaoRouter}
              </Box>
            </>
          );
          break;
        case AccountStatus.ERROR_NETWORK:
          return (
            <Box
              flex={1}
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography marginY={3} variant={"h1"} textAlign={"center"}>
                {t("describeTitleOnErrorNetwork", {
                  connectName: account.connectName,
                })}
              </Typography>
              {/*<BtnConnect/>*/}
            </Box>
          );
          break;
        default:
          break;
      }
    }, [account.readyState]);
    return <>{viewTemplate}</>;
  }
);
