var axios = require('axios');
var db = require('./dbConnect');

module.exports = {
    getAlbums: function(url) {
        return axios.get(url).then(function(response){
            var albums = response.data['release-groups'].filter(function(release){
                if(release['primary-type'] == 'Album'){
                    return release;
                }
            });
            return albums;
        }).catch(function(err){
            console.log(err);
        });
    }
};
