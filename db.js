//////////////
// MongoDB Controller.

var Mongoose = require('mongoose')
    , config = require('../config.js');

exports.mongoConnect = function() {

    var Mongoose = require('mongoose');

    var mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"main"
    }
    var generate_mongo_url = function(obj) {
        obj.hostname = (obj.hostname || 'localhost');
        obj.port = (obj.port || 27017);
        obj.db = (obj.db || 'test');

        if(obj.username && obj.password){
            return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
        else{
            return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
    }
    var mongourl = generate_mongo_url(mongo);

    // var opts = { replset: { strategy: 'ping', rs_name: 'rs1' }}
    // replicaset = "mongodb://localhost:37020/main, mongodb://localhost:37021/main, mongodb://localhost:37022/main";

    return Mongoose.createConnection(config.mongoUrl, { server: { poolSize: 10 }});

}

exports.mongoConnect2 = function() {
    var Mongoose = require('mongoose');
    return Mongoose.createConnection(config.mongoUrl2, { server: { poolSize: 10 }});

}

var Schema = Mongoose.Schema,
    ObjectId = Schema.ObjectId

// Impression Schema

impression = new Schema({
    'imp_id': Number,
    //'date': { type: Date, default: Date.now, index: true },
    'site': String,
    'url': String,
    'campaign_id': String,
    'creative_id': String,
    'account_id': String,
    'browser'  :  { type: String, default: "unknown" },
    'browser_v' : Number,
    'os': { type: String, default: "unknown" },
    'is_mobile': Number,
    'iframe': Number,
    'visible_onload': Number,
    'visible_time': Number,
    'screen_size': String,
    'user_agent': String,
    'ip' : String,
    'uid' : String,
    'segments' : String,
    'freq': Number,
    'clicks': Number,
    'mouseovers':Number,
    'keywords': [String],
    'geo_country': String,
'custom_vars':{}	
}, { collection : 'impressions', safe : false, read: 'secondaryPreferred', shardKey: { "_id" : 1 } });

impression.virtual('date').get(function() {
    return this._id.getTimestamp();
});

// This function returns an ObjectId embedded with a given datetime
// Accepts both Date object and string input
function _objectIDfromTimestamp(timestamp)
{
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }
    return Mongoose.Types.ObjectId.createFromTime(Math.floor(timestamp/1000));
}
// to get rid of extra "date" field from model, we use timestamp part of _id for date queries
exports.dateQuery = function(from,to) {
    console.log("Date query = 'id': { $gte : "+ _objectIDfromTimestamp(from) + " , $lt: "+ _objectIDfromTimestamp(to) + "}");

    return { "_id" : { $gte : _objectIDfromTimestamp(from), $lt : _objectIDfromTimestamp(to) }}
}
exports.dateQueryLte = function(d) {
    return { "_id" : { $lte : _objectIDfromTimestamp(d) }}
}

Mongoose.model('impression', impression);

// Account Schema

account = new Schema({
    'name': { type: String, required: true, unique:true },
    'active': { type: Boolean, default: true },
    'details': {
        'address': {
            'line1': { type: String, required: true },
            'line2': String,
            'city': { type: String, required: true },
            'postcode': { type: String, required: true },
            'country': { type: String, required: true }
        },
        'telephone': { type: String, required: true }
    },
    'billing_type': { type: String, default: 'fixed fee' },
    'cpm_rate': { type: Number, default: 0.05 },
    'monthly_rate': { type: Number, default: 0 },
    'balance':  { type: Number, default: 0 },
    'limits': {
        'campaign':{ type: Number, default: 1000 },
        'creative':{ type: Number, default: 1000 },
        'impression':{ type: Number, default: 250000 }
    },
    'theme':{
        'enabled':Boolean,
        'text': { type: String, default:'#000000' },
        'background': { type: String, default:'#FFFFFF' },
        'foreground': { type: String, default:'#FFFFFF' },
        'labels': { type: String, default:'#e81b79' },
        'nav': { type: String, default:'#000000' },
        'nav_text': { type: String, default:'#FFFFFF' },
        'logo_path': String
    }
}, { collection : 'accounts', safe : true });

Mongoose.model('account', account);

// User Schema

user = new Schema({
    'username': { type: String, required: true, unique: true },
    'name':{
        'first': { type: String, required: true },
        'last': { type: String, required: true }
    },
    'account_id': { type: String, required: true },
    'active': { type: Boolean, default: true },
    'role': { type: String, default: 'standard' },
    'email': { type: String, required: true, unique: true },
    'password': { type: String, required: true },
    'remember': String
}, { collection : 'users', safe : true });

Mongoose.model('user', user);

// Campaign Schema

