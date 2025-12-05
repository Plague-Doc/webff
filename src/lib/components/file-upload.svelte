<script lang="ts">
	import type { PageState } from '$lib/utils/utils';
	import { toast } from 'svelte-sonner';

	type Props = {
		pageState: PageState;
		uploadValidation: (files: File[]) => Promise<boolean>;
	};

	let { pageState = $bindable(), uploadValidation }: Props = $props();

	async function handleUpload(event: Event) {
		event.preventDefault();

		const input = event.target as HTMLInputElement;

		if (!input.files) {
			toast.error('Error while trying to upload files');
			return;
		}

		const inputFiles = Array.from(input.files);

		if (await uploadValidation(inputFiles)) {
			pageState.files = inputFiles.map((file) => ({ input: file, status: 'idle' }));
		}
	}
</script>

<label for="file_upload" class="underline-offset-4 hover:underline">Click to upload files</label>
<input onchange={handleUpload} id="file_upload" type="file" multiple class="hidden" />
