import React, { useState, useEffect } from "react";
import Table from "@bmi-digital/components/table";
import { useTranslation } from "next-i18next";
import { CompanyMember, Technology } from "@bmi/intouch-api-types";
import Dialog from "@bmi-digital/components/dialog";
import Form from "@bmi-digital/components/form";
import Typography from "@bmi-digital/components/typography";
import Checkbox from "@bmi-digital/components/checkbox";
import TeamMemberCertification from "./TeamMemberCertifications";

type AddTeamMemberDialogProps = {
  isOpen: boolean;
  onCloseClick: () => void;
  onConfirmClick: (members: CompanyMember[]) => void;
  members: CompanyMember[];
  loading: boolean;
};

export const AddTeamMemberDialog = ({
  isOpen,
  onCloseClick,
  onConfirmClick,
  members,
  loading
}: AddTeamMemberDialogProps) => {
  const { t } = useTranslation("project-page");

  const [isAllSelected, setAllSelected] = useState<boolean>(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<
    CompanyMember[]
  >([]);

  const handleCheckbox = (member: CompanyMember, selected: boolean) => {
    setSelectedTeamMembers((teamMembers) =>
      selected
        ? [...teamMembers, member]
        : [...teamMembers.filter((team) => team.id !== member.id)]
    );
  };

  useEffect(() => {
    setSelectedTeamMembers([]);
  }, [members]);

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("teamTab.add_team_member_modal.title")}
      </Dialog.Title>
      <Dialog.Content>
        <Typography variant="caption" display="block">
          {t("teamTab.add_team_member_modal.caption")}
        </Typography>
        <Form>
          <Form.Row>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>
                    <Checkbox
                      name={"check"}
                      onChange={(checked: boolean) => {
                        setAllSelected(checked);
                        setSelectedTeamMembers(checked ? [...members] : []);
                      }}
                      checked={isAllSelected}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {t("teamTab.add_team_member_modal.table.name")}
                  </Table.Cell>
                  <Table.Cell>
                    {t("teamTab.add_team_member_modal.table.email")}
                  </Table.Cell>
                  <Table.Cell>
                    {t("teamTab.add_team_member_modal.table.certification")}
                  </Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {members.map((member) => (
                  <Table.Row key={member.id} data-testid="team-member-item">
                    <Table.Cell>
                      {" "}
                      <Checkbox
                        name={"check"}
                        onChange={(checked: boolean) => {
                          handleCheckbox(member, checked);
                        }}
                        checked={selectedTeamMembers.some(
                          (team) => team.id === member.id
                        )}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {member.account?.firstName} {member.account?.lastName}
                    </Table.Cell>
                    <Table.Cell>{member.account?.email}</Table.Cell>
                    <Table.Cell>
                      <TeamMemberCertification
                        certifications={Array.from(
                          new Set(
                            (
                              member.account?.certificationsByDoceboUserId
                                ?.nodes || []
                            ).map((item) => item.technology as Technology)
                          )
                        )}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Form.Row>
        </Form>
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("teamTab.add_team_member_modal.confirm_label")}
        onConfirmClick={() => onConfirmClick(selectedTeamMembers)}
        isConfirmButtonDisabled={loading || selectedTeamMembers.length === 0}
        cancelLabel={t("teamTab.add_team_member_modal.cancel_label")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
