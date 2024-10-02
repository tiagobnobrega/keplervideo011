import { SearchPageScreen } from '@amzn/keplerblocks-ui';
import { useFocusEffect } from '@amzn/react-navigation__core';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppStackScreenProps, Screens } from '../components/navigation/types';
import { COLORS } from '../styles/Colors';
import { recordCustomEvent } from '../utils/helperNewRelic';

const SearchScreen = ({
  navigation,
}: AppStackScreenProps<Screens.SEARCH_SCREEN>) => {
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, []),
  );

  const onSubmit = (searchKeyword: string) => {
    navigation.navigate(Screens.SEARCH_RESULTS_SCREEN, { searchKeyword });
    recordCustomEvent('Navigated: ', {
      name: Screens.SEARCH_RESULTS_SCREEN,
      params: { searchKeyword },
    });
  };

  return isFocused ? (
    <SearchPageScreen onSubmit={onSubmit} backgroundColor="black" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
});

export default SearchScreen;
