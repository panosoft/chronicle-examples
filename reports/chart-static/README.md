# Static Chart Report

This report demonstrates how to include static charts in a report.

Examining the report main, [`lib/index.js`](lib/index.js), we see that [node-chartist](https://github.com/panosoft/node-chartist) is used to generate the chart HTML. Then partials containing the HTML for each chart are created and referenced in the template.

Examining the report test, [`test/index.js`](test/index.js), we see that [Chronicle](https://github.com/panosoft/chronicle) is used to run the report and [prince-promise](https://github.com/panosoft/prince-promise) is used to visually render it to PDF.

The final report output can be viewed here: [`test/test.pdf`](test/test.pdf)
