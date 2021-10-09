import axios from 'axios';
import ytdl from 'react-native-ytdl';
const baseURL = 'https://invidio.xamh.de';

const getURL = formatStreams => {
  let best;
  for (let i = 0; i < formatStreams.length; i++) {
    let item = formatStreams[i];
    if (item.hasAudio && !item.hasVideo) {
      if (!best) {
        best = item;
      } else {
        if (best.bitrate < item.bitrate) {
          best = item;
        }
      }
    }
  }
  if (best) return best;
  else formatStreams[0];
};
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
    const data = await ytdl.getInfo(id);
    console.log(
      data.videoDetails.thumbnails[data.videoDetails.thumbnails.length - 1].url,
    );
    return {
      id,
      title: data.videoDetails.title,
      lengthSeconds: data.videoDetails.lengthSeconds,
      author: data.videoDetails.author.name,
      thumbnailUrl:
        data.videoDetails.thumbnails[data.videoDetails.thumbnails.length - 1]
          .url,
      formatStreams: data.formats,
      url: getURL(data.formats).url,
    };
  },
};
