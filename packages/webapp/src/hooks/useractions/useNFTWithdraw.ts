import React from "react";
import { connectProvides } from "@loopring-web/web3-provider";
import {
  AccountStep,
  SwitchData,
  useOpenModals,
  WithdrawProps,
} from "@loopring-web/component-lib";
import {
  AccountStatus,
  CoinMap,
  IBData,
  NFTWholeINFO,
  SagaStatus,
  UIERROR_CODE,
  WalletMap,
} from "@loopring-web/common-resources";

import * as sdk from "@loopring-web/loopring-sdk";

import { useTokenMap } from "stores/token";
import { useAccount } from "stores/account";
import { LoopringAPI } from "api_wrapper";
import { useSystem } from "stores/system";
import { myLog } from "@loopring-web/common-resources";
import { makeWalletLayer2 } from "hooks/help";
import {
  useWalletLayer2Socket,
  walletLayer2Service,
} from "../../services/socket";
import { getTimestampDaysLater } from "utils/dt_tools";
import { AddressError, BIGO, DAYS, TOAST_TIME } from "defs/common_defs";
import { useAddressCheck } from "hooks/common/useAddrCheck";
import { useWalletInfo } from "stores/localStore/walletInfo";
import { checkErrorInfo } from "./utils";
import { useBtnStatus } from "hooks/common/useBtnStatus";
import { useModalData } from "stores/router";
import { isAccActivated } from "./checkAccStatus";
import {
  OffchainNFTFeeReqType,
  UserNFTBalanceInfo,
} from "@loopring-web/loopring-sdk";
import { NFTTokenInfo } from "@loopring-web/loopring-sdk";
import store from "../../stores";
import { useChargeFees } from "../common/useChargeFees";

export const useNFTWithdraw = <
  R extends IBData<T> &
    Partial<NFTTokenInfo & UserNFTBalanceInfo & NFTWholeINFO>,
  T
