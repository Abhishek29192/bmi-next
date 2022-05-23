import {
  CreateGuaranteeInput,
  UpdateGuaranteeInput
} from "@bmi/intouch-api-types";
import { createGuarantee, updateGuarantee, restartGuarantee } from "..";
import { sendMessageWithTemplate } from "../../../services/mailer";
import * as validate from "../validate";

process.env.GCP_PRIVATE_BUCKET_NAME = "GCP_PRIVATE_BUCKET_NAME";

const storage = {
  uploadFileByStream: jest.fn()
};

const randomPassword = "randomPassword";

jest.mock("../../storage-client", () => {
  return jest.fn().mockImplementation(() => storage);
});
jest.mock("../../../services/mailer", () => ({
  sendMessageWithTemplate: jest.fn()
}));
jest.mock("crypto", () => {
  return {
    randomBytes: () => randomPassword
  };
});
jest.mock("../validate", () => ({
  solutionGuaranteeSubmitValidate: jest
    .fn()
    .mockImplementation(() => ({ isValid: true }))
}));
jest.mock("file-type", () => {
  return {
    fromStream: () => ({
      mime: "image/jpg"
    })
  };
});

const mockGetDbPoolQuery = jest.fn();
jest.mock("../../../db", () => ({
  getDbPool: () => ({
    query: (...params) => mockGetDbPoolQuery(...params)
  })
}));

const evidenceItemInputs = [
  {
    name: "file1.jpg",
    attachment: "file1.jpg",
    attachmentUpload: {
      filename: "file1.jpg",
      mimetype: "image/jpg",
      encoding: "",
      createReadStream: () => {}
    }
  },
  {
    name: "file2.pdf",
    attachment: "file2.pdf",
    attachmentUpload: {
      filename: "file2.pdf",
      mimetype: "application/pdf",
      encoding: "",
      createReadStream: () => {}
    }
  }
];

const guaranteeInput: CreateGuaranteeInput = {
  guarantee: {
    id: 1,
    projectId: 1,
    bmiReferenceId: "",
    requestorAccountId: 1,
    guaranteeReferenceCode: "PITCHED_PRODUCT",
    evidenceItemsUsingId: {
      create: evidenceItemInputs
    }
  }
};

const guaranteeUpdateInput: UpdateGuaranteeInput = {
  id: 1,
  guaranteeEventType: "SUBMIT_SOLUTION",
  patch: {
    id: 1,
    projectId: 1,
    guaranteeReferenceCode: "PITCHED_SOLUTION"
  }
};

