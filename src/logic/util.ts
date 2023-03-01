import type { Action } from 'svelte/types/runtime/action';
import toast from 'svelte-french-toast';
import { browser } from '$app/environment';

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

function measure_scrollbar() {
	if (!browser) return;
	const div = document.createElement('div');
	div.style.width = '100px';
	div.style.height = '100px';
	div.style.overflow = 'scroll';
	div.style.position = 'absolute';
	div.style.top = '-9999px';
	document.body.appendChild(div);
	const scrollbarWidth = div.offsetWidth - div.clientWidth;
	document.body.removeChild(div);
	return scrollbarWidth;
}

export const scrollbar_width = measure_scrollbar();

export function format(number: number, places = 2) {
	return +number?.toFixed(places);
}
