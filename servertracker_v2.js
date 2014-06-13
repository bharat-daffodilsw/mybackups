// Include dependencies

var buffer = require('./buffer')
    , link = require('url')
    , user = require('../controllers/user')
//, secret = require('secret');
console.log("in travegr _ v2.js");

/*var _trans_gif_1x1 = new Buffer([
 0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
 0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
 0x02, 0x44, 0x01, 0x00, 0x3b]);*/ //=next (35)
//var _trans_gif_1x1 = new Buffer("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64"); //35 - utm.gif, 1x1whitepixel
//var _trans_gif_1x1 = new Buffer("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"); //42
//var _trans_gif_1x1 = new Buffer("R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==", "base64"); //49
var _trans_gif_1x1 = new Buffer("R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", "base64"); //43 - reported as smallest valid?

var write_pixel = function (res) {
    res.writeHead(200, {
        'Content-Type':'image/gif', 'Content-Length':_trans_gif_1x1.length
    });
    res.end(_trans_gif_1x1);
};
exports.write_pixel = write_pixel;

var init_call = function (req, res, callback) {
    console.log("in init _call");
    // Get all the user data variables for the impression call
    var udata = {};
    udata.uid = user.id(req, res);
    // udata.data = JSON.parse(user.getdata(req,res));
    // udata.segs = JSON.parse(user.getsegs(req,res));

    console.log("in init_call req.query = " + JSON.stringify(req.query));

    var accs = req.query['acc'].split(',');
    var ids = req.query['id'].split(',');
    var cids = req.query['cid'].split(',');
    var r = req.query['r'].split(',');
    var iframe = req.query['iframe'].split(',');
    var custom = false;

    if (req.query['custom_vars']) {
        custom = req.query['custom_vars'].split(',');
    }
    console.log("bharat" + ids);
    if ('vis_ol' in req.query) {
        var vis = req.query['vis_ol'].split(',');
    } else {
        // old format (double request) ->
        // visible_onload sent as 'vis' during init call
        var vis = req.query['vis'].split(',');
    }
    for (var i = 0; i < ids.length; i++) {
        if (!accs[i]) {
            // If no account ID is configured then do not track the impression.
            console.log("impression ignored - no account id present");

        } else {

            // Create new instance of an impression document.
            // NOTE: we don't want tracker frontend to deal with mongodb,
            // so at this point we create an unbound object, which will be
            // later saved to DB by pusher (sub.js)
            var impression = {};

            // Store the impression id for debug purposes
            impression.imp_id = r[i];
            custom = JSON.parse(custom);
//            custom = JSON.stringify(custom[0]);
            // Create a date to store alongside the impression
            //impression.date = new Date();
            // Store the Account, Campaign and Creative ID
            if (custom) {

                console.log("true")
                impression.custom_vars = custom[0];
            }
            impression.account_id = accs[i];
            impression.campaign_id = cids[i];
            impression.creative_id = ids[i];

            // Parse the URL into constituent parts.
            var url = link.parse(req.query['url'], false);
            impression.site = url['hostname'];
            impression.url = url['href'];

            // Record full user agent
            impression.user_agent = req.headers['user-agent'];

            // Detect whether mobile
            // NOTE: moved to sub.js
            // impression.is_mobile = ...;

            // Iframe and Visible on load attributes
            impression.iframe = iframe[i];
            impression.visible_onload = vis[i];

            // Detect OS and Browser settings
            impression.browser = req.query['b'];
            impression.browser_v = req.query['bv'];
            impression.os = req.query['os'];

            // Detect Screen Resolution
            impression.screen_size = req.query['res'];

            // Store UID alongside the impression
            impression.uid = udata.uid;

            // Store the IP address of the user
            if (!req.header('x-forwarded-for')) {
                impression.ip = req.connection.remoteAddress;
            } else {
                impression.ip = req.header('x-forwarded-for');
            }
            // NOTE: geo_country setting moved to sub.js
            // impression.geo_country = ...;

            // Store frequency cap info alongside the impression
            // impression.freq = udata.data[udata.data.indexOf(ids[i] + 1)];

            // Insert keywords into array
            impression.keywords = req.query['kw'].toString(',');
            console.log("impression" + JSON.stringify(impression));

            if (callback) {
                // Initiate the random number for in memory key value store.
                var random = r[i];
//                console.log(random);

                callback(random, impression);
            }

            impression = null;//force garbage collection, otherwise imp objects never freed
        }
    }
};

var end_call = function (req, res, callback) {

    var r = req.query['r'].split(',');
    var vis = req.query['vis'].split(',');
    // cids = req.query['cid'].split(','); // unused anymore
    var mo = req.query['mo'].split(',');
    var clks = req.query['clks'].split(',');

    for (var i = 0; i < r.length; i++) {

        var random = r[i];

        var data = {};
        data.visible_time = vis[i];
        data.clicks = clks[i];
        data.mouseovers = mo[i];

        callback(random, data);
    }
};

exports.init = function (req, res) {
    req = test_init(req);//to remove

    init_call(req, res, function (key, data) {
        // Store in memory buffer
        buffer.add(key, data);
    });

    write_pixel(res);
};

exports.end = function (req, res) {
    req = test_init(req);//to remove

    end_call(req, res, function (key, data) {
        buffer.update(key, data);
    });

    write_pixel(res);
};

exports.track = function (req, res) {
    req = test_init(req);//to remove

    init_call(req, res, function (key, data) {
        // Store in memory buffer
        buffer.add(key, data);
    });

    end_call(req, res, function (key, data) {
        buffer.update(key, data);
    });

    write_pixel(res);
}


exports.track21 = function (req, res) {
    console.log('in tracker21 now init_call');
    req = test_init(req);//to remove

    init_call(req, res, function (key, data) {
        end_call(req, res, function (key, extra) {
            buffer.push(data, extra);
        });
    });

    write_pixel(res);
}


/// test stuff
var test_init = function (req) {
    if ('pingtest' in req.query) {
        req['query'] = {
            'r':'' + Math.floor((Math.random() * 1000000000000)),
            'vis_ol':'1',
            'iframe':'1',
            'url':'http://www.www.co.uk/',
            'os':'Windows',
            'b':'Chrome',
            'bv':'32',
            'kw':'',
            'res':'1920x1080',
            'acc':'000000000000000000000000',
            'id':'000000000000000000000000',
            'cid':'000000000000000000000000',

            //'r': req.query['r'],
            //'cid': req.query['cid'],
            'vis':'11',
            'clks':'5',
            'mo':'2'
        };
    }
    return req;
};

