import React, { useState } from "react";
import { graphql } from "gatsby";
import { Grid } from "@bmi/components";
import { ProfileCard } from "@bmi/components";
import { EqualHeights } from "@bmi/components";
import { Button } from "@bmi/components";
import { microCopy } from "../constants/microCopies";
import { iconMap } from "./Icon";
import { useSiteContext } from "./Site";
import { Data as LinkData, getClickableActionFromUrl } from "./Link";
import Image, { Data as ImageData } from "./Image";

export type Data = {
  name: string;
  jobTitle: string;
  profileImage: ImageData | null;
  links: LinkData[];
}[];

const TEAM_MEMBERS_PER_PAGE = 8;

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
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <ProfileCard
                  imageSource={profileImage && <Image data={profileImage} />}
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
                    <ProfileCard.Row
                      key={`team-member-link-${index}`}
                      action={getClickableActionFromUrl(
                        link.linkedPage,
                        link.url,
                        countryCode,
                        null,
                        link.label
                      )}
                      icon={iconMap[link.icon]}
                    >
                      {link.label}
                    </ProfileCard.Row>
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
