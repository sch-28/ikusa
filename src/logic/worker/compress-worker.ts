import LZString from 'lz-string';

export interface CompressManager extends PostMessage<string> {
	data: string;
	msg: 'compress_manager';
}

export interface ManagerCompressed extends PostMessage<string> {
	data: string;
	msg: 'manager_compressed';
}

export interface PostMessage<T> {
	msg: 'compress_manager' | 'manager_compressed';
	data: T;
}
onmessage = ({ data }: MessageEvent<CompressManager>) => {
	if (data.msg === 'compress_manager' && data.data) {
		const compressed_data = LZString.compress(data.data);
		const message: ManagerCompressed = {
			msg: 'manager_compressed',
			data: compressed_data
		};
		postMessage(message);
	}
};

export {};
