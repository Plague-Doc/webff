import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

class Converter {
	public ffmpeg?: FFmpeg;
	public progress = $state(0);

	async load() {
		if (this.ffmpeg) this.ffmpeg.terminate();
		else this.ffmpeg = new FFmpeg();

		const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm';
		// const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';

		await this.ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
		});

		this.progress = 0;
		this.ffmpeg.on('progress', (event) => {
			const rawProgress = event.progress * 100;
			this.progress = Math.min(100, Math.max(0, rawProgress));
		});

		console.log('FFmpeg loaded:', this.ffmpeg.loaded);
	}

	async transcode(file: File, args: string[], outName: string) {
		if (!this.ffmpeg) return;

		await this.ffmpeg.writeFile(file.name, await fetchFile(file));
		await this.ffmpeg.exec(['-i', file.name, ...args, outName]);

		const data = await this.ffmpeg.readFile(outName);
		const fileData = typeof data === 'string' ? data : (data as ArrayBufferView<ArrayBuffer>);

		return new File([new Blob([fileData])], outName);
	}
}

export const ffcore = new Converter();
