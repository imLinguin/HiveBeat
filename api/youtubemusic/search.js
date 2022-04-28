"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.handleMultiTypeSearch = void 0;
const axios_1 = require("axios");
const parsers_1 = require("./parsers");
const searchArtists_1 = require("./searchArtists");
const searchAlbums_1 = require("./searchAlbums");
const searchMusics_1 = require("./searchMusics");
const searchPlaylists_1 = require("./searchPlaylists");
const context_1 = require("./context");
const models_1 = require("./models");
function handleMultiTypeSearch(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default({
            url: 'https://music.youtube.com/youtubei/v1/search?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
            method: 'POST',
            responseType: 'json',
            data: Object.assign(Object.assign({}, context_1.default.body), { query }),
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept-Language': 'en',
                origin: 'https://music.youtube.com',
            },
        });
        try {
            const { contents, } = response.data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer;
            const array = [];
            contents.forEach((shelf) => {
                if (shelf.musicShelfRenderer) {
                    shelf.musicShelfRenderer.contents.forEach((element) => {
                        var _a, _b;
                        if ((_a = element.musicResponsiveListItemRenderer) === null || _a === void 0 ? void 0 : _a.navigationEndpoint) {
                            // Album, Artist or Playlist
                            switch ((_b = element.musicResponsiveListItemRenderer) === null || _b === void 0 ? void 0 : _b.navigationEndpoint.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType) {
                                case models_1.PageType.album:
                                    array.push(parsers_1.parseAlbumItem(element));
                                    break;
                                case models_1.PageType.artist:
                                    array.push(parsers_1.parseArtistSearchResult(element));
                                    break;
                                case models_1.PageType.playlist:
                                    array.push(parsers_1.parsePlaylistItem(element, false));
                                    break;
                                default:
                                    break;
                            }
                        }
                        else {
                            // Video
                            array.push(parsers_1.parseMusicItem(element));
                        }
                    });
                }
            });
            return array;
        }
        catch (e) {
            console.error(e);
            return [];
        }
    });
}
exports.handleMultiTypeSearch = handleMultiTypeSearch;
function search(query, type) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (type) {
            case models_1.SearchType.album:
                return searchAlbums_1.searchAlbums(query);
            case models_1.SearchType.artist:
                return searchArtists_1.searchArtists(query);
            case models_1.SearchType.music:
                return searchMusics_1.searchMusics(query);
            case models_1.SearchType.playlist:
                return searchPlaylists_1.searchPlaylists(query);
            default:
                return handleMultiTypeSearch(query);
        }
    });
}
exports.search = search;
