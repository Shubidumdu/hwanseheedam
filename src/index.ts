import './js-dos/js-dos.js';
import './js-dos/js-dos.css';
import './index.scss';
const a = require('./hwanse.jsdos');

console.log(a);

// @ts-ignore
emulators.pathPrefix = 'js-dos/';
// @ts-ignore
Dos(document.getElementById('jsdos')).run(require('./hwanse.jsdos'));
