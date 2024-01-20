var config = {
  entry: './server.js',
};

const webpackConfig = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    //...
  }
  return config;
};

export default webpackConfig;