import React from "react";
import { useAccount } from "../../stores/account";

export const useHebaoMain = () => {
  const { account } = useAccount();
  const loadData = async () => {
    if (account && account.accAddress) {
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
    }
  };
  // const handleRequest = async (approveOrReject, request) => {
  //   try {
  //     if (approveOrReject) {
  //       console.log("setCurrentRequest(request)", request);
  //       setCurrentRequest(request);
  //       setShowVerifyCodeModal(true);
  //     } else {
  //       const sig = await window.wallet.rejectHebao(request.id);
  //       await rejectApproveSignature(
  //         {
  //           approveRecordId: request.id,
  //           signer: address,
  //         },
  //         sig.result.sig
  //       );
  //       setLoading(true);
  //       await loadData();
  //       setLoading(false);
  //       addToast(<I s="reject-request-suc" />, {
  //         appearance: "success",
  //         autoDismiss: true,
  //       });
  //     }
  //   } catch (e) {
  //     addToast(
  //       <I
  //         s={
  //           approveOrReject ? "approve-request-failed" : "reject-request-failed"
  //         }
  //       />,
  //       {
  //         appearance: "error",
  //         autoDismiss: true,
  //       }
  //     );
  //   }
  // };
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
