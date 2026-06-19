const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    entry: './client/src/main.tsx',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'client', 'public' )
    },

    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                use: ['ts-loader'],
                // exclude: /node_modules/

            },
            
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader",
                        options: {
                            // enable css modules 
                            modules: true
                        }

                    }

                ]
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },

    // plugins:[
    //     new MiniCssExtractPlugin({
    //         filename: '[name].css',
    //     }),
    // ]


};