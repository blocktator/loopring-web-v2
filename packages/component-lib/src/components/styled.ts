import styled from "@emotion/styled";
import { BoxProps, Grid, Typography } from "@mui/material";
import { css, Theme } from "@emotion/react";
import { UpColor } from "@loopring-web/common-resources";
import { Box } from "@mui/material";
import React from "react";
import { Button } from "./basic-lib";

// @ts-ignore
export const boxLiner = (_props: { theme: Theme }) => css`
  background: var(--color-box-linear);
  .coinInput-wrap,
  .btnInput-wrap,
  .MuiOutlinedInput-root {
    background: var(--field-opacity);
    border-color: var(--opacity);
    :hover {
      border-color: var(--color-border-hover);
    }
  }
  .MuiToolbar-root .MuiButtonBase-root.outline {
    background-color: var(--field-opacity);
  }
`;
export const TypographyStrong = styled(Typography)`
  color: var(--color-secoundary);
` as typeof Typography;
export const TypographyGood = styled(Typography)`
  color: var(--color-success);
` as typeof Typography;
export const TablePaddingX = ({
  pLeft = 24,
  pRight = 24,
}: {
  pLeft: number;
  pRight: number;
}) => css`
  .rdg-row,
  .rdg-header-row {
    .rdg-cell:first-of-type {
      padding-left: ${pLeft}px;
    }

    .rdg-cell:last-of-type {
      padding-right: ${pRight}px;
    }
  }
`;
export const VipStyled = styled(Typography)`
  margin-left: ${({ theme }) => theme.unit}px;
  padding: ${({ theme }) => theme.unit / 4}px ${({ theme }) => theme.unit}px;
  ${({ theme }) =>
    theme.border.defaultFrame({ c_key: "rgba(0,0,0,0)", d_R: 0.25 })};
  background-color: var(--vip-bg);
  height: 2rem;
  //line-height: 2rem;
  color: var(--vip-text);
` as typeof Typography;
export const floatTag = ({ theme, custom }: any) => css`
  .float-group {
    font-weight: lighter;

    .float-tag.float-increase {
      color: ${custom.chg === UpColor.green
        ? theme.colorBase.success
        : theme.colorBase.error};
    }

    .float-tag.float-decrease {
      color: ${custom.chg === UpColor.green
        ? theme.colorBase.error
        : theme.colorBase.success};
    }

    .float-tag.float-none {
      color: ${theme.colorBase.textPrimary};
    }
  }
`;
export const AvatarIconPair = ({ theme }: any) => css`
  //.MuiAvatar-root {
  //  width: var(--chart-title-coin-size);
  //  height: var(--chart-title-coin-size);
  //}

  .icon-next {
    margin-left: -${theme.unit}px;
  }
`;
export const baseTitleCss = ({ theme, custom }: any) => css`
  height: 72px;

  ${AvatarIconPair({ theme })}
  h3.MuiTypography-root {
    font-size: 1.6rem;
    margin-left: ${theme.unit}px;
    color: ${theme.colorBase.textSecondary};

    .MuiTypography-root {
      margin: 0 ${theme.unit / 4}px;
    }

    .next-coin {
      color: ${theme.colorBase.textPrimary};
    }
  }

  ${floatTag({ theme, custom })};

  .float-chart {
    margin-left: ${theme.unit}px;

    .chart-change {
      color: ${theme.colorBase.textSecondary};
    }
  }
`;
export const ButtonListRightStyled = styled(Grid)`
  .MuiButton-root:not(:last-child) {
    margin-right: ${({ theme }) => theme.unit}px;
  }
` as typeof Grid;
export const modalContentBaseStyle = ({ theme }: any) => css`
  &:focus-visible {
    outline: 0;
  }

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: var(--toolbar-row-padding);
  border: 0;
  border-radius: ${theme.unit}px;
`;
// height:100%;
// margin-top: var(--toolbar-row-padding-minus);
// padding-top: var(--toolbar-row-padding);
// .menu-panel{
//     height: ${_height  ?
//          typeof _height === 'number' ?
//              ` calc(${_height + 'px'} -  var(--toolbar-row-padding)  ) `
//              :` calc(${_height} -  var(--toolbar-row-padding)  )`:'210px'};
// }
export const SwitchPanelStyled: any = styled(Box)<
  { _height?: number | string; _width?: number | string } & BoxProps
