import { ContentLauncherStatusType } from '@amzn/kepler-media-content-launcher';
import { LinearGradientProps } from '@amzn/react-linear-gradient';
import { render } from '@testing-library/react-native';
import React from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { useDispatch } from 'react-redux';
import {
  AppStackScreenProps,
  Screens,
} from '../../src/components/navigation/types';
import HomeScreen from '../../src/screens/HomeScreen';
import {
  getSelectedLocale,
  localeOptions,
} from '../../src/utils/translationHelper';

jest.mock('@amzn/react-linear-gradient', () => ({
  __esModule: true,

  default: ({ children }: LinearGradientProps) => <>{children}</>,
}));

jest.mock('@amzn/kepler-media-content-launcher', () => ({
  ContentLauncherServerComponent: jest
    .fn()
    .mockImplementation(() => mockContentLauncherServerComponent),
  ContentLauncherStatusType: {
    SUCCESS: 'SUCCESS',
  },
}));

jest.mock('lodash', () => ({
  isEqual: jest.fn().mockReturnValue(true),
}));

jest.mock('../../src/data/videos', () => ({
  DEFAULT_FILE_TYPE: 'video/mp4',
}));

const mockContentLauncherServerComponent = {
  makeLauncherResponseBuilder: jest.fn().mockReturnThis(),
  contentLauncherStatus: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({
    getContentLauncherStatus: jest
      .fn()
      .mockReturnValue(ContentLauncherStatusType.SUCCESS),
  }),
  getOrMakeServer: jest.fn().mockReturnThis(),
  setHandler: jest.fn(),
};

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};
const mockRoute: any = {};

const props: AppStackScreenProps<Screens.HOME_SCREEN> = {
  navigation: mockNavigation,
  route: mockRoute,
};

describe('HomeScreen', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  let mockDispatch: any;
  beforeEach(() => {
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders correctly and matches snapshot', () => {
    const { toJSON } = render(<HomeScreen {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('registers event listener and handles event properly', () => {
    const { unmount } = render(<HomeScreen {...props} />);
    expect(EventRegister.addEventListener).toHaveBeenCalledWith(
      'LiveChannelEvent',
      expect.any(Function),
    );
    const eventHandler = (
      EventRegister.addEventListener as unknown as jest.Mock
    ).mock.calls[0][1];
    eventHandler();
    unmount();
    expect(EventRegister.removeEventListener).toHaveBeenCalledWith(
      'mockListenerId',
    );
  });
});

describe('HomeScreen with React.memo', () => {
  it('renders only when props change', async () => {
    const isEqualSpy = jest.spyOn(require('lodash'), 'isEqual');
    const { rerender } = render(<HomeScreen {...props} />);
    rerender(<HomeScreen {...props} />);
    expect(isEqualSpy).toHaveBeenCalledTimes(1);
    const updatedProps = { ...props, someNewProp: 'new value' };
    rerender(<HomeScreen {...updatedProps} />);
    expect(isEqualSpy).toHaveBeenCalledWith(props, updatedProps);
    rerender(<HomeScreen {...updatedProps} />);
    expect(isEqualSpy).toHaveBeenCalledTimes(3);
    isEqualSpy.mockRestore();
  });
});

describe('HomeScreen with touch optimized UX', () => {
  beforeEach(() => {
    jest
      .spyOn(require('../../src/config/AppConfig'), 'isDpadControllerSupported')
      .mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const { toJSON } = render(<HomeScreen {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('HomeScreen with touch optimized UX And Disabled Additional features', () => {
  const ContentPersonalizationServer =
    require('@amzn/kepler-content-personalization').ContentPersonalizationServer;
  const AccountLoginWrapperInstance =
    require('../../src/AccountLoginWrapper').AccountLoginWrapperInstance;
  const onStartService =
    require('../../src/AccountLoginWrapper').onStartService;
  const onStopService = require('../../src/AccountLoginWrapper').onStopService;

  beforeEach(() => {
    jest.mock('@amzn/kepler-content-personalization', () => ({
      __esModule: true,

      ContentPersonalizationServer: jest.fn(),
    }));

    jest.mock('../../src/AccountLoginWrapper', () => ({
      __esModule: true,

      AccountLoginWrapperInstance: jest.fn(),
      onStartService: jest.fn(),
      onStopService: jest.fn(),
    }));

    jest
      .spyOn(require('../../src/config/AppConfig'), 'isDpadControllerSupported')
      .mockReturnValue(false);
    jest
      .spyOn(
        require('../../src/config/AppConfig'),
        'isContentPersonalizationEnabled',
      )
      .mockReturnValue(false);
    jest
      .spyOn(
        require('../../src/config/AppConfig'),
        'isSubscriptionEntitlementEnabled',
      )
      .mockReturnValue(false);
    jest
      .spyOn(require('../../src/config/AppConfig'), 'isAccountLoginEnabled')
      .mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not exercise content personalization features', () => {
    render(<HomeScreen {...props} />);
    expect(
      ContentPersonalizationServer.reportRefreshedCustomerList,
    ).toHaveBeenCalledTimes(0);
    expect(
      ContentPersonalizationServer.reportRefreshedContentEntitlements,
    ).toHaveBeenCalledTimes(0);
    expect(
      ContentPersonalizationServer.reportRefreshedPlaybackEvents,
    ).toHaveBeenCalledTimes(0);
  });

  it('does not exercise account login features', () => {
    render(<HomeScreen {...props} />);
    expect(AccountLoginWrapperInstance.updateStatus).toHaveBeenCalledTimes(0);
    expect(onStartService).toHaveBeenCalledTimes(0);
    expect(onStopService).toHaveBeenCalledTimes(0);
  });
});

describe('getSelectedLocale', () => {
  it('should return a valid OptionType object', () => {
    const result = getSelectedLocale();

    expect(result).toBeDefined();
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('label');
    expect(result).toHaveProperty('value');

    expect(result).toMatchObject({
      code: expect.any(String),
      label: expect.any(String),
      value: expect.any(String),
    });
  });

  it('should return the default OptionType if currentCountry is undefined', () => {
    jest.mock('../../src/utils/translationHelper', () => ({
      getSelectedLocale: jest.fn().mockReturnValue(undefined),
    }));

    const result = getSelectedLocale();

    expect(result).toEqual(localeOptions[0]);
  });
});
