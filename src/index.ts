import './js-dos/js-dos.js';
import './js-dos/js-dos.css';
import './index.scss';
import { DosPlayerOptions } from '../node_modules/js-dos/dist/types/src/player';

const JSDOS_OPTIONS: DosPlayerOptions = {
	style: 'hidden',
};

const WRAPPER = document.getElementById('jsdos');

// @ts-ignore
emulators.pathPrefix = 'js-dos/';
// @ts-ignore
Dos(WRAPPER, JSDOS_OPTIONS).run(require('./hwanse.jsdos'));
