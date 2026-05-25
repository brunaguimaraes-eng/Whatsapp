const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,              //todo arquivo .js
                exclude: /node_modules/,    // exceto os da pasta node_modules
                use: 'babel-loader'         // passa pelo babel antes de empacotar
            }
        ]
    },
    devServer: {
        static: './',
        port: 8080,
        open: true
    }
}