var co = require('co');
var chronicle = require('@panosoft/chronicle');
var fs = require('fs');
var open = require('open');
var path = require('path');
var prince = require('prince-promise');

var report = require('../lib');
var parameters = {
	sort: 'stars',
	results: 30
};

co(function * () {
	try {
		var html = yield chronicle.run(report, parameters);
		fs.writeFileSync(path.resolve(__dirname,'./test.html'), html);

		var pdf = yield prince(html);
		fs.writeFileSync(path.resolve(__dirname,'./test.pdf'), pdf);

		open(path.resolve(__dirname,'./test.pdf'));
	}
	catch (error) { console.error(error.stack); }
});
