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
exports.getSuggestions = exports.parseGetSuggestionsBody = void 0;
const axios_1 = require("axios");
const parsers_1 = require("./parsers");
const context_1 = require("./context");
const parseGetSuggestionsBody = (body) => {
    const { contents, } = body.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content.musicQueueRenderer.content.playlistPanelRenderer;
    const results = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contents.forEach((content) => {
        try {
            const video = parsers_1.parseSuggestionItem(content);
            if (video) {
                results.push(video);
            }
        }
        catch (e) {
            console.error(e);
        }
    });
    return results;
};
exports.parseGetSuggestionsBody = parseGetSuggestionsBody;
function getSuggestions(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default({
            url: 'https://music.youtube.com/youtubei/v1/next?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
            method: 'POST',
            responseType: 'json',
            data: Object.assign(Object.assign({}, context_1.default.body), { enablePersistentPlaylistPanel: true, isAudioOnly: true, params: 'mgMDCNgE', playerParams: 'igMDCNgE', tunerSettingValue: 'AUTOMIX_SETTING_NORMAL', videoId }),
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                origin: 'https://music.youtube.com',
            },
        });
        try {
            return exports.parseGetSuggestionsBody(data);
        }
        catch (_a) {
            return [];
        }
    });
}
exports.getSuggestions = getSuggestions;
