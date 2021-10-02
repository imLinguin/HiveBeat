import ytdl from 'react-native-ytdl'
import axios from 'axios'
const baseURL = "https://invidio.xamh.de"
export default {
    getTrending: ()=>{
        const apiPath = '/api/v1/trending?type=music'
        const url = baseURL+apiPath
        return axios.get(url).then(r=>{return r})
    },
    searchSuggestions: (query)=>{
        const apiPath = `/api/v1/search/suggestions?q=${query}`
        const url = baseURL+apiPath
        return axios.get(url).then(r=>{return r})
    },
    search: async (query)=>{
        const apiPath = `/api/v1/search?q=${query}`
        const url = baseURL+apiPath
        return axios.get(url).then(r=>{return r})
    },
    getVideoData: async (id)=>{
        const apiPath = `/api/v1/videos/${id}`
        const url = baseURL+apiPath
        return axios.get(url).then(r=>{return r})
    }
}