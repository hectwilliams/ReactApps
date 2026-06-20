const path = require('path');
const webpack = require('webpack');

// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    entry: './client/src/index.tsx',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'client', 'public' )
    },

    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                use: ['ts-loader'],
                exclude: /node_modules/

            },
            
        {
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader",
            options: {
              modules: true
              // url: false
            }

          }

        ]
      },

      {
        test: /\.(png|jpg|jpeg)$/i,
        type: 'asset',

      }

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
  
  //   plugins: [
  //   new webpack.NormalModuleReplacementPlugin(
  //     /^node:/,
  //     (resource) => {
  //       resource.request = resource.request.replace(/^node:/, '');
  //     }
  //   ),
  // ],
  

};