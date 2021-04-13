import { GraphQLResolverMap } from "apollo-graphql";
import { IContext } from "../type";

const resolvers: GraphQLResolverMap = {
  Query: {
    token: async (_source, _args, { dataSources }: IContext) => {
      return dataSources.doceboApi.getTokenByUserInfo();
    },
    tokenByJwtPayload: async (
      _source: any,
      { username },
      { dataSources }: IContext
    ) => {
      return dataSources.doceboApi.getTokenByJWTPayload(username);
    },
    training: async (_source, _args, { dataSources }: IContext) => {
      return dataSources.doceboApi.getTraining();
    },
    session: async (_source, _args, { dataSources }: IContext) => {
      return dataSources.doceboApi.getSession();
    },
    course: async (_source, { id }, { dataSources }: IContext) => {
      return dataSources.doceboApi.getCourse(id);
    },
    courses: async (_source, { options }, { dataSources }: IContext) => {
      return dataSources.doceboApi.getCourses(options);
    },
    checkUserValidatiy: async (
      _source,
      { username, email },
      { dataSources }: IContext
    ) => {
      return dataSources.doceboApi.checkUserValidatiy(username, email);
    },
    branches: async (_source, { options }, { dataSources }: IContext) => {
      return dataSources.doceboApi.getBranches(options);
    },
    certifications: async (_source, { options }, { dataSources }: IContext) => {
      return dataSources.doceboApi.getCertifications(options);
    },
    catalogues: async (_source, { options }, { dataSources }: IContext) => {
      return dataSources.doceboApi.getCatalogues(options);
    },
    categories: async (_source, { options }, { dataSources }: IContext) => {
      return dataSources.doceboApi.getCategories(options);
    },
    enrollmentsReport: async (
      _source,
      { branchId, options },
      { dataSources }: IContext
    ) => {
      return dataSources.doceboApi.getEnrollmentsReport(branchId, options);
    },
    certificationsReport: async (_source, _args, { dataSources }: IContext) => {
      return dataSources.doceboApi.getCertificationsReport();
    }
  },
  TrainingInfo: {
    user: async (_source, _args, { dataSources }: IContext) => {
      return dataSources.doceboApi.getTrainingUser();
    },
    url: async (_source, _args, { dataSources }: IContext) => {
      return dataSources.doceboApi.getSSOUrl();
    }
  },
  TrainingUser: {
    userInfo: async (_source, _args, { dataSources }: IContext) => {
      const { id } = _source;
      return dataSources.doceboApi.getUser(id);
    },
    enrollment: async (_source, { options }, { dataSources }: IContext) => {
      const { id } = _source;
      return dataSources.doceboApi.getEnrollmentByUserId(id, options);
    }
  },
  EnrollmentItems: {
    url: async (_source, _args, { dataSources }: IContext) => {
      const { url } = _source;
      return dataSources.doceboApi.getSSOUrl(url);
    },
    course: async (_source, _args, { dataSources }: IContext) => {
      const { id } = _source;
      return dataSources.doceboApi.getCourse(id);
    }
  },
  Mutation: {
    createUser: async (
      _source,
      { userCreateInput },
      { dataSources }: IContext
    ) => {
      return dataSources.doceboApi.createUser(userCreateInput);
    },
    createGroup: async (
      _source,
      { groupCreateInput },
      { dataSources }: IContext
    ) => {
      return dataSources.doceboApi.createGroup(groupCreateInput);
    },
    createSSOUrl: async (
      _source,
      { username, path },
      { dataSources }: IContext
    ) => {
      return dataSources.doceboApi.createSSOUrl(username, path);
    }
  }
};
export default resolvers;
