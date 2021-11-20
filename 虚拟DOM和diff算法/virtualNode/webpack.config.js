let path = require('path')

module.exports = {
  entry: './src/index.js',
  // devtool:'none',
  output: { 
    publicPath: 'xuni',
    filename:'bundle.js' 
  }, 
  devServer: {
    port: 8080,
    contentBase:'www'
  }
  
}
