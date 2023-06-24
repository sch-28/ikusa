// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { User } from './logic/user';
declare global {
	declare module 'svelte-icons/*' {}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			user: User | undefined;
		}
	}
	declare namespace svelte.JSX {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface HTMLProps<T> {
			onclick_outside?: (e: CustomEvent) => void;
		}
	}
}

export {};
