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
            animateGraphBullets(true);
            $('.roadmap-graphs__svg--holder').addClass('animate');
        } else {
            isRotating = false;
            animateGraphBullets(false);
            $('.roadmap-graphs__svg--holder').removeClass('animate');
        }
    });

});
function getParam(name) {
    SCH = document.location.search;
    if(window['W3T'] && (W3T['MORE_ARGS'] != "")) {
        SCH += "&" + W3T['MORE_ARGS'];
    }
    SCH = "?&" + SCH.substring(1,SCH.length);
    // alert('SCH = ' + SCH);
    var start = SCH.indexOf("&" + name+"=");
    var len = start+name.length+2;
    if ((!start) && (name != SCH.substring(0,name.length))) return("");
    if (start == -1) return "";
    var end = SCH.indexOf("&",len);
    if (end == -1) end = SCH.length;
    // alert('finished getting parm ' + name);
    return unescape(SCH.substring(len,end));
}


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
    /*
    if (localStorage.getItem('trueSignUpEmail')) {
        $emailHolder.html(localStorage.getItem('trueSignUpEmail'));
        $successPanel.fadeIn();
    } else {

        $entryPanel.fadeIn();
    }
    */
    $entryPanel.fadeIn();
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
        debug = false;
	if(getParam('debug_post') == "Y") { debug = true; }
        postData = {
            firstName: $firstName.val(),
            lastName: $lastName.val(),
            email: $email.val(),
            currency: $('#signupCurrency',$context).val(),
            range: $('#signupCurrencyRange',$context).val()
        }
       
        if(debug) console.log('form post data:');
        if(debug) console.log(postData);
	var urlstr = ""; 
  	for (var key in postData) { 
	   urlstr += escape(key) + "=" + escape(postData[key]) + "&";
	}
	urlstr += "debug_post=Y";
        if(debug) console.log('as URLARGS: ' + urlstr);

        var myUrl = $email.closest("form").prop("action");
        if(debug) console.log('myUrl=' + myUrl);
        window['SUBSCRIBE_SUCCESS']="";
        $.ajax({
            type: "POST",
            url: myUrl,
            data: postData,
            success: function(msg) {

                if(msg.indexOf($("#responseRegex").html()) >= 0) {
                    if(debug) console.log('GOT GOOD(' + $("#responseRegex").html() + ' from:');
                    if(debug) console.log(msg);
                    window['SUBSCRIBE_SUCCESS'] = 'Y';

                } else {
                    if(debug) console.log('GOT FAILURE from:');
                    if(debug) console.log(msg);

                    window['SUBSCRIBE_SUCCESS'] = 'N';
                }
                // console.log(msg);
                // alert("Form Submitted: " + msg);
            }
        });



    };

    function validateForm() {
        if ($firstName.val() === '' ||
            $lastName.val() === '' ||
            $email.val() === '') {
            $error.show();
            return false;
        } else {
            $throbber.css('height',$entryPanel.outerHeight() + 'px');
            $throbber.show();

            var isGood = submitForm();

            displayResultOfSubscribe();
            /*
             window.setTimeout(function() {
             $entryPanel.hide();
             $successPanel.show();
             $emailHolder.html($email.val());
             // localStorage.setItem('trueSignUpEmail',$email.val());
             },2000);
             */
            return true;
        }
    };
    

    console.log($context);

    $submit.click(function(e) {
        var debug = false;

        if(debug) console.log('submit.click occurs.');
        if(debug) console.log(e);

        e.preventDefault();

        var rv = validateForm();
        if(debug) console.log('after validateForm');
        if(rv) {
            return true;
        } else {
            return false;
        }
    })
}
function displayResultOfSubscribe() {
    var debug = false;

    try { clearTimeout(window['_ST_displayResultOfSubscribe']); } catch(e) { }
    var myAnswer = window['SUBSCRIBE_SUCCESS'];
    if(myAnswer && (myAnswer != "") ) {
        if(debug) console.log('got myAnswer: ' + myAnswer);
        if(myAnswer == "Y") {
            window.setTimeout(function() {

                $('.home-signup__form-entry').hide();
                $('.home-signup__form-success').show();
                var successHtml =  $('.home-signup__form-success').html();
                successHtml = successHtml.replace("&lt;email&gt;", "<span class='home-signup__success-email'>" + $('#formEmail').val() + "</span>");
                //console.log('new text: ' + successHtml);
                $('.home-signup__form-success').html(successHtml);
                $('.home-signup__success-email').html($('#formEmail').val());
                // localStorage.setItem('trueSignUpEmail',$email.val());
                
                if(window.handleLeadConversion) {
                  //console.log('DO handleLeadConversion');
                  
                  handleLeadConversion($('#formEmail').val());
                } else {
                  //console.log('NO FUNC handleLeadConversion');
                }
                
            },1000);
        }
        else {
            window.setTimeout(function() {
				//html($("#submissionFailureMessage").html()).
                $('.home-signup__error').html($('#submissionErrorMssg').html()).show();
                $('.home-signup__form-entry').show();

                $('.home-signup__throbber').hide();
                // $('.home-signup__form-failure').show();
            },1000);
        }
    } else {
        if(debug) console.log('no result yet. try again shortly.');

        window['_ST_displayResultOfSubscribe'] = setTimeout(displayResultOfSubscribe,100);
    }
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
    var wonOptions = [
        {
            value: '< 100',
            label: '< ₩100',
        },
        {
            value: '100-1000',
            label: '₩100 - ₩1,000',
        },
        {
            value: '1000-10000',
            label: '₩1,000 - ₩10,000',
        },
        {
            value: '10000-50000',
            label: '₩10,000 - ₩50,000',
        },
        {
            value: '50000+',
            label: '₩50,000 +',
        }
    ];
    var rubOptions = [
        {
            value: '< 100',
            label: '< ₽100',
        },
        {
            value: '100-1000',
            label: '₽100 - ₽¥1,000',
        },
        {
            value: '1000-10000',
            label: '₽1,000 - ₽10,000',
        },
        {
            value: '10000-50000',
            label: '₽10,000 - ₽50,000',
        },
        {
            value: '50000+',
            label: '₽50,000 +',
        }
    ];
    var yuanOptions = [
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
        } else if (currency === 'WON') {
            looper = wonOptions;
        } else if (currency === 'RUB') {
            looper = rubOptions;
        } else if (currency === 'YEN') {
            looper = yenOptions;    
        } else if (currency === 'YUAN') {
            looper = yuanOptions;    
        }
        // remove select
        $('#signupCurrencyRange',$context).remove();

        var $newSelect = $('<select id="signupCurrencyRange" name="MERGE5" class="home-signup__select"></select>');
        $currencyRangeContainer.append($newSelect);
        looper.forEach(function(amount,index) {
            var option;
            if (index === 0) {
                option = '<option selected="selected" value="'+ amount.value +'">'+ amount.label +'</option>';
            } else {
                option = '<option value="'+ amount.value +'">'+ amount.label +'</option>';
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

$.fn.handleMobileFooter = function() {
    var $container = $(this),
        $button = $('#footerCta', $container),
        $form = $('.home-signup'),
        $formClose = $('.home-signup__close'),
        isScrolling,
        scrollLength = 0,
        scrollBuffer = 300,
        currentScrollLength = 0;
    $(window).scroll(function() {
        if (($(window).scrollTop() > (scrollLength + scrollBuffer)) || ($(window).scrollTop() < (scrollLength - scrollBuffer))) {
            console.log('hide footer');
            $container.addClass('-hide');
        }
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            scrollLength = $(window).scrollTop();
            $container.removeClass('-hide');
        }, 200);
    });

    $button.click(function(e) {
        e.preventDefault();
        $('body').css('overflow','hidden');
        window.location.hash = 'signup';
        $form.show();
    });

    $formClose.click(function(e) {
        e.preventDefault();
        $('body').css('overflow','auto');
        window.location.hash = '';
        // $form.hide();
    });

    window.addEventListener('hashchange', function() {
        if (window.location.hash === '') {
            $form.hide();
            $('body').css('overflow','auto');
            window.location.hash = '';
        }
    }, false);
}

$(function(){
    var debug = false;
    if(debug) console.log($);
    $("#signupCurrency").minimalect({
        placeholder: null,
        class_container: 'minict_wrapper signup-select -full'
    });

    
    $('.home-signup').handleSignUp();
    $('.home-signup__form').handleCurrency('USD');
    $('.mobile-form-cta').handleMobileFooter();


    var $win = $(window);

    $('div.scrollerino').each(function(){
        var scroll_speed = 2;
        var $this = $(this);
        $(window).scroll(function() {
            var bgScroll = (($win.scrollTop() - $this.offset().top)/ scroll_speed);
            var bgPosition = '50% '+ bgScroll + 'px';
            $this.css({ backgroundPosition: bgPosition });
        });
    });
});
var chinese = {
    header: "Facebook 是改不好的, 所以我们要取代它。",
	body1: "世界现在需要的是新一代的，激励机制完全不同的社交媒体平台。 需要的是一种新型的，重视真实性，亲密共享和个人数据隐私的移动社区。",
	body3: "最近,我们将推出一个由硅谷大人物发起的新社交媒体平台史上最大的代币销售活动.",
	body4: "我们已经拥有200万用户，您想怎么分享我们的财务成功呢?",
	contact: "联系我们",
	footer: "版权所有2018 Hello Mobile 公司..",
	signupheader: "节省25%",
	signuptext: "立即注册，持续获取最新动态，并在2018年晚些时候的销售中获得25％折扣.",
	formfirstname: "名字",
	formlastname: "姓",
	formemail: "邮箱地址",
	formcurrencytype: "您想怎么投资?",
	formamount: "感兴趣的投资额",
	selectChoice: "选择一个选项",
	formerror: "请输入您的名字, 姓氏, 以及有效的邮箱地址.",
	formbutton: "我感兴趣,报名参加",
	success: "成功",
	successbody1: "现在您已确定会获得25%的折扣。我们会在销售开始前，将折扣码发送至您的<email>邮箱。",
	successbody2: "祝您愉快。",
	successbody3: "- 团队 @True",
	submissionerrormssg: "我们无法验证您的数据。 请重新核对您的信息，然后重试。",
	body2: "Does this sound right to you? Are you interested in supporting True?",
    feature1header: "The promise of social media to connect the whole world was a wonderful idea... but it has failed.",
    feature1body: "In pursuit of growth at all costs, you have become the product. The only way to maintain this growth is through monetizing your personal data.",
    feature2header: "True has an honest data agreement guaranteed by blockchain.",
    feature2body: "Our users own and control access to their personal data powered by blockchain technology. We’re building a decentralized system that bakes privacy and trust into our core products.",
    feature3header: "TRU TOKENS",
    feature3body: "Instead of creating a new cryptocurrency solely for speculation, we're offering tokens to buy lucrative, early, highly in-demand advertising on our growing social network. We accept TRU exclusively as payment for premium advertising on our network.",
    feature4header: "Our users want TRU!",
    feature4body1: "True is a real company with a real product, with the best investors in Silicon Valley working today with users on the system. We’re changing the game with an honest solution instead of click-bait soundbite trash and the worst kinds of personal data mining.",
    feature4body2: "After this pre-sale, we’re offering TRU to our entire user base, demand and token velocity are likely to be high.",
    truevalueheader: "The value of TRU is simple to understand - we're offering premium advertising at a massive discount to early investors.",
    truevaluebody1: "How much longer will crypto investors tolerate being ripped off in scams?",
    truevaluebody2: "The TRU Token Sale is a premium token offering. We’re offering real value based on a real asset with a proven business model the average investor can understand. It's kind of like owning early shares in Facebook.",
    letsdothis: "We Can Do This. Are You Interested?"
}
var english = {
    header: "Facebook can't be fixed, so we're going to replace it.",
    body1: "What the world needs now is a new generation social media platform that is fundamentally different in it’s incentives. A new kind of mobile community focused on authenticity, intimate sharing and personal data privacy.",
    body3: "Shortly, we’ll be launching the biggest token sale for a new social media platform in history, led by the biggest names in Silicon Valley.",
    body4: "We already have 2 million users, how would you like to share in our financial success?",
    contact: "Contact Us",
    footer: "Copyright 2018 Hello Mobile Inc.",
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
    successbody3: "- The Team @ True",
    submissionerrormssg: "We couldn't validate your data. Please re-check your information and try again.",
    body2: "Does this sound right to you? Are you interested in supporting True?",
    feature1header: "The promise of social media to connect the whole world was a wonderful idea... but it has failed.",
    feature1body: "In pursuit of growth at all costs, you have become the product. The only way to maintain this growth is through monetizing your personal data.",
    feature2header: "True has an honest data agreement guaranteed by blockchain.",
    feature2body: "Our users own and control access to their personal data powered by blockchain technology. We’re building a decentralized system that bakes privacy and trust into our core products.",
    feature3header: "TRU TOKENS",
    feature3body: "Instead of creating a new cryptocurrency solely for speculation, we're offering tokens to buy lucrative, early, highly in-demand advertising on our growing social network. We accept TRU exclusively as payment for premium advertising on our network.",
    feature4header: "Our users want TRU!",
    feature4body1: "True is a real company with a real product, with the best investors in Silicon Valley working today with users on the system. We’re changing the game with an honest solution instead of click-bait soundbite trash and the worst kinds of personal data mining.",
    feature4body2: "After this pre-sale, we’re offering TRU to our entire user base, demand and token velocity are likely to be high.",
    truevalueheader: "The value of TRU is simple to understand - we're offering premium advertising at a massive discount to early investors.",
    truevaluebody1: "How much longer will crypto investors tolerate being ripped off in scams?",
    truevaluebody2: "The TRU Token Sale is a premium token offering. We’re offering real value based on a real asset with a proven business model the average investor can understand. It's kind of like owning early shares in Facebook.",
    letsdothis: "We Can Do This. Are You Interested?",
    signupprompt: "I'm Insterested"
}
var japanese = {
    header: "フェイスブックは修正できないので、私たちが代替します。",
    body1: "今、世の中に必要なものは次世代のソーシャルメディアプラットフォーム。確実性、親密な共有、個人情報の安全性に特化した、新しいモバイルコミュニティ。",
    body3: "間もなく、私たちはシリコンバレーのビッグネーム達による先導で、かつてないほどに大規模なトークンセールを、新しいソーシャルメディアプラットフォームのために開催します。",
    body4: "私たちはすでに２００万人のユーザーを獲得しています。我々のファイナンシャルサクセスに参加しませんか？",
    contact: "コンタクト",
    footer: "Copyright 2018 Hello Mobile Inc.",
    signupheader: "今日、登録してください。",
    signuptext: "最新情報とセールが2018年後半に開始されるとき、VCが得るのと同じ25%の割引を得られます。",
    formfirstname: "名",
    formlastname: "姓",
    formemail: "Eメール",
    formcurrencytype: "どのように投資したいですか？",
    formamount: "投資したい額",
    selectChoice: "選択して下さい",
    formerror: "氏名、Eメールアドレスをご記入ください。",
    formbutton: "サインアップします",
    success: "サクセス",
    successbody1: "25%ディスカウントが確約されました。セールが開始される前に、ディスカウントコードがのったEメールを <email> 宛てに、お送りいたします。",
    successbody2: "",
    successbody3: "チーム@トゥルー",
    submissionerrormssg: "あなたのデータを検証できませんでした。情報を再確認後、もう一度お試しください。",
    body2: "Does this sound right to you? Are you interested in supporting True?",
    feature1header: "The promise of social media to connect the whole world was a wonderful idea... but it has failed.",
    feature1body: "In pursuit of growth at all costs, you have become the product. The only way to maintain this growth is through monetizing your personal data.",
    feature2header: "True has an honest data agreement guaranteed by blockchain.",
    feature2body: "Our users own and control access to their personal data powered by blockchain technology. We’re building a decentralized system that bakes privacy and trust into our core products.",
    feature3header: "TRU TOKENS",
    feature3body: "Instead of creating a new cryptocurrency solely for speculation, we're offering tokens to buy lucrative, early, highly in-demand advertising on our growing social network. We accept TRU exclusively as payment for premium advertising on our network.",
    feature4header: "Our users want TRU!",
    feature4body1: "True is a real company with a real product, with the best investors in Silicon Valley working today with users on the system. We’re changing the game with an honest solution instead of click-bait soundbite trash and the worst kinds of personal data mining.",
    feature4body2: "After this pre-sale, we’re offering TRU to our entire user base, demand and token velocity are likely to be high.",
    truevalueheader: "The value of TRU is simple to understand - we're offering premium advertising at a massive discount to early investors.",
    truevaluebody1: "How much longer will crypto investors tolerate being ripped off in scams?",
    truevaluebody2: "The TRU Token Sale is a premium token offering. We’re offering real value based on a real asset with a proven business model the average investor can understand. It's kind of like owning early shares in Facebook.",
    letsdothis: "We Can Do This. Are You Interested?"
}
var korean = {
    header: "페이스북의 문제점은 쉽게 고쳐질수 없습니다, 그래서 저희가 그 역활을 대신하고자 합니다.",
    body1: "지금 세계가 필요로 하는건 인센티브가 근본적으로 다른 새로운 세대의 소셜 미디어 플렛폼 입니다. 진실성, 친밀감 공유, 그리고 개인 사생활 자료를 초점으로 한 새로운 종류의 모빌 커뮤니티 (유동 공동체).",
    body3: "곧 실리콘 밸리의 유명인사들이 이끄는 새로운 미디어 플렛폼을 위한 역사상 가장 큰 토큰 세일을 출시할 예정입니다.",
    body4: "저희는 벌써 이백만명의 회원이 가입되어 있습니다. 우리의 사업적 성공을 함께 나누시겠습니까?",
    contact: "고객 문의",
    footer: "저작권 2018 Hello Mobile Inc.",
    signupheader: "25% 절약하세요",
    signuptext: "오늘 가입하시고 가장 최신정보를 받으세요.  그리고 2018년 후반부 세일이 시작될때 벤처사업 자본가들이(VCs) 받는 것과 똑같은 25%의 디스카운트를 받으세요.",
    formfirstname: "이름",
    formlastname: "성",
    formemail: "이메일 주소",
    formcurrencytype: "어떻게 투자하고 싶니?",
    formamount: "투자하고 싶으신 금액",
    selectChoice: "선택하세요",
    formerror: "이름, 성, 그리고 유효한 이메일 주소를 입력해 주십시요.",
    formbutton: "관심 있습니다. 가입하겠습니다.",
    success: "가입 성공을 축하 드립니다~!",
    successbody1: "귀하께 약속드린 25%의 디스카운트를 지금 방금 보증 받으셨습니다. 세일이 시작되기전 저희가 <email> 이메일 주소로 디스카운트 코드를 보내드리겠습니다.",
    successbody2: "좋은하루 보내세요.",
    successbody3: "- TRUE 팀 드림",
    submissionerrormssg: "귀하의 데이터를 확인할 수 없습니다. 정보를 확인하고 다시 시도하십시오.",
    body2: "Does this sound right to you? Are you interested in supporting True?",
    feature1header: "The promise of social media to connect the whole world was a wonderful idea... but it has failed.",
    feature1body: "In pursuit of growth at all costs, you have become the product. The only way to maintain this growth is through monetizing your personal data.",
    feature2header: "True has an honest data agreement guaranteed by blockchain.",
    feature2body: "Our users own and control access to their personal data powered by blockchain technology. We’re building a decentralized system that bakes privacy and trust into our core products.",
    feature3header: "TRU TOKENS",
    feature3body: "Instead of creating a new cryptocurrency solely for speculation, we're offering tokens to buy lucrative, early, highly in-demand advertising on our growing social network. We accept TRU exclusively as payment for premium advertising on our network.",
    feature4header: "Our users want TRU!",
    feature4body1: "True is a real company with a real product, with the best investors in Silicon Valley working today with users on the system. We’re changing the game with an honest solution instead of click-bait soundbite trash and the worst kinds of personal data mining.",
    feature4body2: "After this pre-sale, we’re offering TRU to our entire user base, demand and token velocity are likely to be high.",
    truevalueheader: "The value of TRU is simple to understand - we're offering premium advertising at a massive discount to early investors.",
    truevaluebody1: "How much longer will crypto investors tolerate being ripped off in scams?",
    truevaluebody2: "The TRU Token Sale is a premium token offering. We’re offering real value based on a real asset with a proven business model the average investor can understand. It's kind of like owning early shares in Facebook.",
    letsdothis: "We Can Do This. Are You Interested?"
}
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
    } else if (language === 'CH') {
        currentLang = chinese;
		flag = "china";
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
var russian = {
    header: "Facebook уже не исправить - мы его заменим.",
    body1: "Миру нужна принципиально новая социальная платформа. Мобильное сообщество, основанное на подлинности, ограниченном распространении информации и приватности персональных данных.",
    body3: "В ближайшее время будет запущена крупнейшая в истории продажа токенов новой социальной платформы, при поддержке самых влиятельных персон Силиконовой Долины.",
    body4: "Уже сегодня нашим приложением пользуется 2 миллиона человек. Хотите разделить с нами грядущий финансовый успех?",
    contact: "Контакты",
    footer: "Copyright 2018 Hello Mobile Inc.",
    signupheader: "Сэкономьте 25%",
    signuptext: "Подпишитесь сегодня, чтобы узнать о начале продаж в конце 2018 года и получить 25% скидку для будущих инвесторов.",
    formfirstname: "Имя",
    formlastname: "Фамилия",
    formemail: "Емейл",
    formcurrencytype: "Как вы хотели бы инвестировать?",
    formamount: "Желаемая сумма инвестиций",
    selectChoice: "Доступные варианты",
    formerror: "Пожалуйста, введите ваше имя, фамилию и действующий email.",
    formbutton: "Подписаться!",
    success: "Поздравляем! ",
    successbody1: "Вам гарантирована скидка 25%. Скидочный код будет отправлен на вашу электронную почту перед началом продаж.",
    successbody2: "С наилучшими пожеланиями,",
    successbody3: "- Команда @True",
    submissionerrormssg: "Пожалуйста, введите правильный адрес электронной почты.",
    body2: "Звучит заманчиво? Хотите поддержать True?",
    feature1header: "The promise of social media to connect the whole world was a wonderful idea... but it has failed.",
    feature1body: "In pursuit of growth at all costs, you have become the product. The only way to maintain this growth is through monetizing your personal data.",
    feature2header: "True has an honest data agreement guaranteed by blockchain.",
    feature2body: "Our users own and control access to their personal data powered by blockchain technology. We’re building a decentralized system that bakes privacy and trust into our core products.",
    feature3header: "TRU TOKENS",
    feature3body: "Instead of creating a new cryptocurrency solely for speculation, we're offering tokens to buy lucrative, early, highly in-demand advertising on our growing social network. We accept TRU exclusively as payment for premium advertising on our network.",
    feature4header: "Our users want TRU!",
    feature4body1: "True is a real company with a real product, with the best investors in Silicon Valley working today with users on the system. We’re changing the game with an honest solution instead of click-bait soundbite trash and the worst kinds of personal data mining.",
    feature4body2: "After this pre-sale, we’re offering TRU to our entire user base, demand and token velocity are likely to be high.",
    truevalueheader: "The value of TRU is simple to understand - we're offering premium advertising at a massive discount to early investors.",
    truevaluebody1: "How much longer will crypto investors tolerate being ripped off in scams?",
    truevaluebody2: "The TRU Token Sale is a premium token offering. We’re offering real value based on a real asset with a proven business model the average investor can understand. It's kind of like owning early shares in Facebook.",
    letsdothis: "We Can Do This. Are You Interested?",
    signupprompt: "Мне это интересно!"
}
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