import React from 'react';
const videoContext = React.createContext({
  nowPlayingIndex: 0,
  setNowPlayingIndex: () => {},
  videoQueue: [],
  setVideoQueue: () => {},
  nowPlaying: {},
  setNowPlaying: () => {},
  paused: false,
  setPaused: () => {},
  shuffle: false,
  setShuffle: () => {},
});

export {videoContext};
