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
            PlayerContainer: 'app/components/PlayerContainer.jsx',
            AlbumResults: 'app/components/AlbumResults.jsx',
            Tracks: 'app/components/Tracks.jsx',
            Lyrics: 'app/components/Lyrics.jsx',
            Video: 'app/components/Video.jsx',
            RecentScrobbles: 'app/components/RecentScrobbles.jsx',
            ArtistResults: 'app/components/ArtistResults.jsx',
            BubbleOptions: 'app/components/BubbleOptions.jsx',
            getLastFM: 'app/api/getLastFM.jsx',
            getSpotify: 'app/api/getSpotify.jsx',
            getDiscog: 'app/api/getDiscog.jsx',
            getYoutube: 'app/api/getYoutube.jsx',
            genius: 'app/api/genius.jsx',
            bing: 'app/api/bing.jsx',
            appStyles: 'app/styles/app.scss',
            jQuery: 'node_modules/jquery/dist/jquery.min.js',
            PlayerWidget: 'app/components/PlayerWidget.jsx',
            YoutubeControls: 'app/components/YoutubeControls.jsx',
            funcs: 'app/components/funcs.js'
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
