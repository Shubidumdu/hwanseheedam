import './js-dos/js-dos.js';
import './js-dos/js-dos.css';
import './index.scss';
import {
	DosPlayer,
	DosPlayerOptions,
} from '../node_modules/js-dos/dist/types/src/player';

const saveSvg = require('./svg/save.svg');
const exportSvg = require('./svg/export.svg');
const importSvg = require('./svg/import.svg');

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
		document.querySelector('.emulator-options')?.remove();
		dosInterface = ci;
		let timerId: { value: ReturnType<typeof setInterval> } = { value: null };
		ci.sendKeyEvent = (key: number, type: boolean) => {
			if (
				'ontouchstart' in document.documentElement &&
				// only move keys
				key >= 262 &&
				key <= 265
			) {
				// in Mobile
				if (type) {
					if (!timerId.value) {
						timerId.value = setInterval(() => {
							ci.addKey(key, true, Date.now() - ci.startedAt);
							ci.addKey(key, false, Date.now() - ci.startedAt);
						}, 120);
					}
				} else {
					ci.addKey(key, false, Date.now() - ci.startedAt);
					clearInterval(timerId.value);
					timerId.value = null;
				}
			} else {
				// in Desktop
				ci.addKey(key, type, Date.now() - ci.startedAt);
				if (type) {
					requestAnimationFrame(() => {
						ci.addKey(key, false, Date.now() - ci.startedAt);
					});
				}
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
	if (!bufferText) return;
	try {
		const saveBufferURL = URL.createObjectURL(
			new Blob([new Uint8Array(JSON.parse(`[${bufferText}]`)).buffer]),
		);
		wrapper.innerHTML = '';
		dosPlayer.value.stop();
		await runGame(saveBufferURL);
	} catch (err) {}
};

const createButton = (innerHTML: string) => {
	const button = document.createElement('button');

	Object.assign(button, {
		className: 'emulator-button-touch-zone',
		innerHTML: `
			<div class="emulator-button" style="width: 24px; height: 24px;"></div>
			<div class="emulator-button-text">
				${innerHTML}
			</div>
		`,
	});
	return button;
};

const createSaveButton = () => {
	const button = createButton(`<img src="${saveSvg}"></svg>`);
	button.addEventListener('click', () => {
		dosPlayer.value.layers.save();
	});
	return button;
};

const createExportSaveButton = () => {
	const button = createButton(`<img src="${exportSvg}"></svg>`);
	button.addEventListener('click', exportSave);
	return button;
};

const createImportSaveButton = () => {
	const button = createButton(`<img src="${importSvg}"></svg>`);
	button.addEventListener('click', importSave);
	return button;
};

const createButtonContainer = () => {
	const container = document.createElement('div');
	container.className = 'button-container';
	container.append(
		createSaveButton(),
		createExportSaveButton(),
		createImportSaveButton(),
	);
	return container;
};

runGame();

document.body.append(createButtonContainer());

window.onbeforeunload = function () {
	return false;
};
