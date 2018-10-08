function isAnyPartOfElementInViewport(el) {

    const rect = el.getBoundingClientRect();
    // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    return (vertInView && horInView);
}

function animateSocialSection(isInView) {
    var $tag1 = $('.social-media__tag.-brother');
    var $tag2 = $('.social-media__tag.-leaks');
    var $tag3 = $('.social-media__tag.-fakenews');
    if (isInView) {
        $tag1.css('transform','translateX(0)');
        setTimeout(function() {
            $tag1.addClass('animate');
        },300)
        setTimeout(function() {
            $tag2.css('transform','translateX(0)');
            setTimeout(function() {
                $tag2.addClass('animate');
            },300)
        },500)
        setTimeout(function() {
            $tag3.css('transform','translateX(0)');
            setTimeout(function() {
                $tag3.addClass('animate');
            },300)
        },1000)
    } else {
        $tag1.css('transform','translateX(1000px)');
        $tag2.css('transform','translateX(1000px)');
        $tag3.css('transform','translateX(1000px)');
        $tag1.removeClass('animate');
        $tag2.removeClass('animate');
        $tag3.removeClass('animate');
    }
}

function animateTokenSection(isInView) {
    var $blocks = $('.tokenization__col'),
        max = 2000,
        min = 400,
        timeoutTime = 200;

    if (isInView) {
        $blocks.each(function(i,e) {
            console.log(e);
            // timeoutTime = Math.floor(Math.random() * (max - min + 1)) + min;
            timeoutTime = timeoutTime + 400;
            setTimeout(function() {
                $(e).addClass('animate');
            },timeoutTime)
        });
    } else {
        console.log('no blocks');
        timeoutTime = 0;
        $blocks.each(function(i,e) {
            $(e).removeClass('animate');
        });
    }
}

$(function(){
    $(window).on('DOMContentLoaded load resize scroll', function() {
        if (isAnyPartOfElementInViewport($('.social-media')[0])) {
            animateSocialSection(true);
        } else {
            animateSocialSection(false);
        }
    });

    $(window).on('DOMContentLoaded load resize scroll', function() {
        if (isAnyPartOfElementInViewport($('.tokenization__row')[0])) {
            animateTokenSection(true);
        } else {
            animateTokenSection(false);
        }
    });
});