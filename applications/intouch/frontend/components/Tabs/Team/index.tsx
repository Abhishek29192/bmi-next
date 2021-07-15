import React, { useEffect, useState } from "react";
import Table from "@bmi/table";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import { ProjectMember, CompanyMember } from "@bmi/intouch-api-types";
import { gql } from "@apollo/client";
import {
  useDeleteProjectMemberMutation,
  useGetProjectCompanyMembersLazyQuery,
  useAddProjectsMemberMutation,
  GetProjectDocument
} from "../../../graphql/generated/hooks";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";
import { TeamMemberItem } from "./TeamMemberItem";
import styles from "./styles.module.scss";

export type TeamTabProps = {
  projectId: number;
  teams: ProjectMember[];
};

export const TeamTab = ({ projectId, teams }: TeamTabProps) => {
  const { t } = useTranslation("project-page");

  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [companyMembers, setCompanyMembers] = useState<CompanyMember[]>([]);
  const [isTeamMemberDialogOpen, setTeamMemberDialogOpen] = useState(false);
  const [deleteProjectMember] = useDeleteProjectMemberMutation();
  const [addProjectsMember] = useAddProjectsMemberMutation({
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: {
          projectId: projectId
        }
      }
    ]
  });
  const [getProjectCompanyMembers] = useGetProjectCompanyMembersLazyQuery({
    onCompleted: ({ companyMembers }) => {
      setCompanyMembers(companyMembers?.nodes as CompanyMember[]);
    }
  });

  useEffect(() => {
    setProjectMembers(teams);
  }, [teams]);

  const onDeleteClickHandler = async (projectMemberId: number) => {
    await deleteProjectMember({
      variables: {
        input: {
          id: projectMemberId
        }
      },
      update(cache) {
        //It's only reset "GetProject" query
        cache.reset();
      }
    });
  };
  const addTeamMemberHandler = async () => {
    const existAccounts = projectMembers.map((member) => member.accountId);

    getProjectCompanyMembers({
      variables: {
        existAccounts: existAccounts
      }
    });
    setTeamMemberDialogOpen(true);
  };

  const confirmTeamMemberHandler = async (members: CompanyMember[]) => {
    if (members.length > 0) {
      const projectMembers = members.map((member) => ({
        projectId: projectId,
        accountId: member.accountId
      }));
      await addProjectsMember({
        variables: {
          input: {
            members: projectMembers
          }
        }
      });
    }
    setTeamMemberDialogOpen(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button variant="outlined" onClick={addTeamMemberHandler}>
          {t("Add team member")}
        </Button>
      </div>
      <div className={styles.body}>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>{t("Responsible Installer")}</Table.Cell>
              <Table.Cell>{t("Team Member")}</Table.Cell>
              <Table.Cell>{t("Role")}</Table.Cell>
              <Table.Cell>{t("Certification")}</Table.Cell>
              <Table.Cell>{t("Remove")}</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {projectMembers.map(
              (team, index) =>
                team.account && (
                  <TeamMemberItem
                    key={`${team.id}-${index}`}
                    account={team.account}
                    onDeleteClick={() => {
                      onDeleteClickHandler(team.id);
                    }}
                  />
                )
            )}
          </Table.Body>
        </Table>
      </div>
      <AddTeamMemberDialog
        isOpen={isTeamMemberDialogOpen}
        onCloseClick={() => setTeamMemberDialogOpen(false)}
        onConfirmClick={confirmTeamMemberHandler}
        members={companyMembers || []}
      />
    </div>
  );
};

export const DELETE_PROJECT_MEMBER = gql`
  mutation deleteProjectMember($input: DeleteProjectMemberInput!) {
    deleteProjectMember(input: $input) {
      account {
        id
        firstName
        lastName
      }
    }
  }
`;
export const PROJECT_COMPANY_MEMBERS = gql`
  query getProjectCompanyMembers($existAccounts: [Int!]) {
    companyMembers(filter: { accountId: { notIn: $existAccounts } }) {
      nodes {
        id
        accountId
        account {
          id
          firstName
          lastName
          email
          certificationsByDoceboUserId {
            nodes {
              technology
            }
          }
        }
      }
    }
  }
`;
export const ADD_PROJECT_MEMBER = gql`
  mutation createProjectMember($input: CreateProjectMemberInput!) {
    createProjectMember(input: $input) {
      projectMember {
        id
        accountId
        account {
          id
          firstName
          lastName
          role
          certificationsByDoceboUserId {
            nodes {
              technology
            }
          }
        }
      }
    }
  }
`;
export const ADD_PROJECT_MEMBERS = gql`
  mutation addProjectsMember($input: ProjectMembersAddInput!) {
    projectMembersAdd(input: $input) {
      projectMembers {
        projectId
        accountId
      }
    }
  }
`;
