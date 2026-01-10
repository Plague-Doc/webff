<script lang="ts">
	import { ffcore } from '$lib/utils/ffcore.svelte';
	import type { PageState } from '$lib/utils/utils';
	import { LoaderCircle, Upload } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		pageState: PageState;
		uploadValidation: (files: File[]) => Promise<boolean>;
	};

	let { pageState = $bindable(), uploadValidation }: Props = $props();
	let isDragged = $state(false);

	async function handleUpload(fileList: FileList | null) {
		if (!fileList) {
			toast.error('Error while trying to upload files');
			return;
		}

		const files = Array.from(fileList);

		if (await uploadValidation(files)) {
			pageState.files = files.map((file) => ({ input: file, status: 'idle' }));
		}
	}

	async function handleChange(event: Event) {
		event.preventDefault();
		isDragged = false;
		await handleUpload((event.target as HTMLInputElement).files);
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragged = false;
		if (event.dataTransfer?.files) {
			await handleUpload(event.dataTransfer.files);
		}
	}

	async function handleDragover(event: DragEvent) {
		event.preventDefault();
		isDragged = true;
	}
</script>

{#if !ffcore.loaded}
	<div
		class="'z-40 flex h-90 w-full max-w-3xl flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground select-none hover:cursor-not-allowed hover:border-foreground">
		<LoaderCircle class="size-8 animate-spin text-muted-foreground" />
		<div class="py-4 font-medium text-muted-foreground">Loading FFmpeg...</div>
	</div>
{:else}
	<label
		ondrop={handleDrop}
		ondragover={handleDragover}
		ondragleave={() => (isDragged = false)}
		for="file_upload"
		class={[
			'z-40 flex h-90 w-full max-w-3xl flex-col items-center justify-center rounded-lg border border-dashed select-none hover:border-foreground',
			isDragged ? 'border-foreground' : 'border-muted-foreground'
		]}>
		<Upload class="size-8 text-muted-foreground" />
		<div class="py-4 text-lg font-medium">Upload Files</div>
		<div class="text-sm text-muted-foreground">Drag and drop or click to upload</div>
		<div class="text-sm text-muted-foreground">Accepts files up to 2.00GB in size.</div>
	</label>

	<input onchange={handleChange} id="file_upload" type="file" multiple class="hidden" />
{/if}
