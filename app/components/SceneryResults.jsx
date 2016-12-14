var React = require('react');

var Scenery = React.createClass({
    onClickedScenery: function() {
        var {id, onClickedScenery} = this.props;
        onClickedScenery(id);
    },
    render: function() {
        var {scenery, description} = this.props;
        return (
            <div className="result" onDoubleClick={this.onClickedScenery}>
                {scenery} {description}
            </div>
        );
    }
});

module.exports = Scenery;
