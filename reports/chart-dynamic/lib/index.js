const co = require('co');
const generate = require('node-chartist');
const Handlebars = require('handlebars');
const inline = require('inline-html');
const R = require('ramda');
const path = require('path');

const fetch = () => ({
	groups: [
		{
			name: 'Group 1',
			items: [
				{string: 'a', number: 2},
				{string: 'b', number: 9},
				{string: 'c', number: 3},
				{string: 'd', number: 6},
				{string: 'e', number: 1}
			]
		},
		{
			name: 'Group 2',
			items: [
				{string: 'a', number: 3},
				{string: 'b', number: 3},
				{string: 'c', number: 6},
				{string: 'd', number: 8},
				{string: 'e', number: 7}
			]
		}
	]
});

const render = co.wrap(function * (context) {

  const options = {
    width: 400,
    height: 200,
    axisX: { title: 'X Axis (units)', offset: 50 },
    axisY: { title: 'Y Axis (units)' }
  };
  const charts = yield R.map(group => {
    const labels = R.map(R.prop('string'), group.items);
    const value = R.map(R.prop('number'), group.items);
    const series = [{ name: group.name, value }];
    const data = { labels, series };
    return generate('bar', options, data);
  }, context.groups);

  const helpers = {
    charts: index => new Handlebars.SafeString(charts[index])
  };

  const source = yield inline.file(path.resolve(__dirname, 'template.hbs'));
  const template = Handlebars.compile(source);
  return template(context, { helpers });
});

const report = co.wrap(function * () {
  const context = fetch();
  return yield render(context);
});

module.exports = report;
