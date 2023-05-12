import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import type { CreateBabelConfigArgs, GatsbyNode } from "gatsby";

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()]
    }
  });
};

export const onCreateBabelConfig = ({ actions }: CreateBabelConfigArgs) => {
  actions.setBabelPreset({
    name: "babel-preset-gatsby",
    options: {
      targets: {
        browsers: [">0.25%", "not dead"]
      }
    }
  });
};
