var React = require('react');

var Lyrics = React.createClass({
    render: function() {
        var {line} = this.props;
        console.log(line);
        return (
            <div className="lyric-line">
                {line}
            </div>
        );
    }
});

module.exports = Lyrics;
