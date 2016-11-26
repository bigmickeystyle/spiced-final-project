var React = require('react');
var {Link, IndexLink} = require('react-router');

var Nav = React.createClass({
    render: function(){
        return(
            <div>
                <h1>Nav Bar</h1>
                <IndexLink to="/" activeClassName="active" activeStyle={{color: 'green'}}>-Go to Player-</IndexLink>
                <Link to="/about" activeClassName="active" activeStyle={{color: 'green'}}>-About-</Link>
                <Link to="/news" activeClassName="active" activeStyle={{color: 'green'}}>-News-</Link>
            </div>
        );
    }
});

module.exports = Nav;
