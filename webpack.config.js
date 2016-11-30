var webpack = require('webpack');

module.exports = {
    entry: [
        'script!jquery/dist/jquery.min.js',
        'script!foundation-sites/dist/foundation.min.js',
        './app/app.jsx'
    ],
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        })
    ],
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: __dirname,
        alias: {
            Main: 'app/components/Main.jsx',
            Nav: 'app/components/Nav.jsx',
            Player: 'app/components/Player.jsx',
            About: 'app/components/About.jsx',
            News: 'app/components/News.jsx',
            PlayerForm: 'app/components/PlayerForm.jsx',
            SearchResults: 'app/components/SearchResults.jsx',
            Tracks: 'app/components/Tracks.jsx',
            Lyrics: 'app/components/Lyrics.jsx',
            getLastFM: 'app/api/getLastFM.jsx',
            getSpotifyAlbumId: 'app/api/getSpotifyAlbumId.jsx',
            genius: 'app/api/genius.jsx',
            appStyles: 'app/styles/app.scss',
            jQuery: 'node_modules/jquery/dist/jquery.min.js',
            PlayerWidget: 'app/components/PlayerWidget.jsx'
        }
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                },
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    devtool: "inline-source-map"
};
