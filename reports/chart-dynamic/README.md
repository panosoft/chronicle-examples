# Dynamic Chart Report

This report demonstrates how to include dynamic charts in a report.

It is assumed that this report will be generated from a data set that has a variable number of groups. As such, charts are dynamically rendered for each group at runtime.

Examining the report main, [`lib/index.js`](lib/index.js), we see that [node-chartist](https://github.com/panosoft/node-chartist) is used to generate the chart HTML. First, charts are generated for each group in the data set and their HTML is stored. Then, a helper is created that will return the proper chart for each group. Finally, the helper is referenced within the template iterator to place each chart in the report.

Examining the report test, [`test/index.js`](test/index.js), we see that [Chronicle](https://github.com/panosoft/chronicle) is used to run the report and [prince-promise](https://github.com/panosoft/prince-promise) is used to visually render it to PDF.

The final report output can be viewed here: [`test/test.pdf`](test/test.pdf)
