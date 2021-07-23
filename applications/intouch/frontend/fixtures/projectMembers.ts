import { ProjectMember } from "@bmi/intouch-api-types";

export const projectMembers: ProjectMember[] = [
  {
    nodeId: "1",
    id: 1,
    createdAt: "01/01/01",
    updatedAt: "01/01/01",
    account: {
      nodeId: "1",
      id: 1,
      firstName: "",
      lastName: "",
      role: "INSTALLER",
      certificationsByDoceboUserId: {
        nodes: [
          {
            nodeId: "1",
            id: 1,
            technology: "PITCHED",
            createdAt: "01/01/01",
            updatedAt: "01/01/01"
          }
        ]
      }
    }
  } as ProjectMember,
  {
    nodeId: "2",
    id: 2,
    createdAt: "01/01/01",
    updatedAt: "01/01/01",
    account: {
      nodeId: "1",
      id: 1,
      firstName: "",
      lastName: "",
      role: "INSTALLER",
      certificationsByDoceboUserId: {
        nodes: [
          {
            nodeId: "1",
            id: 1,
            technology: "PITCHED",
            createdAt: "01/01/01",
            updatedAt: "01/01/01"
          },
          {
            nodeId: "2",
            id: 2,
            technology: "PITCHED",
            createdAt: "01/01/01",
            updatedAt: "01/01/01"
          }
        ]
      }
    }
  } as ProjectMember,
  {
    nodeId: "3",
    id: 3,
    createdAt: "01/01/01",
    updatedAt: "01/01/01",
    account: {
      nodeId: "1",
      id: 1,
      firstName: "",
      lastName: "",
      role: "INSTALLER",
      certificationsByDoceboUserId: {
        nodes: [
          {
            nodeId: "1",
            id: 1,
            technology: "PITCHED",
            createdAt: "01/01/01",
            updatedAt: "01/01/01"
          },
          {
            nodeId: "2",
            id: 2,
            technology: "FLAT",
            createdAt: "01/01/01",
            updatedAt: "01/01/01"
          },
          {
            nodeId: "3",
            id: 3,
            technology: "OTHER",
            createdAt: "01/01/01",
            updatedAt: "01/01/01"
          }
        ]
      }
    }
  } as ProjectMember
];
