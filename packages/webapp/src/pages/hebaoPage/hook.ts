import React from "react";
import { useAccount } from "../../stores/account";
import { myLog, SagaStatus } from "@loopring-web/common-resources";
import { LoopringAPI } from "../../api_wrapper";
import {
  Guardian,
  HEBAO_LOCK_STATUS,
  Protector,
} from "@loopring-web/loopring-sdk";

export const useHebaoMain = <T extends Protector, G extends Guardian>() => {
  const { account, status: accountStatus } = useAccount();
  const [protectList, setProtectList] = React.useState<T[]>([]);
  const [guardiansList, setGuardiansList] = React.useState<
    Array<G & { ens?: string }>
  >([]);

  const loadData = async () => {
    if (LoopringAPI.walletAPI && account.accAddress) {
      const [protector, guardians]: any = await Promise.all([
        LoopringAPI.walletAPI.getProtectors(
          {
            guardian: account.accAddress,
          },
          account.apiKey
        ),
        LoopringAPI.walletAPI.getGuardianApproveList({
          guardian: account.accAddress,
        }),
      ])
        .then(([protector, guardians]) => [protector, guardians])
        .catch((error) => {
          myLog(error);
        });
      //protector.protectorArray   ?? []
      setProtectList(
        // protector.protectorArray ?? []
        [
          {
            ens: "demo.loopring.protect",
            address: "0xfF7d59D9316EBA168837E3eF924BCDFd64b237D8",
            lockStatus: HEBAO_LOCK_STATUS.LOCK_FAILED,
          },
          {
            ens: "demo.loopring.protect",
            address: "0xfF7d59D9316EBA168837E3eF924BCDFd64b237D8",
            lockStatus: HEBAO_LOCK_STATUS.CREATED,
          },
          {
            ens: "demo.loopring.protect",
            address: "0xfF7d59D9316EBA168837E3eF924BCDFd64b237D8",
            lockStatus: HEBAO_LOCK_STATUS.LOCK_WAITING,
          },
          {
            ens: "demo.loopring.protect",
            address: "0xfF7d59D9316EBA168837E3eF924BCDFd64b237D8",
            lockStatus: HEBAO_LOCK_STATUS.UNLOCK_FAILED,
          },
          {
            ens: "demo.loopring.protect",
            address: "0xfF7d59D9316EBA168837E3eF924BCDFd64b237D8",
            lockStatus: HEBAO_LOCK_STATUS.LOCKED,
          },
          {
            ens: "demo.loopring.protect",
            address: "0xfF7d59D9316EBA168837E3eF924BCDFd64b237D8",
            lockStatus: HEBAO_LOCK_STATUS.UNLOCK_WAITING,
          },
        ] as T[]
      );
      setGuardiansList(
        guardians.guardiansArray
          ? guardians.guardiansArray
              .filter(
                ({ address }: any) =>
                  !!protector.protectorArray?.find(
                    ({ address: pAddress }: any) => pAddress === address
                  )
              )
              .map((approve: any) => {
                const ens = protector.protectorArray?.find(
                  ({ address: pAddress }: any) => pAddress === approve.address
                ).ens;
                return {
                  ...approve,
                  ens,
                };
              })
          : []
      );
    }

    // if (account && account.accAddress) {
    // const protects = await getProtects(address);
    // setProtectees(protects);
    // const approves = await getApproveList(address);
    // const requests = approves
    //   .filter(
    //     (approve) => !!protects.find((p) => p.address === approve.address)
    //   )
    //   .map((approve) => {
    //     const ens = protects.find((p) => p.address === approve.address).ens;
    //     return {
    //       ...approve,
    //       ens,
    //     };
    //   });
    // setRequests(requests);
    // setLoading(false);
    // }
  };
  React.useEffect(() => {
    // const res = await getHebaoConfig();
    // console.log("hebaoConfig", res);
    // setChainId(res.etherId);
    // setFeeRecipient(res.hebaoFeeRecipient);
    // const guardianModule = res.supportContracts.find(
    //   (ele) => ele.contractName.toUpperCase() === "GUARDIAN_MODULE"
    // ).contractAddress;
    //
    // console.log("guardianModule", guardianModule);
    //
    // setGuardianModule(guardianModule);
  }, []);
  React.useEffect(() => {
    if (account.accAddress && accountStatus === SagaStatus.UNSET) {
      loadData();
    }
  }, [accountStatus]);
  return { protectList, guardiansList };
};
export const useHebaoProtector = () => {
  // const lockWallet = async (lockOrUnlock, wallet) => {
  //   // try {
  //   //   const response = lockOrUnlock
  //   //     ? await window.wallet.lockWallet(wallet.address, guardianModule)
  //   //     : await window.wallet.unlockWallet(wallet.address, guardianModule);
  //   //
  //   //   addToast(
  //   //     <I s={lockOrUnlock ? "lock-wallet-suc" : "unlock-wallet-suc"} />,
  //   //     {
  //   //       appearance: "success",
  //   //       autoDismiss: true,
  //   //     }
  //   //   );
  //   //   console.log(JSON.stringify(response));
  //   // } catch (e) {
  //   //   console.error(e);
  //   //   addToast(
  //   //     <I s={lockOrUnlock ? "lock-wallet-failed" : "unlock-wallet-failed"} />,
  //   //     {
  //   //       appearance: "error",
  //   //       autoDismiss: true,
  //   //     }
  //   //   );
  //   // }
  // };
};
export const useHebaoValidationInfo = () => {};
