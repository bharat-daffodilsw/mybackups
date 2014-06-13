onScrOll.version = '1.0.21';
var count = 0;
var timer_interval = false;
var timer_object_id = [];
//init function
onScrOll.main = function () // first init stage
{
    count = 0;
    timer_interval = false;
    if (this.mode === "dual" || this.mode === "sticky_dual") {
        if (this.mode === "dual") {
            this.dualSticky = false;
        }
        else {
            this.dualSticky = true;
        }

        if (!this.dualSticky) {
            this.mode = "sticky_dual";//overloading for simplicity
        }
    } else if (this.mode === "sticky") {
        if (/android|bada\/|blackberry|iemobile|ip(hone|od|ad)|mobile.+firefox|opera m(ob|in)i|phone|symbian|windows (ce|phone)/i.test(navigator.userAgent)) {
            //reset to basic mode on some mobiles/tablets
            this.mode = "basic";
        }
    }
    this.instance = document.onScrOllInstances.length - 1;
    this.wrapper = null;//wrapper div for all ad code wrappers
    this.initialPos = null;//wrappers top offset from document
    this.root = [];//code wrappers array
    this.segment = 0;//ad placement vertical segment
    this.tempScrolly=-1;
    if (!this.hasOwnProperty("iframe")) {
        this.iframe = false;
    }
    if (!this.hasOwnProperty("interval")) {
        this.interval = 1000;
    }
    if (!this.hasOwnProperty("reload")) {
        this.reload = false;
    }
    if (!this.hasOwnProperty("onPageLoad")) {
        this.onPageLoad = false;
    }
    this.style = this.style || { position: 'relative' };
    if (!this.hasOwnProperty("placeholder")) {
        /*jslint evil: true */
        document.write("<div id='" + this.instance + "_onScrOllRoot'" +
            " style='clear:both;position:relative;left:0;top:0;margin:0px auto;'>" +
            "</div>");
    } else {
        var ph = document.getElementById(this.placeholder);
        this.wrapper = document.createElement("div");
        this.wrapper.id = "" + this.instance + "_onScrOllRoot";
        this.wrapper.style.clear = "both";
        this.wrapper.style.position = "relative";
        this.wrapper.style.left = 0;
        this.wrapper.style.top = 0;
        this.wrapper.style.margin = "0px auto";
        ph.appendChild(this.wrapper);
    }
    var self = this;
    setTimeout(function () {
        self.main2(self);
    }, 0);
};
function clearAllInterval() {
    var i;
    for (i = 0; i < timer_object_id.length; i++) {
        window.clearInterval(timer_object_id[i]);
    }
    timer_object_id.length = 0;
}
;
onScrOll.main2 = function (self) //second init stage
{
    if (!self.wrapper) {
        self.wrapper = document.getElementById("" + self.instance + "_onScrOllRoot");
    }
    self.wrapper.style.width = this.width + "px";
    if (this.mode === 'basic') {
        self.wrapper.style.height = this.height + "px";
    }
    var parent = self.wrapper;
    var refreshTime = self.refreshTime;
    var mode = self.mode;
    var pageLoad = this.onPageLoad;
    self.scrollHook(parent, refreshTime, mode, pageLoad);
    var onScrOllInstance = self;
    self.bind(window, "scroll", function () {
        onScrOllInstance.scrollHook(parent, refreshTime, mode, pageLoad);
    });
    self.bind(window, "resize", function () {
        onScrOllInstance.scrollHook(parent, refreshTime, mode, pageLoad);
    });
    self.bind(window, "load", function () {
        onScrOllInstance.scrollHook(parent, refreshTime, mode, pageLoad);
    });
    self.bind(window, "focus", function () {
        if (count > 0) {
            timer_interval = false;
            onScrOllInstance.scrollHook(parent, refreshTime, mode, pageLoad);
        }
    });
    self.bind(window, "blur", function () {
        timer_interval = false;
        clearAllInterval();
    });
    self.bind(window, "focusout", function () {
        timer_interval = false;
    });

    /*	self.bind(window, "touchmove", function(){
     onScrOllInstance.scrollHook();
     });*/
};
//scroll hook, does main job
onScrOll.scrollHook = function (parent, refreshTime, mode, pageLoad) {
    this.initialPos = this.elPos(parent); //initialPos might change during redraw, so calculate it again
    var scrollY = this.getDocScroll().scrOfY;
    var viewedHeight = (scrollY + this.windowDims().myHeight) - this.initialPos;
    var docHeight = this.getDocHeight();
    var windowHeight = this.windowDims().myHeight;
    var gap = this.initialPos - windowHeight + (this.height);
    var scrollAreaHeight = docHeight - this.initialPos - this.margin;
    if (pageLoad) {
        if (scrollAreaHeight < this.height) {
            if (this.mode === "sticky" && this.root.length === 1) {//reached top ; if somehow we've managed to display the ad already, then reset it top to 0
                this.root[0].style.top = '0';
            }
            return;
        }
        if (this.mode === "sticky_reappearing" || this.mode === "sticky_dual") {
            var realSegment = Math.ceil(viewedHeight / this.interval);
            if (this.initialPos + (realSegment - 1) * this.interval + this.height + this.margin <= this.getDocHeight()) {
                this.segment = realSegment;
            }
        }
        this.genRoot();
        if (this.mode === "sticky_reappearing" || this.mode === "sticky" || this.mode === "floating" || this.mode === "sticky_dual") {
            if (this.mode === "sticky_dual") {
                this.checkSegment();
                var i;
                for (i = 0; i < this.root.length; i++) {
                    var ind = i;
                    if (ind == this.segment - 2) {
                        var absolutePos = (ind + 1) * this.interval - this.height;
                        if (scrollY >= this.initialPos + absolutePos) {
                            if (this.dualSticky) {
                                this.root[i].style.position = 'absolute';
                                this.root[i].style.top = absolutePos + 'px';
                            }

                            var inactivePos = (ind + 1) * this.interval;
                            if (scrollY >= this.initialPos + inactivePos) {
                                this.resetRoot(this.segment - 1);
                            }
                            else {
                                if (this.root[i].rel != this.segment - 1) {
                                    this.refreshFrame(this.segment - 1);
                                }
                            }
                        }
                        else {
                            if (this.root[i].rel != this.segment - 1) {
                                this.refreshFrame(this.segment - 1);
                            }
                            if (this.dualSticky) {
                                this.root[i].style.position = 'fixed';
                                this.root[i].style.top = '0';
                            }
                        }
                    }
                    else if (ind == this.segment - 1) {
                        if (scrollY + this.margin + this.height >= docHeight) {
                            if (this.dualSticky) {
                                this.root[i].style.position = 'absolute';
                                this.root[i].style.top = ( scrollAreaHeight - this.height ) + 'px';
                            }
                        }
                        else {
                            var myPos = ind * this.interval;
                            if (scrollY >= this.initialPos + myPos) {
                                if (this.dualSticky) {
                                    this.root[i].style.position = 'fixed';
                                    this.root[i].style.top = '0';
                                }
                            }
                            else {
                                this.root[i].style.position = 'absolute';
                                this.root[i].style.top = myPos + 'px';
                            }
                        }
                    }
                }
            }
            else {
                this.checkSegment();
                if (scrollY >= this.initialPos) {
                    if (scrollY + this.margin + this.height >= docHeight) {//reached bottom
                        this.root[0].style.position = this.style.position;
                        this.root[0].style.top = ( scrollAreaHeight - this.height ) + 'px';
                    }
                    else {//in-sticky-mode
                        this.root[0].style.position = "fixed";
                        this.root[0].style.top = '0';
                    }
                }
                else {//reached top
                    this.root[0].style.position = this.style.position;
                    this.root[0].style.top = '0';
                }
            }
        }
        else if (this.mode === "basic") {
            this.checkSegment();
        }
        if (mode == "sticky") {
            var htmlElement = parent.getElementsByTagName("div")[0];
            if (htmlElement) {
                this.initialPos = this.elPos(htmlElement);
                var gap = this.initialPos - windowHeight + (this.height / 2);
                if (windowHeight >= (this.height / 2)) {
                    var gap = this.initialPos - windowHeight + (this.height / 2);
                    if (scrollY >= gap) {
                        if (!timer_interval) {
                            timer_interval = setInterval(function () {
                                count++;
                                var timeLimit = refreshTime || 30;
                                console.log("count" + count);
                                if (count == timeLimit) {
                                    count = 0;
                                    changeScript(ad_code);
                                }
                            }, 1000);
                            timer_object_id.push(timer_interval);
                        }
                    }   /*if not in 50% view or scroll up*/
                    else {
                        clearAllInterval();
                        timer_interval = false;
                    }
                }  /*if window height in less than half of the height*/
                else if (timer_interval) {
                    clearAllInterval();
                    timer_interval = false;
                }
            }
        }
        if (mode == "basic") {
            if (this.windowHeight >= (this.height / 2)) {
                var htmlElement = parent.getElementsByTagName("div")[0];
                if (htmlElement) {
//                var gap = this.initialPos - windowHeight + (this.height / 2);

                    if(this.scrollY>this.tempScrolly){
                        this.tempScrolly=this.scrollY;

                        if(this.scrollY< this.midPoint && this.midPoint<=(this.scrollY+this.windowHeight)){

                            if (!timer_interval) {

                                timer_interval = setInterval(function () {
                                    count++;
                                    var timeLimit = refreshTime || 30;
                                    console.log("count" + count);
                                    if (count == timeLimit) {
                                        count = 0;
                                        changeScript(ad_code);
                                    }
                                }, 1000);
                                timer_object_id.push(timer_interval);
                            }
                        } else if(this.scrollY> this.midPoint){
                            clearAllInterval();
                            timer_interval = false;
                        }
                    }
                    else if(this.scrollY<this.tempScrolly){
                        this.tempScrolly=this.scrollY;
                        console.log("Move up side");
                        if(this.scrollY< this.midPoint && this.midPoint<=(this.scrollY+this.windowHeight)){
                            console.log("counter start");
                            if (!timer_interval) {
                                console.log("timer start");
                                timer_interval = setInterval(function () {
                                    count++;
                                    var timeLimit = refreshTime || 30;
                                    console.log("count" + count);
                                    if (count == timeLimit) {
                                        count = 0;
                                        changeScript(ad_code);
                                    }
                                }, 1000);
                                timer_object_id.push(timer_interval);
                            }
                        } else if(this.midPoint>(this.scrollY+this.windowHeight)){
                            console.log("stop counter add move up side and not visible");
                            clearAllInterval();
                            timer_interval = false;
                        }
                    }
                }
            }
            /*if window height in less than half of ad the height*/
            else if (timer_interval) {
                //alert("out");
                clearAllInterval();
                timer_interval = false;
            }
        }
    }
    else {

        if (scrollAreaHeight < this.height) {
            if (this.mode === "sticky" && this.root.length === 1) {//reached top ; if somehow we've managed to display the ad already, then reset it top to 0
                this.root[0].style.top = '0';
            }
            return;
        }
        if (this.mode === "sticky_reappearing" || this.mode === "sticky_dual") {
            var realSegment = Math.ceil(viewedHeight / this.interval);
            if (this.initialPos + (realSegment - 1) * this.interval + this.height + this.margin <= this.getDocHeight()) {
                this.segment = realSegment;
            }
        }
        this.genRoot();
        if (this.mode === "sticky_reappearing" || this.mode === "sticky" || this.mode === "floating" || this.mode === "sticky_dual") {
            if (viewedHeight > 0 && (scrollY + this.margin) < docHeight) {
                if (this.mode === "sticky_dual") {
                    this.checkSegment();

                    var i;
                    for (i = 0; i < this.root.length; i++) {
                        var ind = i;
                        if (ind == this.segment - 2) {
                            var absolutePos = (ind + 1) * this.interval - this.height;
                            if (scrollY >= this.initialPos + absolutePos) {
                                if (this.dualSticky) {
                                    this.root[i].style.position = 'absolute';
                                    this.root[i].style.top = absolutePos + 'px';
                                }

                                var inactivePos = (ind + 1) * this.interval;
                                if (scrollY >= this.initialPos + inactivePos) {
                                    this.resetRoot(this.segment - 1);
                                }
                                else {
                                    if (this.root[i].rel != this.segment - 1) {
                                        this.refreshFrame(this.segment - 1);
                                    }
                                }
                            }
                            else {
                                if (this.root[i].rel != this.segment - 1) {
                                    this.refreshFrame(this.segment - 1);
                                }
                                if (this.dualSticky) {
                                    this.root[i].style.position = 'fixed';
                                    this.root[i].style.top = '0';
                                }
                            }
                        }
                        else if (ind == this.segment - 1) {
                            if (scrollY + this.margin + this.height >= docHeight) {
                                if (this.dualSticky) {
                                    this.root[i].style.position = 'absolute';
                                    this.root[i].style.top = ( scrollAreaHeight - this.height ) + 'px';
                                }
                            }
                            else {
                                var myPos = ind * this.interval;
                                if (scrollY >= this.initialPos + myPos) {
                                    if (this.dualSticky) {
                                        this.root[i].style.position = 'fixed';
                                        this.root[i].style.top = '0';
                                    }
                                }
                                else {
                                    this.root[i].style.position = 'absolute';
                                    this.root[i].style.top = myPos + 'px';
                                }
                            }
                        }
                    }
                }
                else {
                    this.checkSegment();
                    if (scrollY >= this.initialPos) {
                        if (scrollY + this.margin + this.height >= docHeight) {//reached bottom
                            this.root[0].style.position = this.style.position;
                            this.root[0].style.top = ( scrollAreaHeight - this.height ) + 'px';
                        }
                        else {//in-sticky-mode
                            this.root[0].style.position = "fixed";
                            this.root[0].style.top = '0';
                        }
                    }
                    else {//reached top
                        this.root[0].style.position = this.style.position;
                        this.root[0].style.top = '0';
                    }
                }
            }
            else {
                this.fullResetRoot();
            }
        }
        else if (this.mode === "basic") {
            if (viewedHeight > 0 && scrollY < this.initialPos + this.height) {
                this.checkSegment();
            }
            else {
                this.fullResetRoot();
            }
        }
    }
    this.scrollY = this.getDocScroll().scrOfY;
    this.midPoint = (this.initialPos + this.height / 2);
    this.windowHeight = this.windowDims().myHeight;
    var ad_code = this.base64_decode(this.code);
    this.endPoint = (this.initialPos + this.height);
    // add MS wrapper if needed
    if (ad_code &&
        typeof this.campaignId !== 'undefined' &&
        typeof this.creativeId !== 'undefined' &&
        typeof this.accountId !== 'undefined') {
        ad_code = '<div>' + ad_code;
        ad_code += '<script type="text/javascript">';
        ad_code += '(window._tracker = (window._tracker || [])).push({';
        ad_code += 'campaignId: \'' + this.campaignId + '\',';
        ad_code += 'creativeId: \'' + this.creativeId + '\',';
        ad_code += 'accountId: \'' + this.accountId + '\'';
        ad_code += '});';
        ad_code += '</script>';
        ad_code += '<script src="http://cdn.onscroll.com/ms.os.js"></script>';
        ad_code += '</div>';
    }
    var changeScript = function (ad_code) {
        clearAllInterval();
        timer_interval = false;
        if (parent) {
            var node = parent.getElementsByTagName("div")[0];
            node.innerHTML = '';
            OSAdWriter(node, ad_code);
        }
    }
    if (mode == "sticky") {
        var htmlElement = parent.getElementsByTagName("div")[0];
        if (htmlElement) {
            this.initialPos = this.elPos(htmlElement);
            var gap = this.initialPos - windowHeight + (this.height / 2);
            if (windowHeight >= (this.height / 2)) {
                var gap = this.initialPos - windowHeight + (this.height / 2);
                if (scrollY >= gap) {
                    if (!timer_interval) {
                        timer_interval = setInterval(function () {
                            count++;
                            var timeLimit = refreshTime || 30;
                            console.log("count" + count);
                            if (count == timeLimit) {
                                count = 0;
                                changeScript(ad_code);
                            }
                        }, 1000);
                        timer_object_id.push(timer_interval);
                    }
                }   /*if not in 50% view or scroll up*/
                else {
                    clearAllInterval();
                    timer_interval = false;
                }
            }  /*if window height in less than half of the height*/
            else if (timer_interval) {
                clearAllInterval();
                timer_interval = false;
            }
        }
    }
    if (mode == "basic") {
        if (this.windowHeight >= (this.height / 2)) {
            var htmlElement = parent.getElementsByTagName("div")[0];
            if (htmlElement) {
//                var gap = this.initialPos - windowHeight + (this.height / 2);
                if(this.scrollY>this.tempScrolly){
                    this.tempScrolly=this.scrollY;
                    console.log("Move Down side ");
                    if(this.scrollY< this.midPoint && this.midPoint<=(this.scrollY+this.windowHeight)){
                        console.log("counter start");
                        if (!timer_interval) {
                            console.log("timer start");
                            timer_interval = setInterval(function () {
                                count++;
                                var timeLimit = refreshTime || 30;
                                console.log("count" + count);
                                if (count == timeLimit) {
                                    count = 0;
                                    changeScript(ad_code);
                                }
                            }, 1000);
                            timer_object_id.push(timer_interval);
                        }
                    } else if(this.scrollY> this.midPoint){
                        console.log("stop counter add move up side and not visible");

                        clearAllInterval();
                        timer_interval = false;
                    }
                }
                else if(this.scrollY<this.tempScrolly){
                    this.tempScrolly=this.scrollY;
                    console.log("Move up side");
                    if(this.scrollY< this.midPoint && this.midPoint<=(this.scrollY+this.windowHeight)){
                        console.log("counter start");
                        if (!timer_interval) {
                            console.log("timer start");
                            timer_interval = setInterval(function () {
                                count++;
                                var timeLimit = refreshTime || 30;
                                console.log("count" + count);
                                if (count == timeLimit) {
                                    count = 0;
                                    changeScript(ad_code);
                                }
                            }, 1000);
                            timer_object_id.push(timer_interval);
                        }
                    } else if(this.midPoint>(this.scrollY+this.windowHeight)){
                        console.log("stop counter add move up side and not visible");
                        clearAllInterval();
                        timer_interval = false;
                    }
                }
            }
        }
        /*if window height in less than half of ad the height*/
        else if (timer_interval) {
            //alert("out");
            clearAllInterval();
            timer_interval = false;
        }
    }
};
//resets all ad wrappers
onScrOll.fullResetRoot = function () {
    var ind;
    for (ind = 0; ind < this.root.length; ind++) {
        this.resetRoot(ind + 1);
        /*segment=this.root[ind].rel*/
    }
};
//resets an ad wrapper
onScrOll.resetRoot = function (segment) {
    var ind = segment - 1;
    this.root[ind].style.position = this.style.position;
    if (this.reload) {
        this.root[ind].innerHTML = "";
        this.root[ind].rel = -1;
    }
};
//utility function to attach an event listener
onScrOll.bind = function (element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    }
    else {
        element.attachEvent('on' + type, handler);
    }
};
//utility function for debugging
onScrOll.logData = function (data) {
    document.getElementById("onScrolllLog").innerHTML = data;
};
//utility function, returns vertical and horizontal scroll
onScrOll.getDocScroll = function () {
    var scrOfX = 0, scrOfY = 0;
    if (typeof( window.pageYOffset ) === 'number') {
        //Netscape compliant
        scrOfY = window.pageYOffset;
        scrOfX = window.pageXOffset;
    }
    else if (document.body && ( document.body.scrollLeft || document.body.scrollTop )) {
        //DOM compliant
        scrOfY = document.body.scrollTop;
        scrOfX = document.body.scrollLeft;
    }
    else if (document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop )) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop;
        scrOfX = document.documentElement.scrollLeft;
    }
    return {scrOfX: scrOfX, scrOfY: scrOfY};
};
//utility function, returns vertical offset from document of an element
onScrOll.elPos = function (node) {
    var curtop = 0;
    if (node.offsetParent) {
        do
        {
            curtop += node.offsetTop;
        }
        while ((node = node.offsetParent));
    }

    return curtop;
};

