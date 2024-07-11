import Button from "@bmi-digital/components/button";
import EqualHeights from "@bmi-digital/components/equal-heights";
import Grid from "@bmi-digital/components/grid";
import ProfileCard from "@bmi-digital/components/profile-card";
import { microCopy } from "@bmi/microcopies";
import React, { useState } from "react";
import { useSiteContext } from "./Site";
import { ProfileRow } from "./styles/TeamListStyles";
import ContentfulImage from "./image/contentful-image/ContentfulImage";
import Icon from "./Icon";
import type { Data as LinkData } from "./link/types";
import type { Data as ImageData } from "./image/contentful-image/types";

export type Data = {
  name: string;
  jobTitle: string | null;
  profileImage: ImageData;
  links: LinkData[];
}[];

const TEAM_MEMBERS_PER_PAGE = 8;

const TeamList = ({ data }: { data: Data | null }) => {
  const { getMicroCopy } = useSiteContext();
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
                  imageSource={<ContentfulImage {...profileImage} />}
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
                      link={{
                        href: link.url ?? undefined,
                        external: true,
                        gtm: {
                          id: "cta-click1",
                          action: "href",
                          label: `${name} - ${link.label}`
                        }
                      }}
                      icon={link.icon ? <Icon name={link.icon} /> : undefined}
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
