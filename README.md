# Axolotl Beats

Axolotl Beats is a Spotify playlist generator app. Users can specify the genre and duration for a playlist, and the app will save the playlist directly to the user's Spotify account. In addition, the app will autoplay the playlist upon creation.

# Setup

To run your own instance of Axolotl Beats, please follow the steps below:

1. Fork and clone this repository.

2. Install the npm dependencies: `npm install`

3. Register your app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) to obtain your Client ID and Client Secret

4. In the root directory of your local app instance, create a `.env` file with the following information:

```
CLIENT_ID=<your Client ID>
CLIENT_SECRET=<your Client Secret>
```

5. Start the app with `npm start`

# References

[Spotify Web API Node](https://github.com/thelinmichael/spotify-web-api-node)

[Spotify Platform Guides](https://developer.spotify.com/documentation/general/guides/)

[Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/reference/#/)
