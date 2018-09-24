// this is for all pages that should show in clickpaths.
// note: tracking is now done inline, with the call to w3trackme() (at the end)
// USAGE: <script src="w3trackV7.js"></script>
//---------------------------------------------------------------
// BEGIN SETTINGS

// Try to keep settings here.
var W3T = {
    cookie_expiration_days: 60,
    tracking_folder: '/krtrk/', // http(s)://secure.w3track.com/newtrk/
    page_load_tracked: false,
	add_link_args: "_uuid=[MOCLID_ENC]",

    a: 1
};
// END SETTINGS
//---------------------------------------------------------------


//+ cookie a xm1 on the url
//+ or a coupon_code.
//+ setting one undoes the other...
var xm1 = Get_Parm("xm1");
var coupon_code = Get_Parm("coupon_code");

if( !((xm1 == null) || (xm1 == "")) ) {
    // alert('xm1=' + xm1);
    SimpleCookie('xm1',xm1,60*24*W3T['cookie_expiration_days'],"/"); // simple cookie uses minutes
    SimpleCookie('coupon_code','',60*24*W3T['cookie_expiration_days'],"/"); // clear a coupon_code when adding a xm1
    coupon_code = "";
} else if(! ((coupon_code == null) || (coupon_code == "")) ) {
    // alert('xm1=' + xm1);
    SimpleCookie('coupon_code',coupon_code,60*24*7,"/"); // simple cookie uses minutes
    SimpleCookie('xm1','',60*24*W3T['cookie_expiration_days'],"/");	// clear a xm1 when adding a coupon_code
} else {
    // no new coupon/xm1
}

//- cookie a xm1 on the url


function addLinkArgs(elem) {
  if(!W3T['add_link_args']) return true;
  if($(elem).prop('link_args_added')) return true;
  
  $(elem).attr('href', function () {
    $(elem).prop('link_args_added',true);
    var href = this.href;
    var add = W3T['add_link_args'].replace("[MOCLID_ENC]",escape(GetCookie('ME_CLICKID')));
    if(href.indexOf("?") >= 0) {
      href = href + "&" + add;
    } else {
      href = href + "?" + add;
    }
    return href;
  });
  return true;
}  

/**
 * function actionTrack
 * 1 arg: an action_id.
 * fire an mnme pixel to action_track for current user.
 **/
function actionTrack(action_id) {
    var pxurl;
    var iframe;
    try {
        pxurl = W3T['tracking_folder'] + "a.php?aid=" + escape(action_id) + "&wu=" + escape(document.location);
        iframe = document.createElement('iframe');
        iframe.style.display = "none";
        if(Get_Parm('pppx') == "Y") {
            iframe.style.display = "block";
        }
        iframe.src = pxurl;
        document.body.appendChild(iframe);
    } catch(e) {
        /* alert('error in actionTrack: ' + e); //  some problem doing this... */
    }
}


/* use new function when Get_Parm is called */
function Get_Parm(name) {
    return(getParamV6(name));
}

/**
 * function getParamV6
 * arg: name - the key.
 * read a name's unexcaped value off:
 *   url.search + "&" + MORE_ARGS
 * return "" if not found.
 **/
