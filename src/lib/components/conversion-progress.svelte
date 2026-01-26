<script lang="ts">
	import * as Item from '$lib/components/ui/item';
	import { ffcore } from '$lib/utils/ffcore.svelte';
	import type { FileState } from '$lib/utils/utils';
	import { Check, Download, X } from '@lucide/svelte';
	import pkg from 'file-saver';
	import JSZip from 'jszip';
	import { toast } from 'svelte-sonner';
	import { Button } from './ui/button';
	import Progress from './ui/progress/progress.svelte';
	import { Spinner } from './ui/spinner';
	const { saveAs } = pkg;

	type Props = {
		files: FileState[];
		reset: () => void;
	};

	const { files, reset }: Props = $props();

	const isConverting = $derived(
		!files.every((file) => file.status === 'idle') &&
			!files.every((file) => file.status === 'done' || file.status === 'error')
	);

	const convertingCount = $derived(files.reduce((count, file) => (file.status !== 'idle' ? count + 1 : count), 0));

	let isDownloading = $state(false);

	async function download() {
		isDownloading = true;

		const convertedFiles = files.map((file) => file.output).filter((file) => file !== undefined);

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

		isDownloading = false;
	}
</script>

<Item.Root variant="muted" class="w-full max-w-lg">
	<Item.Media>
		{#if isConverting}
			<Spinner class="size-5" />
		{:else}
			<Check class="size-5" />
		{/if}
	</Item.Media>

	<Item.Content>
		<Item.Title class="line-clamp-1">
			{#if isConverting}
				<span class="hidden sm:block">Converting files...</span>
				<span class="block sm:hidden">Converting...</span>
			{:else}
				<span class="hidden sm:block">Conversion finished</span>
				<span class="block sm:hidden">Finished</span>
			{/if}
		</Item.Title>
	</Item.Content>

	{#if isConverting}
		<Item.Content>
			<Item.Title class="text-muted-foreground tabular-nums">
				{convertingCount} / {files.length}
			</Item.Title>
		</Item.Content>
	{/if}

	<Item.Actions>
		{#if isConverting}
			<Button onclick={reset} variant="outline">
				<X /> Cancel
			</Button>
		{:else}
			<Button onclick={download} disabled={isDownloading}>
				{#if isDownloading}
					<Spinner />
				{:else}
					<Download />
				{/if}
				Download files
			</Button>
		{/if}
	</Item.Actions>

	{#if isConverting}
		<Item.Footer class="pt-2">
			<Progress value={ffcore.progress === 100 ? 0 : ffcore.progress} />
		</Item.Footer>
	{/if}
</Item.Root>
