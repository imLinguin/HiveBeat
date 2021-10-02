import React from 'react';
const videoContext = React.createContext({
  videoQueue: [],
  setVideoQueue: () => {},
  nowPlaying: {},
  setNowPlaying: () => {},
  paused: false,
  setPaused: () => {},
});

export {videoContext};
