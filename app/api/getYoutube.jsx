var axios = require('axios');

const KEY = "AIzaSyBWbdmTzhEx1N6P3gurIH3lWZcwkteXiX0";
const YOUTUBE_SEARCH_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&&type=video&order=relevance&q=`;


module.exports = {
    getVideo: function(artist, track){
        var encodedString = encodeURIComponent(track +' '+ artist);
        var searchURL = `${YOUTUBE_SEARCH_URL}${encodedString}&key=${KEY}`;
        console.log(searchURL);
        return axios.get(searchURL).then(function(resp){
            return resp.data.items;
        }).catch(function(err){
            return err;
        });
    }
};
