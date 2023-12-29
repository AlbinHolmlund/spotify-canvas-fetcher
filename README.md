# Spotify Canvas Fetcher

This project is a tool for fetching all canvas videos from an artist on Spotify, based on their name.

I use a lot of code from https://github.com/bartleyg/my-spotify-canvas/tree/master to get the canvas videos, but I wanted to be able to fetch all the videos for an artist, not just the currently playing song.

This script can be used without a Spotify client id and secret, but it will only fetch the canvas videos for the songs in your track_list file.

## Installation

Clone this github repo and install the dependencies using npm or yarn:

```sh
npm install
# or yarn
yarn install
```

## Usage

### Use without client id and secret

1. Create a `track_list` file in the root directory of the project. Each line in this file should represent a track, written in the format `track_name@spotify:track:track_id`. For example:

```
track_name1@spotify:track:track_id
track_name2@spotify:track:track_id2
```

2. Run the script with the path where you want to save the videos as the first argument. For example, if you want to save the videos in a directory named `videos`, you would run:

```sh
node main.js "./videos"
```

Please note that the script will only fetch the canvas videos for the songs listed in your `track_list` file when used without a Spotify client id and secret.

### Use with client id and secret to fetch all canvases for an artist

1. Start by creating a `.env` file in the root directory of the project, similar to the provided `.env-example` file.
2. Fill in the required information in the `.env` file:

```plaintext
SPOTIFY_CLIENT_ID=spotifyclientid
SPOTIFY_CLIENT_SECRET=spotifyclientsecret
```

You can get a Spotify client id and secret by creating a Spotify developer account and registering a new application [here](https://developer.spotify.com/dashboard/applications). It's free and only takes a few minutes.

4. Run the project using the following command:

```shell
node index.js artistname
```

or

```shell
node index.js artistname "./video_path"
```

where `artistname` is the name of the artist you want to fetch the canvas videos for and `video_path` is the path to the directory where you want to save the videos. If no path is specified, the videos will be saved in the `canvases` directory in the root of the project.

This will fetch all the canvas videos for the specified artist and save them in the specified directory.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
