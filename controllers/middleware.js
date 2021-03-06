const iniParser = require('../libs/iniParser')
const logging = require('../libs/logging')
const util = require('../libs/utils')
const request = require('../libs/needleRequest');
const passport = require('passport-facebook');

const msgBroker = require('../libs/messageBroker')

let config = iniParser.get()
const SUCCESS           = 200
const ACCESS_FORBIDDEN  = 403
const NOT_FOUND         = 404
const RTO               = 408
const INTERNAL_ERROR    = 500

async function checkPostData(req, res, next) {
    try {
        logging.debug(`[checkPostData][BODY] >>>>  ${JSON.stringify(req.body)}`)
        logging.debug(`[checkPostData][HEADERS] >>>>  ${JSON.stringify(req.headers)}`)

        let payload = await reGetToken()
        if (!payload.access_token) {
            return res.status(ACCESS_FORBIDDEN).json({message: 'who the hell are you?'})
        }

        req.headers.authorization =  `Bearer ${payload.access_token}`
        next()

    } catch (e) {
        logging.error(`[checkPostData] >>>>  ${JSON.stringify(e.stack)}`)
        return res.status(INTERNAL_ERROR)
    }
}



const OAUTH = `https://graph.facebook.com/oauth/access_token?client_id=${config.facebook.app_id}&client_secret=${config.facebook.app_secret}&grant_type=client_credentials`
console.log('uri', OAUTH);
//get token
async function requestToken() {

    const options = {
        'follow_max': 3
    }

    let getToken = await request('GET', OAUTH, {}, options)
    logging.debug(`[REQUESTTOKEN] >>> ${JSON.stringify(getToken)}`)

    if (typeof getToken.access_token === 'undefined') return false;

    logging.debug(`[REDIS] >>> ${config.msgBroker.tokenKey}`)
    msgBroker.set(config.msgBroker.tokenKey, JSON.stringify(getToken))
    msgBroker.expiredAt(config.msgBroker.tokenKey, parseInt((+new Date)/1000) + 86400)

    return getToken
}

async function reGetToken() {
    let getToken = await msgBroker.get(config.msgBroker.tokenKey)
    logging.debug(`[reGetToken] >>> ${JSON.stringify(getToken)}`)
    if (null === getToken || undefined === getToken) {
        return await requestToken()
    }
    let token = JSON.parse(getToken)
    return token;
}

module.exports = checkPostData;
