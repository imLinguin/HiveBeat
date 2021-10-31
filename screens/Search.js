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
import {SearchType} from '../api/youtubemusic';
import {SharedElement} from 'react-navigation-shared-element';
import ArtistPreview from '../components/ArtistPreview';
import AlbumPreview from '../components/AlbumPreview';
import PlaylistPreview from '../components/PlaylistPreview';

function Search({navigation}) {
  const {width, height} = useWindowDimensions();
  const [inputText, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showSuggestions, setSuggestionsVisibility] = useState(false);
  const scrollView = useRef(null);
  const input = useRef(null);

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
          placeholder="here goes ur fav song name"
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
