import {
  MediaItemEventData,
  SearchResultsScreen as ResultsScreen,
} from '@amzn/keplerblocks-ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { createDataProvider } from '../cfg/dataProviderFactory';
import { AppStackScreenProps, Screens } from '../components/navigation/types';
import { searchSelectors } from '../store/search/searchSlice';
import { TitleData } from '../types/TitleData';

interface customMediaItemEventData extends MediaItemEventData {
  mediaItem: TitleData;
}

const SearchResultsScreen = ({
  navigation,
  route,
}: AppStackScreenProps<Screens.SEARCH_RESULTS_SCREEN>) => {
  const { searchKeyword } = route.params;
  const styles = createStyleSheet();
  const playlistsData = useSelector(searchSelectors.playlistData);
  const dataProvider = createDataProvider(playlistsData);

  const onVideoSelect = async (data: customMediaItemEventData) => {
    navigation.navigate(Screens.PLAYER_SCREEN, {
      data: data.mediaItem,
      sendDataOnBack: () => {},
    });
  };

  const convertToCustomMediaItemEventData = (
    data: MediaItemEventData,
  ): customMediaItemEventData => {
    return data as customMediaItemEventData;
  };

  return (
    <View style={styles.screen}>
      <ResultsScreen
        dataProvider={dataProvider}
        searchKeyword={{ searchKeyword }}
        onSearchPageButtonPressed={() => navigation.goBack()}
        backgroundColor="black"
        onItemSelected={(data: MediaItemEventData) => {
          onVideoSelect(convertToCustomMediaItemEventData(data));
        }}
        showPlaylistName={false}
        // eslint-disable-next-line react-native/no-inline-styles
        mediaItemStyleConfig={{ mediaItemTileShowDescription: false }}
      />
    </View>
  );
};

const createStyleSheet = () => {
  return StyleSheet.create({
    screen: {
      height: '100%',
      width: '100%',
    },
  });
};

export default SearchResultsScreen;
