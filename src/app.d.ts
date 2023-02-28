// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	declare namespace svelte.JSX {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface HTMLProps<T> {
			onclick_outside?: (e: CustomEvent) => void;
		}
	}
}

export {};
