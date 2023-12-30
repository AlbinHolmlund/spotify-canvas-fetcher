const axios = require('axios');
const querystring = require('querystring');
const getCanvases = require('./_canvasApi.js');
const fs = require('fs');
const path = require('path');

const request = async (url, method = 'get', data = null, headers = {}) => {
	try {
		const options = { method, url, headers };
		if (data) {
			if (method === 'post') options.data = querystring.stringify(data);
			else options.params = data;
		}
		const response = await axios(options);
		return response.data;
	} catch (error) {
		console.error(`ERROR ${url}: ${error}`);
		if (error.response) {
			console.error(error.response.status, error.response.statusText);
			if (error.response.data.error) console.error(error.response.data.error);
		}
	}
};

const getCanvasToken = () => {
	return request('https://open.spotify.com/get_access_token?reason=transport&productType=web_player')
		.then(data => data && data.accessToken);
};

const downloadCanvas = async (url, saveTo, name) => {
	const canvas = await axios.get(url, { responseType: 'stream' });
	let filename = name;
	if (name) filename = name;
	const canvasPath = path.join(saveTo, `${filename}.mp4`);
	// Create the folder if it doesn't exist
	if (!fs.existsSync(saveTo)) fs.mkdirSync(saveTo);
	// Save the file
	canvas.data.pipe(fs.createWriteStream(canvasPath));
	console.log('Canvas saved to: ', canvasPath);
	return true;
}

const getCanvasUrl = async (trackId) => {
	const canvasToken = await getCanvasToken();
	const uniqueTracks = [{ track: { uri: trackId } }];
	const canvasResponse = await getCanvases(uniqueTracks, canvasToken);

	if (canvasResponse && canvasResponse.canvasesList && canvasResponse.canvasesList.length) {
		const canvasUrl = canvasResponse.canvasesList[0].canvasUrl;
		// Download the file from the url and save it to the saveTo path
		console.log('Canvas found! Url: ', canvasUrl);
		return canvasUrl;
	} else {
		console.log('No canvas found');
		return false;
	}
};

const saveCanvas = async (trackId, saveTo, name) => {
	const canvasUrl = await getCanvasUrl(trackId);
	return canvasUrl && await downloadCanvas(canvasUrl, saveTo, name);
};

// If called directly from the command line
if (require.main === module) {
	require('dotenv').config();
	const trackId = process.argv[2];
	const saveTo = process.argv[3];
	const name = process.argv[4];
	saveCanvas(trackId, saveTo, name);
}

module.exports = {
	getCanvasUrl,
	saveCanvas
};