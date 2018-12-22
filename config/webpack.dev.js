const path=require("path")
const UglifyJsPlugin=require('uglifyjs-webpack-plugin')//js压缩代码
const htmlPlugin=require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")//提取单独打包css文件
const PurifyCSSPlugin=require('purifycss-webpack')
const CleanWebpackPlugin=require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin=require('optimize-css-assets-webpack-plugin')
const glob=require("glob")
var website ={
    publicPath:"/"
    // publicPath:"http://192.168.1.103:8888/"
}

module.exports={
    mode:'development',
    entry:{
        ma:'./src/main.js',
        ma2:'./src/main2.js'
    },
    output:{
        path:path.resolve(__dirname,"../dist"),
        filename:'[name].js',
        publicPath:website.publicPath
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                exclude: /node_modules/, // 取消匹配node_modules里面的文件
                use:[
                    {loader:"style-loader"},
                    MiniCssExtractPlugin.loader,
                    {loader:"css-loader"},
                    {loader:"postcss-loader"}
                ]
            },
            {//antd样式处理
               test:/\.css$/,
                exclude: /src/, // 取消匹配node_modules里面的文件
                use:[
                    {loader:"style-loader"},
                    {loader:"css-loader",
                      options:{
                          importLoaders:1
                      }
                    }
                ]     
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [{
                       loader: "style-loader" 
                    }, MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader" 
                    },{loader:"postcss-loader"},
                    {
                        loader: "less-loader" 
                    }]
            },
            //图片 loader
            {
                test:/\.(png|jpg|gif|jpeg)/,  //是匹配图片文件后缀名称
                use:[{
                    loader:'url-loader', //是指定使用的loader和loader的配置参数
                    options:{
                        limit:500,  //是把小于500B的文件打成Base64的格式，写入JS
                        outputPath:'images/'
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'] 
            },
            {
                test:/\.(jsx|js)$/,
                use:['babel-loader'],
                exclude:/node_modules/
            }
        ]
    },
    plugins:[
            //new UglifyJsPlugin()
            new CleanWebpackPlugin(['../dist']),
            new htmlPlugin({
                minify:{ //是对html文件进行压缩
                    removeAttributeQuotes:true  //removeAttrubuteQuotes是却掉属性的双引号。
                },
                hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
                template:'./src/index.html' //是要打包的html模版路径和文件名称。
            
            }),
            new PurifyCSSPlugin({
                paths:glob.sync(path.join(__dirname,'../src/*.html'))
            }),
            // 把css从bundle.js中分离出来
            new MiniCssExtractPlugin({
                filename: "css/[name].[chunkhash:8].css",
            })
        ],
    // 提取公共代码
    optimization: {
        minimizer: [
           // 自定义js优化配置，将会覆盖默认配置 最大化压缩成js
            new UglifyJsPlugin({
                exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
                cache: true,
                parallel: true, // 开启并行压缩，充分利用cpu
                sourceMap: false,
                extractComments: false, // 移除注释
                uglifyOptions: {
                  compress: {
                    unused: true,
                    warnings: false,
                    drop_debugger: true
                  },
                  output: {
                    comments: false
                  }
                }
            }),
            // 用于优化css文件 最大化压缩成css 并且去掉注释掉的css
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                  safe: true,
                  autoprefixer: { disable: true },
                  mergeLonghand: false,
                  discardComments: {
                    removeAll: true // 移除注释
                  }
                },
                canPrint: true
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10    
                },
                // utils: { // 抽离自己写的公共代码，utils这个名字可以随意起 (css/js公用的都会单独抽离出来生成一个单独的文件)
                //     chunks: 'initial',
                //     name: 'utils',  // 任意命名
                //     minSize: 0    // 只要超出0字节就生成一个新包
                // }
            }
        }
    },
   
    devServer:{
        contentBase:path.resolve(__dirname,"../dist"),
        host:'localhost',
        compress:true,
        port:8888
    }
}