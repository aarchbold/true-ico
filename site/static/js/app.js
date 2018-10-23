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

$.fn.handleAnimatedText = function() {
    var $context = $(this),
        $textBlocks = $('.text-animation', $context),
        position = $(window).scrollTop();

    $textBlocks.each(function(i,e) {
        $(e).addClass('animate');
        $(window).on('scroll', function() {
            if (isAnyPartOfElementInViewport($(e)[0])) {
                $(e).removeClass('animate');
            } else {
                $(e).addClass('animate');
            }
        });
    });


    // console.log('animate the text');
    // $(window).on('scroll', function() {
    //     var scroll = $(window).scrollTop(),
    //         isScrolling,
    //         delay = 0;
    //     if (scroll > position) {
    //         $textBlocks.each(function(i,e) {
    //             delay = delay + 100;
    //             setTimeout(function() {
    //                 $(e).addClass('animate');
    //             },delay)
    //         })
    //     }
    //     window.clearTimeout(isScrolling);
    //     isScrolling = setTimeout(function() {
    //         $textBlocks.each(function(i,e) {
    //             $(e).removeClass('animate');
    //         })
    //     }, 1000);
    //     position = scroll;
    // });
}

$(function(){
    // $(window).on('DOMContentLoaded load resize scroll', function() {
    //     if (isAnyPartOfElementInViewport($('.features')[0])) {
    //         animateFeaturesSection(true);
    //     }
    // });

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
            // animateGraphBullets(false);
            $('.roadmap-graphs__svg--holder').removeClass('animate');
        }
    });

    // detect scroll down
    // home-title
    $('.text-animation-group').handleAnimatedText();
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
            value: '< 90',
            label: '< €90',
        },
        {
            value: '90-900',
            label: '€90 - €900',
        },
        {
            value: '900-9000',
            label: '€900 - €9,000',
        },
        {
            value: '9000-45000',
            label: '€9,000 - €45,000',
        },
        {
            value: '45000+',
            label: '€45,000 +',
        }
    ];
    var yenOptions = [
        {
            value: '< 10000',
            label: '< ¥10,000',
        },
        {
            value: '10000-100000',
            label: '¥10,000 - ¥100,000',
        },
        {
            value: '100000-1000000',
            label: '¥100,000 - ¥1,000,000',
        },
        {
            value: '1000000-5000000',
            label: '¥1,000,000 - ¥5,000,000',
        },
        {
            value: '5000000+',
            label: '¥5,000,000 +',
        }
    ];
    var wonOptions = [
        {
            value: '< 110000',
            label: '< ₩110,000',
        },
        {
            value: '110000-1100000',
            label: '₩110,000 - ₩1,100,000',
        },
        {
            value: '1100000-11000000',
            label: '₩1,100,000 - ₩11,000,000',
        },
        {
            value: '11000000-55000000',
            label: '₩11,000,000 - ₩55,000,000',
        },
        {
            value: '55000000+',
            label: '₩55,000,000 +',
        }
    ];
    var rubOptions = [
        {
            value: '< 6000',
            label: '< ₽6,000',
        },
        {
            value: '6000-60000',
            label: '₽6,000 - ₽¥60,000',
        },
        {
            value: '60000-600000',
            label: '₽60,000 - ₽600,000',
        },
        {
            value: '600000-3000000',
            label: '₽600,000 - ₽3,000,000',
        },
        {
            value: '3000000+',
            label: '₽3,000,000 +',
        }
    ];
    var yuanOptions = [
        {
            value: '< 700',
            label: '< ¥700',
        },
        {
            value: '700-7000',
            label: '¥700 - ¥7,000',
        },
        {
            value: '7000-70000',
            label: '¥7,000 - ¥70,000',
        },
        {
            value: '70000-350000',
            label: '¥70,000 - ¥350,000',
        },
        {
            value: '350000+',
            label: '¥350,000 +',
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
    distributionheader: "代币分配",
    distributionbullet1: "35％公开销售（ICO）",
    distributionbullet2: "20%储备库",
    distributionbullet3: "5%团队",
    distributionbullet4: "15%网络增长",
    distributionbullet5: "10%空投/商务拓展",
    distributionbullet6: "5%咨询顾问，顾问，合作伙伴",
	body2: "听起来怎样？您对支持True有兴趣吗？",
    feature1header: "用社交媒体连接世界的承诺是很棒的主意，但是它失败了",
    feature1body: "在不惜一切代价追求成长的过程中，你已经成为了产品。唯一的保持增长势头的方式就是将您的个人数据货币化",
    feature2header: "True有经过区块链保障的实实在在的数据协议。",
    feature2body: "在区块链技术的帮助下，我们的用户拥有并且能够控制他们的个人数据访问权限。我们正在打造一个去中心化的系统，该系统将隐私与信任融入我们的核心产品中。",
    feature3header: "TRU代币",
    feature3body: "我们正在创造一种新的社交媒体经济，而不仅仅是为了投机创造一种新的加密货币。 True的用户规模正以 2百万的速度在增长，它将成为全球最大的开展端对端的去中心化的隐私解决方案的活跃社交网络。",
    feature4header: "我们的用户想要TRU！",
    feature4body1: "True已经筹集了1000万美元的风险资本，它是一家拥有实实在在产品的公司。当前硅谷最优秀的投资者正在该系统上与用户合作。我们用一个实实在在的解决方案来改变游戏，而不是标题党或者是最劣等的个人数据挖矿。",
    feature4body2: "在预售之后，我们会将TRU提供给我们的全部用户，所以需求和代币升值速度可能会很高。",
    truevalueheader: "TRU的价值很容易理解 - 我们正提供给您以很大折扣购买为下一个Facebook助力的货币。",
    truevaluebody1: "加密投资者还能忍诈骗多久？",
    truevaluebody2: "TRU代币销售提供给您的是一个获得高级代币的机会。我们提供给您的是基于普通投资者可以理解的成熟商业模式的真正价值。 TRU可以像美元，人民币，韩元，日元或欧元一样，专门用在True上购买广告，订阅，优质商品和服务。拥有TRU代币就像拥有Facebook的早期股票一样。",
    letsdothis: "我们能做到。您有兴趣吗？",
    signupprompt: "我有兴趣。"
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
    distributionheader: "TOKEN DISTRIBUTION",
    distributionbullet1: "35% PUBLIC SALE (ICO)",
    distributionbullet2: "20% RESERVE POOL",
    distributionbullet3: "15% TEAM",
    distributionbullet4: "15% NETWORK GROWTH",
    distributionbullet5: "10% AIR DROPS/BIZ DEV",
    distributionbullet6: "5% ADVISORS, CONSULTANTS, PARTNERS",    
    body2: "Does this sound right to you? Are you interested in supporting True?",
    feature1header: "The promise of social media to connect the whole world was a wonderful idea... but it has failed.",
    feature1body: "In pursuit of growth at all costs, you have become the product. The only way to maintain this growth is through monetizing your personal data.",
    feature2header: "True has an honest data agreement guaranteed by blockchain.",
    feature2body: "Our users own and control access to their personal data powered by blockchain technology. We’re building a decentralized system that bakes privacy and trust into our core products.",
    feature3header: "TRU Tokens",
    // updated
    feature3body: "Instead of creating a new cryptocurrency solely for speculation, we're creating a new social media economy. Leveraging 2M growing users at scale, True will become the largest active social network in the world to implement an end-to-end decentralized privacy solution.",
    feature4header: "Our users want TRU!",
    // updated
    feature4body1: "True has already raised $10M in venture capital and is a real company with a real product, with the best investors in Silicon Valley working today with users on the system. We’re changing the game with an honest solution instead of click-bait soundbite trash and the worst kinds of personal data mining.",
    // updated
    feature4body2: "After this pre-sale, we’re offering TRU to our entire user base, demand and token velocity are likely to be high.",
    // updated
    truevalueheader: "The value of TRU is simple to understand - we're offering a chance to own the currency that powers the next Facebook at a massive discount.",
    truevaluebody1: "How much longer will crypto investors tolerate being ripped off in scams?",
    // updated
    truevaluebody2: "The TRU Token Sale is a premium token offering. We’re offering real value based on a proven business model the average investor can understand. TRU can be used exclusively to buy advertising, subcriptions and premium goods and services on True the same way as $Dollars, ¥Yuan, ₩Won, ¥Yen or €Euros. It's kind of like owning early shares in Facebook.",
    letsdothis: "We Can Do This. Are You Interested?",
    signupprompt: "I'm Interested"
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
    distributionheader: "東京ディストリビューション",
    distributionbullet1: "35％ パブリックセール（ICO",
    distributionbullet2: "20％ リザーブプール",
    distributionbullet3: "15％ チーム",
    distributionbullet4: "15％ ネットワークの成長",
    distributionbullet5: "10％ AIR DROPS / BIZ DEV",
    distributionbullet6: " 5％ 顧問、コンサルタント、パートナー",
    body2: "これは正しいと思いますか？ 正しい事にサポートするのは面白いですか？",
    feature1header: "全世界をつなぐソーシャルメディアの約束はすばらしいアイデアでしたが、失敗しました。",
    feature1body: " あらゆるコストで成長を追求するには、あなたは製品になっています。この成長を維持する唯一の方法は、個人データを収益化することです。",
    feature2header: "Trueはブロックチェーンによって保証された正直なデータ契約を持っています。",
    feature2body: "当社のユーザーは、ブロックチェーン技術を搭載した個人データを所有し、アクセスを制御します。私たちは、私たちの中核製品にプライバシーと信頼をもたらす分散システムを構築しています。",
    feature3header: "Truトークン",
    feature3body: "推測のためだけに新しい暗号化を作成するのではなく、新しいソーシャルメディア経済を作り出しています。成長する2Mユーザーを活用して、Trueはエンドツーエンドの分散型プライバシーソリューションを実装する世界最大のアクティブソーシャルネットワークになります。",
    feature4header: "私たちのユーザーはTRUが欲しい！",
    feature4body1: "トゥルーはすでに1億ドルのベンチャーキャピタルを調達しており、シリコンバレーで最も優れた投資家がシステム上のユーザーと今日働いている現実の製品を持つ現実の会社です。私たちは、クリックベイトサウンドビートゴミと最悪の種類の個人データマイニングの代わりに正直な解決策でゲームを変えようとしています。",
    feature4body2: "この販売の後、ユーザーベース全体にTRUを提供しています。需要と供給の速度は高いと思われます。",
    truevalueheader: "TRUの価値はわかりやすいです。私たちは次のFacebookに大きな割引をもたらす通貨を所有するチャンスを提供しています。",
    truevaluebody1: "暗号投資家は詐欺にどれくらいの時間をかけて逃れることができますか？",
    truevaluebody2: "TRUトークンセールはプレミアムトークンです。私たちは、平均的な投資家が理解できる実績のあるビジネスモデルに基づいて真の価値を提供しています。 TRUは、ドル、円、円、円、ユーロ、ユーロと同様に、広告、購読、プレミアム商品およびサービスをTrueで購入するためにのみ使用することができます。 Facebookの初期株式を所有するようなものだ。",
    letsdothis: "これはすることができます。興味がありますか？",
    signupprompt: "興味があります。"
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
    distributionheader: "토큰 배포",
    distributionbullet1: "35% 공개 판매 (ICO)",
    distributionbullet2: "20% 보관",
    distributionbullet3: "15% 팀",
    distributionbullet4: "15% 네트워크 성장",
    distributionbullet5: "10% 에어드롭/사업 개발",
    distributionbullet6: "5% 고문, 컨설턴트, 파트너",
    body2: "맞는 것 같은가요? True 지원에 관심이 있나요?",
    feature1header: "전 세계를 하나로 연결하겠다는 소셜 미디어의 약속은 정말 훌륭한 아이디어 였으나…실패했습니다.",
    feature1body: "어떤 대가를 치르더라도 성장을 추구함에 따라 사람이 상품이 되어버렸습니다. 이러한 성장을 유지하는 유일한 방법은 개인정보를 돈으로 만드는 것 입니다.",
    feature2header: "True는 블록체인이 보증을 해주는 정직한 데이터 계약을 갖고 있습니다.",
    feature2body: "당사의 사용자들은 블록체인 기술을 활용하여 자신의 개인 자료를 소유하고 접근을 제어 합니다. 우리는 당사의 핵심 제품으로 프라이버시와 신뢰를 보장해주는 분산화 시스템을 구축하고 있습니다.",
    feature3header: "TRU 토큰",
    feature3body: "투기를 위해 새로운 암호화폐를 만드는 대신에, 우리는 새로운 소셜 미디어 경제를 만들고 있습니다. 2M 규모의 대규모로 성장하는 사용자를 활용하여, True는 엔드 투 엔드 분산형 프라이버시 보호 솔루션을 구현하는 세계에서 가장 크게 활동하는 소셜 네트워크가 될 것입니다.",
    feature4header: "당사의 사용자들은 TRU를 원하고 있습니다!",
    feature4body1: "True는 이미 벤처 캐피털에서 10만 달러를 모금했으며 실제 제품을 가진 실제로 존재하는 회사이며, 실리콘 밸리내의 최고의 투자자들이 시스템상의 사용자들과 같이 일하고 있습니다. 사람들을 현혹시키는 말과 최악의 개인 정보 마이닝 대신 정직한 솔루션을 바탕으로 세상을 바꾸고 있습니다.",
    feature4body2: "프리세일이후, 모든 사용자를 기반으로 TRU를 제공하고있으며 수요 및 속도가 높아질 것 입니다.",
    truevalueheader: "TRU의 가치는 이해하기 매우 쉽습니다 – 엄청나게 할인된 가격으로 페이스북에 힘을 실어주는 통화를 소유할 수 있는 기회를 제공합니다.",
    truevaluebody1: "암호화폐 투자자들이 스캠을 얼마나 더 견딜 수 있을까요?",
    truevaluebody2: "TRU 토큰세일은 프리미엄 토큰 제안입니다. 일반 투자자가 이해할 수 있는 검증된 비즈니스 모델을 가지고 있는 실제 자산을 기반으로 진정한 가치를 제공합니다. TRU는 광고 구매, 구독, 프리미엄 상품과 서비스를 미국달러, 중국위완화, 한국원화, 일본엔화 또는 유로로 구매하는 것과 동일한 방식과 같이 True로 구매할 수 있습니다. 이것은 페이스북 초창기때의 주식을 갖고 있는 것과 같습니다.",
    letsdothis: "우리는 할 수 있습니다. 관심이 있으신가요?",
    signupprompt: "관심이 있습니다"
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
        e.preventDefault();
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
    distributionheader: "РАСПРЕДЕЛЕНИЕ ТОКЕНОВ",
    distributionbullet1: "35% ПУБЛИЧНАЯ ПРОДАЖА (ICO)",
    distributionbullet2: "20% РЕЗЕРВ",
    distributionbullet3: "15% СОТРУДНИКИ",
    distributionbullet4: "15% РОСТ СЕТИ",
    distributionbullet5: "10% РАЗВИТИЕ БИЗНЕСА",
    distributionbullet6: "5% ПАРТНЕРЫ, КОНСУЛЬТАНТЫ",
    feature1header: "Социальные сети обещали связать между собой весь мир, но что-то пошло не так...",
    feature1body: "Ради прибыли они превратили в продукт самого пользователя. Единственное на чем они зарабатывают - на ваших личных данных.",
    feature2header: "True защищает ваши данные при помощи блокчейна.",
    feature2body: "В основе нашей децентрализованной системы лежат блокчейн технологии. Благодаря им пользователи полностью контролируют доступ к своим личным данным.",
    feature3header: "Токены TRU",
    feature3body: "Вместо выпуска очередной криптовалюты мы создаем новую экономику социальных сетей. Уже сегодня True насчитывает два миллиона пользователей, это будет крупнейшая в истории социальная сеть на основе децентрализованной системы защиты персональных данных.",
    feature4header: "Пользователи хотят TRU",
    feature4body1: "Мы уже привлекли $10 млн венчурных инвестиций, это реальная компания и реальный продукт с реальными пользователями. За нами стоят ведущие инвесторы Силиконовой Долины.",
    feature4body2: "После окончания предварительной продажи, TRU будет открыт для продажи всем нашим пользователям. Спрос обещает быть высоким.",
    truevalueheader: "Ценность TRU очевидна: мы предлагаем уникальную возможность приобрести валюту, на основе которой создается новый Facebook, с огромной скидкой.",
    truevaluebody1: "Сколько можно попадаться на удочку крипто-мошенников?",
    truevaluebody2: "Продажа токенов TRU - уникальное событие. Их ценность обеспечена работающей бизнес-моделью, которую легко понять простому инвестору. Токены можно использовать исключительно для размещения рекламы, приобретения подписок и других платных услуг, предоставляемых нашей социальной сетью. Покупку TRU можно сравнить с приобретением акций Facebook на заре его истории.",
    letsdothis: "Мы сможем это сделать. Присоединяйтесь!",
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