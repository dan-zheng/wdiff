const parse = require('../../lib/parse.js');

$(document).ready(function() {
    $('#parse-btn').click(function() {
        var a = $('input[name=string1]').val();
        var b = $('input[name=string2]').val();

        var data = parse.parseSentences(a, b);
        if (!data) {
            return;
        }
        var i, j;
        i = j = 0;
        var html = '';
        html += '<div class=\'page-header\'><h3>Results</h3></div><div class=\'text-center\' id=\'stringOutput\'>';
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
        html += '</div></div>';
        html += '<pre id=\'jsonOutput\'>' + syntaxHighlight(JSON.stringify(data, null, 4)) + '</pre>';
        $('#results').html(html);
    });
});

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
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
