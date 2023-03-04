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
	import Button from '../../components/elements/button.svelte';
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';

</script>

<div class="flex justify-between mb-4">
	<p>All Wars</p>
	<p>{$Manager.wars.length} Wars</p>
</div>

<div class="flex flex-col">
	<WarList editable wars={$Manager.wars} on_click={(war) => goto(`wars/${war.id}`)} />
</div>
<Button class="mx-auto mt-2" on:click={() => ModalManager.open(WarForm,{war: undefined})}>
	<Icon icon={MdAdd} />
	Add War
</Button>
