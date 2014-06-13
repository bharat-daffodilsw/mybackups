onScrOll.version = "1.0.21";
"undefined" !== typeof onScrOll_block && !0 === onScrOll_block && (onScrOll = null);
onScrOll.main = function () {
    "dual" === this.mode || "sticky_dual" === this.mode ? (this.dualSticky = "dual" === this.mode ? !1 : !0, this.dualSticky || (this.mode = "sticky_dual")) : "sticky" === this.mode && /android|bada\/|blackberry|iemobile|ip(hone|od|ad)|mobile.+firefox|opera m(ob|in)i|phone|symbian|windows (ce|phone)/i.test(navigator.userAgent) && (this.mode = "basic");
    this.instance = document.onScrOllInstances.length - 1;
    this.initialPos = this.wrapper = null;
    this.root = [];
    this.segment = 0;
    this.hasOwnProperty("iframe") || (this.iframe = !0);
    this.hasOwnProperty("interval") || (this.interval = 1E3);
    this.hasOwnProperty("reload") || (this.reload = !1);
    this.style = this.style || {
        position:"relative"
    };
    if (this.hasOwnProperty("placeholder")) {
        var a = document.getElementById(this.placeholder);
        this.wrapper = document.createElement("div");
        this.wrapper.id = "" + this.instance + "_onScrOllRoot";
        this.wrapper.style.clear = "both";
        this.wrapper.style.position = "relative";
        this.wrapper.style.left = 0;
        this.wrapper.style.top = 0;
        this.wrapper.style.margin = "0px auto";
        a.appendChild(this.wrapper)
    } else
        document.write("<div id='" +
            this.instance + "_onScrOllRoot' style='clear:both;position:relative;left:0;top:0;margin:0px auto;'></div>");
    var b = this;
    setTimeout(function () {
        b.main2(b)
    }, 0)
};
onScrOll.main2 = function (a) {
    a.wrapper || (a.wrapper = document.getElementById("" + a.instance + "_onScrOllRoot"));
    a.wrapper.style.width = this.width + "px";
    "basic" === this.mode && (a.wrapper.style.height = this.height + "px");
    a.scrollHook();
    a.bind(window, "scroll", function () {
        a.scrollHook()
    });
    a.bind(window, "resize", function () {
        a.scrollHook()
    });
    a.bind(window, "load", function () {
        a.scrollHook()
    })
};
onScrOll.scrollHook = function () {
    this.initialPos = this.elPos(this.wrapper);
    var a = this.getDocScroll().scrOfY, b = a + this.windowDims().myHeight - this.initialPos, c = this.getDocHeight(), e = c - this.initialPos - this.margin;
    if (e < this.height)
        "sticky" === this.mode && 1 === this.root.length && (this.root[0].style.top = "0");
    else {
        if ("sticky_reappearing" === this.mode || "sticky_dual" === this.mode) {
            var f = Math.ceil(b / this.interval);
            this.initialPos + (f - 1) * this.interval + this.height + this.margin <= this.getDocHeight() && (this.segment = f)
        }
        this.genRoot();
        if ("sticky_reappearing" === this.mode || "sticky" === this.mode || "floating" === this.mode || "sticky_dual" === this.mode)
            if (0 < b && a + this.margin < c)
                if ("sticky_dual" === this.mode)
                    for (this.checkSegment(), b = 0; b < this.root.length; b++)
                        if (f = b, f == this.segment - 2) {
                            var k = (f + 1) * this.interval - this.height;
                            a >= this.initialPos + k ? (this.dualSticky && (this.root[b].style.position = "absolute", this.root[b].style.top = k + "px"), a >= this.initialPos + (f + 1) * this.interval ? this.resetRoot(this.segment - 1) : this.root[b].rel != this.segment - 1 && this.refreshFrame(this.segment -
                                1)) : (this.root[b].rel != this.segment - 1 && this.refreshFrame(this.segment - 1), this.dualSticky && (this.root[b].style.position = "fixed", this.root[b].style.top = "0"))
                        } else
                            f == this.segment - 1 && (a + this.margin + this.height >= c ? this.dualSticky && (this.root[b].style.position = "absolute", this.root[b].style.top = e - this.height + "px") : (f *= this.interval, a >= this.initialPos + f ? this.dualSticky && (this.root[b].style.position = "fixed", this.root[b].style.top = "0") : (this.root[b].style.position = "absolute", this.root[b].style.top = f + "px")));
                else
                    this.checkSegment(), a >= this.initialPos ? a + this.margin + this.height >= c ? (this.root[0].style.position = this.style.position, this.root[0].style.top = e - this.height + "px") : (this.root[0].style.position = "fixed", this.root[0].style.top = "0") : (this.root[0].style.position = this.style.position, this.root[0].style.top = "0");
            else
                this.fullResetRoot();
        else
            "basic" === this.mode && (0 < b && a < this.initialPos + this.height ? this.checkSegment() : this.fullResetRoot())
    }
};
onScrOll.fullResetRoot = function () {
    var a;
    for (a = 0; a < this.root.length; a++)
        this.resetRoot(a + 1)
};
onScrOll.resetRoot = function (a) {
    a -= 1;
    this.root[a].style.position = this.style.position;
    this.reload && (this.root[a].innerHTML = "", this.root[a].rel = -1)
};
onScrOll.bind = function (a, b, c) {
    a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c)
};
onScrOll.logData = function (a) {
    document.getElementById("onScrolllLog").innerHTML = a
};
onScrOll.getDocScroll = function () {
    var a = 0, b = 0;
    "number" === typeof window.pageYOffset ? (b = window.pageYOffset, a = window.pageXOffset) : document.body && (document.body.scrollLeft || document.body.scrollTop) ? (b = document.body.scrollTop, a = document.body.scrollLeft) : document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop) && (b = document.documentElement.scrollTop, a = document.documentElement.scrollLeft);
    return {
        scrOfX:a,
        scrOfY:b
    }
};
onScrOll.refreshFrame = function (a) {
    console.log("refresh frame called");
    var b = this.root["sticky_dual" === this.mode ? a - 1 : 0];
    b.rel = a;


    if (!1 === this.iframe) {
        var ad_code = this.base64_decode(this.code);
        console.log("before change" + ad_code);
        /*add custom variable */
        // for testing in some case accountid campaginid creativeid pass through loaderjs
        if ((this.campaignId && this.creativeId && this.accountId)) {
            if (ad_code.indexOf('<SCRIPT SRC="http://ad.netcommunities.com/ttj?id=1836361" TYPE="text/javascript"></SCRIPT>') == -1) {
                var position = ad_code.lastIndexOf("</div>");
                var tempScript = '<SCRIPT SRC="http://ad.netcommunities.com/ttj?id=1836361" TYPE="text/javascript"></SCRIPT>';
                ad_code = [ad_code.slice(0, position), tempScript, ad_code.slice(position)].join('');
            }
            var position = ad_code.lastIndexOf("</div>");
            var tempScript = '<script type="text/javascript">(window._tracker = (window._tracker || [])).push({' + "campaignId:'" + this.campaignId + "',creativeId:'" + this.creativeId + "',accountId:'" + this.accountId + '\'})</script><script src="http://ms.onscroll.com:2000/p/tracker_v2.js"></script>';
            ad_code = [ad_code.slice(0, position), tempScript, ad_code.slice(position)].join('');
            console.log("my add code" + ad_code);
        }
        if (typeof this.custom_vars !== 'undefined' && ad_code.indexOf("(window._tracker = (window._tracker || [])).push({") != -1) {
            var position = (ad_code.indexOf("(window._tracker = (window._tracker || [])).push({") + "(window._tracker = (window._tracker || [])).push({".length);
            var customVariable = "custom_vars:" + JSON.stringify(this.custom_vars) + ",";
            ad_code = [ad_code.slice(0, position), customVariable, ad_code.slice(position)].join('');
        }
        //ad_code = ad_code.replace('<SCRIPT SRC="http://ad.netcommunities.com/ttj?id=1836361" TYPE="text/javascript"></SCRIPT>', '<SCRIPT SRC="http://ib.adnxs.com/cr?id=15320858" TYPE="text/javascript"></SCRIPT>');
        ad_code = ad_code.replace('<script src="http://ms.onscroll.com:3000/javascripts/tracker_v2.js"></script>', '<script src="http://ms.onscroll.com:2000/p/tracker_v2.js"><\/script>');
        ad_code = ad_code.replace('<script src="http://cdn.onscroll.com/ms.os.js"></script>', '<script src="http://ms.onscroll.com:2000/p/tracker_v2.js"><\/script>');
        OSAdWriter(b, ad_code);
    }
    else {
        a = "";
        if ("object" === typeof this.vars) {
            for (var c in this.vars)
                a += "var " + c + "=" + this.stringify(this.vars[c]) + ";";
            a && (a = "<script>" + a + "\x3c/script>")
        }
        c = "";
        "undefined" !== typeof this.extrajs && (c = "<script>" + this.extrajs + "\x3c/script>");
        var e = this.base64_decode(this.code);
        // e = e.replace('<SCRIPT SRC="http://ad.netcommunities.com/ttj?id=1836361" TYPE="text/javascript"></SCRIPT>', '<SCRIPT SRC="http://ib.adnxs.com/cr?id=15320858" TYPE="text/javascript"></SCRIPT>');
        if (e.indexOf("(window._tracker = (window._tracker || [])).push({") != -1) {
            if (typeof this.custom_vars !== 'undefined' && e.indexOf("(window._tracker = (window._tracker || [])).push({") != -1) {
                var position = (e.indexOf("(window._tracker = (window._tracker || [])).push({") + "(window._tracker = (window._tracker || [])).push({".length);
                var customVariable = "custom_vars:" + JSON.stringify(this.custom_vars) + ",";
                e = [e.slice(0, position), customVariable, e.slice(position)].join('');
            }
            e = e.replace('<script src="http://cdn.onscroll.com/ms.os.js"></script>', '<script src="http://ms.onscroll.com:2000/p/tracker_v2.js"></script>');
            e = e.replace('<script src="http://ms.onscroll.com:3000/javascripts/tracker_v2.js"></script>', '<script src="http://ms.onscroll.com:2000/p/tracker_v2.js"></script>');
            for (a = "<html><head><style>body{margin:0 0 0 0;padding:0 0 0 0;height:100%;}</style>" + a + c + "</head><body>" + e + "</body></html>"; b.hasChildNodes();)
                b.removeChild(b.lastChild);
            c = document.createElement("iframe");
            c.width = this.width + "px";
            c.height = this.height + "px";
            c.frameBorder = "0";
            c.scrolling = "no";

            b.appendChild(c);
        }
        else {
            if ((this.campaignId && this.creativeId && this.accountId)) {
                if (typeof this.custom_vars !== 'undefined') {
                    var customObject = JSON.stringify(this.custom_vars);
                    (e = "<div>" + e + '<script type="text/javascript">', e += "(window._tracker = (window._tracker || [])).push({", e += "campaignId: '" + this.campaignId + "',", e += "creativeId: '" + this.creativeId + "',", e += "accountId: '" + this.accountId + "'", e += "custom_vars: '" + customObject + "'", e += "});", e += "\x3c/script>", e += '<script src="http://ms.onscroll.com:2000/p/tracker_v2.js">\x3c/script>', e += "</div>");
                    for (a = "<html><head><style>body{margin:0 0 0 0;padding:0 0 0 0;height:100%;}</style>" + a + c + "</head><body>" + e + "</body></html>"; b.hasChildNodes();)
                        b.removeChild(b.lastChild);
                    c = document.createElement("iframe");
                    c.width = this.width + "px";
                    c.height = this.height + "px";
                    c.frameBorder = "0";
                    c.scrolling = "no";
                    b.appendChild(c);
                }
                else {
                    (e = "<div>" + e + '<script type="text/javascript">', e += "(window._tracker = (window._tracker || [])).push({", e += "campaignId: '" + this.campaignId + "',", e += "creativeId: '" + this.creativeId + "',", e += "accountId: '" + this.accountId + "'", e += "});", e += "\x3c/script>", e += '<script src="http://ms.onscroll.com:2000/p/tracker_v2.js">\x3c/script>', e += "</div>");
                    for (a = "<html><head><style>body{margin:0 0 0 0;padding:0 0 0 0;height:100%;}</style>" + a + c + "</head><body>" + e + "</body></html>"; b.hasChildNodes();)
                        b.removeChild(b.lastChild);
                    c = document.createElement("iframe");
                    c.width = this.width + "px";
                    c.height = this.height + "px";
                    c.frameBorder = "0";
                    c.scrolling = "no";
                    b.appendChild(c);
                }
            }

        }
        /*not in basecode*/
        // e && "undefined" !== typeof this.campaignId && "undefined" !== typeof this.creativeId &&
        // "undefined" !== typeof this.accountId &&

        if (window.navigator.userAgent.match(/MSIE\s/))
            c.contentWindow.contents = a, c.src = 'javascript:window["contents"]';
        else {
//            var f = c.contentDocument || c.contentWindow && c.contentWindow.document || c.document;
            var f =c = (c.contentWindow) ? c.contentWindow : (c.contentDocument.document) ? c.contentDocument.document : c.contentDocument;
            //a='<IFRAME src="http://ib.adnxs.com/cr?id=15320858" FRAMEBORDER="0" SCROLLING="no" MARGINHEIGHT="0" MARGINWIDTH="0" TOPMARGIN="0" LEFTMARGIN="0" ALLOWTRANSPARENCY="true" WIDTH="300" HEIGHT="250"></IFRAME>';
            console.log("html for iframe" + a);
            f.document.open('text/html','replace');
            f.document.write(a);
            setTimeout(function () {
                console.log("close iframe ");
                f.document.close();
            }, 0)
        }
    }
};
onScrOll.elPos = function (a) {
    var b = 0;
    if (a.offsetParent) {
        do
            b += a.offsetTop;
        while (a = a.offsetParent)
    }
    return b
};
onScrOll.windowDims = function () {
    var a = 0, b = 0;
    "number" === typeof window.innerWidth ? (a = window.innerWidth, b = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (a = document.documentElement.clientWidth, b = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (a = document.body.clientWidth, b = document.body.clientHeight);
    return {
        myWidth:a,
        myHeight:b
    }
};
onScrOll.genRoot = function () {
    for (var a = "sticky_dual" === this.mode ? this.segment : 1; this.root.length < a;) {
        this.root.push(document.createElement("div"));
        var b = this.root.length - 1;
        this.root[b].id = this.instance + "_onScrOllAd_" + b;
        this.root[b].style.position = this.style.position;
        this.root[b].style.clear = "both";
        this.root[b].style.width = this.width + "px";
        this.root[b].style.height = this.height + "px";
        this.root[b].style.top = b * this.interval + "px";
        "undefined" !== typeof this.marginTop && (this.root[b].style.marginTop = this.marginTop +
            "px");
        this.wrapper.appendChild(this.root[b])
    }
};
onScrOll.getDocHeight = function () {
    var a = document;
    return Math.max(Math.max(a.body.scrollHeight, a.documentElement.scrollHeight), Math.max(a.body.offsetHeight, a.documentElement.offsetHeight), Math.max(a.body.clientHeight, a.documentElement.clientHeight))
};
onScrOll.checkSegment = function () {
    var a = "sticky_dual" === this.mode ? this.segment - 1 : 0;
    ("sticky" === this.mode || "floating" === this.mode || "basic" === this.mode || this.segment) && this.root[a].rel != this.segment && this.refreshFrame(this.segment)
};
onScrOll.base64_decode = function (a) {
    var b, c, e, f, k, g = 0, l = 0;
    f = "";
    var p = [];
    if (!a)
        return a;
    a += "";
    do
        b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), e = b << 18 | c << 12 | f << 6 | k, b = e >> 16 & 255, c =
            e >> 8 & 255, e &= 255, 64 == f ? p[l++] = String.fromCharCode(b) : 64 == k ? p[l++] = String.fromCharCode(b, c) : p[l++] = String.fromCharCode(b, c, e);
    while (g < a.length);
    return f = p.join("")
};
onScrOll.stringify = function (a) {
    switch (typeof a) {
        case "string":
            return '"' + a + '"';
        case "number":
            return isFinite(a) ? String(a) : "null";
        case "boolean":
        case "null":
            return String(a);
        case "object":
            if (!a)
                return "null";
            var b = [];
            if ("[object Array]" === Object.prototype.toString.apply(a)) {
                for (var c = 0; c < a.length; c += 1)
                    b[c] = this.stringify(a[c]) || "null";
                return 0 === b.length ? "[]" : "[" + b.join(",") + "]"
            }
            for (c in a)
                if (Object.prototype.hasOwnProperty.call(a, c)) {
                    var e = this.stringify(a[c]);
                    e && b.push(c + ":" + e)
                }
            return 0 === b.length ?
                "{}" : "{" + b.join(",") + "}"
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
            comment:/^<!--/,
            endTag:/^<\//,
            atomicTag:/^<\s*(script|style|noscript|iframe|textarea)[\s>]/i,
            startTag:/^</,
            chars:/^[^<]/
        };

        // Detection has already happened when a reader is called.
        var reader = {

            comment:function () {
                var index = stream.indexOf("-->");
                if (index >= 0) {
                    return {
                        content:stream.substr(4, index),
                        length:index + 3
                    };
                }
            },

            endTag:function () {
                var match = stream.match(endTag);

                if (match) {
                    return {
                        tagName:match[1],
                        length:match[0].length
                    };
                }
            },

            atomicTag:function () {
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
                                tagName:start.tagName,
                                attrs:start.attrs,
                                content:match[1],
                                length:match[0].length + start.length
                            };
                        }
                    }
                }
            },

            startTag:function () {
                var match = stream.match(startTag);

                if (match) {
                    var attrs = {};

                    match[2].replace(attr, function (match, name) {
                        var value = arguments[2] || arguments[3] || arguments[4] ||
                            fillAttr.test(name) && name || null;

                        attrs[name] = value;
                    });

                    return {
                        tagName:match[1],
                        attrs:attrs,
                        unary:!!match[3],
                        length:match[0].length
                    };
                }
            },

            chars:function () {
                var index = stream.indexOf("<");
                return {
                    length:index >= 0 ? index : stream.length
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
                    startTag:function (tok) {
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

                    endTag:function (tok) {
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
            append:append,
            readToken:readToken,
            readTokens:readTokens,
            clear:clear,
            rest:rest,
            stack:stack
        };

    }

    htmlParser.supports = supports;

    htmlParser.tokenToString = function (tok) {
        var handler = {
            comment:function (tok) {
                return '<--' + tok.content + '-->';
            },
            endTag:function (tok) {
                return '</' + tok.tagName + '>';
            },
            atomicTag:function (tok) {
                console.log(tok);
                return handler.startTag(tok) +
                    tok.content +
                    handler.endTag(tok);
            },
            startTag:function (tok) {
                var str = '<' + tok.tagName;
                for (var key in tok.attrs) {
                    var val = tok.attrs[key];
                    // escape quotes
                    str += ' ' + key + '="' + (val ? val.replace(/(^|[^\\])"/g, '$1\\\"') : '') + '"';
                }
                return str + (tok.unary ? '/>' : '>');
            },
            chars:function (tok) {
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
                root:root,

                options:options,

                win:doc.defaultView || doc.parentWindow,

                doc:doc,

                parser:global.OSHtmlParser('', { autoFix:true }),

                // Actual elements by id.
                actuals:[root],

                // Embodies the "structure" of what's been written so far, devoid of attributes.
                proxyHistory:'',

                // Create a proxy of the root element.
                proxyRoot:doc.createElement(root.nodeName),

                scriptStack:[],

                writeQueue:[]
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
            var tok = { type:"function", value:fn.name || fn.toString() };
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
                tokens:tokens,
                raw:raw.join(''),
                actual:actual.join(''),
                proxy:proxy.join('')
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
                this.options.error({ message:"Bad script nesting or script finished twice" });
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
                onload:function () {
                    cleanup();
                },

                onreadystatechange:function () {
                    if (/^(loaded|complete)$/.test(el.readyState)) {
                        cleanup();
                    }
                },

                onerror:function () {
                    error({ message:'remote script failed ' + el.src });
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

            var stash = { write:doc.write, writeln:doc.writeln };

            function write(str) {
                str = options.beforeWrite(str);
                active.write(str);
                options.afterWrite(str);
            }

            set(doc, {
                write:function () {
                    return write(toArray(arguments).join(''));
                },
                writeln:function (str) {
                    return write(toArray(arguments).join('') + '\n');
                }
            });

            // Override window.onerror
            var oldOnError = active.win.onerror || doNothing;

            // This works together with the try/catch around WriteStream::insertScript
            // In modern browsers, exceptions in tag scripts go directly to top level
            active.win.onerror = function (msg, url, line) {
                options.error({ msg:msg + ' - ' + url + ':' + line });
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
                options = { done:options };
            }
            options = defaults(options, {
                done:doNothing,
                error:function (e) {
                    throw e;
                },
                beforeWrite:function (str) {
                    return str;
                },
                afterWrite:doNothing
            });

            el =
                // id selector
                (/^#/).test(el) ? global.document.getElementById(el.substr(1)) :
                    // jquery object. TODO: loop over all elements.
                    el.jquery ? el[0] : el;


            var args = [el, html, options];

            el.postscribe = {
                cancel:function () {
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
            streams:{},
            // Queue of streams.
            queue:queue,
            // Expose internal classes.
            WriteStream:WriteStream
        });

    }());

    // export postscribe
    global.OSAdWriter = postscribe;

}());
document.onScrOllInstances = document.onScrOllInstances || [];
document.onScrOllInstances.push(onScrOll);
document.onScrOllInstances[document.onScrOllInstances.length - 1].main();
onScrOll = null;


