import toast from 'svelte-french-toast';

export function show_toast(message: string, type: 'success' | 'error') {
	toast[type](message, {
		position: 'top-right',
		style: `background: #1f2937; color: #fff; min-width: 200px;`
	});
}
