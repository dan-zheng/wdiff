const qs = require('querystring');

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
 * GET /api
 * Parse sentence and produce JSON output.
 */
exports.getApi = (req, res, next) => {
    req.assert('string1', 'First string cannot be blank.').notEmpty();
    req.assert('string2', 'Second string cannot be blank.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/');
    }

    let a = req.query.string1 || req.body.string1;
    let b = req.query.string2 || req.body.string2;

    var data = parse.parseSentences(a, b);

    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
};

/**
 * POST /api
 * URL-encoded POST parameters and redirect to GET /api.
 */
exports.postApi = (req, res, next) => {
    req.assert('string1', 'First string cannot be blank.').notEmpty();
    req.assert('string2', 'Second string cannot be blank.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/');
    }

    res.redirect('/api?string1=' + qs.escape(req.body.string1) + '&string2=' + qs.escape(req.body.string2));
};
