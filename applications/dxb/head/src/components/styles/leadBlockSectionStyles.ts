import LeadBlock from "@bmi-digital/components/lead-block";
import TableOfContent from "@bmi-digital/components/table-of-content";
import { styled } from "@mui/material/styles";

export const LinksContainer = styled(TableOfContent.Menu)({
  "&>div:first-of-type": {
    marginTop: "0"
  },
  "&>div:last-child": {
    marginBottom: "0"
  }
});

export const Text = styled(LeadBlock.Content.Section)({
  marginBottom: 0
});

export const LinkWrapper = styled(LeadBlock.Content.Section)({
  marginTop: "32px",
  marginBottom: 0
});

export const LeadBlockWrapper = styled(LeadBlock)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    gap: "8px"
  }
}));
