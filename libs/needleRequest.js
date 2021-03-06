const needle = require('needle');

function apiRequest(method, url, data = {}, options={}){
    return new Promise(function(resolve, reject) {
        needle.request(method, url, data, options, function(err, resp, body) {
            console.log(`[err] >>> ${JSON.stringify(err)}`)
            if (err) reject(false)

            resolve(body)
        });
    });
}

module.exports = apiRequest;
