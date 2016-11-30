var axios = require('axios');

module.exports = {
    getSong: function(artist, track){
        return axios({
            method: 'GET',
            url: `/lyrics`,
            params: {
                artist: artist,
                track: track
            }
        }).then(function(resp){
            return (resp.data.lyrics);
        }).catch(function(err){
            console.log('eerror');
            console.log(err);
        });
    }
};
