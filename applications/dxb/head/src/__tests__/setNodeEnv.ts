const setNodeEnv = (env: string | undefined) => {
  Object.defineProperty(process.env, "NODE_ENV", {
    value: env
  });
};

export default setNodeEnv;
