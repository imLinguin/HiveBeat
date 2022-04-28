import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, StatusBar, ScrollView} from 'react-native';
import ArtistCategory from '../components/ArtistCategory';
import scheme from '../assets/scheme';
import PlaylistPreview from '../components/PlaylistPreview';
import {getSharedElements} from '../api/getSharedElements';
import {getHomePageData, getExtraData} from '../api/homepage';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

function Home({navigation}) {
  const [homeData, setHomeData] = useState({});

  useEffect(() => {
    // ytm.getTrending().then(r => {
    //   if (r.data) {
    //     setTrending(r.data);
    //   }
    // });
    getHomePageData().then(data => {
      setHomeData(data);
      scrolledToBottom();
    });
  }, [scrolledToBottom]);
  const scrolledToBottom = useCallback(() => {
    homeData.continuation &&
      getExtraData(homeData.continuation, homeData.clickTrackingParams).then(
        data => {
          console.log(data);
          const newData = {
            ...data,
            sections: [...homeData.sections, ...data.sections],
          };
          setHomeData(newData);
        },
      );
  }, [homeData.clickTrackingParams, homeData.continuation, homeData.sections]);
  return (
    <ScrollView
      style={{backgroundColor: scheme.colorBg, flex: 1}}
      contentContainerStyle={{paddingTop: StatusBar.currentHeight + 15}}
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
          scrolledToBottom();
        }
      }}
      scrollEventTrottle={400}>
      {homeData?.sections?.length > 0 &&
        homeData.sections.map(value => (
          <ArtistCategory
            title={value.section_title}
            key={`${value.section_title}section`}>
            <FlatList
              data={value.array}
              horizontal
              keyExtractor={item =>
                `${value.section_title}sectionItem${item.playlistId}`
              }
              renderItem={({item, index}) => <PlaylistPreview data={item} />}
            />
          </ArtistCategory>
        ))}
    </ScrollView>
  );
}

Home.sharedElements = getSharedElements;

export default Home;
