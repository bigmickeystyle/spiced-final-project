var axios = require('axios');

module.exports = {
    getAlbums: function(artist){
        var encodedArtist = encodeURIComponent(artist);
        return axios({
            method: 'GET',
            url: '/albums',
            params: {
                artist: encodedArtist
            }
        }).then(function(resp){
            return resp.data.albums.results;
        }).catch(function(err){
            return err;
        });
    }
};
