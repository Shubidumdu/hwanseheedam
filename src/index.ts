import './js-dos/js-dos.js';
import './js-dos/js-dos.css';
import './index.scss';
import { DosPlayerOptions } from '../node_modules/js-dos/dist/types/src/player';

const JSDOS_OPTIONS: DosPlayerOptions = {
	style: 'hidden',
	preventUnload: true,
};

const wrapper = document.getElementById('jsdos');
const gamePath = require('./hwanse.jsdos');
let dosInterface: any;

// @ts-ignore
emulators.pathPrefix = 'js-dos/';

// @ts-ignore
Dos(wrapper, JSDOS_OPTIONS)
	.run(gamePath)
	.then((ci: any) => {
		dosInterface = ci;
		ci.sendKeyEvent = (key: number, type: boolean) => {
			ci.addKey(key, type, Date.now() - ci.startedAt);
			requestAnimationFrame(() => {
				ci.addKey(key, false, Date.now() - ci.startedAt);
			});
		};
	});

const exportSave = async () => {
	if (dosInterface) {
		const changesBundle = await dosInterface.persist();
		await navigator.clipboard.writeText(changesBundle);
		alert('클립보드에 저장되었습니다.');
	}
};

const importSave = async () => {
	const bufferText = prompt('세이브 텍스트를 입력해주세요.');
	try {
		const saveBufferURL = URL.createObjectURL(
			new Blob([new Uint8Array(JSON.parse(`[${bufferText}]`)).buffer]),
		);
		wrapper.innerHTML = '';
		// @ts-ignore
		await Dos(wrapper, JSDOS_OPTIONS).run(gamePath, saveBufferURL);
	} catch (err) {}
};

document.getElementById('export-save').addEventListener('click', exportSave);
document.getElementById('import-save').addEventListener('click', importSave);

// ArrowUp = 265;
// ArrowDown = 264;
// ArrowLeft = 263;
// ArrowRight = 262;
// Enter = 257;
// Escape = 256;
