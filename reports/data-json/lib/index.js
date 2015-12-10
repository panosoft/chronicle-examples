const co = require('co');
const got = require('got');
const Handlebars = require('handlebars');
const inline = require('inline-html');
const moment = require('moment');
const path = require('path');
const R = require('ramda');
const url = require('url');

const mapIndexed = R.addIndex(R.map);

// API helper
const searchRepositories = (query) => {
	var api = url.parse(`https://api.github.com/search/repositories`);
	api.query = query;
	return got(url.format(api), {json: true}).then(response => response.body.items);
};

const fetch = co.wrap(function * (parameters) {
	const query = {
		q: 'language:javascript',
		sort: parameters.sort || 'stars', // stars, forks, or updated
		order: 'desc',
		per_page: parameters.results || 30 // min: 1, max: 100
	};
	const data = yield searchRepositories(query);
	return data;
});

const process = (data) => {
	const repos = mapIndexed((repo, index) => {
		repo.rank = index + 1;
		return repo;
	}, data);
	const context = {
		date: new Date(),
		repos,
		title: 'Most Popular Repositories on Github'
	};
	return context;
};

const render = co.wrap(function * (context) {
	const source = yield inline.file(path.resolve(__dirname, 'template.hbs'));
	const template = Handlebars.compile(source);
	const helpers = {
		formatDate: (date, type) => moment(date).format(type)
	};
	const partials = {
		page: '<span style="content: counter(page)"></span>',
		pages: '<span style="content: counter(pages)"></span>'
	};
	const html = template(context, {helpers, partials});
	return html;
});

const report = co.wrap(function * (parameters) {
	const data = yield fetch(parameters);
	const context = process(data);
	const html = yield render(context);
	return html;
});

module.exports = report;
