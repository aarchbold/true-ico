$.fn.handleSignUp = function() {
    var $context = $(this);
    var $entryPanel = $('.home-signup__form-entry',$context),
        $successPanel = $('.home-signup__form-success',$context),
        $firstName = $('#formFirstName',$context),
        $lastName = $('#formLastName',$context),
        $email = $('#formEmail',$context),
        $submit = $('#formSubmit',$context),
        $error = $('.home-signup__error',$context),
        $throbber = $('.home-signup__throbber',$context),
        $emailHolder = $('.home-signup__success-email');
    
    if (localStorage.getItem('trueSignUpEmail')) {
        $emailHolder.html(localStorage.getItem('trueSignUpEmail'));
        $successPanel.fadeIn();
    } else {
        $entryPanel.fadeIn();
    }

    $firstName.keyup(function(){
        $error.hide();
    })
    $lastName.keyup(function(){
        $error.hide();
    })
    $email.keyup(function(){
        $error.hide();
    })

    function submitForm() {
        postData = {
            firstName: $firstName.val(),
            lastName: $lastName.val(),
            email: $email.val(),
            currency: $('#signupCurrency',$context).val(),
            range: $('#signupCurrencyRange',$context).val()
        }
        console.log('form post data:');
        console.log(postData);
        
    };

    function validateForm() {
        if ($firstName.val() === '' ||
            $lastName.val() === '' ||
            $email.val() === '') {
            $error.show(); 
        } else {
            $throbber.css('height',$entryPanel.outerHeight() + 'px');
            $throbber.show();
            submitForm();
            window.setTimeout(function() {
                $entryPanel.hide();
                $successPanel.show();
                $emailHolder.html($email.val());
                localStorage.setItem('trueSignUpEmail',$email.val());
            },2000);
        }
    };
    

    console.log($context);

    $submit.click(function(e) {
        e.preventDefault();
        validateForm();
    })
}

$.fn.handleCurrency = function(currencyOption) {
    var $context = $(this),
        $currencySelector = $('#signupCurrency',$context),
        $currencyRangeContainer = $('#rangeContainer',$context);
    var usdOptions = [
        {
            value: '< 100',
            label: '< $100',
        },
        {
            value: '100-1000',
            label: '$100 - $1,000',
        },
        {
            value: '1000-10000',
            label: '$1,000 - $10,000',
        },
        {
            value: '10000-50000',
            label: '$10,000 - $50,000',
        },
        {
            value: '50000+',
            label: '$50,000 +',
        }
    ];
    var euroOptions = [
        {
            value: '< 100',
            label: '< €100',
        },
        {
            value: '100-1000',
            label: '€100 - €1,000',
        },
        {
            value: '1000-10000',
            label: '€1,000 - €10,000',
        },
        {
            value: '10000-50000',
            label: '€10,000 - €50,000',
        },
        {
            value: '50000+',
            label: '€50,000 +',
        }
    ];
    var yenOptions = [
        {
            value: '< 100',
            label: '< ¥100',
        },
        {
            value: '100-1000',
            label: '¥100 - ¥1,000',
        },
        {
            value: '1000-10000',
            label: '¥1,000 - ¥10,000',
        },
        {
            value: '10000-50000',
            label: '¥10,000 - ¥50,000',
        },
        {
            value: '50000+',
            label: '¥50,000 +',
        }
    ];

    function updateCurrencyOptions(currency) {
        var looper = [];
        if (currency === 'USD') {
            looper = usdOptions;
        } else if (currency === 'EURO') {
            looper = euroOptions;
        } else if (currency === 'YEN') {
            looper = yenOptions;
        }
        // remove select
        $('#signupCurrencyRange',$context).remove();

        var $newSelect = $('<select id="signupCurrencyRange" class="home-signup__select"></select>');
        $currencyRangeContainer.append($newSelect);
        looper.forEach(function(amount,index) {
            var option;
            if (index === 0) {
                option = '<option selected="selected" value='+ amount.value +'>'+ amount.label +'</option>';
            } else {
                option = '<option value='+ amount.value +'>'+ amount.label +'</option>';
            }
            $newSelect.append(option);
        })
        

        window.setTimeout(function() {
            $('#signupCurrencyRange',$context).minimalect({
                placeholder: '',
                class_container: 'minict_wrapper signup-select -full'
            });
        })
    }

    $currencySelector.change(function(){
        $('#signupCurrencyRange',$context).minimalect('destroy');
        updateCurrencyOptions($(this).val());
    })

    updateCurrencyOptions(currencyOption);
}

