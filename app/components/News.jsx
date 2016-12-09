var React = require('react');

var News = React.createClass({
    render: function(){
        var {description} = this.props;
        return (
            <h3>{description}</h3>
        );
    }
});

module.exports = News;
