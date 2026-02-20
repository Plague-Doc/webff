import { ffcore } from '$lib/utils/ffcore.svelte';
import { getFileBaseName, type FileState } from '$lib/utils/utils';
import { toast } from 'svelte-sonner';

const baseType = (file: FileState) => file.input.type.split('/')[0];

export function isUploadValid(files: FileState[]): boolean {
	// 5e8 => 5*10^8 bytes => 500MB limit per file
	if (!files.every((file) => file.input.size < 5e8)) {
		toast.error('Each uploaded file must be under 500MB');
		return false;
	}

	if (!files.every((file) => baseType(file) === 'image' || baseType(file) === 'video')) {
		toast.error('Only image and video formats are supported');
		return false;
	}

	return true;
}

const webpOptions = ['-c:v', 'libwebp', '-lossless', '1'];
const webmOptions = [
	'-c:v',
	'libvpx',
	'-qmin',
	'4',
	'-qmax',
	'40',
	'-cpu-used',
	'5',
	'-deadline',
	'realtime',
	'-c:a',
	'libvorbis',
	'-q:a',
	'4'
];

export async function convert(files: FileState[]): Promise<void> {
	for (const file of files) {
		try {
			file.status = 'converting';
			if (baseType(file) === 'image') {
				const outputName = getFileBaseName(file.input) + '.webp';
				file.output = await ffcore.transcode(file.input, webpOptions, outputName);
			} else {
				const outputName = getFileBaseName(file.input) + '.webm';
				file.output = await ffcore.transcode(file.input, webmOptions, outputName);
			}
			file.status = 'done';
		} catch (error) {
			file.status = 'error';
			await ffcore.load();
		}
	}
}
