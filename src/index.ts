import './js-dos/js-dos.js';
import './js-dos/js-dos.css';
import './index.scss';
import {
	DosPlayer,
	DosPlayerOptions,
} from '../node_modules/js-dos/dist/types/src/player';

const JSDOS_OPTIONS: DosPlayerOptions = {
	style: 'none',
};

const wrapper = document.getElementById('jsdos');
const dosPlayer: { value: DosPlayer } = { value: null };
const gamePath = require('./hwanse.jsdos');
let dosInterface: any;

// @ts-ignore
emulators.pathPrefix = 'js-dos/';

const runGame = async (saveBufferURL?: string) => {
	// @ts-ignore
	dosPlayer.value = Dos(wrapper, JSDOS_OPTIONS);
	dosPlayer.value.run(gamePath, saveBufferURL).then((ci: any) => {
		document.querySelector('.emulator-options').remove();
		dosInterface = ci;
		ci.sendKeyEvent = (key: number, type: boolean) => {
			ci.addKey(key, type, Date.now() - ci.startedAt);
			if (type) {
				requestAnimationFrame(() => {
					ci.addKey(key, false, Date.now() - ci.startedAt);
				});
			}
		};
	});
};

const exportSave = async () => {
	if (dosInterface) {
		const changesBundle = await dosInterface.persist();
		await navigator.clipboard.writeText(changesBundle);
		alert('세이브 데이터가 클립보드에 저장되었습니다.');
	}
};

const importSave = async () => {
	const bufferText = prompt('세이브 데이터를 입력해주세요.');
	try {
		const saveBufferURL = URL.createObjectURL(
			new Blob([new Uint8Array(JSON.parse(`[${bufferText}]`)).buffer]),
		);
		wrapper.innerHTML = '';
		// @ts-ignore
		await runGame(saveBufferURL);
	} catch (err) {}
};

const createSaveButton = () => {
	const button = document.createElement('button');
	Object.assign(button, {
		innerText: '세이브',
		style: 'top: 0; right: 0;',
	});
	button.addEventListener('click', () => {
		dosPlayer.value.layers.save();
	});
	return button;
};

const createExportSaveButton = () => {
	const button = document.createElement('button');
	Object.assign(button, {
		innerText: '내보내기',
		style: 'top: 20px; right: 0;',
	});
	button.addEventListener('click', exportSave);
	return button;
};

const createImportSaveButton = () => {
	const button = document.createElement('button');
	Object.assign(button, {
		innerText: '불러오기',
		style: 'top: 40px; right: 0;',
	});
	button.addEventListener('click', importSave);
	return button;
};

runGame();

document.body.append(
	createSaveButton(),
	createExportSaveButton(),
	createImportSaveButton(),
);

window.onbeforeunload = function () {
	return false;
};
