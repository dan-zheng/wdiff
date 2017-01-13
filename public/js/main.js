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
        html += '<div class=\'page-header\'><h3>Results</h3></div><div class=\'text-center\'>';
        for (i = 0; i < data.result.length; i++) {
            var entry = data.result[i];
            if (entry.type == 'common') {
                html += '<span>' + entry.value.join(' ') + '</span>';
                if (i < data.result.length - 1) {
                    html += '<span> </span>';
                }
            } else if (entry.type == 'deletion') {
                html += '<span class=\'red\'>';
                html += '(-';
                for (j = 0; j < entry.value.length; j++) {
                    html += '<span>' + entry.value[j] + '</span>';
                    if (j < entry.value.length - 1) {
                        html += '<span> </span>';
                    }
                }
                html += ')';
                html += '</span>';
                if (i < data.result.length - 1) {
                    html += '<span> </span>';
                }
            } else if (entry.type == 'insertion') {
                html += '<span class=\'green\'>';
                html += '(+';
                for (j = 0; j < entry.value.length; j++) {
                    html += '<span>' + entry.value[j] + '</span>';
                    if (j < entry.value.length - 1) {
                        html += '<span> </span>';
                    }
                }
                html += ')';
                html += '</span>';
                if (i < data.result.length - 1) {
                    html += '<span> </span>';
                }
            }
        }
        html += '</div></div>';
        $('#results').html(html);
    });
});
