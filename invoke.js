function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

var i = 0;
var interval = setInterval(function() {
    i = ++i % 4;
    $("pre").html("Loading"+Array(i+1).join("."));
}, 500);

var params = new URLSearchParams(window.location.search);
var body = {};

params.forEach((value, key) => {
  body[key] = value;
});

var settings = {
  "url": "https://adat01abcps01.azurewebsites.net/" + window.location.toString().split("/")[3],
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json"
  },
  "data": JSON.stringify(body),
};

$.ajax(settings).done(function (response) {
	clearInterval(interval);
	$("pre").text(formatXml(response.data));
});