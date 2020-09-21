const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devtool: 'eval',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.pug',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
      path: path.resolve(__dirname, 'dist'),
    })
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              sourceMap: true,
              cache: true,
            },
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              cacheDirectory: true
            }
          }
        ]
      },
      // FOR ONLY HTML
      /*
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              attributes: {
                list: [
                  {
                    tag: 'img',
                    attribute: 'src',
                    type: 'src',
                  },
                ],
              }
            }
          }
        ]
      },
      */
      // FOR PUG
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attributes: {
                list: [
                  {
                    tag: 'img',
                    attribute: 'src',
                    type: 'src',
                  },
                ],
              }
            }
          },
          {
            loader: 'pug-html-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-preset-env', {
                    browsers: [
                      'last 2 version'
                    ],
                    autoprefixer: true,
                  }],
                  ['css-mqpacker'],
                  ['postcss-import'],
                  ['cssnano', {
                    preset: [
                      'default', {
                        normalizeWhitespace: true,
                        discardComments: {
                          removeAll: true,
                        }
                      }
                    ]
                  }]
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|webp|jpg|gif)$/,
        use: [
          // COMMON LOAD IMAGES
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './images',
              useRelativePath: true,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.2, 0.80],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 50
              }
            }
          },
          // LOAD AND CHANGE ALL IMAGES INTO WEBP
          /*{
            loader: `img-optimize-loader`,
            options: {
              name: '[name].[ext]',
              outputPath: './images',
              compress: {
                webp: true,
                disableOnDevelopment: true,
                webp: {
                  quality: 50,
                }
              },
            },
          }*/
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './fonts',
            useRelativePath: true,
          }
        }]
      }
    ]
  }
};