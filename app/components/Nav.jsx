var React = require('react');
var {Link, IndexLink} = require('react-router');

var Nav = React.createClass({

    onSearch: function (e) {
        e.preventDefault();
        var artist = this.refs.artist.value;
        var encodedArtist = encodeURI(artist);
        if (encodedArtist){
            this.refs.artist.value = '';
            window.location.hash = `#/?artist=${artist}`;
        }

    },

    render: function () {
        return(
            <div className="top-bar">
                <div className="top-bar-left">
                    <ul className="menu">
                        <li className="menu-text">NAME GOES HERE</li>
                        <li><IndexLink to="/" activeClassName="selected-link">Player</IndexLink></li>
                        <li><Link to="/news" activeClassName="selected-link">News</Link></li>
                        <li><Link to="/about" activeClassName="selected-link">About</Link></li>
                    </ul>
                </div>
                <div className="top-bar-right">
                    <form onSubmit={this.onSearch}>
                        <ul className="menu">
                            <li>
                                <input type="search" placeholder="search" ref="artist" />
                            </li>
                            <li>
                                <input type="submit" className="button" value="go" />
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        );
    }
});

module.exports = Nav;
