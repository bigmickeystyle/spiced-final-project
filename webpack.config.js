module.exports = {
    entry: './app/app.jsx',
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
            PlayerMessage: 'app/components/PlayerMessage.jsx',
            getLastArtist: 'app/api/getLastArtist.jsx'
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
