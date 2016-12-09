var axios = require('axios');

module.exports = {
    getNews: function(artist){
        return axios({
            method: 'GET',
            url: '/news',
            params: {
                artist: artist
            }
        }).then(function(resp){
            if(resp.status == 200){
                return (resp.data.news);
            } else {
                throw ('request failed', resp.status);
            }
        }).catch(function(err){
            console.log('error');
            console.log(err);
        });
    }
};
