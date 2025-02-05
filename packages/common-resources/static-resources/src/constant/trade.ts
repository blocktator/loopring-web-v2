import {
  ChainId,
  NFTTokenInfo,
  UserNFTBalanceInfo,
} from "@loopring-web/loopring-sdk";
import { FeeInfo, IBData } from "../loopring-interface";

export enum WithdrawType {
  Fast = "Fast",
  Standard = "Standard",
}

export const WithdrawTypes: {
  [P in keyof typeof WithdrawType]: string | number;
} = {
  Fast: "",
  Standard: "",
};

export type PriceTagType = "$" | "￥";

export enum PriceTag {
  Dollar = "$",
  Yuan = "￥",
}

export enum TradeTypes {
  Buy = "Buy",
  Sell = "Sell",
}

export enum TradeStatus {
  // Filled = 'Filled',
  // Cancelled = 'Cancelled',
  // Succeeded = 'Succeeded',
  Processing = "processing",
  Processed = "processed",
  Cancelling = "cancelling",
  Cancelled = "cancelled",
  Expired = "expired",
  Waiting = "waiting",
}

export type TxInfo = {
  hash: string;
  timestamp?: number | undefined;
  status?: "pending" | "success" | "failed" | undefined;
  [key: string]: any;
};
export interface AccountHashInfo {
  depositHashes: { [key: string]: TxInfo[] };
}
export type ChainHashInfos = {
  [key in ChainId extends string ? string : string]: AccountHashInfo;
};

export type NFTWholeINFO = NFTTokenInfo &
  UserNFTBalanceInfo & {
    image: string;
    name: string;
    nftIdView: string;
    description: string;
    nftBalance: number;
    isDeployed: boolean;
    etherscanBaseUrl: string;
  } & { fee?: FeeInfo };
export type TradeNFT<I> = {
  balance?: number;
  isApproved?: boolean;
} & Partial<NFTWholeINFO> &
  Partial<IBData<I>> &
  Partial<Omit<NFTTokenInfo, "creatorFeeBips" | "nftData">>;

export const TOAST_TIME = 3000;

export const EmptyValueTag = "--";

export const IPFS_META_URL = "ipfs://";
