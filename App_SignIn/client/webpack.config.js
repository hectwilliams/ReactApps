const { watch } = require('fs');
const path = require('path');

module.exports = {
    entry: './src/index.jsx',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public') // make sure public exists 
    },

    mode: "development",

    module : {
        rules : [
    
    
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader",
                    options: {
                        modules: true
                    }
    
                    }
    
                ]
            },
    
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|hidden_misc)/,
                use :  ['babel-loader']
            },
          
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: 'file-loader',
                options: {
                    name: '/src/icons/[name].[ext]'
                }
            }
    
        ]
    
    },

    resolve: {
        extensions: [".js", ".jsx", ".css"]
    },

      
    watch: true

      
}