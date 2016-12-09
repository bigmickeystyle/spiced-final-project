function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'eyU3bRy2x44',
        events: {
            'onReady': onPlayerReady
        },
        playerVars: {
            showinfo: '0',
            enablejsapi: 1,
            controls: 0,
            modestbranding: 1,
            iv_load_policy: 0
        }
    });
}

function onPlayerReady(e) {
    player.playVideo();
}

$('#youtube-controls').on('click.pause', function (){
    player.pauseVideo();
    $('#youtube-controls').on('click.unpause', function(){
        player.playVideo();
        $(this).off('.unpause');
    });
});
