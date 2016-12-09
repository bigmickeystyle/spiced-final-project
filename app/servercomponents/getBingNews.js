var axios = require('axios');

module.exports = {
    music: function (artist) {
        var newsUrl = `https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=${artist}&count=10&mkt=en-US`;
        return axios({
            method: 'GET',
            url: newsUrl,
            headers: {
                'Ocp-Apim-Subscription-Key': 'ca5bdf0590e140bfa5b84749fea24097'
            }
        }).then(function (response){
            return response.data;
        });
    }
};
