const iniParser = require('./libs/iniParser')
const args = require('minimist')(process.argv.slice(2));
const bodyParser = require('body-parser')
const express = require('express')
const env = process.env.NODE_ENV || 'development'
const logging = require('./libs/logging')
const app = express()

process.env.TZ = 'Asia/Jakarta'
// default config if config file is not provided

let config = {
    log: {
        path: 'var/log/',
        level: 'debug',
        type: 'file',
        errorSufix: '-error',
        filename: 'log-fb-streaming-feed'
    }
}

if (args.h || args.help) {
    // TODO: print USAGE
    console.log("Usage: node " + __filename + " --config");
    process.exit(-1);
}

// overwrite default config with config file
let configFile = {}
if (env === 'development') {
    configFile = args.c || args.config || './log-fb-streaming-feed.dev.ini'
} else {
    configFile = args.c || args.config || './log-fb-streaming-feed.prod.ini'
}
config = iniParser.init(config, configFile, args)
config.log.level = args.logLevel || config.log.level

const take_port = config.app.port;
const port = take_port || process.env.PORT || 2021;

// Initialize logging library
// logging.init(config.log)
logging.init({
    path: config.log.path,
    level: config.log.level,
    filename: config.log.filename
})


logging.info(`[CONFIG] ${JSON.stringify(iniParser.get())}`)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(err, req, res, next) {
    logging.info(`[REQ] ${JSON.stringify(req)}`)
    logging.info(`[RES] ${JSON.stringify(res)}`)
    if (err) {
        logging.error('[MIDDLEWAREERROR] ' + JSON.stringify(err));
        res.status(500);
        let response = {
            status: 500,
            errors: [err.message]
        };
        res.json(response);
    } else {
        next();
    }
});


const routes = require('./router/router');
routes(app);

const server = app.listen(port);
logging.info('[app] API-SERVICE FB-STREAM-FEED-USER STARTED on ' + port);
module.exports = server;
