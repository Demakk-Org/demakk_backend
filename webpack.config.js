import path from 'path'
console.log(path.resolve('dist'))
const webpackConfig = {
  entry: './server.js',
  target:'node',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
};
path.resolve()
export default webpackConfig;