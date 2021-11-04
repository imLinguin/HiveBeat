import axios from 'axios';
import context from './youtubemusic/context'

const parseData = data => {
    const youtubeId = data.videoDetails.videoId;
    const title = data.videoDetails.title;
    const lengthSeconds = data.videoDetails.lengthSeconds;
    const thumbnailUrl = data.videoDetails.thumbnail.thumbnails.pop()?.url;

    const artists = [{name: data.videoDetails.author, id: data.videoDetails.channelId}];
    const author = data.videoDetails.author
    return {title, lengthSeconds, thumbnailUrl, youtubeId, artists, author}
}

const requestMusicData = async id => {
  const response = await axios({
    method: 'POST',
    url: 'https://music.youtube.com/youtubei/v1/player?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
    data: {
        ...context.body,
        videoId: id,
    },
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      origin: 'https://music.youtube.com',
    },
  });

  if(response.status==200) {
    return parseData(response.data);
  }

  return {}
};

export {requestMusicData};
