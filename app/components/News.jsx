var React = require('react');

var Profile = React.createClass({
    render: function(){
        var {description} = this.props;
        return (
            <p>{description}</p>
        );
    }
});

module.exports = Profile;
