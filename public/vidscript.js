function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: '-1tlyGcAHbU',
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(e) {
    e.target.playVideo();
}

$('#vid-box').on('mouseenter', function (){
});

$('#vid-box').on('mouseleave', function (){
});
