import React from "react";
import './Style.css';
import { useRef, useState, useEffect } from "react";
import { playList, appendPlaylist, callPlaylist } from './Playlist';
import Navigation from './Navigation';

const loading = [{ 'title': 'Loading', 'artist': 'Loading', 'genre': 'Loading' }]
const pauseChange = [{ "path": "./control-images/play.png" }, {"path": "./control-images/pause.png"}];



const Main = () => {
  const [songs, setSongs] = useState([]);
  const [isPlaying, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState('');
  const [playlistId, setPlaylistId] = useState([])
  const [currentPlaylist, setCurrentPlaylist] = useState('')
  const [playButton, setPlayButton] = useState('')

  const audioElem = useRef();

  useEffect(() => {
    const fetchSongs = async () => {
      setCurrentSong(loading[0]);
      const playlist = await appendPlaylist('title,artist,url,genre', '1');
      setSongs(playlist);
      setCurrentSong(playlist[0]);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioElem.current.play();
      setPlayButton(pauseChange[1])
    } else {
      audioElem.current.pause();
      setPlayButton(pauseChange[0])
    }
  }, [isPlaying]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const playlist = await callPlaylist();
      setPlaylistId(playlist);
      setCurrentPlaylist(playlist[0]);
    };
    fetchPlaylist();
  }, []);
  

  const onPlaying = () => {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;
    setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration })    
  }


  const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  }


  async function skipNext () {
    const index = songs.findIndex(x => x.title == currentSong.title)
      
    if (index == songs.length - 1){
      setCurrentSong(songs[0])
    } else {
      setCurrentSong(songs[index + 1])
    } 
    let wait = await delay(200); 
      audioElem.current.currentTime = 0;
      if (isPlaying) {
          audioElem.current.play();
      } else {
          audioElem.current.pause();
      }

  }

    return (
        <div className="Player">
        <audio src={currentSong.url} ref={audioElem} onTimeUpdate={onPlaying} onEnded={skipNext} />
        <Navigation songs={songs} setSongs={setSongs} isPlaying={isPlaying} setPlaying={setPlaying} currentSong={currentSong} setCurrentSong={setCurrentSong} audioElem={audioElem}
          playlistId={playlistId} setPlaylistId={setPlaylistId} currentPlaylist={currentPlaylist} setCurrentPlaylist={setCurrentPlaylist} playButton={playButton} setPlayButton={setPlayButton} pauseChange={pauseChange} />
        </div>
    )  

}

export default Main;