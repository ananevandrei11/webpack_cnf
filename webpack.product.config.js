const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  mode: 'none', // FOR  MINIFICATION FALSE OR FOR MINIFICATION TRUE - mode: 'production
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
  //devtool: 'eval', // FOR SPEED
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.pug',
      minify: false
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
      path: path.resolve(__dirname, 'dist'),
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['mozjpeg', { quality: 80 }],
          ['optipng', { optimizationLevel: 4 }],
          ['pngquant', {quality: [0.6, 0.8]}],
          ['svgo', { plugins: [{
                  removeViewBox: false,
            }]}
          ],
        ],
      },
    }),
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
                  {
                    tag: 'img',
                    attribute: 'srcset',
                    type: 'srcset',
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
                  {
                    tag: 'img',
                    attribute: 'srcset',
                    type: 'srcset',
                  },
                ],
              }
            }
          },
          {
            loader: 'pug-html-loader?pretty=true'
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
                      'last 3 versions',
                      '> .5%',
                      'IE 11'
                    ],
                    autoprefixer: true,
                  }],
                  ['css-mqpacker'],
                  ['postcss-import'],
                  ['cssnano', {
                    preset: [
                      'default', {
                        normalizeWhitespace: false,
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
        test: /\.(png|svg|webp|jpe?g|gif)$/i,
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