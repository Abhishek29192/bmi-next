import { GraphQLResolverMap } from "apollo-graphql";
import { IContext } from "../type";

const resolvers: GraphQLResolverMap<IContext> = {
  Query: {
    token: async (_source, _args, { dataSources }) => {
      return dataSources.doceboApi.getTokenByUserInfo();
    },
    tokenByJwtPayload: async (_source: any, { username }, { dataSources }) => {
      return dataSources.doceboApi.getTokenByJWTPayload(username);
    },
    training: async (_source, _args, { dataSources }) => {
      return dataSources.doceboApi.getTraining();
    },
    session: async (_source, _args, { dataSources }) => {
      return dataSources.doceboApi.getSession();
    },
    course: async (_source, { id }, { dataSources }) => {
      return dataSources.doceboApi.getCourse(id);
    },
    courses: async (_source, { options }, { dataSources }) => {
      return dataSources.doceboApi.getCourses(options);
    },
    checkUserValidatiy: async (
      _source,
      { username, email },
      { dataSources }
    ) => {
      return dataSources.doceboApi.checkUserValidatiy(username, email);
    },
    branches: async (_source, { options }, { dataSources }) => {
      return dataSources.doceboApi.getBranches(options);
    },
    certifications: async (_source, { options }, { dataSources }) => {
      return dataSources.doceboApi.getCertifications(options);
    },
    catalogues: async (_source, { options }, { dataSources }) => {
      return dataSources.doceboApi.getCatalogues(options);
    },
    categories: async (_source, { options }, { dataSources }) => {
      return dataSources.doceboApi.getCategories(options);
    },
    enrollmentsReport: async (
      _source,
      { branchId, options },
      { dataSources }
    ) => {
      return dataSources.doceboApi.getEnrollmentsReport(branchId, options);
    },
    certificationsReport: async (_source, _args, { dataSources }) => {
      return dataSources.doceboApi.getCertificationsReport();
    }
  },
  TrainingInfo: {
    user: async (_source, _args, { dataSources }) => {
      return dataSources.doceboApi.getTrainingUser();
    },
    url: async (_source, _args, { dataSources }) => {
      return dataSources.doceboApi.getSSOUrl();
    }
  },
  TrainingUser: {
    userInfo: async (_source, _args, { dataSources }) => {
      const { id } = _source;
      return dataSources.doceboApi.getUser(id);
    },
    enrollment: async (_source, { options }, { dataSources }) => {
      const { id } = _source;
      return dataSources.doceboApi.getEnrollmentByUserId(id, options);
    }
  },
  EnrollmentItems: {
    url: async (_source, _args, { dataSources }) => {
      const { url } = _source;
      return dataSources.doceboApi.getSSOUrl(url);
    },
    course: async (_source, _args, { dataSources }) => {
      const { id } = _source;
      return dataSources.doceboApi.getCourse(id);
    }
  },
  Mutation: {
    createUser: async (_source, { userCreateInput }, { dataSources }) => {
      return dataSources.doceboApi.createUser(userCreateInput);
    },
    createGroup: async (_source, { groupCreateInput }, { dataSources }) => {
      return dataSources.doceboApi.createGroup(groupCreateInput);
    },
    createSSOUrl: async (_source, { username, path }, { dataSources }) => {
      return dataSources.doceboApi.createSSOUrl(username, path);
    }
  }
};
export default resolvers;
