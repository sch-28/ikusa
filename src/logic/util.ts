import type { Action } from 'svelte/types/runtime/action';
import toast from 'svelte-french-toast';

export function show_toast(message: string, type: 'success' | 'error') {
	toast[type](message, {
		position: 'top-right',
		style: `background: #1f2937; color: #fff; min-width: 200px;`
	});
}


export async function sleep(ms?: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const click_outside: Action = (node) => {
	const handle_click = (event: MouseEvent) =>
		node &&
		!node.contains(event.target as HTMLElement) &&
		!event.defaultPrevented &&
		node.dispatchEvent(new CustomEvent('click_outside', node as any));

	document.addEventListener('click', handle_click, true);

	return {
		destroy() {
			document.removeEventListener('click', handle_click, true);
		}
	};
};