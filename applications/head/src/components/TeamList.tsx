import React from "react";
import { graphql } from "gatsby";
import { TeamMemberData } from "../templates/types";
import ProfileCard from "components/profile-card/src";
import { IconMap } from "./Icon";
import styles from "./styles/TeamList.module.scss";

const TeamList = ({ data }: { data: TeamMemberData[] }) => {
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
                  action={{ model: "htmlLink", href: link.url }}
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
