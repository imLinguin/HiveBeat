import create from 'zustand';


const useStore = create(set => ({
  nowPlayingIndex: 0,
  nowPlaying: {},
  setNowPlaying: value => set(state => ({nowPlaying: value})),
  increaseIndex: () =>
    set(state => ({nowPlayingIndex: state.nowPlayingIndex + 1})),
  decreaseIndex: () =>
    set(state => ({nowPlayingIndex: state.nowPlayingIndex - 1})),
  resetIndex: () => set(state => ({nowPlayingIndex: 0})),
  setIndex: value => set(state => ({nowPlayingIndex: value})),
  paused: false,
  setPaused: value => set(state => ({paused: value})),
  shuffle: false,
  setShuffle: value => set(state => ({shuffle: value})),
  videoQueue: [],
  setVideoQueue: value => set(state => ({videoQueue: value})),
  loop: 0,
  changeLoop: () => set(state => {let next = state.loop+1; if(next==3){next = 0}; return {loop:next}}),
}));

export default useStore;