const path = require('path');

module.exports = {

    entry: {
        signin: './src/SignIn/index.jsx',
        aihumans: './src/aiHumans/index.jsx'
    },

    output: {
        filename: '[name].bundle.js', // name = entry key 
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
                test: /\.(jpe?g|png|gif|svg|csv)$/i, 
                loader: 'file-loader',
                options: {
                    name: '/src/assets/[name].[ext]',
                    // outputPath: 'images'
                    outputPath: (url, resourcePath, context) => {
                        console.log(url)
                        console.log(resourcePath)
                        console.log(context)
                        retSignIn = (resourcePath).match(/\/SignIn.+/);
                        retAiHumans = (resourcePath).match(/\/aiHumans.+/);

                        if(retSignIn) 
                            return `assets/SignIn/${path.basename(retSignIn[0])}`

                        if (retAiHumans)
                            return `assets/AiHumans/${path.basename(retAiHumans[0])}`

                    }

                }
            }
    
        ]
    
    },

    resolve: {
        extensions: [".js", ".jsx", ".css"]
    },

      
    watch: true

      
}