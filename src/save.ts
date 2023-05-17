import { runGame, wrapper } from './game';
import state from './state';

export const saveIndexedDB = () => {
	state.dosPlayer?.layers.save();
};

export const exportSaveBuffer = async () => {
	if (state.dosInterface) {
		const changesBundle = await state.dosInterface.persist();
		await navigator.clipboard.writeText(changesBundle);
		alert('세이브 데이터가 클립보드에 저장되었습니다.');
	}
};

export const importSaveBuffer = async () => {
	const bufferText = prompt('세이브 데이터를 입력해주세요.');
	if (!bufferText) return;
	try {
		const saveBufferURL = URL.createObjectURL(
			new Blob([new Uint8Array(JSON.parse(`[${bufferText}]`)).buffer]),
		);
		wrapper.innerHTML = '';
		state.dosPlayer.stop();
		await runGame(saveBufferURL);
	} catch (err) {
		alert('세이브 데이터가 올바르지 않습니다.');
	}
};
