const capitalize = require('underscore.string/capitalize');
const co = require('co');
const promisify = require('pify');
const R = require('ramda');
const sql = require('mysql');
const Treeize = require('treeize');
const untreeize = require('untreeize').untreeize;

const json2csv = promisify(require('json2csv'));

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
  var biotypes = tree.getData();
  // process data
  biotypes = R.map(biotype => {
    biotype.genes = R.map(gene => {
      gene.description = capitalize(gene.description);
      return gene;
    }, biotype.genes);
    return biotype;
  }, biotypes);
  // Assemble context
  const context = { biotypes };
  return context;
};

const render = co.wrap(function * (context) {
  const data = untreeize(context);
  const fields = [
    { value: 'biotypes:biotype', label: 'Biotype' },
    { value: 'biotypes:genes:id', label: 'Gene Id' },
    { value: 'biotypes:genes:description', label: 'Gene Description' }
  ];
  const csv = yield json2csv({ data, fields });
  return csv;
});

const report = co.wrap(function * () {
  const data = yield fetch();
  const context = process(data);
  const csv = yield render(context);
  return csv;
});

module.exports = report;
