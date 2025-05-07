/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import HtmlWebpackPlugin from "html-webpack-plugin";
import {WebpackConfiguration} from "webpack-cli";
import path from "node:path";

const config: WebpackConfiguration = {
  entry: "./src/index.ts",
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      title: "Simple Shooter",
      favicon: "./public/assets/favicon.png"
    })
  ],
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
  },
  
  devServer: {
    port: 3000,
    client: {
      overlay: {
        warnings: false,
        errors: true
      },
    },
    hot: false
  }
}

export default config;