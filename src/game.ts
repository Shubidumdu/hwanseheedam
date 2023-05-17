import './js-dos/js-dos.js';
import './js-dos/js-dos.css';
import { DosPlayerOptions } from 'js-dos';
import state from './state';
import { DosInterface } from './types/dos.js';

const gamePath = require('./hwanse.jsdos');

window.emulators.pathPrefix = 'js-dos/';

const JSDOS_OPTIONS: DosPlayerOptions = {
	style: 'none',
};

export const wrapper = document.getElementById('jsdos');

let timerId: ReturnType<typeof setInterval> = null;

export const runGame = async (saveBufferURL?: string) => {
	state.dosPlayer = window.Dos(wrapper, JSDOS_OPTIONS);
	state.dosPlayer.run(gamePath, saveBufferURL).then((ci) => {
		document.querySelector('.emulator-options')?.remove();
		state.dosInterface = ci as unknown as DosInterface;
		const startedAt = state.dosInterface.startedAt;
		ci.sendKeyEvent = (key: number, type: boolean) => {
			if (
				'ontouchstart' in document.documentElement && // in Mobile
				key >= 262 && // and only move keys
				key <= 265
			) {
				if (type) {
					if (!timerId) {
						timerId = setInterval(() => {
							state.dosInterface.addKey(key, true, Date.now() - startedAt);
							state.dosInterface.addKey(key, false, Date.now() - startedAt);
						}, 120);
					}
				} else {
					state.dosInterface.addKey(key, false, Date.now() - startedAt);
					clearInterval(timerId);
					timerId = null;
				}
			} else {
				state.dosInterface.addKey(key, type, Date.now() - startedAt);
				if (type) {
					requestAnimationFrame(() => {
						state.dosInterface.addKey(key, false, Date.now() - startedAt);
					});
				}
			}
		};
	});
};
