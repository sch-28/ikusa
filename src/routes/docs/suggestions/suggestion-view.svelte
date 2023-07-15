<script lang="ts">
	import { ModalManager } from '../../../components/modal/modal-store';
	import type { Suggestion } from '@prisma/client';

	function close() {
		ModalManager.close();
	}



	export let suggestion: Suggestion;
</script>

<div class="flex flex-col w-80 text-left">
	<div class="flex justify-between items-center text-center mb-4">
		<h1 class="text-lg font-bold flex items-baseline">{suggestion.title}</h1>
        <span class="text-gold">{suggestion.status}</span>
		
	</div>
	<div>
		<p class="text-sm whitespace-break-spaces">{suggestion.content}</p>
	</div>
</div>
