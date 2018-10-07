$.fn.handleVideo= function() {
    var $launcher = $('.home-video__cta--butons', $(this)),
        $video = $('.home-video__container'),
        $overlay = $('.home-video__overlay'),
        $actualVideo = $('#actualVideo')[0],
        $videoClose = $('.home-video__close');

    $launcher.click(function(e) {
        $video.fadeIn();
    });

    $overlay.click(function(e) {
        $video.fadeOut();
        $actualVideo.pause();
    })

    $videoClose.click(function(e) {
        $video.fadeOut();
        $actualVideo.pause();
    })

}

$(function(){
    $('#videoPop').handleVideo();
});