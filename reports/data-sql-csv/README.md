# SQL Data Source, CSV Output Report

This Report demonstrates some useful techniques for creating reports with flat data sources and outputting formats other than HTML.

This Report fetches flat data from a SQL server and uses [Treeize](https://github.com/kwhitley/treeize) to give that data a hierarchical structure. It then processes that data and uses [untreeize](https://github.com/panosoft/untreeize) and [json2csv](https://github.com/zemirco/json2csv) to finally return CSV output.

# Installation

To install and run this report, run the following in Terminal:

```sh
npm install
npm test
```

After running the above commands, the report CSV should open in a new window of your systems preferred viewer. If it does not open automatically, the CSV can be found within the [`test/`](test/) directory after running `npm test`.

# Description

This Report pulls data from the [Ensembl](http://www.ensembl.org/index.html) SQL database and outputs a short list of human genes, grouped by their biotype. In terms of report structure, it is very similar to our [SQL Data Source](../data-sql) report example. Thus, if you have questions to that effect, please reference that example.

That said, the notable difference here can be found in this reports `render` function which outputs CSV instead of HTML ([`lib/index.js`](lib/index.js)).

When it comes to producing CSV, it is much simpler to work with flat data structures. As such, we leverage the [untreeize](https://github.com/panosoft/untreeize) library to transform our hierarchical data structure back to a flat one. Finally, we pass that flat data to [json2csv](https://github.com/zemirco/json2csv) which generates our final CSV output.

The test script for this report can be viewed here: [`test/index.js`](test/index.js).
