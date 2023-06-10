<script lang="ts">
	import MdInsertDriveFile from 'svelte-icons/md/MdInsertDriveFile.svelte';
	import Icon from '../../../components/elements/icon.svelte';
	import IoIosShareAlt from 'svelte-icons/io/IoIosShareAlt.svelte';
</script>

<div>
	<p class="text-xl font-bold text-gold">Sharing a War</p>
	<p>
		Your wars are only saved locally in browser. To share a war with others, you can click the Share <Icon
			icon={IoIosShareAlt}
			class="inline-block"
		/> button. This will upload the war to Ikusa's servers and generate a link that you can share.
	</p>

	<div class="mt-8">
		Next: <a href="/docs/explanation-of-statistics" class="underline">Explanation of statistics</a>
	</div>
</div>
