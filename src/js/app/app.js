$.fn.handleSignUp = function() {
    var $context = $(this);
    var $entryPanel = $('.home-signup__form-entry',$context),
        $successPanel = $('.home-signup__form-success',$context),
        $firstName = $('#formFirstName',$context),
        $lastName = $('#formLastName',$context),
        $email = $('#formEmail',$context),
        $currency = $('#formEmail',$context),
        // this may be tricky as it's getting automatically created
        $amount = $('#formEmail',$context),
        $submit = $('#formSubmit',$context);

    var usdOptions = [
        {
            value: '0-100',
            label: '$0 - $100',
        },
        {
            value: '100-1000',
            label: '$100 - $1,000',
        },
        {
            value: '1000-5000',
            label: '$1000 - $5,000',
        }
    ]
    

    console.log($context);

    $submit.click(function(e) {
        e.preventDefault();
        console.log('hello')
    })
}

$.fn.handleCurrency = function(currencyOption) {
    var $context = $(this),
        $currencySelector = $('#signupCurrency',$context),
        $currencyRangeContainer = $('#rangeContainer',$context);
    var usdOptions = [
        {
            value: '0-100',
            label: '$0 - $100',
        },
        {
            value: '100-1000',
            label: '$100 - $1,000',
        },
        {
            value: '1000-5000',
            label: '$1000 - $5,000',
        }
    ];
    var euroOptions = [
        {
            value: '0-100',
            label: '€0 - €100',
        },
        {
            value: '100-1000',
            label: '€100 - €1,000',
        },
        {
            value: '1000-5000',
            label: '€1000 - €5,000',
        }
    ];
    var yenOptions = [
        {
            value: '0-100',
            label: '¥0 - ¥100',
        },
        {
            value: '100-1000',
            label: '¥100 - ¥1,000',
        },
        {
            value: '1000-5000',
            label: '¥1000 - ¥5,000',
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
    // $("#signupCurrencyRange").minimalect({
    //     placeholder: null,
    //     class_container: 'minict_wrapper signup-select -full'
    // });

    $('.home-signup').handleSignUp();
    $('.home-signup__form').handleCurrency('USD');
});