var React = require('react');

var ProgressBar = React.createClass({
    onclick: function(e){
        e.preventDefault();
        var {onProgressClick} = this.props;
        onProgressClick(e.nativeEvent.offsetX);
    },

    render: function(){
        return (
            <div id="progress-fill" onDoubleClick={this.onclick}></div>
        );
    }
});

module.exports = ProgressBar;
