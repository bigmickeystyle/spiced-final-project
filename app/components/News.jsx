var React = require('react');

var News = React.createClass({
    render: function(){
        var {description} = this.props;
        return (
            <p>{description}</p>
        );
    }
});

module.exports = News;
