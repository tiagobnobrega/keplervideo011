import { ContentPersonalizationServer } from '@amzn/kepler-content-personalization';
import { SubscriptionEntitlementServer } from '@amzn/kepler-subscription-entitlement';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { IAPManager } from '../../src/iap/utils/IAPManager';

import { Header, HeaderProps } from '@amzn/kepler-ui-components';
import { RouteProp } from '@amzn/react-navigation__core';
import { StackNavigationProp } from '@amzn/react-navigation__stack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {
  AppStackParamList,
  Screens,
} from '../../src/components/navigation/types';
import DetailsScreen from '../../src/screens/DetailsScreen';

jest.mock('../../src/utils/translationHelper', () => ({
  getSelectedLocale: jest.fn().mockReturnValue('en-US'),
  translate: jest.fn().mockReturnValue('mocked translation'),
}));

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as StackNavigationProp<AppStackParamList, Screens.DETAILS_SCREEN>;
const mockRoute: any = {
  params: {
    data: {
      title: 'Test Movie',
      id: '123',
      description: 'Test description',
      posterUrl: 'https://example.com/poster.jpg',
      rating: 4.5,
    },
    sendDataOnBack: jest.fn(),
  },
} as unknown as RouteProp<AppStackParamList, Screens.PLAYER_SCREEN>;

const mockStore = configureMockStore();

const renderDetailsScreen = () => {
  return <DetailsScreen navigation={mockNavigation} route={mockRoute} />;
};

describe('Details Component', () => {
  let store: any;
  let mockDispatch: any;

  beforeEach(() => {
    store = mockStore({
      videoDetail: {
        watchList: [],
        purchasedList: [],
        rentList: [],
      },
      settingsSelectors: {
        countryCode: {},
        loginStatus: false,
      },
    });
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation(
      (callback: (state: any) => any) => callback(store.getState()),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with given props', () => {
    const { getByTestId } = render(renderDetailsScreen());
    expect(getByTestId('details-action-play-movie-btn')).toBeTruthy();
    expect(getByTestId('details-action-add-remove-btn')).toBeTruthy();
  });

  it('navigates back when the back button is pressed', () => {
    const { UNSAFE_getByType } = render(renderDetailsScreen());
    fireEvent(UNSAFE_getByType(Header), 'onBackPress');
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  it('handles play movie button press', () => {
    const { getByTestId } = render(renderDetailsScreen());
    const playMovieButton = getByTestId('details-action-play-movie-btn');
    fireEvent.press(playMovieButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Player', {
      data: mockRoute.params.data,
      sendDataOnBack: expect.any(Function),
    });
  });

  it('updates selectedFileType when route params title changes', () => {
    const { rerender, getByTestId } = render(renderDetailsScreen());
    mockRoute.params.data.title = 'New Title';
    rerender(renderDetailsScreen());
    const component = getByTestId('detail-header');
    const componetHeaderProp = component.findByProps(
      (props: HeaderProps) => props.title === 'New Title',
    );
    expect(componetHeaderProp).toBeTruthy();
  });

  it('should add to watchlist when ADD_TO_LIST button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportNewCustomerListEntry,
      ).toHaveBeenCalled();
    });
  });

  it('should handle add to watch list error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportNewCustomerListEntry as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should remove from watchlist when REMOVE_FROM_LIST button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportRemovedCustomerListEntry,
      ).toHaveBeenCalled();
    });
    expect(getByTestId('details-action-add-remove-btn')).toBeTruthy();
  });

  it('should handle remove from watchlist error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportRemovedCustomerListEntry as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    fireEvent.press(getByTestId('details-action-add-remove-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should purchase subscription when Purchase Subscription button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(
      getByTestId('details-action-purchase-remove-subscription-btn'),
    );
    await waitFor(() => {
      expect(IAPManager.triggerPurchase).toHaveBeenCalledWith(
        expect.any(String),
      );
      expect(
        SubscriptionEntitlementServer.reportNewSubscription,
      ).toHaveBeenCalled();
    });
  });

  it('should handle purchase subscription error', async () => {
    const mockError = new Error('Test Error');
    (
      SubscriptionEntitlementServer.reportNewSubscription as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(
      getByTestId('details-action-purchase-remove-subscription-btn'),
    );
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_sub_ent: ${mockError}`);
    });
  });

  it('should remove subscription when Remove Subscription button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(
      getByTestId('details-action-purchase-remove-subscription-btn'),
    );
    fireEvent.press(
      getByTestId('details-action-purchase-remove-subscription-btn'),
    );
    await waitFor(() => {
      expect(
        SubscriptionEntitlementServer.reportRemovedSubscription,
      ).toHaveBeenCalled();
    });
  });

  it('should handle remove subscription error', async () => {
    const mockError = new Error('Test Error');
    (
      SubscriptionEntitlementServer.reportRemovedSubscription as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(
      getByTestId('details-action-purchase-remove-subscription-btn'),
    );
    fireEvent.press(
      getByTestId('details-action-purchase-remove-subscription-btn'),
    );
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_sub_ent: ${mockError}`);
    });
  });

  it('should rent movie when Rent button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    await waitFor(() => {
      expect(IAPManager.triggerPurchase).toHaveBeenCalledWith(
        expect.any(String),
      );
      expect(
        ContentPersonalizationServer.reportNewContentEntitlement,
      ).toHaveBeenCalled();
    });
  });

  it('should handle rent movie error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportNewContentEntitlement as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should remove rental when Remove Rental button is pressed', async () => {
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportRemovedContentEntitlement,
      ).toHaveBeenCalled();
    });
  });

  it('should handle remove rent error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportRemovedContentEntitlement as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    fireEvent.press(getByTestId('details-action-rent-remove-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should handle Navigate Player error', async () => {
    const mockError = new Error('Test Error');
    (
      ContentPersonalizationServer.reportNewContentInteraction as jest.Mock
    ).mockImplementationOnce(() => {
      throw mockError;
    });
    console.error = jest.fn();
    const { getByTestId } = render(renderDetailsScreen());
    fireEvent.press(getByTestId('details-action-play-movie-btn'));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(`k_content_per: ${mockError}`);
    });
  });

  it('should not report to watchlist when ContentPersonalization is not enabled', async () => {
    jest.mock('../../src/config/AppConfig', () => ({
      isContentPersonalizationEnabled: jest.fn(() => false),
      isInAppPurchaseEnabled: jest.fn(() => false),
    }));
    render(renderDetailsScreen());
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportNewCustomerListEntry,
      ).not.toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(
        ContentPersonalizationServer.reportRemovedCustomerListEntry,
      ).not.toHaveBeenCalled();
    });
  });
});
