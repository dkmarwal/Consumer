import request from 'request-promise'

export const invokeApi = async ({ url, method, params, body, authorization }) => {
	const headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'Content-Type':     'application/json'
	}
	if(authorization){
		headers.Authorization = authorization
	}
	const options = {
		url: url,
		method: method,
		headers: headers,
		json: true
	}
	if(params){
		options.qs = params
	}
	if(body) {
		options.body = body
	}
	try{
		return await request(options).promise()
	}catch(error){
		return {
			error
		}
	}
}