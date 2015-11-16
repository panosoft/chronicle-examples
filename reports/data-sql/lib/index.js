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

const getContext = co.wrap(function * (parameters) {
  // Connect to SQL server
  const connection = sql.createConnection({
    host: 'ensembldb.ensembl.org',
    port: '3306',
    user: 'anonymous',
    database: 'homo_sapiens_core_82_38'
  });
  yield connect(connection);
  // Query database
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
  // Process data: unflatten
  const tree = new Treeize();
  tree.grow(results);
  const biotypes = tree.getData();
  // Assemble context
  const context = { title: 'Genes by Biotype', biotypes };
  return context;
});

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

const report = co.wrap(function * (parameters) {
  const context = yield getContext(parameters);
  const html = yield render(context);
  return html;
});

module.exports = report;
