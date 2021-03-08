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
    checkUserValidatiy: async (
      _source,
      { username, email },
      { dataSources }: IContext
    ) => {
      return dataSources.doceboApi.checkUserValidatiy(username, email);
    },
    branches: async (_source, _args, { dataSources }: IContext) => {
      return dataSources.doceboApi.getBranches();
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
    enrollment: async (_source, _args, { dataSources }: IContext) => {
      const { id } = _source;
      return dataSources.doceboApi.getEnrollmentByUserId(id);
    }
  },
  EnrollmentItems: {
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
    }
  }
};
export default resolvers;
