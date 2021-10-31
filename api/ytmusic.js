import axios from 'axios';
import * as youtubemusic from './youtubemusic/index.js';
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
  else return formatStreams[0];
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
    const url =
      'https://music.youtube.com/youtubei/v1/music/get_search_suggestions?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30';
    return axios({
      method: 'POST',
      url,
      data: {
        input: query,
        context: {
          capabilities: {},
          client: {
            clientName: 'WEB_REMIX',
            clientVersion: '0.1',
          },
        },
      },
      headers: {
        origin: 'https://music.youtube.com',
        referrer: 'https://music.youtube.com/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'same-origin',
        'sec-fetch-site': 'same-origin',
        'x-youtube-client-name': '69',
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0,gzip(gfe)',
      },
    }).then(r => {
      const suggestions = [];
      if (r.data.contents)
        for (const suggestion of r.data?.contents[0]
          ?.searchSuggestionsSectionRenderer.contents) {
          let text = '';
          suggestion.searchSuggestionRenderer.suggestion.runs.forEach(v => {
            text += v.text;
          });
          suggestions.push(text);
        }
      return suggestions;
    });
  },
  search: async (query, type) => {
    const results = await youtubemusic.search(query, type);
    return results;
    //  console.log(results)
    //  const apiPath = `/api/v1/search?q=${query}`;
    //   const url = baseURL + apiPath;
    //   return axios.get(url).then(r => {
    //     return r;
    //   });
  },
  musicSuggestions: async id => {
    const array = await youtubemusic.getSuggestions(id);
    for (const item in array) {
      if (!array[item].youtubeId) {
        array.splice(item, 1);
      }
    }
    return array;
  },
  getArtistData: async id => {
    const artist = await youtubemusic.getArtist(id);
    return artist;
  },

  getAlbumSongs: async id => {
    const album = await youtubemusic.listMusicsFromAlbum(id);
    return album;
  },

  getPlaylistSongs: async id => {
    const playlist = await youtubemusic.listMusicsFromPlaylist(id);
    return playlist;
  },

  manipulateThumbnailUrl: (url, width, height) => {
    const newWH = `w${width}-h${height}`;
    url = url.replace(/w\d{3}-h\d{3}/, newWH);
    return url;
  },

  getVideoData: async id => {
    const data = await ytdl.getInfo(id);
    const url = getURL(data.formats).url;
    return {
      id,
      lengthSeconds: data.videoDetails.lengthSeconds,
      formatStreams: data.formats,
      url,
    };
  },

  joinArtists: array => {
    let newArray = [];
    array.forEach(e => {
      newArray.push(e.name);
    });
    return newArray.join(', ');
  },

  shuffle: (array, id) => {
    if (id) {
      array.splice(id, 1);
    }
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  },
};