function getParamV6(name) {
    SCH = document.location.search;
    if(W3T['MORE_ARGS'] != "") {
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


/* function SetCookieV5 has domain as a possible arg. */
function SetCookieV5 (name, value) {
    var argv = SetCookieV5.arguments;
    var argc = SetCookieV5.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    var delay = null;
    document.cookie = name + "=" + escape (value) +
        ((expires == null) ? "" : ("; expires=" + expires)) +
        ((path == null) ? "" : ("; path=" + path)) +
        ( ((delay == null) || (delay == "")) ? "" : ("; delay=" + delay)) +
        ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
}
function SetCookie (name, value) {
    var argv = SetCookie.arguments;
    var argc = SetCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : null;
    var delay = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape (value) +
        ((expires == null) ? "" : ("; expires=" + expires)) +
        ((path == null) ? "" : ("; path=" + path)) +
        ((delay == null) ? "" : ("; delay=" + delay)) +
        ((secure == true) ? "; secure" : "");
}
function SimpleCookie (cookieName, cookieValue, expires_in_minutes,path) {
    var expDate = new Date();
    expDate.setTime( expDate.getTime() + (expires_in_minutes * 60 * 1000) );
    SetCookie(cookieName,cookieValue,expDate.toGMTString(),path);
}

function GetCookie(Name) {
    var search = Name + "=";
    var returnvalue = "";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) { /* if the cookie exists */
            offset += search.length;
            end = document.cookie.indexOf(";", offset); /* set the index of beginning value */
            if (end == -1) /* set the index of the end of cookie value */
                end = document.cookie.length;
            returnvalue=unescape(document.cookie.substring(offset, end));
        }
    }
    return returnvalue;
}
function DeleteCookie (name) {
    var exp = new Date();
    exp.setTime (exp.getTime() - 1);
    var cval = GetCookie (name);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

function varIsDefined(variable) {
    return (typeof(window[variable]) == "undefined") ?  false: true;
}

/* bestReferer - use _orf property on the url if ext */
function bestReferer() {
    var oref = getParamV6('_orf');
    if( (oref != "") && (oref != null) ) {
        return(oref);
    } else {
        return(document.referrer);
    }
}

function topLevelCookie(name,value,expires_in_days) {
    var expDate = new Date();
    expDate.setTime( expDate.getTime() + (expires_in_days * 24 * 3600 * 1000) );
    SetCookieV5(name,value,expDate.toGMTString(),"/","beenigmacream.com");
}

function addClickPathDatum(key,value) {
    var pxurl;
    var iframe;
    try {
        pxurl = W3T['tracking_folder'] + "click_v10.php?step=2&wu=" + escape("CPD-SET?" + escape(key) + "=" + escape(value)) + "&" + escape(key) + "=" + escape(value) + "&rf="+ escape(window.location);
        iframe = document.createElement('iframe');
        iframe.style.display = "none";
        if(Get_Parm('pppx') == "Y") {
            iframe.style.display = "block";
        }
        iframe.src = pxurl;
        document.body.appendChild(iframe);
    } catch(e) {
        /* some problem doing this... */
    }
}

function mdalert(txt) {
    var debugme = false;
    if(window['MD_DEBUG'] == true) {
        debugme=true;
    }
    if(Get_Parm("debug") == "w3track") {
        debugme = true;
    } else if(Get_Parm("debugmp") == "Y") {
        debugme = true;
    }
    if(debugme) {
        if(typeof(window.console.log) == "function") {
            try { console.log('mdalert:' + txt); } catch(e) { }
        } else {
            alert("mdalert: " + txt);
        }
    }
}

function _bestCP() {
    var value;
    value = getParamV6('mecpv5');
    if(value != "") return value;

    value = getParamV6('mcp');
    if(value != "") return value;

    value = getParamV6('cp');
    if(value != "") return value;
    return "";
}

function MAP_pixel(siteAcct) {
    return w3trackme();
}
function w3trackme() {
    if(W3T['page_load_tracked']) return false;
    <!--MNME Code V7-->
    // var subid = Get_Parm("sub");
    var abver = GetCookie('abver');
    var mycp = _bestCP();
    var lastcp = GetCookie("_local_cp");
    var scriptUrl= W3T['tracking_folder'] + 'click_v10mm_js.php?e=e' +
            '&cp=' + escape(mycp) +
            '&rf='+escape(document.referrer) + '&wu=' + escape(document.location)
        ;
    if( abver != "" ) {
        if(GetCookie("_nuab") == "1") {
            // alert('_nuab on abver ' + abver);
            scriptUrl += '&abver=' + escape(abver);
        } else {
            scriptUrl += '&cver=' + escape(abver);
        }
    }
    if(varIsDefined('_visitIsNew') && varIsDefined('_visitCount')) {
        if(_visitIsNew && (_visitCount > 1)) {
            scriptUrl += "&rvst=" + (_visitCount - 1);
        }
    }
    // document.write(scriptUrl);
    if(Get_Parm("debug") == "w3track") {
        alert("w3Track: " + scriptUrl);
    }
    if(Get_Parm("debug") == "w3px") {
        alert(scriptUrl);
    }
    document.write('<scr' + 'ipt type="text/javascript" src="' + scriptUrl + '"></scr' + 'ipt>');

    topLevelCookie("_nuab","0",1);
    if(mycp != "") {
        topLevelCookie("_local_cp",mycp,W3T['cookie_expiration_days']);
    }
    W3T['page_load_tracked'] = true;
    <!--END MNME Code V7-->
}

function trackLead(data) {
    var url = W3T['tracking_folder'] + "conversion_iframe_js.php?isLead=Y&type=LEAD&single=Y&amount=0.00";
    data['wu'] = window.top.location.href;
    data['rf'] = bestReferer();
    for(var key in data) {
        url += "&" + escape(key) + "=" + escape(data[key]);
    }
    console.log('adding iframe with url ' + url);
    var iframe;
    try {
        iframe = document.createElement('iframe');
        iframe.style.display = "none";
        if(getParamV6('pppx') == "Y") {
            iframe.style.display = "block";
        }
        iframe.id = "LEAD_TRACK_IFRAME";
        iframe.src = url;
        document.body.appendChild(iframe);
        console.log('appended trackLead iframe!');
    } catch(e) {
        /* some problem doing this... */
    }
}



w3trackme();


window['criteo_account_id'] = 53797;
function criteo_when_ready() {
    if (typeof window.criteo_q == "function") {
        //console.log('criteo script is loaded!');
        //console.log(window.criteo_q);
    } else if(typeof window.criteo_q == "object") {
        //console.log('criteo script is loaded!');
        //console.log(window.criteo_q);
    }
    else {
        //console.log('not criteo. ' + (typeof window.criteo_q) + ' ... try it in 100ms');
        return setTimeout(criteo_when_ready,100);
    }
    // window.criteo_q = window.criteo_q || [];
    if(!window.criteo_q) {
        //console.log('no criteo_q, but it was a function???');
        return false;
    }
    window.criteo_q.push(
        { event: "setAccount", account: window['criteo_account_id']},
        { event: "setSiteType", type: /iPad/.test(navigator.userAgent)?"t":/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent)?"m":"d"},
        { event: "viewHome"}
    );
}
function do_criteo_remarket_script() {
    try {
        (function () {
            var _onload = function () {
                if (document.readyState && !/loaded|complete/.test(document.readyState)) {
                    setTimeout(_onload, 10);
                    return
                }
                if (!window.__remarket_loaded) {
                    __remarket_loaded = true;
                    setTimeout(_onload, 50);
                    return
                }
                var scr = document.createElement("script");
                scr.setAttribute('async', 'true');
                scr.type = "text/javascript";
                scr.src = "//static.criteo.net/js/ld/ld.js";
                ((document.getElementsByTagName('head') || [null])[0] ||
                document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
                criteo_when_ready();
            };
            if (window.addEventListener) {
                window.addEventListener('load', _onload, false);
            }
            else {
                window.attachEvent('onload', _onload)
            }
        }());
    } catch(e) {
        try {
            console.log('Error doing criteo remarket:' + e);
        } catch(e2) { // let it go
        }
    }
}




function do_facebook_sitetraffic() {
    try {
        document.write('<!-- Facebook Pixel Code --><scr' + 'ipt type="application/javascript">!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,\'script\',\'https://connect.facebook.net/en_US/fbevents.js\');fbq(\'init\', \'329860477751881\');fbq(\'track\', "PageView");</scri' + 'pt><!-- End Facebook Pixel Code -->');
    } catch(e) {
        try {
            console.log('Error doing facebook sitetraffic:' + e);
        } catch(e2) { /* let it go */

        }
    }
}
	
function do_ttd_sitetraffic() {
    try {
        document.write('<!-- TTD pageview Code --><scr' + 'ipt src="https://js.adsrvr.org/up_loader.1.1.0.js" type="text/javascript"></scr' + 'ipt><scr' + 'ipt type="text/javascript">(function(global) {if (typeof TTDUniversalPixelApi === "function") { var universalPixelApi = new TTDUniversalPixelApi(); universalPixelApi.init("pp8sgh0", ["lr8prjq"], "https://insight.adsrvr.org/track/up"); }})(this); /*console.log("TTD - inside script");*/</scr' + 'ipt><!-- End  TTD pageview Code -->');
		/* console.log("TTD After the doc write"); */
    } catch(e) {
        try {
            console.log('Error doing TTD sitetraffic:' + e);
        } catch(e2) { /* let it go */

        }
    }
}

function do_linkedin_traffic() {
    try {
document.write('<!-- LinkedIn Pixel --><scr' + 'ipt type="text/javascript">_linkedin_partner_id = "468244";window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];window._linkedin_data_partner_ids.push(_linkedin_partner_id);</scr' + 'ipt><scr' + 'ipt type="text/javascript">(function(){var s = document.getElementsByTagName("script")[0];var b = document.createElement("script");b.type = "text/javascript";b.async = true;b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b, s);})();</scr' + 'ipt><!-- End Linkedin Pixel -->');
 } catch(e) {
        try {
            console.log('Error doing LinkedIn sitetraffic:' + e);
        } catch(e2) { /* let it go */

        }
    }
}

function do_adroll_traffic() {
    try {
document.write('<!-- adroll Pixel --><scr' + 'ipt type="text/javascript">adroll_adv_id = "N4UMKQPLA5FNHOC53MPXJN";adroll_pix_id = "FFMR2OPGWJDJZBPGEOOEFN";(function () {var _onload = function(){if (document.readyState && !/loaded|complete/.test(document.readyState)){setTimeout(_onload, 10);return} if (!window.__adroll_loaded){__adroll_loaded=true;setTimeout(_onload, 50);return}            var scr = document.createElement("script"); var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com");            scr.setAttribute(\'async\', \'true\');  scr.type = "text/javascript"; scr.src = host + "/j/roundtrip.js"; ((document.getElementsByTagName(\'head\') || [null])[0] || document.getElementsByTagName(\'script\')[0].parentNode).appendChild(scr); }; if (window.addEventListener) {window.addEventListener(\'load\', _onload, false);} else {window.attachEvent(\'onload\', _onload)} }());</scr' + 'ipt><!-- End adroll Pixel -->');
 } catch(e) {
        try {
            console.log('Error doing adroll pixel:' + e);
        } catch(e2) { /* let it go */

        }
    }
}


do_criteo_remarket_script();
do_facebook_sitetraffic();
do_ttd_sitetraffic();
do_linkedin_traffic();
do_adroll_traffic();