const path=require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin=require("html-webpack-plugin");
const UglifyjsWebpackPlugin=require("uglifyjs-webpack-plugin");
const webpack=require("webpack");
const config={
    mode:"development",
    entry:{
        "IdcTopo":path.join(__dirname, "./src/IdcTopo.js"),
        "TreeTopo":path.join(__dirname, "./src/TreeTopo.js"),
    },
    output:{
        path:path.join(__dirname, "build"),//目标路径
        filename:"js/[name].js",//打包名称
        libraryTarget: "var",
		library: "[name]"
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:"css-loader",
                include:[

                ]
            }//文件解析
        ]
    },
    devtool: "source-map",
    plugins:[
        new CleanWebpackPlugin(
            ["build"],
            {
                root:__dirname,
                verbose:true,
                dry:false
            }),
        new CopyWebpackPlugin([
            {from:"libs",to:"libs"},
            {from:"res",to:"res"},
            {from:"node_modules/d3/dist/d3.js",to:"libs"},
            {from:"*.html",to:"./",context: './'}
        ]),       
        new HtmlWebpackPlugin(
            {
                filename:"index.html",
                template:"./index.html",
                inject:false,
                title:"test",
                chunks:["IdcTopo"],
                showErrors:true,                
            }
        ),
        new HtmlWebpackPlugin(
            {
                filename:"topoTree.html",
                template:"./topoTree.html",
                inject:false,
                title:"topotree",
                chunks:["TreeTopo"],
                showErrors:true,     
            }
        ),
    //    new UglifyjsWebpackPlugin({
    //     sourceMap: true
    //    })
    ],   
    watch: true,
    watchOptions:{
        poll:500,//监测修改的时间(ms)
        aggregateTimeout:500, //防止重复按键，500毫米内算按键一次
        ignored:/node_modules/,//不监测
    },
    devServer: {
        contentBase: path.join(__dirname, "build"),
        // useLocalIp: true,
        compress: true,
        port: 8085,
        open: true,
        openPage:"topoTree.html",
        host:"192.168.1.",//
        // hot: true,
        inline: true,
        // noInfo: true,
        watchContentBase: true,
        // overlay: {
        //     warnings: true,
        //     errors: true
        // }
    }
}

module.exports=config;