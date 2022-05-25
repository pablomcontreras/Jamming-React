import React from "react";
import "./App.css";

import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";

import Spotify from "../../util/spotify";
// import TrackList from "../TrackList/TrackList";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "Mi Playlist",
      playlistTracks: []
    };
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let listadeTracks = this.state.playlistTracks;
    if (listadeTracks.find((ntrack) => ntrack.id === listadeTracks.id)) {
      return;
    } else {
      listadeTracks.push(track);
      this.setState({ playlistTracks: listadeTracks });
    }
  }

  removeTrack(track) {
    let listadeTracks = this.state.playlistTracks;
    listadeTracks = listadeTracks.filter(
      (currentTrack) => currentTrack.id !== track.id
    );

    this.setState({ playlistTracks: listadeTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    alert('el boton funciona!');
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'Nueva Playlist',
        playlistTracks: []
      })
    })
  }

  search(term){

    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults}) 

    })
  }
  render() {
    return (
 
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div  className="App-playlist">

            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}
