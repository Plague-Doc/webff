import { ffcore } from '$lib/utils/ffcore.svelte';
import { getFileBaseName, type FileState } from '$lib/utils/utils';
import { toast } from 'svelte-sonner';

// Formats

type Format = {
	label: string;
	extension: string;
	options: string[];
};

const formats: Record<string, Format[]> = {
	video: [
		{
			label: 'MP4',
			extension: '.mp4',
			options: ['-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-b:a', '192k']
		},
		{
			label: 'MOV',
			extension: '.mov',
			options: ['-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-b:a', '192k']
		},
		{
			label: 'WEBM',
			extension: '.webm',
			options: [
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
			]
		},
		{
			label: 'MKV',
			extension: '.mkv',
			options: ['-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-b:a', '192k']
		},
		{
			label: 'AVI',
			extension: '.avi',
			options: ['-c:v', 'mpeg4', '-q:v', '5', '-c:a', 'aac', '-b:a', '192k']
		},
		{
			label: 'WMV',
			extension: '.wmv',
			options: ['-c:v', 'mpeg4', '-q:v', '5', '-c:a', 'aac', '-b:a', '192k']
		}
	],
	image: [
		{ label: 'JPEG', extension: '.jpeg', options: ['-q:v', '2'] },
		{ label: 'PNG', extension: '.png', options: [] },
		{ label: 'WEBP', extension: '.webp', options: ['-c:v', 'libwebp', '-lossless', '1'] },
		{ label: 'GIF', extension: '.gif', options: [] },
		{ label: 'TIFF', extension: '.tiff', options: [] },
		{ label: 'BMP', extension: '.bmp', options: [] }
	],
	audio: [
		{ label: 'MP3', extension: '.mp3', options: ['-c:a', 'libmp3lame', '-q:a', '2'] },
		{ label: 'WAV', extension: '.wav', options: [] },
		{ label: 'FLAC', extension: '.flac', options: [] },
		{ label: 'OGG', extension: '.ogg', options: ['-c:a', 'libvorbis', '-q:a', '4'] }
	]
};

export function getFormats(files: FileState[]): Format[] {
	if (!files.length) return [];
	const category = files[0].input.type.split('/')[0];
	return formats[category] ?? [];
}

// Validation

export function isUploadValid(files: FileState[]): boolean {
	// 2e9 => 2*10^9 bytes => 2 GB limit per file
	if (!files.every((file) => file.input.size < 2e9)) {
		toast.error('Each uploaded file must be under 2.00GB');
		return false;
	}

	const baseType = files[0].input.type.split('/')[0];

	if (!files.every((file) => file.input.type.split('/')[0] === baseType)) {
		toast.error('All uploaded files must share the same media type');
		return false;
	}

	if (baseType !== 'image' && baseType !== 'video' && baseType !== 'audio') {
		toast.error('Uploaded file media type is not supported');
		return false;
	}

	return true;
}

// Conversion

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
