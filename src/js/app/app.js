$.fn.customSelectBox = function() {

}

$(function(){
    console.log('Hello World!');
    console.log($);
    $("#signup-currency").minimalect({
        placeholder: null,
        class_container: 'minict_wrapper signup-select -full'
    });
    $("#signup-currency-range").minimalect({
        placeholder: null,
        class_container: 'minict_wrapper signup-select -full'
    });
});