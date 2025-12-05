import type { FileState } from '$lib/utils/utils';

type Format = {
	label: string;
	extension: string;
	options: string[];
};

const formats: Record<string, Format[]> = {
	video: [
		{ label: 'MP4', extension: '.mp4', options: ['-c:v', 'libx264', '-crf', '18', '-c:a', 'aac'] },
		{ label: 'MKV', extension: '.mkv', options: ['-c:v', 'libx264', '-crf', '18', '-c:a', 'aac'] },
		{ label: 'AVI', extension: '.avi', options: ['-c:v', 'mpeg4', '-q:v', '2', '-c:a', 'aac'] },
		{ label: 'MOV', extension: '.mov', options: ['-c:v', 'libx264', '-crf', '18', '-c:a', 'aac'] },
		{ label: 'WMV', extension: '.wmv', options: ['-c:v', 'mpeg4', '-q:v', '2', '-c:a', 'aac'] }
	],
	image: [
		{ label: 'PNG', extension: '.png', options: [] },
		{ label: 'JPEG', extension: '.jpeg', options: ['-q:v', '2'] },
		{ label: 'GIF', extension: '.gif', options: [] },
		{ label: 'WEBP', extension: '.webp', options: ['-c:v', 'libwebp', '-lossless', '1'] },
		{ label: 'BMP', extension: '.bmp', options: [] },
		{ label: 'TIFF', extension: '.tiff', options: [] }
	],
	audio: [
		{ label: 'MP3', extension: '.mp3', options: ['-c:a', 'libmp3lame', '-q:a', '2'] },
		{ label: 'WAV', extension: '.wav', options: [] },
		{ label: 'OGG', extension: '.ogg', options: ['-c:a', 'libvorbis', '-q:a', '2'] },
		{ label: 'FLAC', extension: '.flac', options: [] }
	]
};

export function getFormats(files: FileState[]): Format[] {
	const category = files[0].input.type.split('/')[0];
	return formats[category] ?? [];
}
