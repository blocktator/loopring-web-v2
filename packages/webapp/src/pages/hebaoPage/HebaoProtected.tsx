import styled from "@emotion/styled";
import {
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemProps,
  ListItemText,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { EmptyDefault } from "@loopring-web/component-lib";
import React from "react";
import { useTranslation } from "react-i18next";

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
  //width: 100%;
  //height: 100%;
  background: var(--color-box);
  border-radius: ${({ theme }) => theme.unit}px;
`;

export const HebaoProtected = () => {
  const protectList = [];
  const { t } = useTranslation(["common"]);
  return (
    <StylePaper
      padding={3}
      borderRadius={2}
      flex={1}
      display={"flex"}
      flexDirection={"column"}
    >
      <Typography component={"h3"} variant={"h5"}>
        {t("labelHebaoAddAsaProtector")}
        <Button></Button>
      </Typography>
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
  );
};
