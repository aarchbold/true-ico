function handleLocalizaion(language) {
    var currentLang;
    $('.language-selector__item').each(function(i,e){
        $(e).removeClass('-active');
    });
    $('[data-language='+language+']').addClass('-active');
    $('.language-selector__current span').text(language);
    
    if (language === 'EN') {
        currentLang = english;
    } else if (language === 'KO') {
        currentLang = korean;
    } else if (language === 'RU') {
        currentLang = russian;
    }
    for (key in currentLang) {
        if (key === 'formfirstname' ||
            key === 'formlastname' ||
            key === 'formemail') {
                $('[data-text='+key+']').attr('placeholder', currentLang[key]);
        } else {
            $('[data-text='+key+']').text(currentLang[key]);
        }
    }
}

$.fn.localizr = function() {
    var $context = $(this),
        $current = $('.language-selector__current', $context),
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
        var currentLang = $(e.target).data('language');
        localStorage.setItem('trueLanguage',currentLang);
        handleLocalizaion(currentLang);
        toggleLayer();
    });
}

$(function(){
    console.log('Localizer');
    if (localStorage.getItem('trueLanguage')) {
        handleLocalizaion(localStorage.getItem('trueLanguage'));
    }
    $('.language-selector').localizr();
});