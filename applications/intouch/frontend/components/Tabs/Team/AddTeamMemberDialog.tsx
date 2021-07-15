import React, { useState } from "react";
import Table from "@bmi/table";
import { useTranslation } from "next-i18next";
import { CompanyMember, Technology } from "@bmi/intouch-api-types";
import Dialog from "@bmi/dialog";
import Form from "@bmi/form";
import Typography from "@bmi/typography";
import Checkbox from "@bmi/checkbox";
import TeamMemberCertification from "./TeamMemberCertifications";

type AddTeamMemberDialogProps = {
  isOpen: boolean;
  onCloseClick: () => void;
  onConfirmClick: (members: CompanyMember[]) => void;
  members: CompanyMember[];
};
export const AddTeamMemberDialog = ({
  isOpen,
  onCloseClick,
  onConfirmClick,
  members
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

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>{t("Add an installer")}</Dialog.Title>
      <Dialog.Content>
        <Typography variant="caption" display="block">
          Choose the installers who will be working on this project.
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
                  <Table.Cell>{t("Name")}</Table.Cell>
                  <Table.Cell>{t("Email")}</Table.Cell>
                  <Table.Cell>{t("Certification")}</Table.Cell>
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
        confirmLabel={t("Add Members")}
        onConfirmClick={() => onConfirmClick(selectedTeamMembers)}
        isConfirmButtonDisabled={selectedTeamMembers.length === 0}
        cancelLabel={t("Cancel")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
