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

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((registration) => {
				console.log('SW registered: ', registration);
			})
			.catch((registrationError) => {
				console.log('SW registration failed: ', registrationError);
			});
	});
}
