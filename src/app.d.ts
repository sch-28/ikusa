// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type Component from './components/table/component.svelte';
import { User } from './logic/user';
declare global {
	declare module 'svelte-icons/*' {
		export default {} as Component;
	}
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