campaign = new Schema({
    'name': { type: String, required: true },
    'active': { type: Boolean, default: true },
    'account_id': { type: String, required: true },
    'created_by': { type: String, required: true },
    'created_on': { type: Date, default: new Date() },
    'creatives': [String],
    'dates': {
        'start': { type: Date, required: true },
        'end': { type: Date, required: true }
    },
    'impression_goal': Number,
    'quickstats': {
        'lifetime':{
            'impressions':{ type: Number, default: 0 },
            'clicks':{ type: Number, default: 0 },
            'mouseovers':{ type: Number, default: 0 },
            'viewable_imps':{ type: Number, default: 0 },
            'visible_time':{ type: Number, default: 0 },
            'domains':{ type: Number, default: 0 }
        },
        'yesterday':{
            'impressions':{ type: Number, default: 0 },
            'clicks':{ type: Number, default: 0 },
            'mouseovers':{ type: Number, default: 0 },
            'viewable_imps':{ type: Number, default: 0 },
            'visible_time':{ type: Number, default: 0 }
        }
    }
}, { collection : 'campaigns', safe : true });

Mongoose.model('campaign', campaign);

// Creative Schema

creative = new Schema({
    'name': { type: String, required: true },
    'account_id': String,
    'active': { type: Boolean, default: true },
    'created_by': String,
    'created_on': { type: Date, default: new Date() },
    'impression_goal': Number,
    'content': String,
    'quickstats': {
        'lifetime':{
            'impressions':Number,
            'clicks':Number,
            'mouseovers':Number,
            'viewable_imps':Number,
            'visible_time':Number
        },
        'yesterday':{
            'impressions':Number,
            'clicks':Number,
            'mouseovers':Number,
            'viewable_imps':Number,
            'visible_time':Number
        }
    },
    'onscroll': {
        'mode':{ type: String, default: 'basic' },
        'width':{ type: Number, default: 300 },
        'height':{ type: Number, default: 250 },
        'margin':{ type: Number, default: 600 },
        'reload':{ type: Boolean, default: false },
        'interval':{ type: Number, default: 1000 }
    }
}, { collection : 'creatives', safe : true });

creative.virtual('onscroll_code').get(function() {
    if(this.content) {
        return new Buffer(this.content).toString('base64');
    }
    return '';
});

Mongoose.model('creative', creative);

// Billing Schema

billing = new Schema({
    'account_id': String,
    'paid': { type: Boolean, default: false },
    'created_on': { type: Date, default: new Date() },
    'impressions': Number,
    'cpm_rate': Number,
    'monthly_fee':Number,
    'total': Number
}, { collection : 'creatives', safe : true });

Mongoose.model('billing', billing);

// Scheduled_job_log Schema

scheduled_job_log = new Schema({
    'job_name': String,
    'created_on': { type: Date, default: new Date() },
    'execute_ms': { type: Number, default: 0 },
    'error_output': String,
    'full_stats': {}
}, { collection : 'scheduled_job_log', safe : true });

Mongoose.model('scheduled_job_log', scheduled_job_log);

// Scheduled_job_log Schema

report_queue = new Schema({
    'created_on': { type: Date, default: new Date() },
    'finished_on': { type: Date, default: new Date() },
    'execute_ms': { type: Number, default: 0 },
    'error_output': String,
    'data': {}
}, { collection : 'report_queue', safe : true });

Mongoose.model('report_queue', report_queue);

// Settings Schema

settings = new Schema({
    'name': String,
    'tracking_path': String
}, { collection : 'settings', safe : true });

Mongoose.model('settings', settings);

agg_log = new Schema({
    'tbl': String,
    'hr': Number,
    'st': Number
}, { collection : 'agg_log', safe : true });

Mongoose.model('agg_log', agg_log);


/////////////////////
// Aggregation Schemas

agg_imp_hourly = new Schema({},
    { collection: 'agg_imp_hourly', safe: true, read: 'secondaryPreferred', shardKey: { "_id" : 1 } });
Mongoose.model('agg_imp_hourly', agg_imp_hourly);

agg_imp_daily = new Schema({},
    { collection: 'agg_imp_daily', safe: true, read:'secondaryPreferred', shardKey: { "_id" : 1 } });
Mongoose.model('agg_imp_daily', agg_imp_daily);

agg_imp_daily_geo = new Schema({},
    { collection: 'agg_imp_daily_geo', safe: true, read: 'secondaryPreferred', shardKey: { "_id" : 1 } });
Mongoose.model('agg_imp_daily_geo', agg_imp_daily_geo);

agg_imp_campaign_creative = new Schema({},
    { collection: 'agg_imp_campaign_creative', safe: true, read: 'secondaryPreferred', shardKey: { "_id" : 1 } });
Mongoose.model('agg_imp_campaign_creative', agg_imp_campaign_creative);

agg_billing_daily = new Schema({},
    { collection: 'agg_billing_daily', safe: true, read: 'secondaryPreferred', shardKey: { "_id" : 1 } });
Mongoose.model('agg_billing_daily', agg_billing_daily);

agg_visible_hourly_sample = new Schema({},
    { collection: 'agg_visible_hourly_sample', safe: true, read:'secondaryPreferred', shardKey: { "_id" : 1 } });
Mongoose.model('agg_visible_hourly_sample', agg_visible_hourly_sample);