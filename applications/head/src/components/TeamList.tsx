import React, { useContext } from "react";
import { graphql } from "gatsby";
import Grid from "@bmi/grid";
import ProfileCard from "@bmi/profile-card";
import { iconMap } from "./Icon";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl, LinkData } from "./Link";

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
    <Grid container justify="center" spacing={3}>
      {data.map((teamMember, index) => {
        const { name, jobTitle, profilePicture, links } = teamMember;
        const url = profilePicture.file.url;

        return (
          <Grid item xs={12} md={data.length < 4 ? 4 : 3} key={index}>
            <ProfileCard name={name} title={jobTitle} imageSource={url}>
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
