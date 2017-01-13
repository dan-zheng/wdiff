const parse = require('../lib/parse');

/**
 * GET /
 * Home page.
 */
exports.getIndex = (req, res) => {
    res.render('home', {
        title: 'Home'
    });
};

/**
 * POST /api
 * Parse sentence and produce JSON output.
 */
exports.postApi = (req, res, next) => {
    req.assert('source', 'Source sentence cannot be blank.').notEmpty();
    req.assert('target', 'Target sentence cannot be blank.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/');
    }

    let source = req.body.source;
    let target = req.body.target;

    var data = parse.parseSentences(source, target);

    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
};
