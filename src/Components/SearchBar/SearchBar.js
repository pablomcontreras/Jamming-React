import React from 'react';
import './SearchBar.css'
//import Spotify from '../../util/spotify';

export class SearchBar extends React.Component {
 
 constructor(props){
   super(props);

   this.state = {
     term: '' 
   }

   this.search = this.search.bind(this);
   this.handleTermChange = this.handleTermChange.bind(this);

 }
 
  search(){
   this.props.onSearch(this.state.term);
 }

 handleTermChange(event){
  this.setState({term: event.target.value});
 }
 
  render(){
       return  (
       <div className="SearchBar">
        <input onChange={this.handleTermChange} placeholder="Escribí una cancion, álbum o artista"
                 />
        <button className="SearchButton">BUSCAR</button>
      </div> 
      );
    }
}