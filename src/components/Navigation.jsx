import e from "cors";
import React, { useRef } from "react";
import { apiCall, appendPlaylist, callPlaylist } from "./Playlist";
import './Style.css'


const Navigation = ({audioElem, isPlaying, setPlaying, currentSong, setCurrentSong, image, setImage, songs, setSongs, playlistId, setPlaylistId, currentPlaylist, setCurrentPlaylist, playButton, setPlayButton, pauseChange}) => {

    const clickRef = useRef(); 

    const PlayPause = () => {
        setPlaying(!isPlaying)
    }

    const delay = (delayInms) => {
        return new Promise(resolve => setTimeout(resolve, delayInms));
    }

    const autoPlay = () => {
        if (isPlaying) {
        audioElem.current.play();
        setPlayButton(pauseChange[1])
        } else {
        audioElem.current.pause();
        setPlayButton(pauseChange[0])
        }
    }


    async function checkWidth(e) {
        if (isPlaying) {
            let width = clickRef.current.clientWidth;
            //console.log(width)
            const offset = await (e.nativeEvent.offsetX);
            //console.log(offset)
            const divprogress = await (offset) / width * 100;
            //console.log(divprogress)
            //console.log(currentSong)
            const time = divprogress / 100 * currentSong.length;
            //console.log(currentSong.length)
            //console.log(time);
            audioElem.current.currentTime = time;
        } else {
            PlayPause();
        }
    }

    async function skipBack () {
        const index = songs.findIndex(x => x.title == currentSong.title)
        
        if (index == 0)
        {
           await setCurrentSong(songs[songs.length - 1])
        }
        else
        {
           await setCurrentSong(songs[index - 1])
        } 
        audioElem.current.currentTime = 0;
        autoPlay();
    }

    async function skipNext () {
        const index = songs.findIndex(x => x.title == currentSong.title)
        
        if (index == songs.length-1)
        {
           await setCurrentSong(songs[0])
        }
        else
        {
           await setCurrentSong(songs[index + 1])
        } 
        audioElem.current.currentTime = 0;
        autoPlay();
    }

    async function listBack() {
        const index = playlistId.findIndex(x => x.type == currentPlaylist.type)
        audioElem.current.currentTime = 0;
        if (index == 0)
        {
            await setCurrentPlaylist(playlistId[playlistId.length - 1])     
            const result = await appendPlaylist('title,artist,url,genre', `${currentPlaylist.playid}`) 
            setSongs(result)
            setCurrentSong(result[0])
        }
        else
        {
            await setCurrentPlaylist(playlistId[index - 1])
            const result = await appendPlaylist('title,artist,url,genre', `${currentPlaylist.playid}`) 
            setSongs(result)
            setCurrentSong(result[0])
        } 
        let wait = await delay(200);
        autoPlay(); 
    }

    
    async function listNext() {
        const index = playlistId.findIndex(x => x.type == currentPlaylist.type)
        audioElem.current.currentTime = 0;
        if (index == playlistId.length - 1)
        {
            await setCurrentPlaylist(playlistId[0])     
            const result = await appendPlaylist('title,artist,url,genre', `${currentPlaylist.playid}`) 
            console.log(currentPlaylist)
            setSongs(result)
            setCurrentSong(result[0])
        }
        else
        {
            await setCurrentPlaylist(playlistId[index + 1])
            const result = await appendPlaylist('title,artist,url,genre', `${currentPlaylist.playid}`) 
            console.log(currentPlaylist)
            setSongs(result)
            setCurrentSong(result[0])
        } 
        let wait = await delay(200);
        autoPlay();  
    }

    return(
    <>
        <div className="container neu">
            <div className="player neu">
                <div className="playlist">
                        <button className="pbtn pbtn-left"><img src="./control-images/playlist-back.png" onClick={listBack}></img></button>
                        <button className="playlist-name">{currentSong.genre}</button>
                        <button className="pbtn pbtn-right"><img src="./control-images/playlist-next.png" onClick={listNext}></img></button>
                </div>
                    <div className="image"><img src={`./music-images/${currentSong.genre}.jpg`} alt="Loading"></img></div>
                    <div className="title">{currentSong.title}</div>
                    <div className="artist-name">{currentSong.artist}</div>
                <div className="media-control">
                        <button className="btn neu previous" onClick={skipBack}><img src="./control-images/previous.png"></img></button>
                    <button className= "btn neu play" onClick={PlayPause}><img src={playButton.path}></img></button>
                    <button className= "btn neu next" onClick={skipNext}><img src="./control-images/next.png"></img></button>
                </div>
                <div className="seek-wrap neu" onClick={checkWidth} ref={clickRef}>
                    <div className="seek-bar" style={{width: `${currentSong.progress}`+"%"}}></div>
                </div>
            </div>   
        </div>
        </>
    )
}

export default Navigation;