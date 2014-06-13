(function () {
    version = '2.1.1';
    visible_timer = 0;
    object_arr = [];
    developer = false;
    path = "";
    // Get parent DIV of script element
    function getScriptParents() {
        console.log("in get script" + JSON.stringify(this._tracker));
        var src = "tracker_v2.js";
        var parent = null;
        var scripts;
        scripts = document.getElementsByTagName('script');
        var script_ind = 0;

        for (i = 0; i < scripts.length; i++) {
            if (scripts[i].src.indexOf(src) > -1) {

                var queryString = scripts[i].src.replace(/^[^\?]+\??/, '');

                if (queryString.indexOf('creativeId') != -1 && queryString.indexOf('campaignId') != -1 && queryString.indexOf('accountId') != -1 && queryString.indexOf('custom_vars') != -1) {
                    object = {
                        creativeId:getQuerystring(queryString, 'creativeId'),
                        campaignId:getQuerystring(queryString, 'campaignId'),
                        accountId:getQuerystring(queryString, 'accountId'),
                        custom_vars:getQuerystring(queryString, 'custom_vars')
                    }

                    if (this._tracker) {
                        this._tracker.push(object);
                    } else {
                        this._tracker = [];
                        this._tracker.push(object);
                    }

                }

                if (this._tracker[script_ind] && this._tracker[script_ind].mode == "developer") {
                    developer = true;
                    if (this._tracker[script_ind].path) {
                        path = this._tracker[script_ind].path;
                    }
                }
                random = Math.floor((Math.random() * 1000000000000));
                obj = {};
                scripts[i].parentNode.id = (this._tracker[script_ind] && this._tracker[script_ind].creativeId) ? this._tracker[script_ind].creativeId : getQuerystring(queryString, 'creativeId');
                obj.campaignId = (this._tracker[script_ind] && this._tracker[script_ind].campaignId) ? this._tracker[script_ind].campaignId : getQuerystring(queryString, 'campaignId');
                obj.accountId = (this._tracker[script_ind] && this._tracker[script_ind].accountId) ? this._tracker[script_ind].accountId : getQuerystring(queryString, 'accountId');
                obj.custom_vars = (this._tracker[script_ind] && this._tracker[script_ind].custom_vars) ? this._tracker[script_ind].custom_vars : getQuerystring(queryString, 'custom_vars');
                script_ind++;
                obj.tagId = scripts[i].parentNode.id + "_" + random;
                obj.creativeId = scripts[i].parentNode.id;
                obj.visible_time = 0;
                obj.mouseovers = 0;
                obj.clicks = 0;
                obj.r = random;
                if (top === self) {
                    obj.isIframe = 0;
                } else {
                    obj.isIframe = 1;
                }
                object_arr.push(obj);
                scripts[i].parentNode.id = scripts[i].parentNode.id + "_" + random;
            }
        }
    }

    function getQuerystring(qs, variable) {
        var query = qs;
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
    }

    function elementIsParentOf(el_id, target) {
        // walk up dom tree and check if given element is our parent
        while (target) {
            if (el_id == target.id)
                return false; //don't consider placeholder be a target
            var parent = target.parentNode;
            if (parent && (el_id == parent.id))
                return true; //found element, whos parent is a placeholder
            target = parent;
        }
        return false;
    }

    function getDivs() {

        for (var j = 0; j < object_arr.length; j++) {
            // Get the element by it's unique ID
            var element = document.getElementById(object_arr[j].tagId);
            if (!element)
                continue;
            // Increment mouseover counter on each mouseover
            element.onmouseover = function (e) {
                var evt = e || window.event;
                var target = evt.target || evt.srcElement;
                for (var i = 0; i < object_arr.length; i++) {
                    if (elementIsParentOf(object_arr[i].tagId, target)) {
                        object_arr[i].mouseovers += 1;
                        break; //to avoid multiple match
                    }
                }
            };
            element.onclick = function (e) {
                var evt = e || window.event;
                var target = evt.target || evt.srcElement;
                for (var i = 0; i < object_arr.length; i++) {
                    if (elementIsParentOf(object_arr[i].tagId, target)) {
                        object_arr[i].clicks += 1;
                        break; //to avoid multiple match
                    }
                }
            };
        }
    }

    function getOffset(el) {

        var _x = 0;
        var _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop;
            el = el.offsetParent;
        }
        return { top:_y, left:_x };
    }

    // Get browser window height
    function getWindowHeight() {
        var w = window.top, d = w.document;
        var myHeight = 0;
        if (typeof( w.innerWidth ) == 'number') {
            //Non-IE
            myHeight = w.innerHeight;
        } else if (d.documentElement && ( d.documentElement.clientWidth || d.documentElement.clientHeight )) {
            //IE 6+ in 'standards compliant mode'
            myHeight = d.documentElement.clientHeight;
        } else if (d.body && ( d.body.clientWidth || d.body.clientHeight )) {
            //IE 4 compatible
            myHeight = d.body.clientHeight;
        }
        return myHeight;
    }

    // Get browser window width
    function getWindowWidth() {
        var w = window.top, d = w.document;
        var myWidth = 0;
        if (typeof( w.innerWidth ) == 'number') {
            //Non-IE
            myWidth = w.innerWidth;
        } else if (d.documentElement && ( d.documentElement.clientWidth || d.documentElement.clientHeight )) {
            //IE 6+ in 'standards compliant mode'
            myWidth = d.documentElement.clientWidth;
        } else if (d.body && ( d.body.clientWidth || d.body.clientHeight )) {
            //IE 4 compatible
            myWidth = d.body.clientWidth;
        }
        return myWidth;
    }

    function getWinSize() {
        var w = window.top, d = w.document;
        if (w.innerWidth != undefined) {
            return [w.innerWidth, w.innerHeight];
        }
        else {
            var B = d.body, D = d.documentElement;
            return [Math.max(D.clientWidth, B.clientWidth),
                Math.max(D.clientHeight, B.clientHeight)];
        }
    }

    function isVisibleOnLoad() {
        // Loop through each instance on the page
        for (var j = 0; j < object_arr.length; j++) {
            if (isObjectVisible(object_arr[j])) {
                object_arr[j].visible_onload = 1;
            } else {
                object_arr[j].visible_onload = 0;
            }
        }
    }

    function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top >= window.pageYOffset &&
                left >= window.pageXOffset &&
                (top + height) <= (window.pageYOffset + window.innerHeight) &&
                (left + width) <= (window.pageXOffset + window.innerWidth)
            );
    }

    /* detect tab/window visibility*/
    var isActive = true;
    var hidden = "hidden";

    function setWindowVisibility() {
        var w = window.top, d = w.document;
        // Standards:
        if (hidden in d)
            d.addEventListener("visibilitychange", onvischange);
        else if ((hidden = "mozHidden") in d)
            d.addEventListener("mozvisibilitychange", onvischange);
        else if ((hidden = "webkitHidden") in d)
            d.addEventListener("webkitvisibilitychange", onvischange);
        else if ((hidden = "msHidden") in d)
            d.addEventListener("msvisibilitychange", onvischange);
        else if ('onfocusin' in d) {
            // IE 9 and lower:
            bind(d, "focusin", onvischange);
            bind(d, "focusout", onvischange);
        } else {
            // All others:
            bind(w, "pageshow", onvischange);
            bind(w, "pagehide", onvischange);
            bind(w, "focus", onvischange);
            bind(w, "blur", onvischange);
        }
    }

    function onvischange(evt) {
        var v = true, h = false, evtMap = { focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h };

        evt = evt || window.event;
        if (evt.type in evtMap) {
            isActive = evtMap[evt.type];
        } else {
            isActive = !this[hidden];
        }
    }

    /* *** */

    function findElementWithGeo(node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var el = node.childNodes[i];
            var width = parseInt(el.clientWidth);
            var height = parseInt(el.clientHeight);
            if (width && height) {
                return el;
            }
            el = findElementWithGeo(el);
            if (el)
                return el;
        }
        return false;
    }

    function isObjectVisible(obj) {
        // Get the element by it's unique ID
        var target = document.getElementById(obj.tagId);
        if (!target)
            return false;//should never happen in good env

        // find child element which has width
        target = findElementWithGeo(target);
        if (!target)
            return false;

        // Find the dimensions of that unit
        var width = parseInt(target.clientWidth);
        var height = parseInt(target.clientHeight);
        var offsetLeft = getOffset(target).left;
        var offsetTop = getOffset(target).top;

        // Get browser properties such as window height and width and scroll level.
        /*var viewport = getWinSize();
         var bHeight = viewport[1];
         var bWidth = viewport[0];*/
        var bHeight = getWindowHeight();
        var bWidth = getWindowWidth();

        // Check if the elements is within an iframe and use appropriate variables in each case.
        if (top === self && !window.frameElement) {
            var w = window, d = document;
            var yscroll = w.pageYOffset || (d.body && d.body.scrollTop) || (d.documentElement && d.documentElement.scrollTop);
            var xscroll = w.pageXOffset || (d.body && d.body.scrollLeft) || (d.documentElement && d.documentElement.scrollLeft);
        } else {
            var w = window.top, d = w.document;
            var yscroll = w.pageYOffset || (d.body && d.body.scrollTop) || (d.documentElement && d.documentElement.scrollTop);
            var xscroll = w.pageXOffset || (d.body && d.body.scrollLeft) || (d.documentElement && d.documentElement.scrollLeft);

            offsetLeft += getOffset(window.frameElement).left;
            offsetTop += getOffset(window.frameElement).top;
        }

        if (isActive == true && (((offsetTop + (height / 2)) < (bHeight + yscroll)) && ((offsetTop + (height / 2)) > yscroll)) && ( (offsetLeft + (width / 2)) < (bWidth + xscroll) )) {
            return true;
        }
        return false;
    }

    function isVisible() {
        // Loop through each instance on the page
        for (var q = 0; q < object_arr.length; q++) {
            if (isObjectVisible(object_arr[q])) {
                object_arr[q].visible_time += 0.25;
            }
        }
    }

    function getElements() {

        for (z = 0; z < object_arr.length; z++) {

            target = document.getElementById(object_arr[z].tagId);

            // Add the width and height of each instance to the object array
            object_arr[z].width = parseInt(target.clientWidth);
            object_arr[z].height = parseInt(target.clientHeight);

            // Add the left and top offset to the element array
            object_arr[z].offsetLeft = getOffset(target).left;
            object_arr[z].offsetTop = getOffset(target).top;

        }
        ;
    }

    function getLocation() {

        for (i = 0; i < object_arr.length; i++) {

            if (object_arr[i].isIframe == 1) {
                object_arr[i].url = document.referrer || parent.location.href || top.location.href;
            } else {
                object_arr[i].url = window.location.href;
            }

        }
        ;
    }

    function get_browser_os() {
        var BrowserDetect = {
            init:function () {
                this.browser = this.searchString(this.dataBrowser) || "";
                this.version = this.searchVersion(navigator.userAgent)
                    || this.searchVersion(navigator.appVersion)
                    || "";
                this.OS = this.searchString(this.dataOS) || "Other";
            },
            searchString:function (data) {
                for (var i = 0; i < data.length; i++) {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                    }
                    else if (dataProp)
                        return data[i].identity;
                }
            },
            searchVersion:function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            },
            dataBrowser:[
                {
                    string:navigator.userAgent,
                    subString:"Chrome",
                    identity:"Chrome"
                },
                {
                    string:navigator.userAgent,
                    subString:"OmniWeb",
                    versionSearch:"OmniWeb/",
                    identity:"OmniWeb"
                },
                {
                    string:navigator.vendor,
                    subString:"Apple",
                    identity:"Safari",
                    versionSearch:"Version"
                },
                {
                    prop:window.opera,
                    identity:"Opera",
                    versionSearch:"Version"
                },
                {
                    string:navigator.vendor,
                    subString:"iCab",
                    identity:"iCab"
                },
                {
                    string:navigator.vendor,
                    subString:"KDE",
                    identity:"Konqueror"
                },
                {
                    string:navigator.userAgent,
                    subString:"Firefox",
                    identity:"Firefox"
                },
                {
                    string:navigator.vendor,
                    subString:"Camino",
                    identity:"Camino"
                },
                {       // for newer Netscapes (6+)
                    string:navigator.userAgent,
                    subString:"Netscape",
                    identity:"Netscape"
                },
                {
                    string:navigator.userAgent,
                    subString:"MSIE",
                    identity:"Explorer",
                    versionSearch:"MSIE"
                },
                {
                    string:navigator.userAgent,
                    subString:"Gecko",
                    identity:"Mozilla",
                    versionSearch:"rv"
                },
                {       // for older Netscapes (4-)
                    string:navigator.userAgent,
                    subString:"Mozilla",
                    identity:"Netscape",
                    versionSearch:"Mozilla"
                }
            ],
            dataOS:[
                {
                    string:navigator.platform,
                    subString:"Win",
                    identity:"Windows"
                },
                {
                    string:navigator.platform,
                    subString:"Mac",
                    identity:"Mac"
                },
                {
                    string:navigator.userAgent,
                    subString:"iPhone",
                    identity:"iPhone/iPod"
                },
                {
                    string:navigator.platform,
                    subString:"iPad",
                    identity:"iPad"
                },
                {
                    string:navigator.userAgent,
                    subString:"Android",
                    identity:"Android"
                },
                {
                    string:navigator.platform,
                    subString:"Android",
                    identity:"Android"
                },
                {
                    string:navigator.platform,
                    subString:"BlackBerry",
                    identity:"BlackBerry"
                },
                {
                    string:navigator.platform,
                    subString:"Linux",
                    identity:"Linux"
                }
            ]

        };
        BrowserDetect.init();
        os = BrowserDetect.OS;
        browser = BrowserDetect.browser;
        browser_version = BrowserDetect.version;
    }

    var browser;
    var browser_version;
    var os;
    var keywords = '';

    function document_keywords() {
        var dd = [document, parent.document, top.document];
        var metas = false;
        for (var i = 0; i < dd.length; i++) {
            metas = dd[i].getElementsByTagName('meta');
            if (metas && metas.length)
                break;
        }
        if (metas) {
            for (var x = 0, y = metas.length; x < y; x++) {
                if (metas[x].name.toLowerCase() == "keywords") {
                    keywords += metas[x].content;
                }
            }
        }
        keywords = keywords.substr(0, 1000);
    }

    function createPingCall() {
        console.log("user ping call");
        var pingCall = {
            acc:[], id:[], cid:[],
            r:[],
            iframe:[], url:[],
            visible_onload:[], vis:[],
            mo:[], clks:[], custom:[]
        };
        for (var i = 0; i < object_arr.length; i++) {
            pingCall.acc.push(object_arr[i].accountId);
            pingCall.cid.push(object_arr[i].campaignId);
            pingCall.id.push(object_arr[i].creativeId);

            pingCall.r.push(object_arr[i].r);

            pingCall.iframe.push(object_arr[i].isIframe);
            pingCall.visible_onload.push(object_arr[i].visible_onload);

            pingCall.vis.push(object_arr[i].visible_time);
            pingCall.mo.push(object_arr[i].mouseovers);
            pingCall.clks.push(object_arr[i].clicks);
            if (object_arr[i].custom_vars) {
                pingCall.custom.push(object_arr[i].custom_vars);
            }
        }
        pingCall.url.push(escape(object_arr[0].url));

        var test = "?r=" + pingCall.r.toString() +
            "&acc=" + pingCall.acc.toString() +
            "&id=" + pingCall.id.toString() +
            "&cid=" + pingCall.cid.toString() +
            "&vis=" + pingCall.vis.toString() +
            "&mo=" + pingCall.mo.toString() +
            "&clks=" + pingCall.clks.toString() +
            "&iframe=" + pingCall.iframe.toString() +
            "&url=" + pingCall.url.toString() +
            "&vis_ol=" + pingCall.visible_onload.toString() +
            "&os=" + os +
            "&b=" + browser +
            "&bv=" + browser_version +
            "&kw=" + keywords +
            "&res=" + screen.width + "x" + screen.height;
        if (pingCall.custom.length) {

            test += "&custom_vars=" + JSON.stringify(pingCall.custom).toString();
        }
        return test;
    }

    function getPingUrl() {
        if (developer == false) {
            return ('https:' == window.document.location.protocol ? 'https://secure' : 'http://ping.onscroll.com') + '/p.gif';
        }
        if (developer == true) {
            return ('https:' == window.document.location.protocol ? 'https://secure' : path) + '/p.gif';
        }
    }

    function ajaxCall(url) {
        try {
            var xmlhttp = new XMLHttpRequest();
            if (xmlhttp.withCredentials !== undefined) {
                xmlhttp.open('GET', url, false);
                xmlhttp.send();
                return true;
            }
            return false;
        } catch (e) {
            return true;
        }
    }

    function endCall(e) {
        clearInterval(visible_timer);//stop counting visibility
        unbind(window, "beforeunload", endCall);//detach unload handlers
        unbind(window, "unload", endCall);

        var done = false;
        var tracking_url = "http://ms.onscroll.com:3000/p.gif" + createPingCall();
        console.log("url->>>>>>>>>>>" + tracking_url);
//var userPingCall= createPingCall();
//        var tracking_url = "http://t.onscroll.com" +userPingCall;
        if (browser == 'Firefox') {
            // for FF first try with blocking(!) ajax call, otherwise GET might be cancelled
            done = ajaxCall(tracking_url);
        }
        if (!done) {
            var req_img = new Image();
            console.log("Tracking Url in done false " + tracking_url);
            req_img.src = tracking_url;
        }
    }

    function set_before_unload() {
        if (os == 'iPhone/iPod' || os == 'iPad' || os == 'Android') {
            window.onunload = endCall;
            if ((browser_version <= 4 && os == 'iPhone/iPod') || (browser_version <= 5 && os == 'iPad')) {
                //	if("onpagehide" in window){
                //		window.addEventListener("pagehide", endCall, false);
                //	} else {
                window.onunload = setTimeout(endCall, 1000);
                //	}
            }
        } else {
            bind(window, "beforeunload", endCall);
            bind(window, "unload", endCall);
        }
    }

    function bind(element, type, callback) {
        if (element.addEventListener) {
            element.addEventListener(type, callback, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, callback);
        } else {
            element[type] = callback;
        }
    }

    function unbind(element, type, callback) {
        if (element.removeEventListener) {
            element.removeEventListener(type, callback, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, callback);
        } else {
            element[type] = callback;
        }
    }

    // All of the functions to call on the page load
    function onLoad() {
        console.log(">>>>>>>>>>tracker js loaded phase 1");
        getScriptParents();
        setWindowVisibility();
        isVisibleOnLoad();
        getDivs();
        getLocation();
        get_browser_os();
        document_keywords();
        visible_timer = setInterval(isVisible, 250);
        set_before_unload();
        console.log(">>>>>>>>>>tracker js end");
    }

    // Trigger on page load
    window.onload = onLoad;//bind(window, "load", onLoad);

}());
