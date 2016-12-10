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

    render: function(){
        return (
            <div>
                <form onSubmit={this.onArtistFormSubmit}>
                    <input ref="artist" placeholder="Enter Artist"></input>
                </form>
                <form onSubmit={this.onAlbumFormSubmit}>
                    <input ref="album" placeholder="or Album"></input>
                </form>
                <form onSubmit={this.onTrackFormSubmit}>
                    <input ref="track" placeholder="or Track"></input><br/>
                    <button>Submit</button>
                </form>
            </div>
        );
    }
});

module.exports = PlayerForm;