>`
  .MuiModal-root & {
    .react-swipeable-view-container > div {
      background: var(--opacity);
    }
    .container {
      padding-bottom: 0;
    }
  }

  .trade-panel {
    .react-swipeable-view-container {
      & > div {
        padding: 0 ${({ theme }) => (theme.unit * 5) / 2}px
          ${({ theme }) => theme.unit * 5}px;

        .container {
          height: 100%;
          padding-top: 0;
        }
      }
    }
  }

  && {
    ${({ theme }) => modalContentBaseStyle({ theme: theme })}
    ${({ _height, _width, theme }) => `
     
      background: ${theme.colorBase.box};
      .react-swipeable-view-container {
           height: ${
             _height && Number.isNaN(_height)
               ? _height + "px"
               : _height
               ? _height
               : "100%"
           } ;
           width: ${
             _width && Number.isNaN(_width)
               ? _width + "px"
               : _width
               ? _width
               : "100%"
           };
           & > div{
              height:initial;
              overflow-x: hidden;
              overflow-y: scroll !important;
              padding-bottom:var(--toolbar-row-padding); 
              background: initial;
           }
       }
      
      .trade-panel{
        .react-swipeable-view-container {
           & > div{
              height: calc(100% -  var(--toolbar-row-padding));
              padding-bottom:0; 
              overflow-x: hidden;
              overflow-y: scroll !important;
          }
        }
      }
      
    `}
  }

  ${({ _height, theme }) => `
  .MuiModal-root & {
     .coin-menu {
          height:${
            _height
              ? typeof _height === "number"
                ? ` calc(${_height + "px"} - ${
                    theme.unit * 4
                  }px - 2 * var(--toolbar-row-padding)  ) `
                : ` calc(${_height} - ${
                    theme.unit * 4
                  }px - 2 * var(--toolbar-row-padding)  )`
              : "410px"
          } !important;
     }
  }`};
` as React.ElementType<
  { _height?: number | string; _width?: number | string } & BoxProps
>;

export const toolBarPanel = ({ theme }: any) => css`
  .MuiToolbar-root {
    align-content: stretch;
    justify-content: flex-end;
    box-sizing: border-box;
    height: var(--toolbar-row-padding-minus);
    padding: 0 ${(theme.unit * 5) / 2}px;
    //min-height: var(--toolbar-row-padding);
    margin-top: var(--toolbar-row-padding-minus);

    .MuiIconButton-root {
      height: var(--btn-icon-size);
      width: var(--btn-icon-size);
      min-width: var(--btn-icon-size);
      margin: 0;
      display: flex;
      padding: 0;
      justify-content: center;
      justify-items: center;
      align-items: center;
      font-size: ${theme.fontDefault.h4};
    }
  }
`;

export const TableFilterStyled = styled(Box)`
  margin-left: 26px;
  margin-bottom: ${({ theme }) => theme.unit * 2}px;
` as typeof Box;

export const AnimationArrow = styled(Box)`
  &.arrowCta {
    transform-origin: center;
    display: block;
    height: 12px;
    width: 12px;
    border: 9px solid transparent;
    transform: rotate(45deg) scale(0.5);
    position: relative;
    margin: ${({ theme }) => theme.unit * 2}px;
    //margin: 25vh auto;
  }

  &.arrowCta:after,
  &.arrowCta:before {
    content: "";
    display: block;
    height: inherit;
    width: inherit;
    position: absolute;
    top: 0;
    left: 0;
  }

  &.arrowCta:after {
    border-bottom: 3px solid var(--color-text-primary);
    border-right: 3px solid var(--color-text-primary);
    top: 0;
    left: 0;
    opacity: 1;
    animation: bottom-arrow 1.65s infinite;
  }

  @keyframes bottom-arrow {
    0% {
      opacity: 1;
      transform: translate(0, 0);
    }
    45% {
      opacity: 0;
      transform: translate(12px, 12px);
    }
    46% {
      opacity: 0;
      transform: translate(-16px, -16px);
    }
    90% {
      opacity: 1;
      transform: translate(-6px, -6px);
    }
    100% {
      opacity: 1;
      transform: translate(-6px, -6px);
    }
  }

  &.arrowCta:before {
    top: 0;
    left: 0;
    border-bottom: 3px solid var(--color-text-primary);
    border-right: 3px solid var(--color-text-primary);
    animation: top-arrow 1.65s infinite;
  }

  @keyframes top-arrow {
    0% {
      transform: translate(-6px, -6px);
    }
    35% {
      transform: translate(0, 0);
    }
    90% {
      opacity: 1;
      transform: translate(0, 0);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
` as typeof Box;

export const shake = css`
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`;

export const MenuBtnStyled = styled(Button)`
  font-size: 1.4rem;
  background: var(--opacity);
  color: var(--color-text-secondary);
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.unit * 3}px;
  text-indent: 0.5em;
  &:hover {
    background: var(--provider-hover);
    border-color: var(--opacity);
    color: var(--color-text-button-select);
  }
  &.selected {
    position: relative;
    background: var(--provider-hover);
    border-color: var(--opacity);
    color: var(--color-text-button-select);

    &:after {
      position: absolute;
      content: "\u25CF";
      text-indent: 0em;
      color: var(--color-success);
      //width: 100%;
      display: flex;
      left: 0;
      padding-left: ${({ theme }) => (theme.unit * 3) / 2}px;
      //justify-content: ;
      align-items: center;
      font-size: ${({ theme }) => theme.fontDefault.h5};
    }
  }
  &.vendor {
    text-indent: -999em;
    justify-content: center;
  }
` as typeof Button;
