import styled from "@emotion/styled";
import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemProps,
  ListItemText,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import {
  ButtonListRightStyled,
  EmptyDefault,
  TradeBtnStatus,
  Button,
  ModalQRCode,
} from "@loopring-web/component-lib";
import React from "react";
import { useTranslation } from "react-i18next";
import { SecurityIcon } from "@loopring-web/common-resources";
import { useAccount } from "../../stores/account";

const HebaoListItemStyled = styled(ListItem)<ListItemProps>`
  height: var(--Hebao-activited-heigth);
  overflow: hidden;
  padding: ${({ theme }) => theme.unit}px ${({ theme }) => theme.unit}px;
  background-color: var(--opacity);
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-divide);
    // margin-bottom: ${({ theme }) => theme.unit}px;
  }

  .MuiListItemText-root {
    margin-top: 0;
    white-space: pre-line;
  }
  .description {
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: pre-line;
  }
  .MuiListItemAvatar-root {
    width: 1em;
    height: 100%;
  }
` as (prosp: ListItemProps) => JSX.Element;

export const HebaoListItem = (props: any) => {
  // const { t } = useTranslation(["common"]);
  const history = useHistory();
  const { title, description1, description2 } = props;

  return (
    <HebaoListItemStyled
      alignItems="flex-start"
      onClick={() => history.replace(`/Hebao/${props.link}`)}
      className={`Hebao`}
    >
      <ListItemAvatar />
      <Box
        className={"Hebao-content"}
        component={"section"}
        display={"flex"}
        alignItems={"flex-start"}
        flexDirection={"column"}
        overflow={"hidden"}
      >
        <ListItemText
          primary={() => (
            <div dangerouslySetInnerHTML={{ __html: title ?? "" }} />
          )}
          primaryTypographyProps={{ component: "h4", color: "textPrimary" }}
        />
        <ListItemText
          className="description description1"
          primary={() => (
            <div dangerouslySetInnerHTML={{ __html: description1 ?? "" }} />
          )}
          primaryTypographyProps={{
            component: "p",

            variant: "body1",
            color: "textPrimary",
          }}
        />
        <ListItemText
          className="description description2"
          primary={() => (
            <div dangerouslySetInnerHTML={{ __html: description2 ?? "" }} />
          )}
          primaryTypographyProps={{
            component: "p",
            variant: "body2",
            color: "textSecondary",
          }}
        />
      </Box>
    </HebaoListItemStyled>
  );
};
const StylePaper = styled(Box)`
  background: var(--color-box);
  border-radius: ${({ theme }) => theme.unit}px;
`;
export const HebaoProtector = <T extends any[]>({
  protectList,
}: {
  protectList: T;
}) => {
  const { account } = useAccount();
  const { t } = useTranslation(["common"]);
  const onShowQRCode = () => undefined;
  const [openQRCode, setOpenQRCode] = React.useState(false);

  // const verifyCodeModal = showVerifyCodeModal ? (
  //   <VerifyCodeModal
  //     instruction={<I s="verify-code-instruction" />}
  //     onClose={() => {
  //       setShowVerifyCodeModal(false);
  //     }}
  //     onProceed={async (code) => {
  //       console.log("window.wallet.approveHebao", currentRequest);
  //       try {
  //         let result = {};
  //         let isContract = await window.wallet.isContract();
  //         if (isContract === true) {
  //           console.log("isContract use approveHebaoForContract");
  //           const wallet = currentRequest.signedRequest.wallet;
  //           const validUntil = currentRequest.signedRequest.validUntil;
  //           const obj = JSON.parse(currentRequest.businessDataJson);
  //           const newOwner = obj.value.value.newOwner;
  //           console.log("businessDataJson", obj);
  //           result = await window.wallet.approveHebaoForContract(
  //             chainId,
  //             guardianModule,
  //             wallet,
  //             validUntil,
  //             newOwner
  //           );
  //           console.log("approveHebaoForContract", result);
  //         } else {
  //           console.log("not isContract use approveHebao");
  //           result = await window.wallet.approveHebao(
  //             currentRequest.messageHash
  //           );
  //           console.log("approveHebao", result);
  //         }
  //
  //         await submitApproveSignature({
  //           approveRecordId: currentRequest.id,
  //           txAwareHash: currentRequest.messageHash,
  //           securityNumber: code,
  //           signer: address,
  //           signature: result.result.sig + result.result.signType,
  //         });
  //         setLoading(true);
  //         const approves = await getApproveList(address);
  //         setRequests(approves);
  //         setLoading(false);
  //       } catch (e) {
  //         console.log("error", e);
  //         addToast(<I s={"approve-request-failed"} />, {
  //           appearance: "error",
  //           autoDismiss: true,
  //         });
  //       }
  //     }}
  //   />
  // ) : null;
  return (
    <>
      <ModalQRCode
        open={openQRCode}
        onClose={() => setOpenQRCode(false)}
        title={() => {
          return (
            <Typography component={"h4"} textAlign={"center"}>
              <Typography
                color={"var(--color-text-primary)"}
                component={"p"}
                variant={"h5"}
              >
                {t("labelHebaoAddAsGuardian")}
              </Typography>
              <Typography
                color={"var(--color-text-secondary)"}
                component={"p"}
                variant={"body1"}
              >
                {t("labelHebaoScanQRCode")}
              </Typography>
            </Typography>
          );
        }}
        description={() => {
          return (
            <Typography
              component={"div"}
              textAlign={"center"}
              variant={"body2"}
              color={"var(--color-text-third)"}
            >
              <Typography color={"inherit"} component={"p"} variant={"inherit"}>
                {account?.accAddress}
              </Typography>
              <Typography color={"inherit"} component={"p"} variant={"inherit"}>
                {account?.connectName}
              </Typography>
            </Typography>
          );
        }}
        url={`ethereum:${account?.accAddress}?type=${account?.connectName}&action=HebaoAddGuardian`}
      />
      <StylePaper
        padding={3}
        borderRadius={2}
        flex={1}
        display={"flex"}
        flexDirection={"column"}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography component={"h3"} variant={"h5"}>
            {t("labelHebaoAddAsaProtector")}
          </Typography>
          <ButtonListRightStyled
            item
            xs={5}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
          >
            <Button
              variant={"contained"}
              size={"small"}
              color={"primary"}
              startIcon={
                <SecurityIcon htmlColor={"var(--color-text-button)"} />
              }
              onClick={() => onShowQRCode()}
            >
              {t("labelAddProtector")}
            </Button>
          </ButtonListRightStyled>
        </Box>
        <Box flex={1} alignItems={"center"}>
          {protectList.length ? (
            <></>
          ) : (
            <EmptyDefault
              style={{ alignSelf: "center" }}
              height={"100%"}
              message={() => (
                <Box
                  flex={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  No Content
                </Box>
              )}
            />
          )}
        </Box>
      </StylePaper>
    </>
  );
};
