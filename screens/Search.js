import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';

import Loading from '../components/Loading';
import ytm from '../api/ytmusic';
import scheme from '../assets/scheme';
import SearchResult from '../components/SearchResult';
import CustomText from '../components/CustomText';
import ArtistPreview from '../components/ArtistPreview';
import AlbumPreview from '../components/AlbumPreview';
import PlaylistPreview from '../components/PlaylistPreview';
import shallow from 'zustand/shallow';
import useStore from '../context';

function Search({navigation}) {
  const {width, height} = useWindowDimensions();
  const [inputText, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showSuggestions, setSuggestionsVisibility] = useState(false);
  const scrollView = useRef(null);
  const input = useRef(null);
  const context = useStore(state=>({setNowPlaying:state.setNowPlaying, setIndex: state.setIndex, setVideoQueue: state.setVideoQueue}), shallow)

  useEffect(() => {
    if (inputText)
      ytm.searchSuggestions(inputText).then(r => {
        setSuggestions(r);
      });
    if (inputText.length > 0 && input.current?.isFocused()) {
      setSuggestionsVisibility(true);
    } else {
      setSuggestionsVisibility(false);
    }
  }, [inputText]);

  const search = (_, value) => {
    if (!value) value = inputText;
    input.current.blur();
    setLoading(true);
    setSuggestionsVisibility(false);
    if (inputText.length === 0) {
      return;
    }
    // Checks to play youtube url
    if(value.match(/^(https?\:\/\/)?(music\.)?(youtube\.com)\/(watch\?v=).+$/)){
      let id = value.split("/").pop();
      id = id.replace("watch?v=", "");
      id = id.slice(0,id.indexOf("&"));
      console.log(id);

      ytm.getMusicData(id).then((v)=>{
        context.setNowPlaying(v);
        context.setVideoQueue([v]);
        context.setIndex(0);
        setLoading(false);
      })
    }
    //https://music.youtube.com/playlist?list=OLAK5uy_lJFdICFYUcP7x0t13ZXmPbTMCE56TKPeo&feature=share
    else if(value.match(/^(https?\:\/\/)?(music\.)?(youtube\.com)\/(playlist\?list=).+$/)){
      let id = value.split("/").pop();
      id = id.replace("playlist?list=", "");
      id = id.slice(0,id.indexOf("&"));
      setLoading(false)
      console.log(id);
      navigation.navigate("Playlist", {data:{playlistId:"VL"+id}})
    }
    else
    ytm.search(value).then(r => {
      r.forEach((v, i) => {
        r[i].thumbnailUrl = ytm.manipulateThumbnailUrl(
          v.thumbnailUrl,
          250,
          250,
        );
      });
      setResults(r);
      setLoading(false);
      setSuggestionsVisibility(false);
      scrollView.current.scrollTo({x: 0, y: 0, animated: true});
    });
  };
  return (
    <View>
      <View style={styles.topWrapper}>
        <TextInput
          ref={input}
          style={{color: '#fff', width: '100%'}}
          value={inputText}
          selectTextOnFocus={true}
          underlineColorAndroid={scheme.colorPrimary}
          onSubmitEditing={search}
          onFocus={() => setSuggestionsVisibility(true)}
          onBlur={() => setSuggestionsVisibility(false)}
          onChangeText={e => {
            setText(e);
          }}
          placeholderTextColor="rgba(255,255,255,0.6)"
          placeholder="Search or paste URL"
          returnKeyType="search"
        />
      </View>
      <ScrollView
        ref={scrollView}
        style={styles.results}
        contentContainerStyle={{
          paddingBottom: 210,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        {loading === false ? (
          results.map((e, i) => {
            if (e.youtubeId)
              return <SearchResult key={`${e.youtubeId} ${i}`} listProps={e} />;
            else if (e.albumId)
              return (
                <AlbumPreview
                  key={`${e.albumId} ${i}`}
                  data={e}
                  navigation={navigation}
                  index={i}
                />
              );
            else if (e.playlistId)
              return <PlaylistPreview key={`${e.playlistId} ${i}`} data={e} />;
            else if (e.artistId)
              return <ArtistPreview key={`${e.artistId} ${i}`} data={e} />;
          })
        ) : (
          <Loading
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: height,
            }}
          />
        )}
      </ScrollView>
      {showSuggestions && (
        <View style={[styles.suggestions]}>
          {suggestions.map((e, i) => (
            <TouchableOpacity
              onPress={() => {
                setText(e);
                search(null, e);
              }}
              key={i}
              style={{padding: 5}}>
              <CustomText style={{color: '#fff', fontSize: 15}}>{e}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

Search.sharedElements = (route, otherRoute, x) => {
  const {data} = otherRoute.params
  const id = data?.playlistId || data?.albumId || data?.artistId
    return [`${id}.thumbnail`];
}

export default Search
const styles = StyleSheet.create({
  topWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#262626',
    paddingTop: StatusBar.currentHeight,
  },
  suggestions: {
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: scheme.colorBg,
    top: StatusBar.currentHeight + 50,
    marginHorizontal: 10,
    width: '95%',
  },
  results: {
    backgroundColor: scheme.colorBg,
    height: '100%',
  },
});
