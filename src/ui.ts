import { exportSaveBuffer, importSaveBuffer, saveIndexedDB } from './save';

const saveSvg = require('./svg/save.svg');
const exportSvg = require('./svg/export.svg');
const importSvg = require('./svg/import.svg');

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

const createSvgButton = (src: string, onClick: () => void) => {
	const button = createButton(`<img src="${src}"></img>`);
	button.addEventListener('click', () => {
		onClick();
	});
	return button;
};

export const createCustomButtons = () => {
	const container = document.createElement('div');
	container.className = 'button-container';
	const saveButton = createSvgButton(saveSvg, saveIndexedDB);
	const exportSaveButton = createSvgButton(exportSvg, exportSaveBuffer);
	const importSaveButton = createSvgButton(importSvg, importSaveBuffer);
	container.append(saveButton, exportSaveButton, importSaveButton);
	return container;
};
