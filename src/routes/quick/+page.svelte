<script lang="ts">
	import ConversionProgress from '$lib/components/conversion-progress.svelte';
	import FileUpload from '$lib/components/file-upload.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { ffcore } from '$lib/utils/ffcore.svelte';
	import { type PageState } from '$lib/utils/utils';
	import { convert } from './(utils)/convert';
	import { getFormats } from './(utils)/formats';
	import { uploadValidation } from './(utils)/validation';

	let pageState = $state<PageState>({
		files: [],
		status: 'idle'
	});

	let targetLabel = $state('');

	$effect(() => {
		if (pageState.files.length && targetLabel && pageState.status === 'idle') {
			pageState.status = 'converting';
			convert(pageState.files, targetLabel).then(() => {
				if (pageState.files.length && targetLabel) pageState.status = 'done';
			});
		}
	});

	async function reset() {
		pageState.files = [];
		pageState.status = 'idle';
		targetLabel = '';
		await ffcore.load();
	}
</script>

<section class="pt-6 md:pt-12">
	<h1 class="pb-2 text-center text-4xl font-semibold">Quick Convert</h1>
	<h2 class="text-center text-lg text-muted-foreground">
		Easily convert your video, image, or audio files to the format of your choice.
	</h2>
</section>

{#if !targetLabel}
	<section class="flex justify-center pt-12">
		<FileUpload bind:pageState {uploadValidation} />

		<Dialog.Root open={pageState.files.length > 0} onOpenChange={reset}>
			<Dialog.Content onOpenAutoFocus={(e) => e.preventDefault()}>
				<Dialog.Header>
					<Dialog.Title>Select format</Dialog.Title>
					<Dialog.Description>Select the format you want your files to be converted into.</Dialog.Description>
				</Dialog.Header>

				<div class="flex items-center justify-center pt-4 sm:justify-between sm:gap-8">
					<div class="hidden min-w-fit font-semibold sm:block">Convert into</div>

					<Select.Root type="single" bind:value={targetLabel}>
						<Select.Trigger class="w-full max-w-64 sm:max-w-full">Select format</Select.Trigger>
						<Select.Content>
							{#each getFormats(pageState.files) as format}
								<Select.Item value={format.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	</section>
{:else}
	<section class="flex justify-center pt-12">
		<ConversionProgress {pageState} {reset} />
	</section>
{/if}
