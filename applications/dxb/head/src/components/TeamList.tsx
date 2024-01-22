import AnchorLink, {
  AnchorLinkProps
} from "@bmi-digital/components/anchor-link";
import Button from "@bmi-digital/components/button";
import EqualHeights from "@bmi-digital/components/equal-heights";
import Grid from "@bmi-digital/components/grid";
import ProfileCard from "@bmi-digital/components/profile-card";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import React, { useState } from "react";
import withGTM from "../utils/google-tag-manager";
import Icon from "./Icon";
import Image, { Data as ImageData } from "./Image";
import { Data as LinkData, getClickableActionFromUrl } from "./Link";
import { useSiteContext } from "./Site";
import { ProfileRow } from "./styles/TeamListStyles";

export type Data = {
  name: string;
  jobTitle: string | null;
  profileImage: ImageData;
  links: LinkData[];
}[];

const TEAM_MEMBERS_PER_PAGE = 8;

const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink, {
  action: "href"
});

const TeamList = ({ data }: { data: Data | null }) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const showMoreText = getMicroCopy(microCopy.GLOBAL_SHOW_MORE);
  const [numberVisible, setNumberVisible] = useState(TEAM_MEMBERS_PER_PAGE);
  return (
    <div>
      <EqualHeights>
        <Grid container justifyContent="center" spacing={3}>
          {data?.slice(0, numberVisible).map((teamMember, index) => {
            const { name, jobTitle, profileImage, links } = teamMember;

            return (
              <Grid xs={12} sm={6} lg={3} key={index}>
                <ProfileCard
                  imageSource={<Image {...profileImage} />}
                  body={
                    <EqualHeights.Consumer shouldDisableBoxSizing>
                      {({ addRef, equalHeight }) => {
                        return (
                          <ProfileCard.Body
                            name={name}
                            title={jobTitle}
                            style={{ height: equalHeight }}
                            ref={addRef(index)}
                          />
                        );
                      }}
                    </EqualHeights.Consumer>
                  }
                >
                  {(links || []).map((link, index) => (
                    <ProfileRow
                      key={`team-member-link-${index}`}
                      action={getClickableActionFromUrl(
                        link.linkedPage,
                        link.url,
                        countryCode,
                        undefined,
                        link.label
                      )}
                      anchorComponent={(props: AnchorLinkProps) => (
                        <GTMAnchorLink
                          gtm={{
                            id: "cta-click1",
                            label: `${name} - ${props.children}`
                          }}
                          {...props}
                        />
                      )}
                      icon={<Icon name={link.icon || ""} />}
                    >
                      {link.label}
                    </ProfileRow>
                  ))}
                </ProfileCard>
              </Grid>
            );
          })}
          {data && numberVisible < data.length ? (
            <Button
              variant="outlined"
              onClick={() =>
                setNumberVisible((prevNum) => prevNum + TEAM_MEMBERS_PER_PAGE)
              }
            >
              {showMoreText}
            </Button>
          ) : null}
        </Grid>
      </EqualHeights>
    </div>
  );
};

export default TeamList;

export const query = graphql`
  fragment TeamMemberFragment on ContentfulTeamMember {
    name
    jobTitle
    profileImage {
      image {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          width: 200
          formats: [WEBP, AUTO]
        )
      }
    }
    links {
      id
      label
      icon
      url
    }
  }
`;
