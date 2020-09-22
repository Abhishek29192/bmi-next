import React, { useContext } from "react";
import { graphql } from "gatsby";
import ProfileCard from "components/profile-card/src";
import { IconMap } from "./Icon";
import styles from "./styles/TeamList.module.scss";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl, LinkData } from "../components/Link";

export type TeamMemberData = {
  name: string;
  jobTitle: string;
  profilePicture: {
    file: {
      url: string;
    };
  };
  links: LinkData[];
};

const TeamList = ({ data }: { data: TeamMemberData[] }) => {
  const { countryCode } = useContext(SiteContext);

  return (
    <div className={styles["TeamList"]}>
      {data.map((teamMember, index) => {
        const { name, jobTitle, profilePicture, links } = teamMember;
        const url = profilePicture.file.url;

        return (
          <div key={`team-member-card-${index}`}>
            <ProfileCard
              name={name}
              title={jobTitle}
              imageSource={url}
              className={styles["card"]}
            >
              {(links || []).map((link, index) => (
                <ProfileCard.Row
                  key={`team-member-link-${index}`}
                  action={getClickableActionFromUrl(
                    link.linkedPage,
                    link.url,
                    countryCode
                  )}
                  icon={IconMap[link.icon]}
                >
                  {link.label}
                </ProfileCard.Row>
              ))}
            </ProfileCard>
          </div>
        );
      })}
    </div>
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
