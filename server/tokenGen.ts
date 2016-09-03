export default function() {
	let count = 6;
	let token: string = '';
	for (; count--;) {
		token += Math.floor(Math.random() * (1 << 24)).toString(16);
	}
	return token;
};