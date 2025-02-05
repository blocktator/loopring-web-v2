import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { AmmActivityMapStates } from "./interface";
import { SagaStatus } from "@loopring-web/common-resources";
import { AmmPoolActivityRule, LoopringMap } from "@loopring-web/loopring-sdk";
import { AmmPoolInProgressActivityRule } from "@loopring-web/loopring-sdk/dist/defs/loopring_defs";

const initialState: Required<AmmActivityMapStates> = {
  ammActivityMap: {},
  activityInProgressRules: {},
  activityDateMap: {},
  groupByRuleType: {},
  groupByActivityStatus: {},
  groupByRuleTypeAndStatus: {},
  status: "PENDING",
  errorMessage: null,
};
const ammActivityMapSlice: Slice = createSlice({
  name: "ammActivityMap",
  initialState,
  reducers: {
    getAmmActivityMap(state, action: PayloadAction<string | undefined>) {
      state.status = SagaStatus.PENDING;
    },
    getAmmActivityMapStatus(
      state,
      action: PayloadAction<AmmActivityMapStates>
    ) {
      // @ts-ignore
      if (action.error) {
        state.status = SagaStatus.ERROR;
        // @ts-ignore
        state.errorMessage = action.error;
      }
      state.ammActivityMap = { ...action.payload.groupByRuleTypeAndStatus };
      state.activityInProgressRules = {
        ...action.payload.activityInProgressRules,
      };
      state.activityDateMap = { ...action.payload.activityDateMap };
      state.groupByRuleType = { ...action.payload.groupByRuleType };
      state.groupByActivityStatus = {
        ...action.payload.groupByActivityStatus,
      };
      state.groupByRuleTypeAndStatus = {
        ...action.payload.groupByRuleTypeAndStatus,
      };
      state.status = SagaStatus.DONE;
    },
    statusUnset: (state) => {
      state.status = SagaStatus.UNSET;
    },
  },
});
export { ammActivityMapSlice };
export const { getAmmActivityMap, getAmmActivityMapStatus, statusUnset } =
  ammActivityMapSlice.actions;
