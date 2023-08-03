//import { JSEncrypt } from 'jsencrypt'

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDx9ewTQLP28xCvJBZIeYtrDksK
aG1hl34ZvhSfLmFgalDXz3PCiU5qnU7xaq9LzCbL2QerozFSm+vHsVq5ISYVMRvB
qt+SIKi2P+gpeHoZvuf1tt51pJpTt00pI48wMbbNuuhChW3K4dv6YAUalhXdw24L
CvKXrAVN583hJ/yYfQIDAQAB
-----END PUBLIC KEY-----
`;

//const rsaEncrypt = new JSEncrypt();

const chars =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()";

export const generateKey = (keyLength) => {
	let randomstring = "";

	for (let i = 0; i < keyLength; i++) {
		let rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
};

export const encrypt = (data) => {
	//rsaEncrypt.setPublicKey(publicKey);
	//return rsaEncrypt.encrypt(data);
}