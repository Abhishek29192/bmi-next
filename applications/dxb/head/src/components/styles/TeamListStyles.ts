import { ProfileCard } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";

export const ProfileRow = styled(ProfileCard.Row)({
  padding: "15px 0 10px",
  "&:first-child": {
    paddingTop: "8px"
  }
});
