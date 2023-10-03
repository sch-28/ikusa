<script lang="ts">
	import Button from '../elements/button.svelte';
	import LoadingCircle from '../elements/loading-circle.svelte';
	import { LoaderManager, type Loader } from './loader-store';

	let loader: Loader;
	LoaderManager.store.subscribe((new_loader) => {
		loader = new_loader;
	});
</script>

{#if loader && loader.visible}
	<div
		class="z-[51] fixed top-0 left-0 w-screen h-screen flex flex-col justify-center bg-background bg-opacity-90"
	>
		<div class="relative m-2 max-h-full">
			<div class="relative w-fit max-w-full max-h-full my-2 mx-auto">
				<div class="relative p-4 overflow-auto">
					<div class="flex flex-col items-center justify-center gap-2">
						<div
							class="w-12 h-12 [&_svg]:!fill-gold [&_svg]:!text-gold-800 [&_svg]:dark:!text-dark-muted"
						>
							<LoadingCircle />
						</div>
						<div class="w-80 items-center">
							<div
								class="h-2 bg-gold-800 dark:bg-dark-muted rounded-full overflow-hidden relative transition-all duration-300"
							>
								<div
									class="bg-gold dark:bg-gold h-full transition-all duration-300"
									style="width: {loader.progress ? loader.progress : 0}%;"
								/>
							</div>
						</div>
						<div class="text-xl font-bold text-light">
							{loader.text}
						</div>
						{#if loader.cancel}
							<Button
								class="w-40"
								on:click={() => {
									loader.cancel?.();
								}}
							>
								Cancel
							</Button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
