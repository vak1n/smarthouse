const PUBLIC_PATH = require('path').join(__dirname, 'public');

module.exports = {
  output: {
    path: PUBLIC_PATH,
    filename: 'index.js',
  },
  devServer: {
    contentBase: PUBLIC_PATH,
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
      },
    ],
  },
};
