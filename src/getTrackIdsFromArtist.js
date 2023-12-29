const axios = require('axios');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Function to authenticate and get an access token
async function getAccessToken() {
	const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
		}
	});
	return response.data.access_token;
}

// Function to search for an artist and get their ID
async function getArtistId(artistName, accessToken) {
	const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
		headers: {
			'Authorization': 'Bearer ' + accessToken
		}
	});
	return response.data.artists.items[0].id;
}

// Function to get all albums by an artist
async function getAlbumsByArtist(artistId, accessToken) {
	const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single`, {
		headers: {
			'Authorization': 'Bearer ' + accessToken
		}
	});
	return response.data.items;
}

// Function to get all tracks from an album
async function getTracksFromAlbum(albumId, accessToken) {
	const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
		headers: {
			'Authorization': 'Bearer ' + accessToken
		}
	});
	return response.data.items;
}

// Main function to orchestrate the calls
async function getAllTrackUris(artistNameOrId) {
	try {
		let accessToken = await getAccessToken();
		let artistId;
		if (!artistNameOrId || artistNameOrId.length === 0) {
			throw new Error('No artist name or id provided');
		}
		if (artistNameOrId.indexOf('spotify:artist:') === 0) {
			// Use the id directly
			console.log('Using artist id: ', artistNameOrId);
			artistId = artistNameOrId;
		} else {
			// Search for the artist
			console.log('Searching for artist: ', artistNameOrId);
			artistId = await getArtistId(artistNameOrId, accessToken);
			console.log('Found artist id: ', artistId);
		}
		console.log('Getting albums for artist: ', artistId);
		const albums = await getAlbumsByArtist(artistId, accessToken);
		console.log('Got ', albums.length, ' albums');
		let allTracks = [];

		console.log('Getting tracks for all albums');
		for (const album of albums) {
			const tracks = await getTracksFromAlbum(album.id, accessToken);
			allTracks = allTracks.concat(tracks.map(track => track));
			console.log('Got tracks for album: ', album.name, tracks.length);
		}

		return allTracks;
	} catch (error) {
		console.error('Error:', error.message);
	}
}

module.exports = getAllTrackUris;