const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

class CopyFilesPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('CopyFilesPlugin', (compilation) => {
      const files = [
        { from: 'src/.well-known/atproto-did', to: 'build/.well-known/atproto-did' },
        { from: 'src/_config.yml', to: 'build/_config.yml' }
      ];

      files.forEach(({ from, to }) => {
        const fromPath = path.resolve(__dirname, from);
        const toPath = path.resolve(__dirname, to);
        const toDir = path.dirname(toPath);

        if (!fs.existsSync(toDir)) {
          fs.mkdirSync(toDir, { recursive: true });
        }

        if (fs.existsSync(fromPath)) {
          fs.copyFileSync(fromPath, toPath);
          console.log(`✓ Copiado: ${from} → ${to}`);
        } else {
          console.error(`✗ No encontrado: ${from}`);
        }
      });
    });
  }
}

module.exports = {
  mode: "development",
  entry: "./main.js",
  output: {
     filename: "main.js",
     path: path.resolve(__dirname, "./build")
  },
  plugins: [
     new MiniCssExtractPlugin({
        filename: "./css/style.css",
     }),
     new HtmlWebpackPlugin({
        filename: "index.html",
        template: "src/index.html",
        hash: true
     }),
     new CopyFilesPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.htm(l)?$/i,
        loader: "html-loader"
      }
    ]
  }
}