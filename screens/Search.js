import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';

import Loading from '../components/Loading';
import ytm from '../api/ytmusic';
import scheme from '../assets/scheme';
import SearchResult from '../components/SearchResult';

export default function Search({navigation}) {
  const [inputText, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const scrollView = useRef(null)
  const input = useRef(null);

  useEffect(() => {
    if (inputText.length > 0 && input.current?.isFocused()) {
      ytm.searchSuggestions(inputText).then(r => {
        setSuggestions(r.data.suggestions);
      });
    } else {
      setSuggestions([]);
    }
  }, [inputText]);

  const search = () => {
    input.current.blur();
    setLoading(true);
    setSuggestions([]);
    if (inputText.length === 0) {
      return;
    }
    ytm.search(inputText).then(r => {
      setResults(r.data);
      setLoading(false);
      scrollView.current.scrollTo({ x: 0, y: 0, animated: true })
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
          onChangeText={e => {
            setText(e);
          }}
          placeholderTextColor="rgba(255,255,255,0.6)"
          placeholder="here goes ur fav song name"
          returnKeyType="search"
        />
      </View>
      <ScrollView ref={scrollView} style={styles.results} contentContainerStyle={{paddingBottom: 210, flexDirection:'row', flexWrap:'wrap', justifyContent:'center'}}>
        {loading === false ? (
          results.map((e,i) => <SearchResult key={e.videoId} listProps={e}/>)
        ) : (
          <Loading
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex:1,
              height: Dimensions.get('window').height,
            }}
          />
        )}
      </ScrollView>
      {suggestions.length > 0 && (
        <View style={styles.suggestions}>
          {suggestions.map((e, i) => (
            <TouchableOpacity
              onPress={() => {
                setText(e);
                search();
              }}
              key={i}
              style={{padding: 3}}>
              <Text style={{color: '#fff'}}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

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
    top: StatusBar.currentHeight + 60,
    marginHorizontal: 10,
    width: '95%',
  },
  results: {
    backgroundColor: scheme.colorBg,
  },
});
