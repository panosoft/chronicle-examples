const co = require('co');
const chronicle = require('@panosoft/chronicle');
const fs = require('fs');
const open = require('open');
const path = require('path');
const prince = require('prince-promise');

const reportUrl = 'http://localhost:8888/data-json/bundle.js';
const parameters = {
	sort: 'stars',
	results: 30
};

co(function * () {
  try {
    const html = yield chronicle.run(reportUrl, parameters);
    fs.writeFileSync(path.resolve(__dirname,'./test.html'), html);

    const pdf = yield prince(html);
    fs.writeFileSync(path.resolve(__dirname,'./test.pdf'), pdf);

    open(path.resolve(__dirname,'./test.pdf'));
  }
  catch (error) { console.error(error.stack); }
});
