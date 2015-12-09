const capitalize = require('underscore.string/capitalize');
const co = require('co');
const Handlebars = require('handlebars');
const inline = require('inline-html');
const moment = require('moment');
const path = require('path');
const sql = require('mysql');
const Treeize = require('treeize');

const connect = (connection) => new Promise((resolve, reject) =>
  connection.connect((error) => error ? reject(error) : resolve())
);
const execute = (connection, query) => new Promise((resolve, reject) =>
  connection.query(query, (error, results) => error ? reject(error) : resolve(results))
);

const fetch = co.wrap(function * () {
  const connection = sql.createConnection({
    host: 'ensembldb.ensembl.org',
    port: '3306',
    user: 'anonymous',
    database: 'homo_sapiens_core_82_38'
  });
  yield connect(connection);
  const query = `
    SELECT
      gene.biotype AS "biotypes:biotype",
        gene.stable_id AS "biotypes:genes:id",
        gene.description AS "biotypes:genes:description"
    FROM gene
    LIMIT 30
  `;
  const results = yield execute(connection, query);
  connection.end();
  return results;
});

const process = (data) => {
  // Unflatten data
  const tree = new Treeize();
  tree.grow(data);
  const biotypes = tree.getData();
  // Assemble context
  const context = {
    title: 'Genes by Biotype',
    biotypes
  };
  return context;
};

const render = co.wrap(function * (context) {
  // Create template
  const source = yield inline.file(path.resolve(__dirname, './template.hbs'));
  const template = Handlebars.compile(source);
  // Define helpers and partials
  const helpers = {
    capitalize: (value) => capitalize(value),
    formatDate: (date, type) => moment(date).format(type)
  };
  const partials = {
    page: '<span style="content: counter(page)"></span>',
    pages: '<span style="content: counter(pages)"></span>'
  };
  // Generate HTML
  const html = template(context, {helpers, partials});
  return html;
});

const report = co.wrap(function * () {
  const data = yield fetch();
  const context = process(data);
  const html = yield render(context);
  return html;
});

module.exports = report;
