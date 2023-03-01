<script lang="ts">
	import LoadingCircle from '../elements/loading-circle.svelte';
	import { LoaderManager, type Loader } from './loader-store';

	let loader: Loader;
	LoaderManager.store.subscribe((new_loader) => {
		loader = new_loader;
		/* loader.loading = true;
		if (loader.loading) {
			loader.state = 'relations';
			loader.progress = 50;
		} */
	});
</script>

{#if loader && loader.visible}
	<div
		class="z-[51] fixed top-0 left-0 w-screen h-screen flex flex-col justify-center bg-black bg-opacity-90"
	>
		<div class="relative m-2 max-h-full">
			<div class="relative w-fit max-w-full max-h-full my-2 mx-auto ">
				<div class="relative p-4 overflow-auto">
					<div class="flex flex-col items-center justify-center gap-2">
						<div
							class="w-12 h-12 [&_svg]:!fill-blue-500 [&_svg]:!text-gray-300 [&_svg]:dark:!text-dark-muted"
						>
							<LoadingCircle />
						</div>
						<div class="w-80 items-center">
							<div
								class="h-2 bg-gray-300 dark:bg-dark-muted rounded-full overflow-hidden relative transition-all duration-300"
							>
								<div
									class="bg-blue-500 dark:bg-blue-500 h-full transition-all duration-300"
									style="width: {loader.progress ? loader.progress : 0}%;"
								/>
							</div>
						</div>
						<div class="text-xl font-bold text-light ">
							{loader.text}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
