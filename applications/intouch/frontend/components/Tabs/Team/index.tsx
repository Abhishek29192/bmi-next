import { gql } from "@apollo/client";
import { Button, Table } from "@bmi-digital/components";
import { CompanyMember, ProjectMember } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import React, { useEffect, useMemo, useState } from "react";
import {
  GetProjectDocument,
  useAddProjectsMemberMutation,
  useDeleteProjectMemberMutation,
  useGetProjectCompanyMembersLazyQuery,
  useUpdateProjectMemberMutation
} from "../../../graphql/generated/hooks";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import AccessControl from "../../../lib/permissions/AccessControl";
import { NoContent } from "../../NoContent";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";
import styles from "./styles.module.scss";
import { TeamMemberItem } from "./TeamMemberItem";

export type TeamTabProps = {
  projectId: number;
  teams: ProjectMember[];
  canNominateProjectResponsible: boolean;
  project: GetProjectQuery["project"];
};

export const TeamTab = ({
  projectId,
  teams,
  canNominateProjectResponsible,
  project
}: TeamTabProps) => {
  const { t } = useTranslation("project-page");

  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [companyMembers, setCompanyMembers] = useState<CompanyMember[]>([]);
  const [isTeamMemberDialogOpen, setTeamMemberDialogOpen] = useState(false);
  const [deleteProjectMember, { loading: loadingDeleteMember }] =
    useDeleteProjectMemberMutation({
      refetchQueries: [
        {
          query: GetProjectDocument,
          variables: {
            projectId
          }
        }
      ]
    });
  const [addProjectsMember, { loading: loadingAddMember }] =
    useAddProjectsMemberMutation({
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

  const [updateProjectMember] = useUpdateProjectMemberMutation();
  useEffect(() => {
    setProjectMembers(teams);
  }, [teams]);

  const onDeleteClickHandler = async (projectMemberId: number) => {
    await deleteProjectMember({
      variables: {
        input: {
          id: projectMemberId
        }
      }
    });
  };

  const addTeamMemberHandler = async () => {
    const existAccounts = projectMembers.map((member) => member.accountId);

    getProjectCompanyMembers({
      variables: {
        existAccounts: existAccounts,
        companyId: project.company.id
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

  const onResponsibleInstallerChangeHandler = async ({
    id,
    isResponsibleInstaller
  }: ProjectMember) => {
    await updateProjectMember({
      variables: {
        input: {
          id,
          patch: {
            isResponsibleInstaller: !isResponsibleInstaller
          }
        },
        projectId
      }
    });
  };

  const isSomeResponsibleInstaller = useMemo(
    () =>
      projectMembers.some(
        ({ isResponsibleInstaller }) => isResponsibleInstaller
      ),
    [projectMembers]
  );

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <AccessControl
          dataModel="project"
          action="addTeamMember"
          extraData={{ isArchived: project.hidden }}
        >
          <Button
            data-testid="add-team-member-button"
            variant="outlined"
            onClick={addTeamMemberHandler}
          >
            {t("teamTab.header")}
          </Button>
        </AccessControl>
      </div>
      <div className={styles.body}>
        {!projectMembers.length ? (
          <NoContent message={t("teamTab.noContent")} />
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                {(isSomeResponsibleInstaller ||
                  canNominateProjectResponsible) && (
                  <Table.Cell>
                    {t("teamTab.table.responsibleInstaller")}
                  </Table.Cell>
                )}
                <Table.Cell>{t("teamTab.table.teamMember")}</Table.Cell>
                <Table.Cell>{t("teamTab.table.role")}</Table.Cell>
                <Table.Cell>{t("teamTab.table.certification")}</Table.Cell>
                <AccessControl
                  dataModel="project"
                  action="removeTeamMember"
                  extraData={{ isArchived: project.hidden }}
                >
                  <Table.Cell>{t("teamTab.table.remove")}</Table.Cell>
                </AccessControl>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {projectMembers.map(
                (team, index) =>
                  team.account && (
                    <TeamMemberItem
                      key={`${team.id}-${index}`}
                      project={project}
                      member={team}
                      onDeleteClick={() => {
                        onDeleteClickHandler(team.id);
                      }}
                      canNominateProjectResponsible={
                        canNominateProjectResponsible
                      }
                      isSomeResponsibleInstaller={isSomeResponsibleInstaller}
                      onResponsibleInstallerChange={() =>
                        onResponsibleInstallerChangeHandler(team)
                      }
                      loading={loadingDeleteMember}
                    />
                  )
              )}
            </Table.Body>
          </Table>
        )}
      </div>
      <AddTeamMemberDialog
        isOpen={isTeamMemberDialogOpen}
        onCloseClick={() => setTeamMemberDialogOpen(false)}
        onConfirmClick={confirmTeamMemberHandler}
        members={companyMembers || []}
        loading={loadingAddMember}
      />
    </div>
  );
};

export const DELETE_PROJECT_MEMBER = gql`
  mutation deleteProjectMember($input: DeleteProjectMemberInput!) {
    deleteProjectMember(input: $input) {
      projectMember {
        ...ProjectMemberDetailsFragment
      }
    }
  }
`;
export const PROJECT_COMPANY_MEMBERS = gql`
  query getProjectCompanyMembers($existAccounts: [Int!], $companyId: Int!) {
    companyMembers(
      filter: { accountId: { notIn: $existAccounts } }
      condition: { companyId: $companyId }
    ) {
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
        ...ProjectMemberDetailsFragment
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

export const UPDATE_PROJECT_MEMBER = gql`
  mutation updateProjectMember(
    $input: UpdateProjectMemberInput!
    $projectId: Int!
  ) {
    updateProjectMember(input: $input) {
      projectMember {
        id
        projectId
        isResponsibleInstaller
      }
      query {
        projectMembers(condition: { projectId: $projectId }) {
          nodes {
            ...ProjectMemberDetailsFragment
          }
        }
      }
    }
  }
`;

export const PROJECT_MEMBER_DETAILS_FRAGMENT = gql`
  fragment ProjectMemberDetailsFragment on ProjectMember {
    id
    accountId
    account {
      id
      firstName
      lastName
      role
      certificationsByDoceboUserId {
        nodes {
          name
          technology
        }
      }
    }
    isResponsibleInstaller
  }
`;
