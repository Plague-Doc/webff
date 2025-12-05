import { ffcore } from '$lib/utils/ffcore.svelte';
import { type FileState, getFileBaseName } from '$lib/utils/utils';
import { getFormats } from './formats';

export async function convert(files: FileState[], targetLabel: string): Promise<void> {
	const targetFormat = getFormats(files).find((format) => format.label === targetLabel)!;
	for (const file of files) {
		try {
			file.status = 'converting';
			const outputName = getFileBaseName(file.input) + targetFormat.extension;
			file.output = await ffcore.transcode(file.input, targetFormat.options, outputName);
			file.status = 'done';
		} catch (error) {
			file.status = 'error';
			await ffcore.load();
		}
	}
}
