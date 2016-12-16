var React = require('react');

var Profile = React.createClass({

    render: function(){
        var {title, description, image, url} = this.props;
        return (
            <div className="news-item media-object" onDoubleClick={this.onClickedNews}>
                <div className="media-object-section">
                    <a target="_blank" href={url}>
                        <div className="thumbnail">
                            <img className="news-image" src={image}></img>
                        </div>
                    </a>
                </div>
                <div className="media-object-section main-section">
                    <p>{title} - {description}</p>
                </div>
            </div>
        );
    }
});

module.exports = Profile;
