import React from "react";
import axios from "axios";

let playList = []

const url = 'https://music-app-api.onrender.com/get';

async function apiCall(column, id) {
    const result = await (axios.get(`${url}/${column}/${id}`));
    return (result.data);
}

async function callPlaylist() {
  const result = await ((axios.get(`${url}All`)));
  return (result.data);
}


async function appendPlaylist(column, id) {
  playList = [];
  let result = await apiCall(column, id);
  for (let i = 0; i < result.length; i++) {
    let song = result[i];
    if (!playList.some(item => item.url === song.url)) {
      playList.push(song);
    }
  }
  console.log(playList);
  return playList;
}





export {playList, apiCall, appendPlaylist, callPlaylist}