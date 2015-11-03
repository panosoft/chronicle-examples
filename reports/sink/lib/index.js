var co = require('co');
var common = require('@panosoft/report-common');
var Handlebars = require('handlebars');
var inline = require('inline-html');
var path = require('path');
var R = require('ramda');

var getContext = function (parameters) {
	var context = {
		title: "Kitchen Sink",
		string: 'A string',
		number: 4321.1234,
		numberNegative: -4321.1234,
		date: new Date(),
		groups: [
			{
				name: 'Group 1',
				items: [
					{string: 'a', number: 1, date: new Date('1/1/2015 00:00:00')},
					{string: 'b', number: 2, date: new Date('2/1/2015 00:00:00')}
				]
			},
			{
				name: 'Group 2',
				items: [
					{string: 'c', number: 3, date: new Date('3/1/2015 00:00:00')},
					{string: 'd', number: 4, date: new Date('4/1/2015 00:00:00')},
					{string: 'e', number: 5, date: new Date('5/1/2015 00:00:00')}
				]
			}
		]
	};
	return context;
};

var render = co.wrap(function * (context) {
	const components = yield common.getComponents();
	const helpers = R.merge(components.helpers, {
		embedded: function () { return 'Embedded Helper'; },
		imported: require('./assets/helper.js')
	});
	const partials = R.merge(components.partials, {
		embedded: 'Embedded Partial',
		imported: yield inline.file(path.resolve(__dirname, './assets/partial.html'))
	});
	const source = yield inline.file(path.resolve(__dirname, './assets/template.html'));
	const template = Handlebars.compile(source);
	var html = template(context, {helpers, partials});
	return html;
});

var report = co.wrap(function * (parameters) {
	const context = getContext(parameters);
	const html = yield render(context);
	return html;
});

module.exports = report;
