import React, {useState, useEffect} from 'react';
import {View, FlatList, StatusBar} from 'react-native';
import TrendingCard from '../components/TrendingCard';
import scheme from '../assets/scheme';

import ytm from '../api/ytmusic';

export default function Home({navigation}) {
  const [trending, setTrending] = useState(null);

  useEffect(() => {
    ytm.getTrending().then(r => {
      if (r.data) {
        setTrending(r.data);
      }
    });
  }, []);

  return (
    <View style={{backgroundColor: scheme.colorBg}}>
      {trending ? (
        <FlatList
          data={trending}
          keyExtractor={(item, index) => index}
          renderItem={listProps => (
            <TrendingCard
              listProps={listProps}
              style={{
                paddingTop:
                  listProps.index == 0 ? StatusBar.currentHeight + 15 : 15,
              }}
            />
          )}
        />
      ) : (
        <View style={{height: '100%', width: '100%'}}></View>
      )}
    </View>
  );
}
