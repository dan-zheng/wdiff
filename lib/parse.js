exports.parseSentences = (a, b, regex) => {
    if (a === undefined || a.length === 0 || b === undefined || b.length === 0) {
        return undefined;
    }
    return levenshtein(a, b, regex, false);
};

const levenshtein = (a, b, regex, useSub) => {
    if (typeof(a) !== 'string' || typeof(b) !== 'string') {
        throw new Error('Illegal argument error.');
    }

    regex = regex || new RegExp(/(\w+'\w+)|\w+|,|\!|\.|\?|\'|\"/g);
    useSub = useSub || false;

    var tokensA = a.match(regex);
    var tokensB = b.match(regex);

    var distances = [];
    var i, j;

    for (i = 0; i <= tokensA.length; ++i) {
        distances[i] = [i];
    }
    for (j = 0; j <= tokensB.length; ++j) {
        distances[0][j] = j;
    }

    for (i = 1; i <= tokensA.length; i++) {
        for (j = 1; j <= tokensB.length; j++) {
            if (tokensA[i - 1] === tokensB[j - 1]) {
                distances[i][j] = distances[i - 1][j - 1];
            } else {
                const sub = distances[i - 1][j - 1] + 1;
                const del = distances[i - 1][j] + 1;
                const ins = distances[i][j - 1] + 1;
                distances[i][j] = useSub ? Math.min.apply(null, [sub, del, ins]) : Math.min.apply(null, [del, ins]);
            }
        }
    }
    const distance = distances[tokensA.length][tokensB.length];
    var result = levenshteinUtility(distances, tokensA, tokensB, useSub);
    return {
        string1: a,
        string2: b,
        tokens1: tokensA,
        tokens2: tokensB,
        regex: regex.toString(),
        distance: distance,
        result: dataGroupUtility(result),
        resultString: printFormat(result)
    };
};

const levenshteinUtility = (C, a, b, useSub) => {
    var data = [];
    var i = a.length;
    var j = b.length;
    useSub = useSub || false;

    while (i > 0 && j > 0) {
        const com = C[i - 1][j - 1];
        const sub = C[i - 1][j - 1] + 1;
        const del = C[i - 1][j] + 1;
        const ins = C[i][j - 1] + 1;

        if (a[i - 1] == b[j - 1] && C[i][j] === com) {
            data.unshift({
                type: 'common',
                value: a[i - 1]
            });
            i--;
            j--;
        } else if (C[i][j] === sub) {
            if (useSub) {
                data.unshift({
                    type: 'substitution',
                    from: a[i - 1],
                    to: b[j - 1]
                });
                i--;
                j--;
            } else {
                data.unshift({
                    type: 'deletion',
                    value: a[i - 1]
                });
                data.unshift({
                    type: 'insertion',
                    value: b[j - 1]
                });
                i--;
                j--;
            }
        } else if (C[i][j] === del) {
            data.unshift({
                type: 'deletion',
                value: a[i - 1]
            });
            i--;
        } else if (C[i][j] === ins) {
            data.unshift({
                type: 'insertion',
                value: b[j - 1]
            });
            j--;
        }
    }
    while (i > 0) {
        if (C[i][j] === C[i - 1][j]) {
            data.unshift({
                type: 'common',
                value: a[i - 1]
            });
        } else {
            data.unshift({
                type: 'deletion',
                value: a[i - 1]
            });
        }
        i--;
    }
    while (j > 0) {
        if (C[i][j] === C[i][j - 1]) {
            data.unshift({
                type: 'common',
                value: b[j - 1]
            });
        } else {
            data.unshift({
                type: 'insertion',
                value: b[j - 1]
            });
        }
        j--;
    }
    return data;
};

const dataGroupUtility = (data) => {
    var result = [];
    var commonList = [];
    var insertList = [];
    var deleteList = [];
    var i;

    for (i = 0; i < data.length; i++) {
        var entry = data[i];
        if (entry.type == 'common') {
            if (deleteList.length > 0) {
                result.push({
                    type: 'deletion',
                    value: deleteList
                });
                deleteList = [];
            }
            if (insertList.length > 0) {
                result.push({
                    type: 'insertion',
                    value: insertList
                });
                insertList = [];
            }
            commonList.push(entry.value);
        } else if (entry.type == 'deletion') {
            if (commonList.length > 0) {
                result.push({
                    type: 'common',
                    value: commonList
                });
                commonList = [];
            }
            deleteList.push(entry.value);
        } else if (entry.type == 'insertion') {
            if (commonList.length > 0) {
                result.push({
                    type: 'common',
                    value: commonList
                });
                commonList = [];
            }
            insertList.push(entry.value);
        }
    }
    if (commonList.length > 0) {
        result.push({
            type: 'common',
            value: commonList
        });
        commonList = [];
    }
    if (deleteList.length > 0) {
        result.push({
            type: 'deletion',
            value: deleteList
        });
        deleteList = [];
    }
    if (insertList.length > 0) {
        result.push({
            type: 'insertion',
            value: insertList
        });
        insertList = [];
    }
    return result;
};

var LCS = (source, target, regex) => {
    let re = regex || new RegExp(/(\w+'\w+)|\w+|,|\!|\.|\?|\'|\'/g);
    a = source.match(re);
    b = target.match(re);
    var m = a.length,
        n = b.length,
        C = [],
        i, j;
    for (i = 0; i <= m; i++) {
        C.push([0]);
    }
    for (j = 0; j < n; j++) {
        C[0].push(0);
    }
    for (i = 1; i <= m; i++) {
        for (j = 1; j <= n; j++) {
            if (a[i] == b[j]) {
                C[i][j] = C[i - 1][j - 1] + 1;
            } else {
                C[i][j] = Math.max(C[i][j - 1], C[i - 1][j]);
            }
        }
    }
    var result = printDiff(C, a, b, m - 1, n - 1);
    return data;
};

var printDiff = (C, a, b, i, j) => {
    var lcs = [];
    var data = [];
    printDiffHelper(C, a, b, i, j, lcs, data);
    return {
        lcs: lcs,
        data: data
    };
};

var printDiffHelper = (C, a, b, i, j, lcs, data) => {
    if (i === 0 && j === 0) {
        lcs.unshift(a[i]);
        data.unshift({
            type: 'common',
            value: a[i]
        });
        console.log('  ' + a[i]);
    } else if (i > 0 && j > 0 && a[i] == b[j]) {
        lcs.unshift(a[i]);
        data.unshift({
            type: 'common',
            value: a[i]
        });
        printDiffHelper(C, a, b, i - 1, j - 1, lcs, data);
        console.log('  ' + a[i]);
    } else if (j > 0 && (i === 0 || C[i][j - 1] > C[i - 1][j])) {
        data.unshift({
            type: 'insertion',
            value: b[j]
        });
        printDiffHelper(C, a, b, i, j - 1, lcs, data);
        console.log('+ ' + b[j]);
    } else if (i > 0 && (j === 0 || C[i][j - 1] <= C[i - 1][j])) {
        data.unshift({
            type: 'deletion',
            value: a[i]
        });
        printDiffHelper(C, a, b, i - 1, j, lcs, data);
        console.log('- ' + a[i]);
    } else {
        console.log('');
    }
};

var printFormat = (data, delimiter) => {
    var result = '';
    var commonList = [];
    var deleteList = [];
    var insertList = [];
    for (var i = 0; i < data.length; i++) {
        var token = data[i];
        if (token.type == 'common') {
            if (deleteList.length > 0) {
                result += listToString(deleteList, '(', ')', '-');
                deleteList = [];
            }
            if (insertList.length > 0) {
                result += listToString(insertList, '(', ')', '+');
                insertList = [];
            }
            commonList.push(token.value);
        } else if (token.type == 'insertion') {
            if (commonList.length > 0) {
                result += listToString(commonList, '');
                commonList = [];
            }
            insertList.push(token.value);
        } else if (token.type == 'deletion') {
            if (commonList.length > 0) {
                result += listToString(commonList, '');
                commonList = [];
            }
            deleteList.push(token.value);
        }
    }
    if (commonList.length > 0) {
        result += listToString(commonList, '');
        commonList = [];
    }
    if (deleteList.length > 0) {
        result += listToString(deleteList, '(', ')', '-');
        deleteList = [];
    }
    if (insertList.length > 0) {
        result += listToString(insertList, '(', ')', '+');
        insertList = [];
    }
    result = result.trim();
    return result;
};

var listToString = (list, prefix, suffix, symbol) => {
    if (list === undefined || list.length === 0) {
        return '';
    }
    prefix = prefix || '';
    suffix = suffix || '';
    symbol = symbol || '';
    var string = '';
    string += prefix + symbol;
    string += list.join(' ');
    string += suffix;
    string += ' ';
    return string;
};
