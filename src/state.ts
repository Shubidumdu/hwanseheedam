import { DosPlayer } from 'js-dos';
import { DosInterface } from './types/dos';

type State = {
	dosPlayer: DosPlayer | null;
	dosInterface: DosInterface | null;
};

const state: State = {
	dosPlayer: null,
	dosInterface: null,
};

export default state;
