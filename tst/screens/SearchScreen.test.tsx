import { SearchPageScreen } from '@amzn/keplerblocks-ui';
import { useFocusEffect } from '@amzn/react-navigation__core';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Screens } from '../../src/components/navigation/types';
import SearchScreen from '../../src/screens/SearchScreen';

jest.mock('@amzn/react-navigation__core', () => ({
  useFocusEffect: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
} as any;

const mockRoute = {
  key: 'SearchScreen',
  name: Screens.SEARCH_SCREEN,
  params: {},
} as any;

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = async () => {
    const component = render(
      <SearchScreen navigation={mockNavigation} route={mockRoute} />,
    );
    // Await the focus effect's callback
    await (useFocusEffect as jest.Mock).mock.calls[0][0]();
    return component;
  };

  it('renders the SearchPageScreen with the correct props', async () => {
    const { UNSAFE_getByType } = await renderComponent();

    const searchPageScreen = UNSAFE_getByType(SearchPageScreen);

    expect(searchPageScreen.props.backgroundColor).toBe('black');
    expect(searchPageScreen.props.onSubmit).toBeInstanceOf(Function);
  });

  it('navigates to SearchResultsScreen with the correct search keyword on submit', async () => {
    const { UNSAFE_getByType } = await renderComponent();
    const searchKeyword = 'test keyword';

    fireEvent(UNSAFE_getByType(SearchPageScreen), 'onSubmit', searchKeyword);

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      Screens.SEARCH_RESULTS_SCREEN,
      { searchKeyword },
    );
  });
});
