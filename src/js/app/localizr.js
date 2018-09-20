$.fn.localizr = function() {
    var $context = $(this),
        $current = $('.language-selector__current', $context),
        $currentLang = $('.language-selector__current span', $context),
        $arrow = $('.language-selector__arrow', $context),
        $layer = $('.language-selector__layer', $context),
        $languages = $('.language-selector__item', $context);

    function toggleLayer() {
        if ($layer.hasClass('-active')) {
            $arrow.removeClass('-active');
            $layer.removeClass('-active');
            $layer.hide();
        } else {
            $layer.show();
            setTimeout(function() {
                $arrow.addClass('-active');
                $layer.addClass('-active');
            },100)
        }
    }

    $current.click(function() {
        toggleLayer();
    });

    $languages.click(function(e) {
        console.log($(e.target).data('language'));
        $currentLang.html($(e.target).data('language'));
        toggleLayer();
    });


}

$(function(){
    console.log('Localizer');
    $('.language-selector').localizr();
});