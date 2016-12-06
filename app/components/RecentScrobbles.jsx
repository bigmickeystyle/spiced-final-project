var React = require('react');

var recentScrobbles = React.createClass({
    generate: function (){
        var {user, onGenerate} = this.props;
        onGenerate(user);
    },

    render: function(){
        return(
            <div onClick={this.generate}>{this.props.artist} - {this.props.album} - {this.props.track} - {this.props.date}</div>
        );
    }
});

module.exports = recentScrobbles;
