require('dotenv').config();
const fs = require('fs');
const saveCanvas = require('./src/saveCanvas.js');
const getTrackIdsFromArtist = require('./src/getTrackIdsFromArtist.js');

(async () => {
    let artistName, saveTo, tracks;
    // node main.js "Skräp" "./canvas_files"
    // If a track_list file is provided, use that instead of searching for tracks
    // Every line is a track and it's written like
    /*
        track_name1@track_id1
        track_name2@track_id2
    */
    // Also if a track list is used, then the first argument is the save path
    if (fs.existsSync('./track_list')) {
        const trackList = fs.readFileSync('track_list', 'utf8');
        tracks = trackList.split('\n').map(line => {
            let [name, uri] = line.split('@');
            name = name.trim();
            uri = uri.trim();
            return { name, uri };
        });
        saveTo = process.argv[2];
        console.log(`Found ${tracks.length} tracks in track_list`);
    } else {
        artistName = process.argv[2];
        saveTo = process.argv[3];

        if (!artistName || artistName.length === 0) {
            console.error('No artist name provided');
            return;
        }
    }

    // Check if saveTo is empty
    const saveToFiles = fs.existsSync(saveTo) && fs.readdirSync(saveTo);
    if (saveToFiles && saveToFiles.length > 0) {
        console.error('Save path is not empty, please provide an empty folder');
        return;
    }

    if (!saveTo || saveTo.length === 0) {
        // Use default
        console.log('No save path provided, using default: ', __dirname + '/canvases');
        saveTo = __dirname + '/canvases';
    }

    if (artistName) {
        console.log(`Saving canvases for ${artistName} to ${saveTo}`);

        if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_ID.length === 0 || process.env.SPOTIFY_CLIENT_SECRET.length === 0) {
            console.error('Missing environment variables ', 'SPOTIFY_CLIENT_ID', ' and ', 'SPOTIFY_CLIENT_SECRET');
            return;
        }

        tracks = await getTrackIdsFromArtist(artistName);
    } else {
        console.log(`Saving canvases to ${saveTo}`);
    }
    
    console.log(`Found tracks: \n${
        tracks.map((track, index) => `${index + 1}. ${track.name}`).join('\n')
    }`);

    console.log(`Saving ${tracks.length} canvases`);
    let counterSuccessfull = 0;
    let counter = 1;
    for (const track of tracks) {
        console.log(`Saving ${track.name} (${counter}/${tracks.length})`);
        const successFull = await saveCanvas(track.uri, saveTo, track.name);
        
        if (successFull) {
            console.log(`Saved ${track.name} (${counter}/${tracks.length})`);
            counterSuccessfull++;
        } else {
            console.log(`Failed to save ${track.name} (${counter}/${tracks.length})`);
        }

        counter++;
    }

    if (artistName) {
        console.log('Done! ', 'Saved ', counterSuccessfull, ' canvases to ', saveTo, ' for ', artistName);
    } else {
        console.log('Done! ', 'Saved ', counterSuccessfull, ' canvases to ', saveTo);
    }
})();