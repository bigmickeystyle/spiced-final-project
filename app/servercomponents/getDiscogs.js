var axios = require('axios');
var db = require('./dbConnect');
var key = 'BbbRzFPxUMUcyACiGlnh';
var secret  = 'hbCHSANxssidYtDOrFERtegYvuUDHAWw';

module.exports = {
    getAlbums: function(artist) {
        var tokenUrl = `https://api.discogs.com/database/search?q=&key=${key}&secret=${secret}&type=master&artist=${artist}&format=album`;
        return axios({
            methog: 'GET',
            url: tokenUrl,
            headers: {
                Authorization: {
                    key: key,
                    secret: secret
                }

            }
        }).then(function(response){
            return response.data;
        }).catch(function(err){
            console.log(err);
        });
    }
};
