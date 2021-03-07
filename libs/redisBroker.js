const redis = require('redis')
let client = null

function construct(option, callback = null) {
    option.retry_strategy = function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
    client = redis.createClient(option)
    if(callback) callback()
}

function ping (callback = null){
    client.ping(function(err, result){
        if(callback) callback(err, result)
    })
}

function blpop(key, callback = null){
    let blockingClient = client.duplicate()
    blockingClient.blpop(key, 0, function(err, result) {
        console.log('blpop', result);
        if (callback) callback(err, result)

        blockingClient.end(true)
    })
}

function lpop(key, callback = null){
    client.lpop(key, function(err, result){
        // result is null if empty
        if (callback) callback(err, result)
    })
}

function rpush(key, message, callback = null){
    client.rpush(key, message, function(err, result) {
        if (callback) callback(err, result)
    })
}

function lrange(key, start = 0, stop = -1, callback = null){
    client.lrange(key, start, stop, function(err, result){
        if (callback) callback(err, result)
    })
}

function flushAll(){
    client.flushall()
}

function syncRPush(key, messages){

}

function end(){
    client.end(true)
}

function set(key, message, callback = null) {
    client.set(key, message, function(err, result){
        if (callback) callback(err, result)
    })
}

function setEx(key, message, ex = '', callback = null) {
    client.set(key, message, ex, function(err, result){
        if (callback) callback(err, result)
    })
}

function get(key, callback = null) {
    client.get(key, function(err, result){
        if (callback) callback(err, result)
    })
}

module.exports = {
    blpop: blpop,
    lpop, lpop,
    rpush: rpush,
    lrange: lrange,
    flushAll: flushAll,
    end: end,
    set: set,
    setEx: setEx,
    get: get,
    init: construct,
    ping: ping
}
