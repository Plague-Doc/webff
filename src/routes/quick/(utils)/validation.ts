import { toast } from 'svelte-sonner';

export async function uploadValidation(files: File[]): Promise<boolean> {
	// 2e9 => 2*10^9 bytes => 2 GB limit per file
	if (!files.every((file) => file.size < 2e9)) {
		toast.error('Each uploaded file must be under 2.00GB');
		return false;
	}

	const baseType = files[0].type.split('/')[0];

	if (!files.every((file) => file.type.split('/')[0] === baseType)) {
		toast.error('All uploaded files must share the same media type');
		return false;
	}

	if (baseType !== 'image' && baseType !== 'video' && baseType !== 'audio') {
		toast.error('Uploaded file media type is not supported');
		return false;
	}

	return true;
}