//utility function, returns window dimensions
onScrOll.windowDims = function () {
    var myWidth = 0, myHeight = 0;
    if (typeof( window.innerWidth ) === 'number') {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    }
    else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight )) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    }
    else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return {myWidth: myWidth, myHeight: myHeight};
};

//generates ad wrappers on demand
onScrOll.genRoot = function () {
    var maxRoots = (this.mode === "sticky_dual") ? this.segment : 1;

    while (this.root.length < maxRoots) {
        this.root.push(document.createElement("div"));
        var rootInd = this.root.length - 1;
        this.root[rootInd].id = this.instance + "_onScrOllAd_" + rootInd;
        this.root[rootInd].style.position = this.style.position;
        this.root[rootInd].style.clear = "both";
        this.root[rootInd].style.width = this.width + 'px';
        this.root[rootInd].style.height = this.height + 'px';
        this.root[rootInd].style.top = (rootInd * this.interval) + 'px';
        if (typeof this.marginTop !== "undefined") {
            this.root[rootInd].style.marginTop = this.marginTop + 'px';
        }

        this.wrapper.appendChild(this.root[rootInd]);
    }
};

//reloads or loads ad content in ad wrappers
onScrOll.refreshFrame = function (segment) {
    var nodeInd = ( this.mode === 'sticky_dual' ) ? ( segment - 1 ) : 0;
    var node = this.root[nodeInd];
    node.rel = segment;
    var ad_code = this.base64_decode(this.code);
    // add MS wrapper if needed
    if (ad_code &&
        typeof this.campaignId !== 'undefined' &&
        typeof this.creativeId !== 'undefined' &&
        typeof this.accountId !== 'undefined') {
        ad_code = '<div>' + ad_code;
        ad_code += '<script type="text/javascript">';
        ad_code += '(window._tracker = (window._tracker || [])).push({';
        ad_code += 'campaignId: \'' + this.campaignId + '\',';
        ad_code += 'creativeId: \'' + this.creativeId + '\',';
        ad_code += 'accountId: \'' + this.accountId + '\'';
        ad_code += '});';
        ad_code += '</script>';
        ad_code += '<script src="http://cdn.onscroll.com/ms.os.js"></script>';
        ad_code += '</div>';
    }
    if (this.iframe === false) {
        OSAdWriter(node, ad_code);
        return;
    }
};