describe("Guarantee", () => {
  const source = {};
  const resolveInfo = {};
  const userCanMock = jest.fn();
  const mockUser = {
    id: 3,
    company: {
      id: 1
    },
    role: "INSTALLER",
    can: userCanMock
  };
  const mockQuery = jest.fn();
  const mockClientGateway = jest.fn();
  const loggerError = jest.fn();
  const loggerInfo = jest.fn();
  const deleteFileSpy = jest.fn();
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      debug: jest.fn(),
      log: jest.fn(),
      error: loggerError,
      info: loggerInfo
    }),
    pgRootPool: null,
    pgClient: {
      query: mockQuery
    },
    user: mockUser,
    clientGateway: mockClientGateway,
    storageClient: {
      deleteFile: (...params) => deleteFileSpy(params)
    }
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a guarantee", async () => {
      const resolve = jest.fn();
      const args = {
        input: guaranteeInput
      };

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: 1 }]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ name: "project", companyId: 1, tier: "T1" }]
        }))
        .mockImplementationOnce(() => ({
          rows: [
            {
              email: "email",
              first_name: "first_name",
              role: "COMPANY_ADMIN"
            }
          ]
        }));

      await createGuarantee(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(sendMessageWithTemplate).toBeCalledTimes(1);
    });
    it("should create a guarantee with evidences", async () => {
      const resolve = jest.fn();
      const args = {
        input: {
          ...guaranteeInput,
          guarantee: {
            ...guaranteeInput.guarantee,
            evidenceItemsUsingId: {
              create: evidenceItemInputs
            }
          }
        }
      };

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: 1 }]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ name: "project", companyId: 1, tier: "T1" }]
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }));

      await createGuarantee(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(storage.uploadFileByStream).toHaveBeenCalledTimes(
        evidenceItemInputs.length
      );
    });

    it("call logger when createGuarantee throw error", async () => {
      const resolve = jest.fn().mockRejectedValueOnce("I am error");
      const args = {
        input: {
          ...guaranteeInput,
          guarantee: {
            ...guaranteeInput.guarantee,
            evidenceItemsUsingId: {
              create: evidenceItemInputs
            }
          }
        }
      };

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: 1 }]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ name: "project", companyId: 1, tier: "T1" }]
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }));
      await expect(
        createGuarantee(resolve, source, args, context, resolveInfo)
      ).rejects.toEqual("I am error");

      expect(loggerError).toHaveBeenCalledWith(
        "Error creating guarantee evidence"
      );
    });

    it("coverage is PRODUCT", async () => {
      const resolve = jest.fn();
      const args = {
        input: {
          guarantee: {
            ...guaranteeInput.guarantee,
            coverage: "PRODUCT" as const
          }
        }
      };

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: null }]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ name: "project", companyId: 1, tier: "T1" }]
        }))
        .mockImplementationOnce(() => ({
          rows: [
            {
              email: "email",
              first_name: "first_name",
              role: "COMPANY_ADMIN"
            }
          ]
        }));

      await createGuarantee(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(sendMessageWithTemplate).toBeCalledTimes(1);
    });

    it("coverage is SOLUTION", async () => {
      const resolve = jest.fn();
      const args = {
        input: {
          guarantee: {
            ...guaranteeInput.guarantee,
            coverage: "SOLUTION" as const
          }
        }
      };

      mockQuery.mockImplementationOnce(() => {});

      await createGuarantee(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(sendMessageWithTemplate).toBeCalledTimes(0);
    });
  });

  describe("update", () => {
    const resolve = jest.fn();
    const mockGuarante = {
      id: 1,
      status: "",
      systemBmiRef: ""
    };
    const guaranteMockImplementation = () => ({
      rows: [mockGuarante]
    });
    mockQuery
      .mockImplementation(() => {})
      .mockImplementation(guaranteMockImplementation);

    const args = {
      input: {
        ...guaranteeUpdateInput,
        patch: {
          ...guaranteeUpdateInput.patch
        }
      }
    };
    it("shouldn't be able to update guarantee when user unauthorised", async () => {
      userCanMock.mockReturnValue(false);

      await expect(
        updateGuarantee(resolve, source, args, context, resolveInfo)
      ).rejects.toThrow("unauthorized");
    });
    it("should be able to submit new guarantee", async () => {
      userCanMock.mockReturnValue(true);
      mockGuarante.status = "NEW";

      mockGetDbPoolQuery.mockReturnValueOnce({
        rows: [{ email: "test@mail.me", id: 1 }]
      });

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.requestorAccountId).toEqual(mockUser.id);
      expect(patch.bmiReferenceId).toEqual(randomPassword);
      expect(patch.status).toEqual("SUBMITTED");

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to submit rejected guarantee", async () => {
      userCanMock.mockReturnValue(true);
      const args = {
        input: { ...guaranteeUpdateInput }
      };
      mockGuarante.status = "REJECTED";

      mockGetDbPoolQuery.mockReturnValueOnce({
        rows: [{ email: "test2@mail.me", id: 2 }]
      });

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.requestorAccountId).toEqual(mockUser.id);
      expect(patch.status).toEqual("SUBMITTED");
      expect(patch.productBmiRef).toBeUndefined();

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to assing guarantee", async () => {
      userCanMock.mockReturnValue(true);
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "ASSIGN_SOLUTION"
        }
      };
      mockGuarante.status = "SUBMITTED";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.reviewerAccountId).toEqual(mockUser.id);
      expect(patch.status).toEqual("REVIEW");

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to re-assing guarantee", async () => {
      userCanMock.mockReturnValue(true);
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "REASSIGN_SOLUTION"
        }
      };
      mockGuarante.status = "REVIEW";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.reviewerAccountId).toEqual(mockUser.id);
      expect(patch.status).toEqual("REVIEW");

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to un-assing guarantee", async () => {
      userCanMock.mockReturnValue(true);
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "UNASSIGN_SOLUTION"
        }
      };
      mockGuarante.status = "REVIEW";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.reviewerAccountId).toBeNull();
      expect(patch.status).toEqual("SUBMITTED");

      expect(resolve).toBeCalledTimes(1);
    });

    describe("should be able to approve guarantee", () => {
      it("with guaranteeValidityOffsetYears and maximum_validity_years returned from query", async () => {
        userCanMock.mockReturnValue(true);
        const maximum_validity_years = 3;
        const guaranteeValidityOffsetYears = 5;
        const args: { input: UpdateGuaranteeInput } = {
          input: {
            ...guaranteeUpdateInput,
            guaranteeEventType: "APPROVE_SOLUTION"
          }
        };
        mockGuarante.status = "REVIEW";

        mockQuery
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(guaranteMockImplementation)
          .mockImplementationOnce(() => ({
            rows: [{ tier: "T1" }]
          }))
          .mockImplementationOnce(() => ({
            rows: [{ maximum_validity_years }]
          }));

        mockClientGateway.mockImplementationOnce(() => ({
          data: {
            tierBenefitCollection: {
              items: [{ guaranteeValidityOffsetYears }]
            }
          }
        }));

        await updateGuarantee(resolve, source, args, context, resolveInfo);

        const { patch } = args.input;
        expect(patch.status).toEqual("APPROVED");
        expect(mockClientGateway).toHaveBeenCalledTimes(1);
        expect(patch.expiryDate.getFullYear()).toEqual(
          new Date().getFullYear() +
            maximum_validity_years -
            guaranteeValidityOffsetYears
        );
        expect(resolve).toBeCalledTimes(1);
      });

      it("use default guaranteeValidityOffsetYears and maximum_validity_years", async () => {
        userCanMock.mockReturnValue(true);
        const args: { input: UpdateGuaranteeInput } = {
          input: {
            ...guaranteeUpdateInput,
            guaranteeEventType: "APPROVE_SOLUTION"
          }
        };
        mockGuarante.status = "REVIEW";

        mockQuery
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(guaranteMockImplementation)
          .mockImplementationOnce(() => ({
            rows: [{ tier: "T1" }]
          }))
          .mockImplementationOnce(() => ({
            rows: [{ maximum_validity_years: null }]
          }));

        mockClientGateway.mockImplementationOnce(() => ({
          data: {
            tierBenefitCollection: {
              items: [{}]
            }
          }
        }));

        await updateGuarantee(resolve, source, args, context, resolveInfo);

        const { patch } = args.input;
        expect(patch.status).toEqual("APPROVED");
        expect(mockClientGateway).toHaveBeenCalledTimes(1);
        expect(patch.expiryDate.getFullYear()).toEqual(
          new Date().getFullYear() + 0 - 0
        );
        expect(resolve).toBeCalledTimes(1);
      });
    });

    it("should be able to reject guarantee", async () => {
      userCanMock.mockReturnValue(true);
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "REJECT_SOLUTION"
        }
      };
      mockGuarante.status = "REVIEW";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.reviewerAccountId).toBeNull();
      expect(patch.status).toEqual("REJECTED");

      expect(resolve).toBeCalledTimes(1);
    });

    it("call logger when isValid is false", async () => {
      jest
        .spyOn(validate, "solutionGuaranteeSubmitValidate")
        .mockResolvedValueOnce(false);
      userCanMock.mockReturnValue(true);
      context.user.role = "SUPER_ADMIN";
      mockGuarante.status = "NEW";

      await expect(
        updateGuarantee(resolve, source, args, context, resolveInfo)
      ).rejects.toThrowError("Validation Error");

      expect(loggerError).toHaveBeenCalledWith(
        `User with id: ${mockUser.id} and role: SUPER_ADMIN is trying to submit guarantee ${guaranteeUpdateInput.id}`
      );
    });

    it("getGuarantee throw error when no guarantee", async () => {
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: []
        }));
      userCanMock.mockReturnValue(true);
      context.user.role = "SUPER_ADMIN";
      mockGuarante.status = "NEW";

      await expect(
        updateGuarantee(resolve, source, args, context, resolveInfo)
      ).rejects.toThrowError("The guarantee not exist");
    });

    it("getProjectCompanyDetail throw error when no ProjectCompanyDetail returns", async () => {
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(guaranteMockImplementation)
        .mockImplementationOnce(() => ({
          rows: []
        }));

      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "APPROVE_SOLUTION"
        }
      };

      userCanMock.mockReturnValue(true);
      mockGuarante.status = "REVIEW";

      await expect(
        updateGuarantee(resolve, source, args, context, resolveInfo)
      ).rejects.toThrowError("The project not exist");
    });
  });

  describe("uploadEvidence", () => {
    it("with no evidenceItemInput", async () => {
      const resolve = jest.fn();
      const args = {
        input: {
          ...guaranteeInput,
          guarantee: {
            ...guaranteeInput.guarantee
          }
        }
      };

      delete args.input.guarantee.evidenceItemsUsingId;

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: 1 }]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ name: "project", companyId: 1, tier: "T1" }]
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }));

      await createGuarantee(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(storage.uploadFileByStream).toHaveBeenCalledTimes(0);
    });

    it("without evidenceItemInput.create", async () => {
      const resolve = jest.fn();
      const args = {
        input: {
          ...guaranteeInput,
          guarantee: {
            ...guaranteeInput.guarantee,
            evidenceItemsUsingId: {}
          }
        }
      };

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: 1 }]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ name: "project", companyId: 1, tier: "T1" }]
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }));

      await createGuarantee(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(storage.uploadFileByStream).toHaveBeenCalledTimes(0);
    });

    it("with empty evidenceItemInput.create", async () => {
      const resolve = jest.fn();
      const args = {
        input: {
          ...guaranteeInput,
          guarantee: {
            ...guaranteeInput.guarantee,
            evidenceItemsUsingId: { create: [] }
          }
        }
      };

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: 1 }]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ name: "project", companyId: 1, tier: "T1" }]
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }));

      await createGuarantee(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(storage.uploadFileByStream).toHaveBeenCalledTimes(0);
    });
  });

  describe("restartGuarantee", () => {
    const args = { projectId: 1 };
    const solutionGuarantee = [{ id: 2 }];
    const relatedEvidenceItems = [
      { id: 3, name: "relatedEvidenceItems1" },
      { id: 6, name: "relatedEvidenceItems2" }
    ];
    const revokeInstallers = [{ id: 4 }, { id: 5 }];

    beforeEach(() => {
      mockQuery.mockReset();
      deleteFileSpy.mockReset();
    });

    it("normal case", async () => {
      userCanMock.mockReturnValueOnce(true);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: relatedEvidenceItems
        }))
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: revokeInstallers
        }))
        .mockImplementationOnce(() => {});
      deleteFileSpy
        .mockImplementationOnce(() => Promise.resolve(true))
        .mockImplementationOnce(() => Promise.resolve(true));
      const response = await restartGuarantee(args, context);

      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        "SAVEPOINT graphql_restart_guarantee_mutation"
      );
      expect(userCanMock).toHaveBeenCalledWith("delete:guarantee");
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        "SELECT id FROM guarantee WHERE project_id = $1 AND (coverage = $2 OR coverage = $3)",
        [args.projectId, "SOLUTION", "SYSTEM"]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        3,
        "SELECT id, name FROM evidence_item WHERE project_id = $1 AND guarantee_id = $2",
        [args.projectId, solutionGuarantee[0].id]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        4,
        "DELETE FROM guarantee WHERE id = $1 RETURNING id",
        [solutionGuarantee[0].id]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        5,
        "UPDATE project_member SET is_responsible_installer = false WHERE project_id = $1 AND is_responsible_installer = true RETURNING *",
        [args.projectId]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        6,
        "RELEASE SAVEPOINT graphql_restart_guarantee_mutation"
      );
      expect(loggerInfo).toHaveBeenNthCalledWith(
        1,
        `Deleted guarantee with id ${solutionGuarantee[0].id} for project with id ${args.projectId}`
      );
      expect(loggerInfo).toHaveBeenNthCalledWith(
        2,
        `Unassigned ${revokeInstallers.length} installer(s) with id(s) 4,5 for project with id ${args.projectId}`
      );
      expect(loggerInfo).toHaveBeenNthCalledWith(
        3,
        `Deleted ${relatedEvidenceItems.length} files with id(s) [3|6] for project with id ${args.projectId}`
      );
      expect(loggerInfo).toHaveBeenNthCalledWith(
        4,
        `Deleted 2 out of 2 files from storage`
      );
      expect(deleteFileSpy).toHaveBeenNthCalledWith(1, [
        "GCP_PRIVATE_BUCKET_NAME",
        "relatedEvidenceItems1"
      ]);
      expect(deleteFileSpy).toHaveBeenNthCalledWith(2, [
        "GCP_PRIVATE_BUCKET_NAME",
        "relatedEvidenceItems2"
      ]);
      expect(response).toBe("ok");
    });

    it("no permission to delete guarantee", async () => {
      userCanMock.mockReturnValueOnce(false);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: relatedEvidenceItems
        }))
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: revokeInstallers
        }))
        .mockImplementationOnce(() => {});
      deleteFileSpy
        .mockImplementationOnce(() => Promise.resolve(true))
        .mockImplementationOnce(() => Promise.resolve(true));
      try {
        await restartGuarantee(args, context);
      } catch (error) {
        expect(error.message).toBe("unauthorized");
      }
      expect(loggerError).toHaveBeenCalledWith(
        `User with id: ${mockUser.id} and role: ${mockUser.role} is trying to restart solution guarantee for project ${args.projectId}`
      );
    });

    it("no guarantee found", async () => {
      userCanMock.mockReturnValueOnce(true);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: []
        }))
        .mockImplementationOnce(() => {});
      const response = await restartGuarantee(args, context);
      expect(response).toBe("ok");
      expect(loggerInfo).toHaveBeenCalledWith(
        `No guarantee found for project with id ${args.projectId}`
      );
    });

    it("no guarantee deleted", async () => {
      userCanMock.mockReturnValueOnce(true);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: relatedEvidenceItems
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }));

      const response = await restartGuarantee(args, context);
      expect(response).toBe("ok");
      expect(loggerInfo).toHaveBeenCalledWith(
        `Failed to delete guarantee with id ${solutionGuarantee[0].id} with project id ${args.projectId}`
      );
    });

    it("no installer unassigned", async () => {
      userCanMock.mockReturnValueOnce(true);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: relatedEvidenceItems
        }))
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }))
        .mockImplementationOnce(() => {});

      const response = await restartGuarantee(args, context);
      expect(response).toBe("ok");
      expect(loggerInfo).toHaveBeenCalledWith(
        `No unassigned installer(s) for project with id ${args.projectId}`
      );
    });

    it("failed to remove relatedEvidenceItems from storage", async () => {
      userCanMock.mockReturnValueOnce(true);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: relatedEvidenceItems
        }))
        .mockImplementationOnce(() => ({
          rows: solutionGuarantee
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }))
        .mockImplementationOnce(() => {});

      deleteFileSpy
        .mockImplementationOnce(() => Promise.reject("reason1"))
        .mockImplementationOnce(() => Promise.reject("reason2"));

      const response = await restartGuarantee(args, context);
      expect(response).toBe("ok");
      expect(loggerError).toHaveBeenCalledWith(
        `Failed to delete files with error: [reason1|reason2]`
      );
    });

    it("error throw from query", async () => {
      userCanMock.mockReturnValueOnce(true);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => Promise.reject("error"));

      try {
        await restartGuarantee(args, context);
      } catch (error) {
        expect(loggerError).toHaveBeenCalledWith(
          `Error restart guarantee for project with id ${args.projectId}, ${error}`
        );
        expect(mockQuery).toHaveBeenCalledWith(
          "ROLLBACK TO SAVEPOINT graphql_restart_guarantee_mutation"
        );
        expect(mockQuery).toHaveBeenCalledWith(
          "RELEASE SAVEPOINT graphql_restart_guarantee_mutation"
        );
      }
    });
  });
});
