var path = require('path');
var prepend = require('prepend-file');
var findUp = require('find-up')

var FIXED_FILE = ['chart.js', 'src', 'core', 'core.helpers.js'];
var FIXED_CODE = '// < HACK >\n'
  +'if (!process.env.BROWSER) {\n'
  +'  global.window = {};\n'
  +'}\n// </ HACK >\n\n';

function hackChartJs() {
  findUp('node_modules')
    .then(nodeModules => prepend(
      path.resolve.apply(path, [nodeModules].concat(FIXED_FILE)),
      FIXED_CODE,
      console.log
    ));
}

hackChartJs();
