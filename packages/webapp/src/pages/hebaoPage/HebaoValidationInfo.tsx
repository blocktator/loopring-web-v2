import { Guardian } from "@loopring-web/loopring-sdk";
import { Box } from "@mui/material";

export const HebaoValidationInfo = <T extends Guardian>({
  guardiansList,
}: {
  guardiansList: T[];
}) => {
  return (
    <Box
      paddingTop={3}
      borderRadius={2}
      flex={1}
      marginBottom={0}
      display={"flex"}
      flexDirection={"column"}
    >
      11
    </Box>
  );
};
