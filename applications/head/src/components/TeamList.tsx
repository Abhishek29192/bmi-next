import React, { useContext, useState } from "react";
import { graphql } from "gatsby";
import Grid from "@bmi/grid";
import ProfileCard from "@bmi/profile-card";
import { iconMap } from "./Icon";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl, LinkData } from "./Link";
import EqualHeights from "@bmi/equal-heights";
import Button from "@bmi/button";

export type Data = {
  name: string;
  jobTitle: string;
  profilePicture: {
    resize: {
      src: string;
    };
  };
  links: LinkData[];
}[];

const TEAM_MEMBERS_PER_PAGE = 8;

const TeamList = ({ data }: { data: Data }) => {
  const { countryCode, getMicroCopy } = useContext(SiteContext);
  const showMoreText = getMicroCopy("global.showMore");
  const [numberVisible, setNumberVisible] = useState(TEAM_MEMBERS_PER_PAGE);
  return (
    <div>
      <EqualHeights>
        <Grid container justify="center" spacing={3}>
          {data.slice(0, numberVisible).map((teamMember, index) => {
            const { name, jobTitle, profilePicture, links } = teamMember;
            const src = profilePicture.resize.src;

            return (
              <Grid item xs={12} md={6} key={index}>
                <ProfileCard
                  imageSource={src}
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
                        countryCode
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
          {numberVisible < data.length ? (
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
    profilePicture {
      resize(width: 150) {
        src
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
