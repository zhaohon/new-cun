module.exports = {
  entry: ['babel-polyfill', './src/main.js'],
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, 'src')
    }
  }
}