//utility function, return document height
onScrOll.getDocHeight = function () {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
};

//ad content loading and reloading preprocessing
onScrOll.checkSegment = function () {
    var rootInd = (this.mode === "sticky_dual") ? (this.segment - 1) : 0;

    if (this.mode === "sticky" || this.mode === "floating" || this.mode === "basic" || this.segment) {
        if (this.root[rootInd].rel != this.segment) {
            this.refreshFrame(this.segment);
        }
    }
};


onScrOll.base64_decode = function (data) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        dec = "",
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do { // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');

    return dec;
};

onScrOll.stringify = function (val) {
    switch (typeof val) {
        case 'string':
            return '"' + val + '"';
        case 'number':
            return isFinite(val) ? String(val) : 'null';
        case 'boolean':
        case 'null':
            return String(val);
        case 'object': // null, array or object
            if (!val) {
                return 'null';
            }

            var tmp = [];

            if (Object.prototype.toString.apply(val) === '[object Array]') {
                for (var i = 0; i < val.length; i += 1) {
                    tmp[i] = this.stringify(val[i]) || 'null';
                }
                return tmp.length === 0 ? '[]' : '[' + tmp.join(',') + ']';
            }

            for (var k in val) {
                if (Object.prototype.hasOwnProperty.call(val, k)) {
                    var v = this.stringify(val[k]);
                    if (v) {
                        tmp.push(k + ':' + v);
                    }
                }
            }

            return tmp.length === 0 ? '{}' : '{' + tmp.join(',') + '}';
    }
};

