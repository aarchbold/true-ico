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