>({
  isLocalShow = false,
  doWithdrawDone,
}: {
  isLocalShow?: boolean;
  doWithdrawDone?: () => void;
}) => {
  const {
    modals: {
      isShowNFTWithdraw: { isShow, nftData, nftBalance, ...nftRest },
    },
    setShowAccount,
    setShowNFTWithdraw,
  } = useOpenModals();

  const { tokenMap, totalCoinMap, disableWithdrawList } = useTokenMap();
  const { account, status: accountStatus } = useAccount();
  const { exchangeInfo, chainId } = useSystem();

  const { nftWithdrawValue, updateNFTWithdrawData, resetNFTWithdrawData } =
    useModalData();

  const [walletMap2, setWalletMap2] = React.useState(
    makeWalletLayer2(true).walletMap ?? ({} as WalletMap<R>)
  );

  const { chargeFeeTokenList, isFeeNotEnough, handleFeeChange, feeInfo } =
    useChargeFees({
      requestType: OffchainNFTFeeReqType.NFT_WITHDRAWAL,
      tokenAddress: nftWithdrawValue.tokenAddress,
      updateData: (feeInfo, _chargeFeeList) => {
        updateNFTWithdrawData({ ...nftWithdrawValue, fee: feeInfo });
      },
    });

  const { checkHWAddr, updateHW } = useWalletInfo();

  const [lastRequest, setLastRequest] = React.useState<any>({});

  const {
    address,
    realAddr,
    setAddress,
    addrStatus,
    isCFAddress,
    isContractAddress,
    isAddressCheckLoading,
  } = useAddressCheck();

  const isNotAvaiableAddress =
    isCFAddress ||
    (isContractAddress &&
      disableWithdrawList.includes(nftWithdrawValue?.belong ?? ""));

  const { btnStatus, enableBtn, disableBtn } = useBtnStatus();

  const checkBtnStatus = React.useCallback(() => {
    if (
      tokenMap &&
      nftWithdrawValue?.fee?.belong &&
      nftWithdrawValue?.tradeValue &&
      sdk.toBig(nftWithdrawValue.tradeValue).gt(BIGO) &&
      sdk
        .toBig(nftWithdrawValue.tradeValue)
        .lte(Number(nftWithdrawValue.nftBalance) ?? 0) &&
      addrStatus === AddressError.NoError &&
      !isFeeNotEnough &&
      !isNotAvaiableAddress &&
      !!address
    ) {
      enableBtn();
      myLog("enableBtn");
      return;
    }
    disableBtn();
  }, [
    tokenMap,
    nftWithdrawValue?.fee?.belong,
    nftWithdrawValue.tradeValue,
    nftWithdrawValue.nftBalance,
    addrStatus,
    isFeeNotEnough,
    address,
    disableBtn,
    enableBtn,
    isNotAvaiableAddress,
  ]);

  React.useEffect(() => {
    checkBtnStatus();
  }, [
    address,
    addrStatus,
    nftWithdrawValue.fee,
    nftWithdrawValue.tradeValue,
    isNotAvaiableAddress,
  ]);

  const walletLayer2Callback = React.useCallback(() => {
    const walletMap = makeWalletLayer2(true).walletMap ?? ({} as WalletMap<R>);
    setWalletMap2(walletMap);
  }, []);

  const resetDefault = React.useCallback(() => {
    if (nftData) {
      updateNFTWithdrawData({
        belong: nftData as any,
        balance: nftBalance,
        tradeValue: undefined,
        ...nftRest,
        address: address ? address : "*",
      });
    } else {
      updateNFTWithdrawData({
        belong: "",
        balance: 0,
        tradeValue: 0,
        address: "*",
      });
      setShowNFTWithdraw({ isShow: false });
    }
  }, [
    nftData,
    updateNFTWithdrawData,
    nftBalance,
    nftRest,
    address,
    setShowNFTWithdraw,
  ]);

  React.useEffect(() => {
    if (isShow) {
      resetDefault();
    }
  }, [isShow]);

  React.useEffect(() => {
    if (
      accountStatus === SagaStatus.UNSET &&
      account.readyState === AccountStatus.ACTIVATED
    ) {
    } else {
      setShowNFTWithdraw({ isShow: false });
    }
  }, [accountStatus, account.readyState]);

  React.useEffect(() => {
    if (
      accountStatus === SagaStatus.UNSET &&
      account.readyState === AccountStatus.ACTIVATED
    ) {
      if (nftWithdrawValue.address) {
        myLog("addr 1");
        setAddress(nftWithdrawValue.address);
      } else {
        myLog("addr 2");
        // setAddress(account.accAddress)
        updateNFTWithdrawData({
          balance: -1,
          tradeValue: -1,
        });
      }
    }
  }, [
    setAddress,
    isShow,
    nftWithdrawValue.address,
    accountStatus,
    account.readyState,
  ]);

  useWalletLayer2Socket({ walletLayer2Callback });

  const processRequest = React.useCallback(
    async (request: sdk.NFTWithdrawRequestV3, isNotHardwareWallet: boolean) => {
      const { apiKey, connectName, eddsaKey } = account;

      try {
        if (connectProvides.usedWeb3 && LoopringAPI.userAPI) {
          let isHWAddr = checkHWAddr(account.accAddress);

          if (!isHWAddr && !isNotHardwareWallet) {
            isHWAddr = true;
          }

          myLog("nftWithdraw processRequest:", isHWAddr, isNotHardwareWallet);
          const response = await LoopringAPI.userAPI.submitNFTWithdraw(
            {
              request,
              web3: connectProvides.usedWeb3,
              chainId: chainId === "unknown" ? 1 : chainId,
              walletType: connectName as sdk.ConnectorNames,
              eddsaKey: eddsaKey.sk,
              apiKey,
              isHWAddr,
            },
            {
              accountId: account.accountId,
              counterFactualInfo: eddsaKey.counterFactualInfo,
            }
          );
          myLog("submitNFTWithdraw:", response);

          if (isAccActivated()) {
            if (
              (response as sdk.RESULT_INFO).code ||
              (response as sdk.RESULT_INFO).message
            ) {
              // Withdraw failed
              const code = checkErrorInfo(
                response as sdk.RESULT_INFO,
                isNotHardwareWallet
              );
              if (code === sdk.ConnectorError.USER_DENIED) {
                setShowAccount({
                  isShow: true,
                  step: AccountStep.NFTWithdraw_User_Denied,
                });
              } else if (code === sdk.ConnectorError.NOT_SUPPORT_ERROR) {
                setLastRequest({ request });
                setShowAccount({
                  isShow: true,
                  step: AccountStep.NFTWithdraw_First_Method_Denied,
                });
              } else {
                setShowAccount({
                  isShow: true,
                  step: AccountStep.NFTWithdraw_Failed,
                  error: response as sdk.RESULT_INFO,
                });
              }
            } else if ((response as sdk.TX_HASH_API)?.hash) {
              // Withdraw success
              setShowAccount({
                isShow: true,
                step: AccountStep.NFTWithdraw_In_Progress,
              });
              await sdk.sleep(TOAST_TIME);
              setShowAccount({
                isShow: true,
                step: AccountStep.NFTWithdraw_Success,
              });
              if (isHWAddr) {
                myLog("......try to set isHWAddr", isHWAddr);
                updateHW({ wallet: account.accAddress, isHWAddr });
              }
              if (doWithdrawDone) {
                doWithdrawDone();
              }
              resetNFTWithdrawData();
            }

            walletLayer2Service.sendUserUpdate();
          } else {
            resetNFTWithdrawData();
          }
        }
      } catch (reason) {
        sdk.dumpError400(reason);
        const code = checkErrorInfo(reason, isNotHardwareWallet);
        myLog("code:", code);

        if (isAccActivated()) {
          if (code === sdk.ConnectorError.USER_DENIED) {
            setShowAccount({
              isShow: true,
              step: AccountStep.NFTWithdraw_User_Denied,
            });
          } else if (code === sdk.ConnectorError.NOT_SUPPORT_ERROR) {
            setLastRequest({ request });
            setShowAccount({
              isShow: true,
              step: AccountStep.NFTWithdraw_First_Method_Denied,
            });
          } else {
            setShowAccount({
              isShow: true,
              step: AccountStep.NFTWithdraw_Failed,
              error: {
                code: UIERROR_CODE.Unknow,
                msg: reason?.message,
              },
            });
          }
        }
      }
    },
    [
      account,
      checkHWAddr,
      chainId,
      setShowAccount,
      doWithdrawDone,
      resetNFTWithdrawData,
      updateHW,
    ]
  );

  const handleNFTWithdraw = React.useCallback(
    async (_nftWithdrawToken: any, address, isFirstTime: boolean = true) => {
      const { accountId, accAddress, readyState, apiKey, eddsaKey } = account;
      const nftWithdrawToken = {
        ...store.getState()._router_modalData.nftWithdrawValue,
        ..._nftWithdrawToken,
      };
      if (
        readyState === AccountStatus.ACTIVATED &&
        tokenMap &&
        exchangeInfo &&
        connectProvides.usedWeb3 &&
        address &&
        LoopringAPI.userAPI &&
        nftWithdrawValue.fee?.belong &&
        nftWithdrawValue.fee?.__raw__ &&
        eddsaKey?.sk
      ) {
        try {
          setShowNFTWithdraw({ isShow: false });
          setShowAccount({
            isShow: true,
            step: AccountStep.NFTWithdraw_WaitForAuth,
          });

          const feeToken = tokenMap[nftWithdrawValue.fee.belong];
          const fee = sdk.toBig(nftWithdrawValue.fee.__raw__?.feeRaw ?? 0);

          const tradeValue = nftWithdrawToken.tradeValue;

          const storageId = await LoopringAPI.userAPI.getNextStorageId(
            {
              accountId: accountId,
              sellTokenId: nftWithdrawToken.tokenId,
            },
            apiKey
          );

          const request: sdk.NFTWithdrawRequestV3 = {
            exchange: exchangeInfo.exchangeAddress,
            owner: accAddress,
            to: address,
            accountId: account.accountId,
            storageId: storageId?.offchainId,
            token: {
              tokenId: nftWithdrawToken.tokenId,
              nftData: nftWithdrawToken.nftData,
              amount: tradeValue.toString(),
            },
            maxFee: {
              tokenId: feeToken.tokenId,
              amount: fee.toString(), // TEST: fee.toString(),
            },
            // fastWithdrawalMode: nftWithdrawType2 === WithdrawType.Fast,
            extraData: "",
            minGas: 0,
            validUntil: getTimestampDaysLater(DAYS),
          };

          myLog("submitNFTWithdraw:", request);

          processRequest(request, isFirstTime);
        } catch (e) {
          sdk.dumpError400(e);
          setShowAccount({
            isShow: true,
            step: AccountStep.NFTWithdraw_Failed,
            error: {
              code: UIERROR_CODE.Unknow,
              msg: e?.message,
            },
          });
        }

        return true;
      } else {
        return false;
      }
    },
    [
      account,
      tokenMap,
      exchangeInfo,
      feeInfo,
      setShowNFTWithdraw,
      setShowAccount,
      processRequest,
    ]
  );

  React.useEffect(() => {
    if (isLocalShow) {
      resetDefault();
    }
  }, [isLocalShow]);
  const retryBtn = React.useCallback(
    (isHardwareRetry: boolean = false) => {
      setShowAccount({
        isShow: true,
        step: AccountStep.NFTWithdraw_WaitForAuth,
      });
      processRequest(lastRequest, !isHardwareRetry);
    },
    [lastRequest, processRequest, setShowAccount]
  );
  const nftWithdrawProps = {
    handleOnAddressChange: (value: any) => {
      setAddress(value);
    },
    addressDefault: address,
    accAddr: account.accAddress,
    isNotAvaiableAddress,
    realAddr,
    disableWithdrawList,
    tradeData: nftWithdrawValue as any,
    coinMap: totalCoinMap as CoinMap<T>,
    walletMap: walletMap2 as WalletMap<any>,
    isCFAddress,
    isContractAddress,
    isAddressCheckLoading,
    withdrawBtnStatus: btnStatus,
    withdrawType: "Standard",
    withdrawTypes: { Standard: "" } as any,
    onWithdrawClick: (tradeData: R) => {
      if (nftWithdrawValue && nftWithdrawValue.tradeValue) {
        handleNFTWithdraw(tradeData, realAddr ? realAddr : address);
      }
      setShowNFTWithdraw({ isShow: false });
    },
    handleWithdrawTypeChange: () => {},
    handlePanelEvent: async (data: SwitchData<R>) => {
      return new Promise((res: any) => {
        if (data.to === "button") {
          if (data.tradeData.belong) {
            updateNFTWithdrawData({
              tradeValue: data.tradeData?.tradeValue,
              balance: data.tradeData.nftBalance,
              address: "*",
            });
          } else {
            updateNFTWithdrawData({
              belong: undefined,
              tradeValue: undefined,
              balance: undefined,
              address: "*",
            });
          }
        }

        res();
      });
    },
    handleFeeChange,
    feeInfo,
    chargeFeeTokenList,
    isFeeNotEnough,
    handleAddressError: (value: any) => {
      updateNFTWithdrawData({ address: value, balance: -1, tradeValue: -1 });
      return { error: false, message: "" };
    },
  } as WithdrawProps<any, any>;

  return {
    nftWithdrawProps,
    retryBtn,
  };
};
