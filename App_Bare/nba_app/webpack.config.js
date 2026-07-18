import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the current file path (equivalent to __filename)
const __filename = fileURLToPath(import.meta.url);

// Get the current directory path (equivalent to __dirname)
const __dirname = path.dirname(__filename);

// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export default  {
  
    mode: "development",
    entry: './client/src/Index.tsx',

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