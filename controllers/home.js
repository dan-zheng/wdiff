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
    req.assert('string1', 'First string cannot be blank.').notEmpty();
    req.assert('string2', 'Second string cannot be blank.').notEmpty();

    const errors = req.validationErrors();

    console.log(req.body);

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/');
    }

    let a = req.body.string1;
    let b = req.body.string2;

    var data = parse.parseSentences(a, b);

    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
};
