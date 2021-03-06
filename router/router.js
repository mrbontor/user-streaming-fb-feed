module.exports = function(app) {
    const ctrl = require('../controllers');

    app.route('/fb/user/feed/:id')
        .get(ctrl.getFeed)

    app.get('/fb/ping', function (req, res) {
        res.status(200).json({status: true, message: "How are you? i`m Fine. Thanks "})
    })
};
