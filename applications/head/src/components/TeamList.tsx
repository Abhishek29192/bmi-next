import React, { useContext, useRef, useEffect } from "react";
import { graphql } from "gatsby";
import Grid from "@bmi/grid";
import ProfileCard from "@bmi/profile-card";
import { iconMap } from "./Icon";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl, LinkData } from "./Link";
import EqualHeights from "@bmi/equal-heights";

export type Data = {
  name: string;
  jobTitle: string;
  profilePicture: {
    file: {
      url: string;
    };
  };
  links: LinkData[];
}[];

const TeamList = ({ data }: { data: Data }) => {
  const { countryCode } = useContext(SiteContext);

  return (
    <EqualHeights>
      <Grid container justify="center" spacing={3}>
        {data.map((teamMember, index) => {
          const { name, jobTitle, profilePicture, links } = teamMember;
          const url = profilePicture.file.url;

          return (
            <Grid item xs={12} md={data.length < 4 ? 4 : 3} key={index}>
              <ProfileCard
                imageSource={url}
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
      </Grid>
    </EqualHeights>
  );
};

export default TeamList;

export const query = graphql`
  fragment TeamMemberFragment on ContentfulTeamMember {
    name
    jobTitle
    profilePicture {
      file {
        url
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
