const {
    useBabelRc,
    override,
    addWebpackModuleRule,
  } = require('customize-cra');
  
  module.exports = override(
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useBabelRc(),
  addWebpackModuleRule({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      { loader: 'babel-loader' },
      {
        loader: '@linaria/webpack-loader',
        options: {
          sourceMap: process.env.NODE_ENV !== 'production',
        },
      },
    ],
  })
);