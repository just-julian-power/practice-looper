
let loopStart = -1;
let loopEnd = -1;

let tag
let firstScriptTag

tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let vlink;
let video_id;
let video_info;
let player;

let playing = false;

let startTime = document.getElementById("lStartTime");
let endTime = document.getElementById("lEndTime");

document.getElementById("mySubmit").onclick = function(){

    vlink = document.getElementById("vlink").value;
    video_info = youtubeUrlParser(vlink)
    video_id = video_info.id
    console.log(video_id);
    console.log("click!");
    player.loadVideoById(video_id);

}

document.getElementById("setStart").onclick = function(){
    loopStart = player.getCurrentTime();
    startTime.innerText = loopStart.toFixed(1);
}

document.getElementById("setEnd").onclick = function(){
    loopEnd = player.getCurrentTime();
    endTime.innerText = loopEnd.toFixed(1);
    if(loopStart != -1){
        loopPlayback();
    }
}

document.getElementById("resetLoop").onclick = function(){
    loopStart = -1;
    loopEnd = -1;
}



// This function creates an <iframe> (and YouTube player) after the API code downloads.


function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'yydNF8tuVmU',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}


function loopPlayback(){

    if(loopEnd == -1  || loopStart == -1){

    }
    else{
        var duration = (loopEnd - loopStart).toFixed(5);
        console.log(duration);
        player.seekTo(loopStart);

        setTimeout(loopPlayback, duration*1000);
    }
    
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}



// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.




function onPlayerStateChange(event) { //needed to make iframe


    if (event.data == YT.PlayerState.PLAYING)
    {
        playing = true;
    }
    else
    {
        playing = false;
    }

    /*
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }

    */
}



function stopVideo() {
    player.stopVideo();
}


function youtubeUrlParser(url) {
  
  var timeToSec = function(str) {
    var sec = 0;
    if (/h/.test(str)) { sec += parseInt(str.match(/(\d+)h/,'$1')[0],10) * 60 * 60; }
    if (/m/.test(str)) { sec += parseInt(str.match(/(\d+)m/,'$1')[0],10) * 60; }
    if (/s/.test(str)) { sec += parseInt(str.match(/(\d+)s/,'$1')[0],10); }
    return sec;
  };
  
  var videoId = /^https?\:\/\/(www\.)?youtu\.be/.test(url) ? url.replace(/^https?\:\/\/(www\.)?youtu\.be\/([\w-]{11}).*/,"$2") : url.replace(/.*\?v\=([\w-]{11}).*/,"$1");
  var videoStartTime = /[^a-z]t\=/.test(url) ? url.replace(/^.+t\=([\dhms]+).*$/,'$1') : 0;
  var videoStartSeconds = videoStartTime ? timeToSec(videoStartTime) : 0;
  var videoShowRelated = ~~/rel\=1/.test(url);
  
  return {
    id: videoId,
    startString: videoStartTime,
    startSeconds: videoStartSeconds,
    showRelated: videoShowRelated
  };
  
};