import './js-dos/js-dos.js';
import './js-dos/js-dos.css';
import './index.scss';
import { DosPlayer, DosPlayerOptions } from './js-dos/types/src/player';
import { DosInterface } from './types/dos';

const saveSvg = require('./svg/save.svg');
const exportSvg = require('./svg/export.svg');
const importSvg = require('./svg/import.svg');

const JSDOS_OPTIONS: DosPlayerOptions = {
	style: 'none',
};

const wrapper = document.getElementById('jsdos');
const dosPlayer: { value: DosPlayer } = { value: null };
const dosInterface: { value: DosInterface } = { value: null };
const gamePath = require('./hwanse.jsdos');

window.emulators.pathPrefix = 'js-dos/';

const runGame = async (saveBufferURL?: string) => {
	dosPlayer.value = window.Dos(wrapper, JSDOS_OPTIONS);
	dosPlayer.value.run(gamePath, saveBufferURL).then((ci) => {
		document.querySelector('.emulator-options')?.remove();
		dosInterface.value = ci as unknown as DosInterface;
		let timerId: { value: ReturnType<typeof setInterval> } = { value: null };
		ci.sendKeyEvent = (key: number, type: boolean) => {
			if (
				'ontouchstart' in document.documentElement && // in Mobile
				key >= 262 && // and only move keys
				key <= 265
			) {
				if (type) {
					if (!timerId.value) {
						timerId.value = setInterval(() => {
							dosInterface.value.addKey(
								key,
								true,
								Date.now() - dosInterface.value.startedAt,
							);
							dosInterface.value.addKey(
								key,
								false,
								Date.now() - dosInterface.value.startedAt,
							);
						}, 120);
					}
				} else {
					dosInterface.value.addKey(
						key,
						false,
						Date.now() - dosInterface.value.startedAt,
					);
					clearInterval(timerId.value);
					timerId.value = null;
				}
			} else {
				dosInterface.value.addKey(
					key,
					type,
					Date.now() - dosInterface.value.startedAt,
				);
				if (type) {
					requestAnimationFrame(() => {
						dosInterface.value.addKey(
							key,
							false,
							Date.now() - dosInterface.value.startedAt,
						);
					});
				}
			}
		};
	});
};

const exportSave = async () => {
	if (dosInterface.value) {
		const changesBundle = await dosInterface.value.persist();
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
