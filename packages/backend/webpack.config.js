const path = require('path');
const distPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');

const nodeExternals = require('webpack-node-externals');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const app = (env) => {
  return {
    entry: path.resolve(srcPath, 'App.ts'),
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts'],
      plugins: [new TsconfigPathsPlugin()],
    },
    plugins: [
      new ESLintPlugin({ extensions: ['ts'] }),
      new ForkTsCheckerWebpackPlugin(),
    ],
    externalsPresets: { node: true },
    externals: [nodeExternals(env.ci ? {} : {
      modulesDir: path.resolve(__dirname, '../../node_modules'),
    })],
    stats: {
      preset: 'minimal',
      assets: false,
      modules: false,
    },
    optimization: {
      minimizer: [
        new ESBuildMinifyPlugin(),
      ],
    },
    output: {
      filename: 'app.js',
      path: distPath,
      clean: true,
    },
  };
};

module.exports = (env) => [app(env)];
