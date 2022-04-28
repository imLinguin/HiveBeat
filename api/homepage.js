import axios from 'axios';
import context from './youtubemusic/context';
import {PageType} from './youtubemusic';

function parseSection(carousel) {
  const {contents, header} = carousel.musicCarouselShelfRenderer;

  const section_title =
    header.musicCarouselShelfBasicHeaderRenderer.title.runs[0].text;
  const array = [];
  try {
    for (const playlist of contents) {
      if (playlist.musicResponsiveListItemRenderer) {
        continue;
      }
      const thumbnailUrl =
        playlist.musicTwoRowItemRenderer.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails.pop()
          ?.url;
      const title = playlist.musicTwoRowItemRenderer.title.runs[0].text;

      const playlistId =
        playlist.musicTwoRowItemRenderer.title.runs[0].navigationEndpoint
          .browseEndpoint.browseId;

      let author = '';
      playlist.musicTwoRowItemRenderer.subtitle.runs.forEach(
        v => author + v.text,
      );
      array.push({thumbnailUrl, title, playlistId, author});
    }
  } catch {}
  return {section_title, array};
}

function parseData(body) {
  const {contents, continuations} =
    body.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
      .sectionListRenderer;
  const sections = [];
  for (const section of contents) {
    if (section.musicCarouselShelfRenderer)
      sections.push(parseSection(section));
  }
  const {continuation, clickTrackingParams} =
    continuations[0].nextContinuationData;
  return {sections, continuation, clickTrackingParams};
}

export async function getHomePageData() {
  const response = await axios({
    method: 'POST',
    url: 'https://music.youtube.com/youtubei/v1/browse?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
    data: {
      ...context.body,
      browseId: 'FEmusic_home',
    },
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      origin: 'https://music.youtube.com',
    },
  });

  if (response.status == 200) {
    return parseData(response.data);
  }

  return {};
}

function parseContinuationData(body) {
  console.log(body);
  const {contents, continuations} =
    body.continuationContents.sectionListContinuation;
  const sections = [];
  for (const section of contents) {
    if (section.musicCarouselShelfRenderer)
      sections.push(parseSection(section));
  }
  const {continuation, clickTrackingParams} =
    continuations[0].nextContinuationData;
  return {sections, continuation, clickTrackingParams};
}

export async function getExtraData(continuation, tracking) {
  tracking = 'CAAQhGciEwi8gfX2mMr0AhU2wU8IHYa6BIU=';
  console.log(
    `https://music.youtube.com/youtubei/v1/browse?ctoken=${continuation}&continuation=${continuation}&type=next&itct=${tracking}&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30`,
  );
  const response = await axios({
    method: 'POST',
    url: `https://music.youtube.com/youtubei/v1/browse?ctoken=${continuation}&continuation=${continuation}&type=next&itct=${tracking}&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30`,
    data: {
      ...context.body,
    },
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0',
      origin: 'https://music.youtube.com',
      'X-Goog-AuthUser': 0,
      'X-Origin': 'https://music.youtube.com',
      'X-Goog-Visitor-Id': 'CgtCS3Q0QkM1ZXlVTSiWy62NBg%3D%3D',
    },
  });
  if (response.status == 200) {
    return parseContinuationData(response.data);
  }

  return {};
}
