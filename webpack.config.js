const PUBLIC_PATH = require('path').join(__dirname, 'public');

module.exports = {
  entry: {
    index: './src/index.ts',
    video: './src/video.ts',
  },
  output: {
    path: PUBLIC_PATH,
    filename: '[name].js',
  },
  devServer: {
    disableHostCheck: true,
    contentBase: PUBLIC_PATH,
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};
