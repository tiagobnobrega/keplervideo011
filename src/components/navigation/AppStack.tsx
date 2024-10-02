/*
 * Copyright (c) 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
import { createStackNavigator } from '@amzn/react-navigation__stack';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchPlaylists } from '../../store/search/searchSlice';
import AppDrawer from './AppDrawer';
import { AppStackParamList, Screens } from './types';

const DetailsScreen = React.lazy(() => import('../../screens/DetailsScreen'));
const PlayerScreen = React.lazy(() => import('../../screens/PlayerScreen'));
const SearchResultsScreen = React.lazy(
  () => import('../../screens/SearchResultsScreen'),
);
const FeedBackScreen = React.lazy(() => import('../../screens/FeedbackScreen'));
const Stack = createStackNavigator<AppStackParamList>();
const AppStack = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    //fetching local file data for search flow
    dispatch(fetchPlaylists());
  }, [dispatch]);

  const navigationOptions = {
    headerShown: false,
    animationEnabled: false,
  };

  return (
    <Stack.Navigator screenOptions={navigationOptions}>
      <Stack.Screen name={Screens.APP_DRAWER} component={AppDrawer} />
      <Stack.Screen name={Screens.DETAILS_SCREEN} component={DetailsScreen} />
      <Stack.Screen name={Screens.PLAYER_SCREEN} component={PlayerScreen} />
      <Stack.Screen
        name={Screens.SEARCH_RESULTS_SCREEN}
        component={SearchResultsScreen}
      />
      <Stack.Screen name={Screens.FEEDBACK_SCREEN} component={FeedBackScreen} />
    </Stack.Navigator>
  );
};

export default React.memo(AppStack);
