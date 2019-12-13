module.exports = {
    devServer: {
        proxy: {
          '^/api': {
            target: 'http://test.yinhuspa.com',
            ws: true,
            changeOrigin: true
          }
        }
    },
    assetsDir: 'static'
}