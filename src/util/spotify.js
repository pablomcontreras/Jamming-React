const clientId = "c2ccbc01f7564ca9938ed1534b427813";
const redirectUri = "http://localhost:3000/";
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      console.log('ya estaba: ' + accessToken)
      return accessToken;
    }
    //revisar si el token está en la url (implicit grant flow )

    const accesTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMach = window.location.href.match(/expires_in=([^&]*)/);
    if (accesTokenMatch && expiresInMach) {
      accessToken = accesTokenMatch[1];
      const expiresIn = Number(expiresInMach[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      console.log('acces token match ' + accessToken)

      return accessToken;
      
    } else {
      console.log('no se encuentra token');
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.open(accessUrl, '_blank');
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length){
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`};
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse =>{
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com//v1/users/${userId}/playlists` , {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: name})
        }).then(response => response.json()
        ).then(jsonResponse => {
          const playlistId = jsonResponse.id;
          return fetch (`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris})
          }
          )
        })
    })
  }
};

export default Spotify;
