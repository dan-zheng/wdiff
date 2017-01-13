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
 * POST /
 * Sign in using email and password.
 */
exports.postIndex = (req, res, next) => {
    req.assert('source', 'Source sentence cannot be blank.').notEmpty();
    req.assert('target', 'Target sentence cannot be blank.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/');
    }

    let re = req.body.regex || new RegExp(/(\w+'\w+)|\w+|,|\!|\.|\?|\'|\"/g);
    let source = req.body.source;
    let target = req.body.target;
    let sourceTokens = source.match(re);
    let targetTokens = target.match(re);

    var result = [];
    var resultString = "";
    var dist = 0;

    var sourcePtr, targetPtr;
    sourcePtr = targetPtr = 0;
    var sourceLen = sourceTokens.length;
    var targetLen = targetTokens.length;

    var identicalList = [];
    var insertList = [];
    var deleteList = [];

    while (sourcePtr < sourceLen && targetPtr < targetLen) {
        var sourceToken = sourceTokens[sourcePtr];
        var targetToken = targetTokens[targetPtr];

        // Check if tokens at pointers are equal
        // If tokens equal, then no insertion/substitution/deletion is needed
        if (sourceToken == targetToken) {
            identicalList.push(sourceToken);
            // Update result
            if (deleteList.length > 0) {
                result.push({
                    type: "deletion",
                    value: deleteList
                });
                resultString += "(-" + deleteList.join(" ") + ") ";
                deleteList = [];
            }
            if (insertList.length > 0) {
                result.push({
                    type: "insertion",
                    value: insertList
                });
                resultString += "(+" + insertList.join(" ") + ") ";
                insertList = [];
            }
            // Increment both pointers
            sourcePtr++;
            targetPtr++;
        }
        // If tokens not equal, insertion/substitution/deletion is needed
        else {
            if (identicalList.length > 0) {
                result.push({
                    type: "identical",
                    value: identicalList
                });
                resultString += identicalList.join(" ") + " ";
                identicalList = [];
            }
            // Find indices of tokens in sentences
            var indexSource = targetTokens.indexOf(sourceToken);
            var indexTarget = sourceTokens.indexOf(targetToken);

            // Substitution: delete token from source and insert token from target
            if (indexSource == -1 && indexTarget == -1) {
                // Add tokens to both deletion and insertion lists
                deleteList.push(sourceToken);
                insertList.push(targetToken);

                dist++;
                sourcePtr++;
                targetPtr++;
            }
            // Insertion: insert token from target
            else if (indexTarget == -1 || indexTarget < indexSource) {
                // Add token to insertion list
                insertList.push(targetToken);
                dist++;
                targetPtr++;
            }
            // Deletion: delete token from source
            else if (indexSource == -1 || indexSource <= indexTarget) {
                // Add token to deletion list
                deleteList.push(sourceToken);
                dist++;
                sourcePtr++;
            }
        }
    }
    if (deleteList.length > 0) {
        result.push({
            type: "deletion",
            value: deleteList
        });
        resultString += "(-" + deleteList.join(" ") + ") ";
    }
    if (insertList.length > 0) {
        result.push({
            type: "insertion",
            value: insertList
        });
        resultString += "(+" + insertList.join(" ") + ") ";
    }
    if (identicalList.length > 0) {
        result.push({
            type: "identical",
            value: identicalList
        });
        resultString += identicalList.join(" ") + " ";
    }

    resultString = resultString.trim();

    var data = {
        source: source,
        target: target,
        distance: dist,
        result: result,
        resultString: resultString
    };

    res.render('home', {
        title: 'Home',
        data: data
    });
};

/**
 * POST /api
 * Sign in using email and password.
 */
exports.postApi = (req, res, next) => {
    req.assert('source', 'Source sentence cannot be blank.').notEmpty();
    req.assert('target', 'Target sentence cannot be blank.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/');
    }

    let re = req.body.regex || new RegExp(/(\w+'\w+)|\w+|,|\!|\.|\?|\'|\"/g);
    let source = req.body.source;
    let target = req.body.target;
    let sourceTokens = source.match(re);
    let targetTokens = target.match(re);

    var result = [];
    var resultString = "";
    var dist = 0;

    var sourcePtr, targetPtr;
    sourcePtr = targetPtr = 0;
    var sourceLen = sourceTokens.length;
    var targetLen = targetTokens.length;

    var identicalList = [];
    var insertList = [];
    var deleteList = [];

    while (sourcePtr < sourceLen && targetPtr < targetLen) {
        var sourceToken = sourceTokens[sourcePtr];
        var targetToken = targetTokens[targetPtr];

        // Check if tokens at pointers are equal
        // If tokens equal, then no insertion/substitution/deletion is needed
        if (sourceToken == targetToken) {
            identicalList.push(sourceToken);
            // Update result
            if (deleteList.length > 0) {
                result.push({
                    type: "deletion",
                    value: deleteList
                });
                resultString += "(-" + deleteList.join(" ") + ") ";
                deleteList = [];
            }
            if (insertList.length > 0) {
                result.push({
                    type: "insertion",
                    value: insertList
                });
                resultString += "(+" + insertList.join(" ") + ") ";
                insertList = [];
            }
            // Increment both pointers
            sourcePtr++;
            targetPtr++;
        }
        // If tokens not equal, insertion/substitution/deletion is needed
        else {
            if (identicalList.length > 0) {
                result.push({
                    type: "identical",
                    value: identicalList
                });
                resultString += identicalList.join(" ") + " ";
                identicalList = [];
            }
            // Find indices of tokens in sentences
            var indexSource = targetTokens.indexOf(sourceToken);
            var indexTarget = sourceTokens.indexOf(targetToken);

            // Substitution: delete token from source and insert token from target
            if (indexSource == -1 && indexTarget == -1) {
                // Add tokens to both deletion and insertion lists
                deleteList.push(sourceToken);
                insertList.push(targetToken);

                dist++;
                sourcePtr++;
                targetPtr++;
            }
            // Insertion: insert token from target
            else if (indexTarget == -1 || indexTarget < indexSource) {
                // Add token to insertion list
                insertList.push(targetToken);
                dist++;
                targetPtr++;
            }
            // Deletion: delete token from source
            else if (indexSource == -1 || indexSource <= indexTarget) {
                // Add token to deletion list
                deleteList.push(sourceToken);
                dist++;
                sourcePtr++;
            }
        }
    }
    if (deleteList.length > 0) {
        result.push({
            type: "deletion",
            value: deleteList
        });
        resultString += "(-" + deleteList.join(" ") + ") ";
    }
    if (insertList.length > 0) {
        result.push({
            type: "insertion",
            value: insertList
        });
        resultString += "(+" + insertList.join(" ") + ") ";
    }
    if (identicalList.length > 0) {
        result.push({
            type: "identical",
            value: identicalList
        });
        resultString += identicalList.join(" ") + " ";
    }

    resultString = resultString.trim();

    var data = {
        source: source,
        target: target,
        distance: dist,
        result: result,
        resultString: resultString
    };

    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
};
