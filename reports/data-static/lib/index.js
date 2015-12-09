const Handlebars = require('handlebars');

const fetch = (parameters) => ({
	date: parameters.date
});

const render = (context) => {
	const helpers = { identity: (x) => x };
	const partials = { welcome: '<h1>Welcome to Chronicle</h1>' };
	const source = `
		<!DOCTYPE html>
		<html>
		<body>
			{{>welcome}}
			{{identity date}}
		</body>
		</html>
	`;
	const template = Handlebars.compile(source);
	return template(context, { helpers, partials });
};

const report = (parameters) => {
	const context = fetch(parameters);
	const html = render(context);
	return html;
};

module.exports = report;
