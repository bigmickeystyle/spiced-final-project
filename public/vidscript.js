var paused = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'qREKP9oijWI',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerChange
        },
        playerVars: {
            showinfo: '0',
            enablejsapi: 1,
            controls: 0,
            modestbranding: 1,
            iv_load_policy: 0,
            autoplay: 1
        }
    });
}

function onPlayerReady() {
    player.playVideo();
}

function onPlayerChange(e){
    if(e.data == 0){
        console.log("ended");
    }
    if (e.data == 2 && !paused){
        $('#controls-image').attr('src', './images/bubbles.png');
        paused = true;
    } else if (e.data == 1 && paused) {
        $('#controls-image').attr('src', './images/pause.png');
        paused = false;
    }
}

$('#youtube-controls').on('click.pause', function (){
    player.pauseVideo();
    $('#youtube-controls').on('click.unpause', function(){
        player.playVideo();
        $(this).off('.unpause');
    });
});
