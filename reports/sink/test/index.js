const chronicle = require('@panosoft/chronicle');
const co = require('co');
const fs = require('fs');
const nock = require('nock');
const open = require('open');
const path = require('path');
const prince = require('prince-promise');
const url = require('url');

co(function * () {
	try {
		const baseUrl = 'http://www.test.com';
		const reportPath = '/report/bundle.js';
		const filePath = path.resolve(__dirname, '../bundle.js');
		const reportUrl = url.resolve(baseUrl, reportPath);
		const parameters = {
			renderer: {},
			report: {}
		};

		// Mock Network
		nock(baseUrl)
			.get(reportPath)
			.replyWithFile(200, filePath);

		const html = yield chronicle.run(reportUrl, parameters.report);
		fs.writeFileSync(path.join(__dirname, './test.html'), html);

		const pdf = yield prince(html, parameters.renderer);
		fs.writeFileSync(path.join(__dirname, './test.pdf'), pdf);

		open(path.join(__dirname, './test.pdf'));
	}
	catch (error) { console.trace(error.stack); }
});
