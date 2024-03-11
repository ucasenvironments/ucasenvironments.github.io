$.ajax("XmlLinkWS_" + window.location.search.replace('?', ''), {
    success: function(response) {
      $("body").html(response);
    }
});

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

function submitToUCAS() {
	var body = {};

	$('form').serializeArray().forEach((item) => {
		body[item.name] = item.value;
	});

	var i = 0;
	$("body").html('<pre style="font-family: Consolas;font-size: 13px;">Loading</pre>');
	var interval = setInterval(function() {
		i = ++i % 4;
		$("pre").html("Loading"+Array(i+1).join("."));
	}, 500);

	var environment = window.location.toString().split("/")[3];

	var settings = {
	  "url": "https://inquisitive-unicorn-88cf28.netlify.app/.netlify/functions/" + environment.substr(0, environment.length - 3) + "/ucas_xml"
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
}
