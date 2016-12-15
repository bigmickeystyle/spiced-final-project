var React = require('react');
var {Link, IndexLink} = require('react-router');
var hidden = false;

var Nav = React.createClass({

    onSearch: function (e) {
        e.preventDefault();
        var searchString = this.refs.searchString.value;
        var encodedString = encodeURI(searchString);
        if (encodedString){
            this.refs.searchString.value = '';
            window.location.hash = `#/?search=${encodedString}`;
        }

    },

    hideAll: function() {
        $('.bubble').toggleClass('hide-bubbles');
    },

    render: function () {
        return(
            <div className="top-bar">
                <div className="top-bar-left">
                    <ul className="menu">
                        <li onClick={this.hideAll} id="hider" className="menu-text">HIDE</li>
                        <li><IndexLink to="/" activeClassName="selected-link">Player</IndexLink></li>
                        <li><Link to="/profile" activeClassName="selected-link">Profile</Link></li>
                        <li><Link to="/about" activeClassName="selected-link">About</Link></li>
                    </ul>
                </div>
                <div className="top-bar-right">
                    <form onSubmit={this.onSearch}>
                        <ul className="menu">
                            <li>
                                <input type="search" placeholder="search" ref="searchString" />
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
