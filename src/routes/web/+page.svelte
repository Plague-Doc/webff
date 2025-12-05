<script lang="ts">
	import { FFmpeg } from '@ffmpeg/ffmpeg';
	import { fetchFile, toBlobURL } from '@ffmpeg/util';
	import { onMount } from 'svelte';

	let ffmpeg: FFmpeg;
	let fileList = $state<FileList>();
	let files = $derived(Array.from(fileList ?? []));

	const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';

	onMount(async () => {
		ffmpeg = new FFmpeg();

		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
			//workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
		});
		console.log('Loaded:', ffmpeg.loaded);
	});

	async function convert() {
		console.log('converting...');
		for (const file of files) {
			await ffmpeg.writeFile(file.name, await fetchFile(file));

			await ffmpeg.exec(['-i', file.name, 'out.webp']);

			const data = await ffmpeg.readFile('out.webp');

			console.log(data);
		}
	}
</script>

<input type="file" multiple bind:files={fileList} />
<button onclick={convert}>Convert</button>
