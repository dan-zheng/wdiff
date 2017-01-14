const parse = require('../../lib/parse.js');

$(document).ready(function() {
    $('#parse-btn').click(function() {
        var a = $('input[name=a]').val();
        var b = $('input[name=b]').val();

        createCookie('a', a, 1);
        createCookie('b', a, 1);

        var data = parse.parseSentences(a, b);
        if (!data) {
            return;
        }
        var i, j;
        i = j = 0;
        var html = '';
        html += '<div class=\'page-header\'><h3>Results</h3></div><div id=\'output\'><div class=\'text-center\' id=\'stringOutput\'>';
        for (i = 0; i < data.result.length; i++) {
            var entry = data.result[i];
            if (entry.type == 'common') {
                html += '<span>' + entry.value.join(' ') + '</span>';
                if (i < data.result.length - 1) {
                    html += '<span> </span>';
                }
            } else if (entry.type == 'deletion') {
                html += '<span class=\'red\'>' + '(-' + entry.value.join(' ') + ')' + '</span>';
                if (i < data.result.length - 1) {
                    html += '<span> </span>';
                }
            } else if (entry.type == 'insertion') {
                html += '<span class=\'green\'>' + '(+' + entry.value.join(' ') + ')' + '</span>';
                if (i < data.result.length - 1) {
                    html += '<span> </span>';
                }
            }
        }
        html += '</div><div class=\'text-center\' id=\'distOutput\'>';
        html += '<span class=\'gray\'>Distance: <span class=\'number bold\'>' + data.distance + '</span> tokens</span>';
        html += '</div></div>';
        html += '<pre id=\'jsonOutput\'>' + syntaxHighlight(JSON.stringify(data, null, 4)) + '</pre>';
        $('#results').html(html);
    });
});

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
