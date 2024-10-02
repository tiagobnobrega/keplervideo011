import { createStackNavigator } from '@amzn/react-navigation__stack';
import { render } from '@testing-library/react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AppStack from '../../src/components/navigation/AppStack';
import { Screens } from '../../src/components/navigation/types';

jest.mock('../../src/screens/DetailsScreen', () => 'DetailsScreen');
jest.mock('../../src/screens/PlayerScreen', () => 'PlayerScreen');
jest.mock('../../src/screens/SearchResultsScreen', () => 'SearchResultsScreen');
jest.mock('../../src/components/navigation/AppDrawer', () => 'AppDrawer');

jest.mock('@amzn/react-navigation__stack', () => {
  return {
    createStackNavigator: jest.fn().mockReturnValue({
      Navigator: jest.fn(({ children }) => children),
      Screen: jest.fn(({ children }) => children),
    }),
  };
});
const mockStore = configureMockStore();

describe('AppStack', () => {
  let store: any;
  let mockDispatch: any;
  beforeEach(() => {
    store = mockStore({
      videoDetail: {
        watchList: [],
        purchasedList: [],
        rentList: [],
      },
    });
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation(
      (callback: (state: any) => any) => callback(store.getState()),
    );
  });

  const setup = () => {
    return render(<AppStack />);
  };

  it('renders correctly', () => {
    const { toJSON } = setup();
    const tree = toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders the navigator with the correct screens', () => {
    setup();
    const createStack = createStackNavigator();

    expect(createStack.Navigator).toHaveBeenCalled();
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.APP_DRAWER }),
      {},
    );
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.DETAILS_SCREEN }),
      {},
    );
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.PLAYER_SCREEN }),
      {},
    );
    expect(createStack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ name: Screens.SEARCH_RESULTS_SCREEN }),
      {},
    );
  });

  test('navigator has correct screen options', () => {
    setup();
    const createStack = createStackNavigator();
    const navigatorProps = (createStack.Navigator as jest.Mock).mock
      .calls[0][0];

    expect(navigatorProps.screenOptions).toEqual({
      headerShown: false,
      animationEnabled: false,
    });
  });
});
