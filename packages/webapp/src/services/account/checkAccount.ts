import { accountServices } from "./accountServices";
import store from "../../stores";
import { cleanAccountStatus } from "../../stores/account";
import { myLog } from "@loopring-web/common-resources";
import { ChainId } from "@loopring-web/loopring-sdk";

export const checkAccount = (
  newAccAddress: string,
  chainId?: ChainId | undefined
) => {
  const account = store.getState().account;
  if (account.accAddress === "" || account.accAddress !== newAccAddress) {
    myLog("After connect >>,account part: diff account, clean layer2");
    store.dispatch(cleanAccountStatus(undefined));
    accountServices.sendCheckAccount(newAccAddress, chainId);
  } else if (newAccAddress && newAccAddress !== "") {
    myLog("After connect >>,checkAccount: step1 address", newAccAddress);
    if (account && account.accountId === -1) {
      myLog("After connect >>,checkAccount: step1 no account Id");
      accountServices.sendCheckAccount(newAccAddress);
    } else if (account.accountId && account.apiKey && account.eddsaKey) {
      myLog(
        "After connect >>,checkAccount: step1 have activate account from store"
      );
      accountServices.sendAccountSigned({});
    } else {
      myLog("After connect >>,checkAccount: step1 account locked");
      accountServices.sendAccountLock();
    }
  }
};
