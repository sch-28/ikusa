// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Component } from './components/modal/modal-store';
import { User } from './logic/user';
declare global {
	declare module 'svelte-icons/*' {
		export default {} as Component;
	}
	namespace App {
		interface Locals {
			user: User | undefined;
		}
	}
	declare namespace svelte.JSX {
		interface HTMLProps<T> {
			onclick_outside?: (e: CustomEvent) => void;
		}
	}
}

export {};
