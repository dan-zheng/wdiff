const qs = require('querystring');

const parse = require('../lib/parse');

/**
 * GET /
 * Home page.
 */
exports.getIndex = (req, res) => {
    console.log(req.cookies);
    res.render('home', {
        title: 'Home',
        a: req.cookies.a || undefined,
        b: req.cookies.b || undefined
    });
};

/**
 * GET /api
 * Parse sentence and produce JSON output.
 */
exports.getApi = (req, res, next) => {
    req.assert('a', 'First string cannot be blank.').notEmpty();
    req.assert('b', 'Second string cannot be blank.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/');
    }

    let a = req.query.a || req.body.a;
    let b = req.query.b || req.body.b;

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
    req.assert('a', 'First string cannot be blank.').notEmpty();
    req.assert('b', 'Second string cannot be blank.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/');
    }

    res.redirect('/api?a=' + qs.escape(req.body.a) + '&b=' + qs.escape(req.body.b));
};
