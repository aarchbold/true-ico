function handleLocalizaion(langObj) {
    var currentLang;
    $('.language-selector__current span').text(langObj.short);
    if (langObj.full.toLowerCase() === 'english') {
        currentLang = english;
    } else if (langObj.full.toLowerCase() === 'korean') {
        currentLang = korean;
    } else if (langObj.full.toLowerCase() === 'russian') {
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
    var emailSwapper = $('#successEmail').text();
    var replacedEmail = emailSwapper.replace('<email>',localStorage.getItem('trueEmail'));
    $('#successEmail').text(replacedEmail);
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
        var currentLang = {
            full: $(e.target).html(),
            short: $(e.target).data('language')
        }
        localStorage.setItem('trueLanguage',JSON.stringify(currentLang));
        handleLocalizaion(currentLang);
        toggleLayer();
    });
}

$(function(){
    console.log('Localizer');
    if (localStorage.getItem('trueLanguage')) {
        handleLocalizaion(JSON.parse(localStorage.getItem('trueLanguage')));
    }
    $('.language-selector').localizr();
});