import { DosPlayer, DosPlayerOptions } from '../js-dos/types/src/player';

declare global {
	interface Window {
		emulators: {
			pathPrefix: string;
			version: string;
			wasmModulesPromise: Promise<any>;
			wdosboxJs: string;
		};
		Dos: (root: HTMLElement, options?: DosPlayerOptions) => DosPlayer;
	}
}

export {};
