const co = require('co');
const got = require('got');
const Handlebars = require('handlebars');
const inline = require('inline-html');
const moment = require('moment');
const path = require('path');
const url = require('url');

// API helper
const searchRepositories = (query) => {
	var api = url.parse(`https://api.github.com/search/repositories`);
	api.query = query;
	return got(url.format(api), {json: true}).then(response => response.body.items);
};

// Define function that returns template context
const getContext = co.wrap(function * (parameters) {
	// Build query using parameters
	const query = {
		q: 'language:javascript',
		sort: parameters.sort || 'stars', // stars, forks, or updated
		order: 'desc',
		per_page: parameters.results || 30 // min: 1, max: 100
	};
	// Fetch data dynamically
	var repos = yield searchRepositories(query);
	// Process data: add rank
	repos = repos.map((repo, index) => {
		repo.rank = index + 1;
		return repo;
	});
	// Assemble template context
	const context = {
		date: new Date(),
		repos,
		title: 'Most Popular Repositories on Github'
	};
	return context;
});

const render = co.wrap(function * (context) {
	// Create template
	const source = yield inline.file(path.resolve(__dirname, 'template.hbs'));
	const template = Handlebars.compile(source);
	// Define helpers
	const helpers = {
		formatDate: (date, type) => moment(date).format(type)
	};
	// Define partials
	const partials = {
		page: '<span style="content: counter(page)"></span>',
		pages: '<span style="content: counter(pages)"></span>'
	};
	const html = template(context, {helpers, partials});
	return html;
});

const report = co.wrap(function * (parameters) {
	const context = yield getContext(parameters);
	const html = yield render(context);
	return html;
});

module.exports = report;
