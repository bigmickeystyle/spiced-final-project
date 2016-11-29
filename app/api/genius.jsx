var axios = require('axios');

module.exports = {
    getSong: function(songId){
        return axios({
            method: 'GET',
            url: `/lyrics`
        }).then(function(resp){
            return (resp.data.lyrics);
        }).catch(function(err){
            console.log('eerror');
            console.log(err);
        });
    }
};
