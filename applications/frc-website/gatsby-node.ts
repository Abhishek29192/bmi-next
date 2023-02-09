import findUp from "find-up";
import type { GatsbyNode } from "gatsby";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions
}) => {
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
