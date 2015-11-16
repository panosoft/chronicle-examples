var Handlebars = require('handlebars');

var getContext = (parameters) => ({ date: parameters.date });

var helpers = { identity: (x) => x };
var partials = { welcome: '<h1>Welcome to Chronicle</h1>' };
var source = `
	<!DOCTYPE html>
	<html>
	<body>
		{{>welcome}}
		{{identity date}}
	</body>
	</html>
`;
var template = Handlebars.compile(source);
var render = (context) => template(context, {helpers, partials});

var report = (parameters) => {
	var context = getContext(parameters);
	var html = render(context);
	return html;
};

module.exports = report;
