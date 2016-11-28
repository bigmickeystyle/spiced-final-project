var React = require('react');

var PlayerForm = React.createClass({
    onFormSubmit: function (e) {
        e.preventDefault();
        var enteredArtist= this.refs.artist.value;
        if (enteredArtist){
            this.refs.artist.value = '';
            this.props.onSubmit(enteredArtist);
        }
    },

    render: function(){
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <input ref="artist" placeholder="Enter Artist"></input>
                    <button>Submit</button>
                </form>
            </div>
        );
    }
});

module.exports = PlayerForm;
