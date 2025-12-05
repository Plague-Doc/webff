<script lang="ts">
	import * as Item from '$lib/components/ui/item';
	import { ffcore } from '$lib/utils/ffcore.svelte';
	import type { PageState } from '$lib/utils/utils';
	import { Check, Download, X } from '@lucide/svelte';
	import pkg from 'file-saver';
	import JSZip from 'jszip';
	import { toast } from 'svelte-sonner';
	import { Button } from './ui/button';
	import Progress from './ui/progress/progress.svelte';
	import { Spinner } from './ui/spinner';

	type Props = {
		pageState: PageState;
		reset: () => void;
	};

	const { saveAs } = pkg;

	const { pageState, reset }: Props = $props();

	const convertingCount = $derived(
		pageState.files.reduce((count, file) => (file.status !== 'idle' ? count + 1 : count), 0)
	);

	let downloading = $state(false);

	async function download() {
		downloading = true;

		const convertedFiles = pageState.files.map((file) => file.output).filter((file) => file !== undefined);

		if (convertedFiles.length === 0) {
			toast.error('Failed to convert files.');
		} else if (convertedFiles.length === 1) {
			saveAs(convertedFiles[0], convertedFiles[0].name);
		} else {
			const zip = new JSZip();
			convertedFiles.forEach((file) => zip.file(file.name, file));
			const zippedFiles = await zip.generateAsync({ type: 'blob' });
			saveAs(zippedFiles, 'converted-files.zip');
		}

		downloading = false;
	}
</script>

<Item.Root variant="muted" class="w-full max-w-md">
	<Item.Media>
		{#if pageState.status !== 'done'}
			<Spinner class="size-5" />
		{:else}
			<Check class="size-5" />
		{/if}
	</Item.Media>

	<Item.Content>
		<Item.Title class="line-clamp-1">
			{#if pageState.status !== 'done'}
				<span>Converting files...</span>
			{:else}
				<span>Conversion finished</span>
			{/if}
		</Item.Title>
	</Item.Content>

	{#if pageState.status !== 'done'}
		<Item.Content>
			<Item.Title class="text-muted-foreground tabular-nums">
				{convertingCount} / {pageState.files.length}
			</Item.Title>
		</Item.Content>
	{/if}

	<Item.Actions>
		{#if pageState.status !== 'done'}
			<Button onclick={reset} variant="outline">
				<X /> Cancel
			</Button>
		{:else}
			<Button onclick={download} disabled={downloading}>
				{#if downloading}
					<Spinner />
				{:else}
					<Download />
				{/if}
				Download files
			</Button>
		{/if}
	</Item.Actions>

	{#if pageState.status !== 'done'}
		<Item.Footer class="pt-2">
			<Progress value={ffcore.progress === 100 ? 0 : ffcore.progress} />
		</Item.Footer>
	{/if}
</Item.Root>
