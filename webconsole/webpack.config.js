var webpack = require("webpack"),
    path = require('path');

const ccpOptions = {
    name: 'vendor',
    filename: './vendor.bundle.js'
};

function root(__path) {
    return path.join(__dirname, __path);
}

const config = {
    entry: {
        "vendor": "./src/vendor",
        "app": "./src/main"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js",
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules')
        ]
    },
    devtool: 'source-map',
    module: {
        exprContextCritical: false,
        rules: [
            {test: /\.html$/, loader: "html-loader"},
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.ts/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(ccpOptions),

        // Takes care of warnings described at https://github.com/angular/angular/issues/11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            root('./src'), // location of your src
            {}
        ),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                htmlLoader: {
                    minimize: false
                }
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true
        }),

        new webpack.ProvidePlugin({   
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })
    ]
};

module.exports = config;
