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

function animateFeaturesSection() {
    var $blocks = $('.features-item'),
        timeoutTime = 0;

    $blocks.each(function(i,e) {
        if (isAnyPartOfElementInViewport(e)) {
            timeoutTime = timeoutTime + 100;
            setTimeout(function() {
                $(e).addClass('animate');
            },timeoutTime)
        }
    });
}

function rotateGraphs(shouldHalt) {
    if (shouldHalt) {
        return false;
    }
    var $leftGraph = $('.roadmap-graphs__svg.-left-graph'),
        rotation = 0, 
        scrollLoc = $(document).scrollTop();
    $(window).scroll(function() {
        var newLoc = $(document).scrollTop();
        var diff = scrollLoc - newLoc;
        rotation += diff, scrollLoc = newLoc;
        var rotationStr = "rotate(" + rotation + "deg)";
        $leftGraph.css({
            "-webkit-transform": rotationStr,
            "-moz-transform": rotationStr,
            "transform": rotationStr
        });
    });
}

function animateGraphBullets(isInView) {
    $bullets = $('.roadmap-graphs__item'),
        timeoutTime = 0;
    if (isInView) {
        $bullets.each(function(i,e) {
            // timeoutTime = Math.floor(Math.random() * (max - min + 1)) + min;
            timeoutTime = timeoutTime + 200;
            setTimeout(function() {
                $(e).addClass('animate');
            },timeoutTime)
        });
    } else {
        timeoutTime = 0;
        $bullets.each(function(i,e) {
            $(e).removeClass('animate');
        });
    }
}

$(function(){
    $(window).on('DOMContentLoaded load resize scroll', function() {
        if (isAnyPartOfElementInViewport($('.features')[0])) {
            animateFeaturesSection(true);
        }
    });

    var isRotating = false;
    $(window).on('DOMContentLoaded load resize scroll', function() {
        if (isAnyPartOfElementInViewport($('.roadmap-graphs')[0])) {
            if (!isRotating) {
                rotateGraphs();
            }
            isRotating = true;
            // animateGraphBullets(true);
            $('.roadmap-graphs__svg--holder').addClass('animate');
        } else {
            isRotating = false;
            animateGraphBullets(false);
            $('.roadmap-graphs__svg--holder').removeClass('animate');
        }
    });

});