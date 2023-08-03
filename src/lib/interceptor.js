import axios from "axios";
import { encrypt } from '~/lib/crypto';

axios.interceptors.request.use(
	async (config) => {
		switch (config.method) {
			case 'post':
			case 'put':
				// if (config.data) {
				// 	config.data = {
				// 		data: encrypt(config.data),
				// 	};					
				// }
				break;
		}
		return config;
	}
);