$(function(){
    console.log('Hello World!');
    console.log($);
    $("#signupCurrency").minimalect({
        placeholder: null,
        class_container: 'minict_wrapper signup-select -full'
    });

    $('.home-signup').handleSignUp();
    $('.home-signup__form').handleCurrency('USD');


    var $win = $(window);

    $('div.scrollerino').each(function(){
        var scroll_speed = 4;
        var $this = $(this);
        $(window).scroll(function() {
            var bgScroll = (($win.scrollTop() - $this.offset().top)/ scroll_speed);
            var bgPosition = '20% '+ bgScroll + 'px';
            $this.css({ backgroundPosition: bgPosition });
        });
    });
});
var english = {
    header: "Facebook can't be fixed, so we're going to replace it.",
    body1: "What the world needs now is a new generation social media platform that is fundamentally different in it’s incentives. A new kind of mobile community focused on authenticity, intimate sharing and personal data privacy.",
    body2: "Are you interested in supporting True?",
    body3: "Shortly, we’ll be launching the biggest token sale for a new social media platform in history, led by the biggest names in Silicon Valley.",
    body4: "We already have 2 million users, how would you like to share in our financial success?",
    contact: "Contact Us",
    footer: "저작권 2018 Hello Mobile Inc.",
    signupheader: "Save 25%",
    signuptext: "Sign up today to stay updated and get the same 25% discount the VCs get when the sale goes live later in 2018.",
    formfirstname: "First Name",
    formlastname: "Last Name",
    formemail: "Email Address",
    formcurrencytype: "How would you like to invest?",
    formamount: "Amount Interested in Investing",
    selectChoice: "Select a choice",
    formerror: "Please enter a first name, last name, and valid email address.",
    formbutton: "I'm Interested, Sign Me Up",
    success: "Success",
    successbody1: "Your 25% discount is now guaranteed. We’ll send an email to <email> with your discount code before the sale goes live.",
    successbody2: "Have a great day.",
    successbody3: "- The Team @ True"
}
var korean = {
    header: "페이스북의 문제점은 쉽게 고쳐질수 없습니다, 그래서 저희가 그 역활을 대신하고자 합니다.",
    body1: "지금 세계가 필요로 하는건 인센티브가 근본적으로 다른 새로운 세대의 소셜 미디어 플렛폼 입니다. 진실성, 친밀감 공유, 그리고 개인 사생활 자료를 초점으로 한 새로운 종류의 모빌 커뮤니티 (유동 공동체).",
    body2: "True (진실) 를 지지하는데 동참할 생각이 있으십니까?",
    body3: "곧 실리콘 밸리의 유명인사들이 이끄는 새로운 미디어 플렛폼을 위한 역사상 가장 큰 토큰 세일을 출시할 예정입니다.",
    body4: "저희는 벌써 이백만명의 회원이 가입되어 있습니다. 우리의 사업적 성공을 함께 나누시겠습니까?",
    contact: "고객 문의",
    footer: "저작권 2018 Hello Mobile Inc.",
    signupheader: "25% 절약하세요",
    signuptext: "오늘 가입하시고 가장 최신정보를 받으세요.  그리고 2018년 후반부 세일이 시작될때 벤처사업 자본가들이(VCs) 받는 것과 똑같은 25%의 디스카운트를 받으세요.",
    formfirstname: "이름",
    formlastname: "성",
    formemail: "이메일 주소",
    formcurrencytype: "How would you like to invest?",
    formamount: "투자하고 싶으신 금액",
    selectChoice: "Select a choice",
    formerror: "이름, 성, 그리고 유효한 이메일 주소를 입력해 주십시요.",
    formbutton: "관심 있습니다. 가입하겠습니다.",
    success: "Success",
    successbody1: "귀하께 약속드린 25%의 디스카운트를 지금 방금 보증 받으셨습니다. 세일이 시작되기전 저희가 <email> 이메일 주소로 디스카운트 코드를 보내드리겠습니다.",
    successbody2: "좋은하루 보내세요.",
    successbody3: "- TRUE 팀 드림"
}
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
var russian = {
    header: "Facebook уже не исправить - мы его заменим.",
    body1: "Миру нужна принципиально новая социальная платформа. Мобильное сообщество, основанное на подлинности, ограниченном распространении информации и приватности персональных данных.",
    body2: "Хотите поддержать True?",
    body3: "В ближайшее время будет запущена крупнейшая в истории продажа токенов новой социальной платформы, при поддержке самых влиятельных персон Силиконовой Долины.",
    body4: "Уже сегодня нашим приложением пользуется 2 миллиона человек. Хотите разделить с нами грядущий финансовый успех?",
    contact: "Контакты",
    footer: "Copyright 2018 Hello Mobile Inc.",
    signupheader: "Сэкономьте 25%",
    signuptext: "Подпишитесь сегодня, чтобы узнать о начале продаж в конце 2018 года и получить 25% скидку для будущих инвесторов.",
    formfirstname: "Имя",
    formlastname: "Фамилия",
    formemail: "Email",
    formcurrencytype: "How would you like to invest?",
    formamount: "Желаемая сумма инвестиций",
    selectChoice: "Доступные варианты",
    formerror: "Пожалуйста, введите ваше имя, фамилию и действующий email.",
    formbutton: "Подписаться!",
    success: "Поздравляем! ",
    successbody1: "Вам гарантирована скидка 25%. Скидочный код будет отправлен на вашу электронную почту перед началом продаж.",
    successbody2: "С наилучшими пожеланиями,",
    successbody3: "- Команда @True"
}