const iniParser = require('../libs/iniParser')
const logging = require('../libs/logging')
const request = require('../libs/needleRequest')

let config = iniParser.get()

const SUCCESS           = 200
const ACCESS_FORBIDDEN  = 403
const NOT_FOUND         = 404
const RTO               = 408
const INTERNAL_ERROR    = 500

const URIFB = 'https://graph.facebook.com/v10.0/'
// https://graph.facebook.com/{api-endpoint}&access_token={your-app_id}|{your-app_secret}

async function getFeed(req, res) {
    let result = {status:false, message: "No data found"}
    try {
        let userFieldSet = 'id, name, feed';

        let params = {
            access_token: config.facebook.token,
            fields: userFieldSet
        };
        let resp = await request('get', URIFB + req.params.id , params)
        logging.debug(`[getFeed] >>> ${JSON.stringify(resp)}`)

        if (undefined === resp.id) {
            result.message = "user not found"
            return res.status(NOT_FOUND).send(result)
        }
        // if (resp.feed.data.length === 0)  return res.status(NOT_FOUND).send(result)
        result.status = true
        result.message = "Success"
        result.data = resp
        res.status(SUCCESS).send(result);
    } catch (e) {
        logging.error(`[getFeed] >>> ${JSON.stringify(e.stack)}`)

        res.send(INTERNAL_ERROR)
    }
}

module.exports = {getFeed}
