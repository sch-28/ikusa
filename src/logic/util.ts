import type { Action } from 'svelte/types/runtime/action';
import toast from 'svelte-french-toast';
import generateUniqueId from 'generate-unique-id';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export function show_toast(message: string, type: 'success' | 'error') {
	toast[type](message, {
		position: 'top-right',
		style: `background: #f5cd40; color: #00000; min-width: 200px;`
	});
}

export function redirect_and_toast(
	destination: string,
	message: string,
	type: 'success' | 'error' = 'error'
) {
	show_toast(message, type);
	goto(destination, { replaceState: true });
}

export async function sleep(ms?: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copy_to_clipboard(text: string) {
	try {
		navigator.clipboard.writeText(text);
		show_toast('Copied to clipboard!', 'success');
	} catch (e) {
		show_toast('Error while copying to clipboard!', 'error');
		console.log(e);
	}
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
	if (!browser || typeof document === 'undefined') return;
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

export function table_format(number: number, places = 2) {
	return {
		label: isNaN(number) ? '-' : format(number, places),
		value: isNaN(number) ? -0.01 : number
	};
}

export function get_remaining_height(el: HTMLElement, margin = 0) {
	if (!el) return 0;
	const { top } = el.getBoundingClientRect();
	const { innerHeight } = window;
	return innerHeight - top - margin;
}

export function generate_id() {
	return generateUniqueId() as string;
}

export function debounce<T>(func: (...args: T[]) => void, timeout = 300) {
	let timer: NodeJS.Timeout;
	return (...args: T[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, timeout);
	};
}
