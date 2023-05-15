import './js-dos/js-dos.js';
import './js-dos/js-dos.css';
import './index.scss';
import { DosPlayerOptions } from '../node_modules/js-dos/dist/types/src/player';

const JSDOS_OPTIONS: DosPlayerOptions = {
	style: 'hidden',
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
	});

const exportSave = async () => {
	// const openRequest = indexedDB.open('js-dos-cache (emulators-ui-saves)', 1);
	// openRequest.onsuccess = async () => {
	// 	let db = openRequest.result;
	// 	const transaction = db.transaction('files', 'readonly');
	// 	const fileStore = transaction.objectStore('files');
	// 	const files = fileStore.getAll();
	// 	files.onsuccess = async () => {
	// 		const [saveBufferArray] = files.result;
	// 		const stringified = JSON.stringify([...new Int8Array(saveBufferArray)]);
	// 		await navigator.clipboard.writeText(stringified);
	// 		alert('클립보드에 저장되었습니다.');
	// 		db.close();
	// 	};
	// };
	// console.log(ci);
	if (dosInterface) {
		const changesBundle = await dosInterface.persist();
		await navigator.clipboard.writeText(changesBundle);
		alert('클립보드에 저장되었습니다.');
	}
};

const importSave = async () => {
	const bufferText = prompt('세이브 텍스트를 입력해주세요.');
	try {
		const saveBufferURL = URL.createObjectURL(new Blob([bufferText]));
		// @ts-ignore
		// await Dos(wrapper, JSDOS_OPTIONS).run(gamePath, );
	} catch (err) {}
};

document.getElementById('export-save').addEventListener('click', exportSave);
document.getElementById('import-save').addEventListener('click', importSave);
