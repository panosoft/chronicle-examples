const co = require('co');
const generate = require('node-chartist');
const Handlebars = require('handlebars');
const inline = require('inline-html');
const R = require('ramda');
const path = require('path');

const render = co.wrap(function * () {

  const options = {
    width: 400,
    height: 200,
    axisX: { title: 'X Axis (units)', offset: 50 },
    axisY: { title: 'Y Axis (units)' }
  };
  const partials = {
    bar: yield generate('bar', options, {
      labels: ['A', 'B', 'C', 'D', 'E'],
      series: [
        {name: 'Test 1', value: [2, 9, 3, 6, 1]},
        {name: 'Test 2', value: [3, 3, 6, 8, 7]}
      ]
    }),
    line: yield generate('line', options, {
      labels: ['A', 'B', 'C', 'D', 'E'],
      series: [
        {name: 'Test 1', value: [2, 9, 3, 6, 1]},
        {name: 'Test 2', value: [3, 3, 6, 8, 7]}
      ]
    }),
    pie: yield generate('pie', R.omit(['axisX', 'axisY'], options), {
      series: [
        {name: 'Test 1', value: 2},
        {name: 'Test 2', value: 3}
      ]
    })
  };

  const source = yield inline.file(path.resolve(__dirname, 'template.hbs'));
  const template = Handlebars.compile(source);
  return template({}, { partials });
});

const report = co.wrap(function * () {
  try {
    return yield render();
  }
  catch (error) {console.error(error);}
});

module.exports = report;
