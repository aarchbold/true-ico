function handleLocalizaion(language) {
    var currentLang;
	var flag;
    $('.language-selector__item').each(function(i,e){
        $(e).removeClass('-active');
    });
    $('[data-language='+language+']').addClass('-active');
    //$('.language-selector__current span').text(language);
	
	// 
    if (language === 'EN') {
        currentLang = english;
		flag = "us";
    } else if (language === 'KO') {
        currentLang = korean;
		flag = "korea";
    } else if (language === 'RU') {
        currentLang = russian;
		flag = "russia";
    } else if (language === 'JP') {
        currentLang = japanese;
		flag = "japan";
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
	$('.language-selector__current span').html('<img src="static/images/icons/'+ flag +'.png" class="flag" /> ' + language);
   
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
        localStorage.setItem('trueLanguage2',currentLang);
        handleLocalizaion(currentLang);
        toggleLayer();
    });
}

var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

$(function(){
    console.log('Localizer');
    if (localStorage.getItem('trueLanguage')) {
        localStorage.removeItem('trueLanguage');
    }
    if (getParameterByName('lang')) {
        localStorage.setItem('trueLanguage2',getParameterByName('lang').toLocaleUpperCase());
        handleLocalizaion(getParameterByName('lang').toUpperCase());
    } else if (localStorage.getItem('trueLanguage2')) {
        handleLocalizaion(localStorage.getItem('trueLanguage2'));
    }
    $('.language-selector').localizr();
});