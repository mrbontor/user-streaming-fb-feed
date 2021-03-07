const redis = require('redis')
let client = null

// const client = require('bluebird').promisifyAll(require('redis').createClient({
//     retry_strategy: function (options) {
//         if (options.error && options.error.code === 'ECONNREFUSED') {
//             // End reconnecting on a specific error and flush all commands with
//             // a individual error
//             return new Error('The server refused the connection');
//         }
//         if (options.total_retry_time > 1000 * 60 * 60) {
//             // End reconnecting after a specific timeout and flush all commands
//             // with a individual error
//             return new Error('Retry time exhausted');
//         }
//         if (options.attempt > 10) {
//             // End reconnecting with built in error
//             return undefined;
//         }
//         // reconnect after
//         return Math.min(options.attempt * 100, 3000);
//     }
// }));

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
    // client = redis.createClient({
    //     retry_strategy: function (options) {
    //         if (options.error && options.error.code === 'ECONNREFUSED') {
    //             // End reconnecting on a specific error and flush all commands with
    //             // a individual error
    //             return new Error('The server refused the connection');
    //         }
    //         if (options.total_retry_time > 1000 * 60 * 60) {
    //             // End reconnecting after a specific timeout and flush all commands
    //             // with a individual error
    //             return new Error('Retry time exhausted');
    //         }
    //         if (options.attempt > 10) {
    //             // End reconnecting with built in error
    //             return undefined;
    //         }
    //         // reconnect after
    //         return Math.min(options.attempt * 100, 3000);
    //     },
    //     host: option.host,
    //     port: option.port,
    //     database: option.database
    // })
    if(callback) callback()
}

function getClient() {
  return client.duplicate()
}

function ping (callback = null){
    client.ping(function(err, result){
        if(callback) callback(err, result)
    })
}

function blpop(key, callback = null){
    let blockingClient = getClient()
    blockingClient.blpop(key, 0, function(err, result) {
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

function setEx(key, value, ex = 3600) {
    return new Promise((resolve, reject) => {
        client.set(key, value, `EX ${ex}`, (err, result) => {
            if (err) reject(err)

            resolve(result)
        })
    });
}

function get(key, callback = null) {
    return new Promise(function(resolve, reject) {
        client.get(key, function(err, result){
            if (err) reject(err)

            resolve(result)
        })

    });
}

function expired(key, timeout = null) {
    return new Promise((resolve, reject) => {
        client.expire(key, timeout, function (err, result){
            if (err) reject(err)

            resolve(result)
        })

    });
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
    ping: ping,
    expiredAt: expired
}
