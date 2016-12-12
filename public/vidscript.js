// var paused = false;
//
// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('player', {
//         height: '100%',
//         width: '100%',
//         videoId: 'qREKP9oijWI',
//         events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerChange
//         },
//         playerVars: {
//             showinfo: '0',
//             enablejsapi: 1,
//             controls: 0,
//             modestbranding: 1,
//             iv_load_policy: 0,
//             autoplay: 1
//         }
//     });
// }
//
// function onPlayerReady() {
//     player.playVideo();
// }
//
// function onPlayerChange(){
//     queue =
// }
//
// $('#play-img').on('click.pause', function (){
//     player.pauseVideo();
//     $('#play-img').on('click.unpause', function(){
//         player.playVideo();
//         $(this).off('.unpause');
//     });
// });

// if(e.data == 0){
//     player.loadVideoById()
// }
// if (e.data == 2 && !paused){
//     $.ajax({
//         url: '/nextTrack',
//         method: 'GET',
//         data: {
//             limit: 20
//         },
//         success: function(data) {
//             console.log(data);
//         }
//     });
//     $('#play-img').attr('src', './images/play.png');
//     paused = true;
// } else if (e.data == 1 && paused) {
//     $('#play-img').attr('src', './images/pause.png');
//     paused = false;
// }
