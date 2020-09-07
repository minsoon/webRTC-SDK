const path = require('path');

const config = {  
    entry: {
        main : ['./src/index.js']
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9090
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'mc.webRTC.sdk.js',
        library: 'mc',
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
};

module.exports = config;  
