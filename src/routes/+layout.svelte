<script lang="ts">
	import '../app.css';
	import Header from '../components/header.svelte';
	import { ModalManager } from '../components/modal/modal-store';
	import Modal from '../components/modal/modal.svelte';
	import Upload from '../components/modal/modals/upload.svelte';
	import { Toaster } from 'svelte-french-toast';

	ModalManager.open(Upload);
</script>

<div class="px-4 max-w-7xl mx-auto">
	<Header />
	<div class="mt-16">
		<slot />
	</div>
</div>
<Modal />
<Toaster />
