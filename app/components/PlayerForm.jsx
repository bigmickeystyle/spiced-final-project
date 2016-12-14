var React = require('react');

var PlayerForm = React.createClass({

    onArtistFormSubmit: function (e) {
        e.preventDefault();
        var enteredArtist= this.refs.artist.value;
        if (enteredArtist){
            this.refs.artist.value = '';
            this.props.onArtistSubmit(enteredArtist);
        }
    },

    onAlbumFormSubmit: function (e) {
        e.preventDefault();
        var enteredAlbum = this.refs.album.value;
        if (enteredAlbum){
            this.refs.album.value = '';
            this.props.onAlbumSubmit(enteredAlbum);
        }
    },

    onTrackFormSubmit: function (e) {
        e.preventDefault();
        var enteredTrack = this.refs.track.value;
        if (enteredTrack){
            this.refs.track.value = '';
            this.props.onTrackSubmit(enteredTrack);
        }
    },

    onPlaylistFormSubmit: function(){
        console.log("doesn't work");
    },

    onSceneryFormSubmit: function (e) {
        e.preventDefault();
        var enteredScenery = this.refs.scenery.value;
        if(enteredScenery){
            this.refs.scenery.value = "";
            this.props.onScenerySubmit(enteredScenery);
        }
    },

    render: function(){
        return (
            <div id="search-input">
                <form onSubmit={this.onArtistFormSubmit}>
                    <input ref="artist" placeholder="Enter Artist"></input>
                </form>
                <form onSubmit={this.onAlbumFormSubmit}>
                    <input ref="album" placeholder="or Album"></input>
                </form>
                <form onSubmit={this.onTrackFormSubmit}>
                    <input ref="track" placeholder="or Track"></input><br/>
                </form>
                <form onSubmit={this.onPlaylistFormSubmit}>
                    <input ref="playlist" placeholder="or Playlist (doesn't work yet)"></input><br/>
                </form>
                <form onSubmit={this.onSceneryFormSubmit}>
                    <input ref="scenery" placeholder="or Scenery"></input><br/>
                </form>
            </div>
        );
    }
});

module.exports = PlayerForm;
