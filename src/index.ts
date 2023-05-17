import './index.scss';
import { runGame } from './game';
import { createCustomButtons } from './ui';

const buttonContainer = createCustomButtons();
document.body.append(buttonContainer);

runGame();

window.addEventListener('beforeunload', (e) => {
	e.preventDefault();
	e.returnValue = '';
});
