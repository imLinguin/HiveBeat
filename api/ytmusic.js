import axios from 'axios';
import ytdl from 'react-native-ytdl';
const baseURL = 'https://invidio.xamh.de';
export default {
  getTrending: () => {
    const apiPath = '/api/v1/trending?type=music';
    const url = baseURL + apiPath;
    return axios.get(url).then(r => {
      return r;
    });
  },
  searchSuggestions: query => {
    const apiPath = `/api/v1/search/suggestions?q=${query}`;
    const url = baseURL + apiPath;
    return axios.get(url).then(r => {
      return r;
    });
  },
  search: async query => {
    const apiPath = `/api/v1/search?q=${query}`;
    const url = baseURL + apiPath;
    return axios.get(url).then(r => {
      return r;
    });
  },
  getVideoData: async id => {
    const data = await ytdl.getInfo(id, {format: '140/highestaudio', filter:'audioonly'});
 
    return {
      title: data.videoDetails.title,
      lengthSeconds: data.videoDetails.lengthSeconds,
      author: data.videoDetails.author.name,
      thumbnailUrl: data.videoDetails.thumbnails[data.videoDetails.thumbnails.length - 1].url,
      formatStreams: data.formats,
    };
  },
};
