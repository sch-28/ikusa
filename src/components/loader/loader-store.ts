import { get, writable } from 'svelte/store';

export type Loader = {
	visible: boolean;
	/* state?: LoadingState; */
	text?: string;
	progress?: number;
};

const CurrentLoader = writable<Loader>({ visible: false });

export abstract class LoaderManager {
	static set_status(text: string, progress?: number) {
		CurrentLoader.update((s) => ({ ...s, text, progress }));
	}

	static close() {
		CurrentLoader.set({ visible: false });
	}

	static open() {
		CurrentLoader.update((s) => ({ ...s, visible: true }));
	}

	static get store() {
		return CurrentLoader;
	}
}
