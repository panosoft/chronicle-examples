const co = require('co');
const chronicle = require('@panosoft/chronicle');
const fs = require('fs');
const open = require('open');
const path = require('path');
const report = require('../lib');

co(function * () {
	try {
		const csv = yield chronicle.run(report);
		fs.writeFileSync(path.resolve(__dirname,'./test.csv'), csv);

		open(path.resolve(__dirname,'./test.csv'));
	}
	catch (error) { console.error(error.stack); }
});
