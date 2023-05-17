import { CommandInterface } from 'emulators';

export type DosInterface = Omit<CommandInterface, 'persist'> & {
	persist: () => Promise<string>;
	addKey: (key: number, type: boolean, time: number) => void;
	startedAt: number;
};
