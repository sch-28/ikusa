<script lang="ts">
	import Icon from '../../components/elements/icon.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import { ModalManager } from '../../components/modal/modal-store';
	import WarForm from '../../components/modal/modals/war-form.svelte';
	import { Manager } from '../../logic/stores';
	import WarList from '../../components/war-list.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="flex justify-between mb-4">
	<p>All Wars</p>
	<p>{$Manager.wars.length} Wars</p>
</div>

<div class="flex flex-col">
	<WarList editable wars={$Manager.wars} on_click={(war) => goto(`wars/${war.id}`)} />
</div>