// An html parser written in JavaScript
// Based on http://ejohn.org/blog/pure-javascript-html-parser/
/* jslint boss:true, eqnull:true */

(function () {
    if (this.OSHtmlParser) {
        return;
    }

    var supports = (function () {
        var supports = {};

        var html;
        var work = this.document.createElement('div');

        html = "<P><I></P></I>";
        work.innerHTML = html;
        supports.tagSoup = work.innerHTML !== html;

        work.innerHTML = "<P><i><P></P></i></P>";
        supports.selfClose = work.childNodes.length === 2;
        return supports;
    })();
    // Regular Expressions for parsing tags and attributes
    var startTag = /^<([\-A-Za-z0-9_]+)((?:\s+[\w\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
    var endTag = /^<\/([\-A-Za-z0-9_]+)[^>]*>/;
    var attr = /([\-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
    var fillAttr = /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i;

    var DEBUG = false;

    function htmlParser(stream, options) {
        stream = stream || '';

        // Options
        options = options || {};

        for (var key in supports) {
            if (supports.hasOwnProperty(key)) {
                if (options.autoFix) {
                    options['fix_' + key] = true;//!supports[key];
                }
                options.fix = options.fix || options['fix_' + key];
            }
        }

        var stack = [];

        var append = function (str) {
            stream += str;
        };

        var prepend = function (str) {
            stream = str + stream;
        };

        // Order of detection matters: detection of one can only
        // succeed if detection of previous didn't
        var detect = {
            comment: /^<!--/,
            endTag: /^<\//,
            atomicTag: /^<\s*(script|style|noscript|iframe|textarea)[\s>]/i,
            startTag: /^</,
            chars: /^[^<]/
        };

        // Detection has already happened when a reader is called.
        var reader = {

            comment: function () {
                var index = stream.indexOf("-->");
                if (index >= 0) {
                    return {
                        content: stream.substr(4, index),
                        length: index + 3
                    };
                }
            },

            endTag: function () {
                var match = stream.match(endTag);

                if (match) {
                    return {
                        tagName: match[1],
                        length: match[0].length
                    };
                }
            },

            atomicTag: function () {
                var start = reader.startTag();
                if (start) {
                    var rest = stream.slice(start.length);
                    // for optimization, we check first just for the end tag
                    if (rest.match(new RegExp("<\/\\s*" + start.tagName + "\\s*>", "i"))) {
                        // capturing the content is inefficient, so we do it inside the if
                        var match = rest.match(new RegExp("([\\s\\S]*?)<\/\\s*" + start.tagName + "\\s*>", "i"));
                        if (match) {
                            // good to go
                            return {
                                tagName: start.tagName,
                                attrs: start.attrs,
                                content: match[1],
                                length: match[0].length + start.length
                            };
                        }
                    }
                }
            },

            startTag: function () {
                var match = stream.match(startTag);

                if (match) {
                    var attrs = {};

                    match[2].replace(attr, function (match, name) {
                        var value = arguments[2] || arguments[3] || arguments[4] ||
                            fillAttr.test(name) && name || null;

                        attrs[name] = value;
                    });

                    return {
                        tagName: match[1],
                        attrs: attrs,
                        unary: !!match[3],
                        length: match[0].length
                    };
                }
            },

            chars: function () {
                var index = stream.indexOf("<");
                return {
                    length: index >= 0 ? index : stream.length
                };
            }
        };

        var readToken = function () {

            // Enumerate detects in order
            for (var type in detect) {

                if (detect[type].test(stream)) {
                    if (DEBUG) {
                        console.log('suspected ' + type);
                    }

                    var token = reader[type]();
                    if (token) {
                        if (DEBUG) {
                            console.log('parsed ' + type, token);
                        }
                        // Type
                        token.type = token.type || type;
                        // Entire text
                        token.text = stream.substr(0, token.length);
                        // Update the stream
                        stream = stream.slice(token.length);

                        return token;
                    }
                    return null;
                }
            }
        };

        var readTokens = function (handlers) {
            var tok;
            while (tok = readToken()) {
                // continue until we get an explicit "false" return
                if (handlers[tok.type] && handlers[tok.type](tok) === false) {
                    return;
                }
            }
        };

        var clear = function () {
            var rest = stream;
            stream = '';
            return rest;
        };

        var rest = function () {
            return stream;
        };

        if (options.fix) {
            (function () {
                // Empty Elements - HTML 4.01
                var EMPTY = /^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i;

                // Elements that you can| intentionally| leave open
                // (and which close themselves)
                var CLOSESELF = /^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR)$/i;


                var stack = [];
                stack.last = function () {
                    return this[this.length - 1];
                };
                stack.lastTagNameEq = function (tagName) {
                    var last = this.last();
                    return last && last.tagName &&
                        last.tagName.toUpperCase() === tagName.toUpperCase();
                };

                stack.containsTagName = function (tagName) {
                    for (var i = 0, tok; tok = this[i]; i++) {
                        if (tok.tagName === tagName) {
                            return true;
                        }
                    }
                    return false;
                };

                var correct = function (tok) {
                    if (tok && tok.type === 'startTag') {
                        // unary
                        tok.unary = EMPTY.test(tok.tagName) || tok.unary;
                    }
                    return tok;
                };

                var readTokenImpl = readToken;

                var peekToken = function () {
                    var tmp = stream;
                    var tok = correct(readTokenImpl());
                    stream = tmp;
                    return tok;
                };

                var closeLast = function () {
                    var tok = stack.pop();

                    // prepend close tag to stream.
                    prepend('</' + tok.tagName + '>');
                };

                var handlers = {
                    startTag: function (tok) {
                        var tagName = tok.tagName;
                        // Fix tbody
                        if (tagName.toUpperCase() === 'TR' && stack.lastTagNameEq('TABLE')) {
                            prepend('<TBODY>');
                            prepareNextToken();
                        } else if (options.fix_selfClose &&
                            CLOSESELF.test(tagName) &&
                            stack.containsTagName(tagName)) {
                            if (stack.lastTagNameEq(tagName)) {
                                closeLast();
                            } else {
                                prepend('</' + tok.tagName + '>');
                                prepareNextToken();
                            }
                        } else if (!tok.unary) {
                            stack.push(tok);
                        }
                    },

                    endTag: function (tok) {
                        var last = stack.last();
                        if (last) {
                            if (options.fix_tagSoup && !stack.lastTagNameEq(tok.tagName)) {
                                // cleanup tag soup
                                closeLast();
                            } else {
                                stack.pop();
                            }
                        } else if (options.fix_tagSoup) {
                            // cleanup tag soup part 2: skip this token
                            skipToken();
                        }
                    }
                };

                var skipToken = function () {
                    // shift the next token
                    readTokenImpl();

                    prepareNextToken();
                };

                var prepareNextToken = function () {
                    var tok = peekToken();
                    if (tok && handlers[tok.type]) {
                        handlers[tok.type](tok);
                    }
                };

                // redefine readToken
                readToken = function () {
                    prepareNextToken();
                    return correct(readTokenImpl());
                };
            })();
        }

        return {
            append: append,
            readToken: readToken,
            readTokens: readTokens,
            clear: clear,
            rest: rest,
            stack: stack
        };

    }

    htmlParser.supports = supports;

    htmlParser.tokenToString = function (tok) {
        var handler = {
            comment: function (tok) {
                return '<--' + tok.content + '-->';
            },
            endTag: function (tok) {
                return '</' + tok.tagName + '>';
            },
            atomicTag: function (tok) {
                console.log(tok);
                return handler.startTag(tok) +
                    tok.content +
                    handler.endTag(tok);
            },
            startTag: function (tok) {
                var str = '<' + tok.tagName;
                for (var key in tok.attrs) {
                    var val = tok.attrs[key];
                    // escape quotes
                    str += ' ' + key + '="' + (val ? val.replace(/(^|[^\\])"/g, '$1\\\"') : '') + '"';
                }
                return str + (tok.unary ? '/>' : '>');
            },
            chars: function (tok) {
                return tok.text;
            }
        };
        return handler[tok.type](tok);
    };

    htmlParser.escapeAttributes = function (attrs) {
        var escapedAttrs = {};
        // escape double-quotes for writing html as a string

        for (var name in attrs) {
            var value = attrs[name];
            escapedAttrs[name] = value && value.replace(/(^|[^\\])"/g, '$1\\\"');
        }
        return escapedAttrs;
    };

    for (var key in supports) {
        htmlParser.browserHasFlaw = htmlParser.browserHasFlaw || (!supports[key]) && key;
    }

    this.OSHtmlParser = htmlParser;
})();

//     postscribe.js 1.1.2
//     (c) Copyright 2012 to the present, Krux
//     postscribe is freely distributable under the MIT license.
//     For all details and documentation:
//     http://krux.github.com/postscribe


(function () {

    var global = this;

    if (global.OSAdWriter) {
        return;
    }

    // Debug write tasks.
    var DEBUG = true;

    // Turn on to debug how each chunk affected the DOM.
    var DEBUG_CHUNK = false;

    // # Helper Functions

    var slice = Array.prototype.slice;

    // A function that intentionally does nothing.
    function doNothing() {
    }


    // Is this a function?
    function isFunction(x) {
        return "function" === typeof x;
    }

    // Loop over each item in an array-like value.
    function each(arr, fn, _this) {
        var i, len = (arr && arr.length) || 0;
        for (i = 0; i < len; i++) {
            fn.call(_this, arr[i], i);
        }
    }

    // Loop over each key/value pair in a hash.
    function eachKey(obj, fn, _this) {
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                fn.call(_this, key, obj[key]);
            }
        }
    }

    // Set properties on an object.
    function set(obj, props) {
        eachKey(props, function (key, value) {
            obj[key] = value;
        });
        return obj;
    }

    // Set default options where some option was not specified.
    function defaults(options, _defaults) {
        options = options || {};
        eachKey(_defaults, function (key, val) {
            if (options[key] == null) {
                options[key] = val;
            }
        });
        return options;
    }

    // Convert value (e.g., a NodeList) to an array.
    function toArray(obj) {
        try {
            return slice.call(obj);
        } catch (e) {
            var ret = [];
            each(obj, function (val) {
                ret.push(val);
            });
            return ret;
        }
    }

    // Test if token is a script tag.
    function isScript(tok) {
        return (/^script$/i).test(tok.tagName);
    }

    // # Class WriteStream

    // Stream static html to an element, where "static html" denotes "html without scripts".

    // This class maintains a *history of writes devoid of any attributes* or "proxy history".
    // Injecting the proxy history into a temporary div has no side-effects,
    // other than to create proxy elements for previously written elements.

    // Given the `staticHtml` of a new write, a `tempDiv`'s innerHTML is set to `proxy_history + staticHtml`.
    // The *structure* of `tempDiv`'s contents, (i.e., the placement of new nodes beside or inside of proxy elements),
    // reflects the DOM structure that would have resulted if all writes had been squashed into a single write.

    // For each descendent `node` of `tempDiv` whose parentNode is a *proxy*, `node` is appended to the corresponding *real* element within the DOM.

    // Proxy elements are mapped to *actual* elements in the DOM by injecting a data-id attribute into each start tag in `staticHtml`.
    var WriteStream = (function () {

        // Prefix for data attributes on DOM elements.
        var BASEATTR = 'data-ps-';

        // get / set data attributes
        function data(el, name, value) {
            var attr = BASEATTR + name;

            if (arguments.length === 2) {
                // Get
                var val = el.getAttribute(attr);

                // IE 8 returns a number if it's a number
                return val == null ? val : String(val);

            } else if (value != null && value !== '') {
                // Set
                el.setAttribute(attr, value);

            } else {
                // Remove
                el.removeAttribute(attr);
            }
        }

        function WriteStream(root, options) {
            var doc = root.ownerDocument;

            set(this, {
                root: root,

                options: options,

                win: doc.defaultView || doc.parentWindow,

                doc: doc,

                parser: global.OSHtmlParser('', { autoFix: true }),

                // Actual elements by id.
                actuals: [root],

                // Embodies the "structure" of what's been written so far, devoid of attributes.
                proxyHistory: '',

                // Create a proxy of the root element.
                proxyRoot: doc.createElement(root.nodeName),

                scriptStack: [],

                writeQueue: []
            });

            data(this.proxyRoot, 'proxyof', 0);

        }


        WriteStream.prototype.write = function () {
            [].push.apply(this.writeQueue, arguments);
            // Process writes
            // When new script gets pushed or pending this will stop
            // because new writeQueue gets pushed
            var arg;
            while (!this.deferredRemote &&
                this.writeQueue.length) {
                arg = this.writeQueue.shift();

                if (isFunction(arg)) {
                    this.callFunction(arg);
                } else {
                    this.writeImpl(arg);
                }
            }
        };

        WriteStream.prototype.callFunction = function (fn) {
            var tok = { type: "function", value: fn.name || fn.toString() };
            this.onScriptStart(tok);
            fn.call(this.win, this.doc);
            this.onScriptDone(tok);
        };

        WriteStream.prototype.writeImpl = function (html) {
            this.parser.append(html);

            var tok, tokens = [];

            // stop if we see a script token
            while ((tok = this.parser.readToken()) && !isScript(tok)) {
                tokens.push(tok);
            }

            this.writeStaticTokens(tokens);

            if (tok) {
                this.handleScriptToken(tok);
            }
        };


        // ## Contiguous non-script tokens (a chunk)
        WriteStream.prototype.writeStaticTokens = function (tokens) {

            var chunk = this.buildChunk(tokens);

            if (!chunk.actual) {
                // e.g., no tokens, or a noscript that got ignored
                return;
            }
            chunk.html = this.proxyHistory + chunk.actual;
            this.proxyHistory += chunk.proxy;

            this.proxyRoot.innerHTML = chunk.html;

            if (DEBUG_CHUNK) {
                chunk.proxyInnerHTML = this.proxyRoot.innerHTML;
            }

            this.walkChunk();

            if (DEBUG_CHUNK) {
                chunk.actualInnerHTML = this.root.innerHTML; //root
            }

            return chunk;
        };


        WriteStream.prototype.buildChunk = function (tokens) {
            var nextId = this.actuals.length,

            // The raw html of this chunk.
                raw = [],

            // The html to create the nodes in the tokens (with id's injected).
                actual = [],

            // Html that can later be used to proxy the nodes in the tokens.
                proxy = [];

            each(tokens, function (tok) {

                raw.push(tok.text);

                if (tok.attrs) { // tok.attrs <==> startTag or atomicTag or cursor
                    // Ignore noscript tags. They are atomic, so we don't have to worry about children.
                    if (!(/^noscript$/i).test(tok.tagName)) {
                        var id = nextId++;

                        // Actual: inject id attribute: replace '>' at end of start tag with id attribute + '>'
                        actual.push(
                            tok.text.replace(/(\/?>)/, ' ' + BASEATTR + 'id=' + id + ' $1')
                        );

                        // Don't proxy scripts: they have no bearing on DOM structure.
                        if (tok.attrs.id !== "ps-script") {
                            // Proxy: strip all attributes and inject proxyof attribute
                            proxy.push(
                                // ignore atomic tags (e.g., style): they have no "structural" effect
                                    tok.type === 'atomicTag' ? '' :
                                    '<' + tok.tagName + ' ' + BASEATTR + 'proxyof=' + id + (tok.unary ? '/>' : '>')
                            );
                        }
                    }

                } else {
                    // Visit any other type of token
                    // Actual: append.
                    actual.push(tok.text);
                    // Proxy: append endTags. Ignore everything else.
                    proxy.push(tok.type === 'endTag' ? tok.text : '');
                }
            });

            return {
                tokens: tokens,
                raw: raw.join(''),
                actual: actual.join(''),
                proxy: proxy.join('')
            };
        };

        WriteStream.prototype.walkChunk = function () {
            var node, stack = [this.proxyRoot];

            // use shift/unshift so that children are walked in document order

            while ((node = stack.shift()) != null) {

                var isElement = node.nodeType === 1;
                var isProxy = isElement && data(node, 'proxyof');

                // Ignore proxies
                if (!isProxy) {

                    if (isElement) {
                        // New actual element: register it and remove the the id attr.
                        this.actuals[data(node, 'id')] = node;
                        data(node, 'id', null);
                    }

                    // Is node's parent a proxy?
                    var parentIsProxyOf = node.parentNode && data(node.parentNode, 'proxyof');
                    if (parentIsProxyOf) {
                        // Move node under actual parent.
                        this.actuals[parentIsProxyOf].appendChild(node);
                    }
                }
                // prepend childNodes to stack
                stack.unshift.apply(stack, toArray(node.childNodes));
            }
        };

        // ### Script tokens

        WriteStream.prototype.handleScriptToken = function (tok) {
            var remainder = this.parser.clear();

            if (remainder) {
                // Write remainder immediately behind this script.
                this.writeQueue.unshift(remainder);
            }

            tok.src = tok.attrs.src || tok.attrs.SRC;

            if (tok.src && this.scriptStack.length) {
                // Defer this script until scriptStack is empty.
                // Assumption 1: This script will not start executing until
                // scriptStack is empty.
                this.deferredRemote = tok;
            } else {
                this.onScriptStart(tok);
            }

            // Put the script node in the DOM.
            var _this = this;
            this.writeScriptToken(tok, function () {
                _this.onScriptDone(tok);
            });

        };

        WriteStream.prototype.onScriptStart = function (tok) {
            tok.outerWrites = this.writeQueue;
            this.writeQueue = [];
            this.scriptStack.unshift(tok);
        };

        WriteStream.prototype.onScriptDone = function (tok) {
            // Pop script and check nesting.
            if (tok !== this.scriptStack[0]) {
                this.options.error({ message: "Bad script nesting or script finished twice" });
                return;
            }
            this.scriptStack.shift();

            // Append outer writes to queue and process them.
            this.write.apply(this, tok.outerWrites);

            // Check for pending remote

            // Assumption 2: if remote_script1 writes remote_script2 then
            // the we notice remote_script1 finishes before remote_script2 starts.
            // I think this is equivalent to assumption 1
            if (!this.scriptStack.length && this.deferredRemote) {
                this.onScriptStart(this.deferredRemote);
                this.deferredRemote = null;
            }
        };

        // Build a script and insert it into the DOM.
        // Done is called once script has executed.
        WriteStream.prototype.writeScriptToken = function (tok, done) {
            var el = this.buildScript(tok);

            if (tok.src) {
                // Fix for attribute "SRC" (capitalized). IE does not recognize it.
                el.src = tok.src;
                this.scriptLoadHandler(el, done);
            }

            try {
                this.insertScript(el);
                if (!tok.src) {
                    done();
                }
            } catch (e) {
                this.options.error(e);
                done();
            }
        };

        // Build a script element from an atomic script token.
        WriteStream.prototype.buildScript = function (tok) {
            var el = this.doc.createElement(tok.tagName);

            // Set attributes
            eachKey(tok.attrs, function (name, value) {
                el.setAttribute(name, value);
            });

            // Set content
            if (tok.content) {
                el.text = tok.content;
            }

            return el;
        };


        // Insert script into DOM where it would naturally be written.
        WriteStream.prototype.insertScript = function (el) {
            // Append a span to the stream. That span will act as a cursor
            // (i.e. insertion point) for the script.
            this.writeImpl('<span id="ps-script"/>');

            // Grab that span from the DOM.
            var cursor = this.doc.getElementById("ps-script");

            // Replace cursor with script.
            cursor.parentNode.replaceChild(el, cursor);
        };


        WriteStream.prototype.scriptLoadHandler = function (el, done) {
            function cleanup() {
                el = el.onload = el.onreadystatechange = el.onerror = null;
                done();
            }

            // Error handler
            var error = this.options.error;

            // Set handlers
            set(el, {
                onload: function () {
                    cleanup();
                },

                onreadystatechange: function () {
                    if (/^(loaded|complete)$/.test(el.readyState)) {
                        cleanup();
                    }
                },

                onerror: function () {
                    error({ message: 'remote script failed ' + el.src });
                    cleanup();
                }
            });
        };

        return WriteStream;

    }());


    // Public-facing interface and queuing
    var postscribe = (function () {
        var nextId = 0;

        var queue = [];

        var active = null;

        function nextStream() {
            var args = queue.shift();
            if (args) {
                args.stream = runStream.apply(null, args);
            }
        }


        function runStream(el, html, options) {
            active = new WriteStream(el, options);

            // Identify this stream.
            active.id = nextId++;
            active.name = options.name || active.id;
            postscribe.streams[active.name] = active;

            // Override document.write.
            var doc = el.ownerDocument;

            var stash = { write: doc.write, writeln: doc.writeln };

            function write(str) {
                str = options.beforeWrite(str);
                active.write(str);
                options.afterWrite(str);
            }

            set(doc, {
                write: function () {
                    return write(toArray(arguments).join(''));
                },
                writeln: function (str) {
                    return write(toArray(arguments).join('') + '\n');
                }
            });

            // Override window.onerror
            var oldOnError = active.win.onerror || doNothing;

            // This works together with the try/catch around WriteStream::insertScript
            // In modern browsers, exceptions in tag scripts go directly to top level
            active.win.onerror = function (msg, url, line) {
                options.error({ msg: msg + ' - ' + url + ':' + line });
                oldOnError.apply(active.win, arguments);
            };

            // Write to the stream
            active.write(html, function streamDone() {
                // restore document.write
                set(doc, stash);

                // restore window.onerror
                active.win.onerror = oldOnError;

                options.done();
                active = null;
                nextStream();
            });

            return active;
        }


        function postscribe(el, html, options) {
            if (isFunction(options)) {
                options = { done: options };
            }
            options = defaults(options, {
                done: doNothing,
                error: function (e) {
                    throw e;
                },
                beforeWrite: function (str) {
                    return str;
                },
                afterWrite: doNothing
            });

            el =
                // id selector
                (/^#/).test(el) ? global.document.getElementById(el.substr(1)) :
                    // jquery object. TODO: loop over all elements.
                    el.jquery ? el[0] : el;


            var args = [el, html, options];

            el.postscribe = {
                cancel: function () {
                    if (args.stream) {
                        // TODO: implement this
                        args.stream.abort();
                    } else {
                        args[1] = doNothing;
                    }
                }
            };

            queue.push(args);
            if (!active) {
                nextStream();
            }

            return el.postscribe;
        }

        return set(postscribe, {
            // Streams by name.
            streams: {},
            // Queue of streams.
            queue: queue,
            // Expose internal classes.
            WriteStream: WriteStream
        });

    }());

    // export postscribe
    global.OSAdWriter = postscribe;

}());
document.onScrOllInstances = document.onScrOllInstances || [];
document.onScrOllInstances.push(onScrOll);
document.onScrOllInstances[ document.onScrOllInstances.length - 1 ].main();

onScrOll = null;

