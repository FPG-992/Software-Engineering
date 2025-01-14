export function info(...args: unknown[]): void {
	console.log(...args);
}

export function error(...args: unknown[]): void {
	console.error(...args);
}

export default {
	info,
	error,
};