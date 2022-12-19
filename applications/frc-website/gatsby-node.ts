import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import findUp from "find-up";

export const onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          configFile: findUp.sync("tsconfig.json")
        })
      ]
    }
  });
};
