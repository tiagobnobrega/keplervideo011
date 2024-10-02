import { SearchResultsScreen as ResultsScreen } from '@amzn/keplerblocks-ui';
import { RouteProp } from '@amzn/react-navigation__core';
import { StackNavigationProp } from '@amzn/react-navigation__stack';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import {
  AppStackParamList,
  Screens,
} from '../../src/components/navigation/types';
import SearchResultsScreen from '../../src/screens/SearchResultsScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as StackNavigationProp<
  AppStackParamList,
  Screens.SEARCH_RESULTS_SCREEN
>;

const mockRoute = {
  key: 'SearchResultsScreen',
  name: Screens.SEARCH_RESULTS_SCREEN,
  params: {
    searchKeyword: 'test',
  },
} as unknown as RouteProp<AppStackParamList, Screens.SEARCH_RESULTS_SCREEN>;

const mockVideoData = {
  mediaItem: {
    id: '1',
    title: 'Test Video',
    description: 'A test video',
    posterUrl: 'http://example.com/poster.jpg',
  },
};

describe('SearchResultsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <SearchResultsScreen navigation={mockNavigation} route={mockRoute} />,
    );

  it('handles video selection correctly', async () => {
    const { UNSAFE_getByType } = renderComponent();
    fireEvent(UNSAFE_getByType(ResultsScreen), 'onItemSelected', {
      mediaItem: {
        id: '1',
        title: 'Test Video',
        description: 'A test video',
        posterUrl: 'http://example.com/poster.jpg',
      },
    });
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        Screens.PLAYER_SCREEN,
        {
          data: mockVideoData.mediaItem,
          sendDataOnBack: expect.any(Function),
        },
      );
    });
  });

  it('navigates back on button press', () => {
    const { UNSAFE_getByType } = renderComponent();
    fireEvent(UNSAFE_getByType(ResultsScreen), 'onSearchPageButtonPressed');
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
