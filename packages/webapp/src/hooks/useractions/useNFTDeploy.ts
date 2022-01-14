import { useAccount } from "../../stores/account";
import {
  AccountStep,
  NFTDeployProps,
  TokenType,
  useOpenModals,
} from "@loopring-web/component-lib";
import React from "react";

import { FeeInfo, TradeNFT, WalletMap } from "@loopring-web/common-resources";
import { useBtnStatus } from "../common/useBtnStatus";
import { useTokenMap } from "../../stores/token";
import { useWalletLayer2 } from "../../stores/walletLayer2";
import { useModalData } from "../../stores/router";
import { useChargeNFTFees } from "../common/useChargeNFTFees";
import { OffchainNFTFeeReqType } from "@loopring-web/loopring-sdk";
import { makeWalletLayer2 } from "../help";
import { useWalletLayer2Socket } from "../../services/socket";

export function useNFTDeploy<T extends TradeNFT<I> & { broker: string }, I>({
  isLocalShow = false,
  doDeployDone,
}: {
  isLocalShow?: boolean;
  doDeployDone?: () => void;
}) {
  const [nftDeployFeeInfo, setNFTDeployFeeInfo] = React.useState<FeeInfo>();
  const { btnStatus } = useBtnStatus();
  const { tokenMap, idIndex, status: tokenMapStatus } = useTokenMap();
  const { account } = useAccount();
  const { walletLayer2, status: walletLayer2Statue } = useWalletLayer2();
  const { nftDeployValue, updateNFTDeployData } = useModalData();
  const [walletMap2, setWalletMap2] = React.useState(
    makeWalletLayer2(true).walletMap ?? ({} as WalletMap<I>)
  );
  const { setShowAccount } = useOpenModals();

  // React.useEffect(() => {
  //   if (isLocalShow) {
  //   }
  // }, [isLocalShow]);
  const handleFeeChange = (value: FeeInfo): void => {
    value.__raw__ = {
      ...value.__raw__,
      tokenId: tokenMap[value.belong.toString()].tokenId,
    };
    setNFTDeployFeeInfo(value);
  };
  const onNFTDeployClick = () => {
    setShowAccount({
      isShow: true,
      step: AccountStep.NFTDeploy_WaitForAuth,
    });
  };
  const { chargeFeeList } = useChargeNFTFees({
    tokenAddress: nftDeployValue.tokenAddress,
    requestType: OffchainNFTFeeReqType.NFT_DEPLOY,
    tokenMap,
    amount: 0,
    needRefresh: true,
  });
  const walletLayer2Callback = React.useCallback(() => {
    const walletMap = makeWalletLayer2(true).walletMap ?? ({} as WalletMap<I>);
    setWalletMap2(walletMap);
  }, []);

  useWalletLayer2Socket({ walletLayer2Callback });

  const nftDeployProps: NFTDeployProps<T, I> = {
    coinMap: {},
    handleOnNFTDataChange<T>(data: T): void {},
    tradeData: nftDeployValue as T,
    walletMap: walletMap2 as WalletMap<any>,
    onNFTDeployClick,
    nftDeployBtnStatus: btnStatus,
    chargeFeeToken: nftDeployFeeInfo?.belong,
    chargeFeeTokenList: chargeFeeList,
    handleFeeChange,
  };

  return {
    nftDeployProps,
  };
}
