// jest.setup.js or setupTests.js
import { HWEvent } from '@amzn/react-native-kepler';

beforeEach(() => {
  expect.hasAssertions();
});

// Add spyOn here
jest.spyOn(console, 'error').mockImplementation(() => {});
export const consoleInfoSpy = jest
  .spyOn(console, 'info')
  .mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

// Add mocks of libraries here
jest.mock('@amzn/react-native-vector-icons/MaterialIcons', () =>
  jest.requireMock('./tst/helperMocks/MockMaterialIcons'),
);
jest.mock('@amzn/kepler-content-personalization', () => ({
  __esModule: true,
  PlaybackState: jest.fn(),
  ContentPersonalizationServer: {
    reportNewContentEntitlement: jest.fn(),
    reportRemovedContentEntitlement: jest.fn(),
    reportNewCustomerListEntry: jest.fn(),
    reportRemovedCustomerListEntry: jest.fn(),
    reportNewContentInteraction: jest.fn(),
    reportRefreshedCustomerList: jest.fn(),
    reportRefreshedContentEntitlements: jest.fn(),
    reportRefreshedPlaybackEvents: jest.fn(),
  },
  ContentInteractionType: {
    INGRESS: 'INGRESS',
  },
  CustomerListType: {
    WATCHLIST: 'WATCHLIST',
  },
  ContentIdNamespaces: {
    NAMESPACE_CDF_ID: 'NAMESPACE_CDF_ID',
  },
}));
jest.mock('@amzn/kepler-subscription-entitlement', () => ({
  __esModule: true,
  SubscriptionEntitlementServer: {
    reportNewSubscription: jest.fn(),
    reportRemovedSubscription: jest.fn(),
    reportRefreshedSubscriptions: jest.fn(),
  },
}));
jest.mock('@amzn/kepler-epg-provider', () => ({
  __esModule: true,
  ChannelDescriptorBuilder: jest.fn(),
  IChannelDescriptor: jest.fn(),
}));
jest.mock('@amzn/react-native-w3cmedia', () => ({
  __esModule: true,
  KeplerVideoSurfaceView: ({
    onSurfaceViewCreated,
    onSurfaceViewDestroyed,
  }: {
    onSurfaceViewCreated: (_surfaceHandle: string) => void;
    onSurfaceViewDestroyed: (_surfaceHandle: string) => void;
  }) => {
    onSurfaceViewCreated('SurfaceViewCreated');
    onSurfaceViewDestroyed('SurfaceViewDestroyed');
    return null;
  },
  KeplerCaptionsView: ({
    onCaptionViewCreated,
  }: {
    onCaptionViewCreated: ((captionsViewHandle: string) => void) | undefined;
  }) => {
    onCaptionViewCreated?.('CaptionViewCreated');
    return null;
  },
  VideoPlayer: jest.fn().mockImplementation(() => ({
    destroyVideoElements: jest.fn(),
    preBufferVideo: jest.fn(),
  })),
}));
jest.mock('@amzn/lottie-react-native', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@amzn/react-native-kepler', () => {
  return {
    __esModule: true,
    HWEvent: jest.fn(),
    KeplerAppStateChange: jest.fn(),
    useCallback: jest.fn(),
    useTVEventHandler: jest.fn((evt: HWEvent) => {
      return evt;
    }),
    useAddKeplerAppStateListenerCallback: jest.fn().mockReturnValue(jest.fn()),
    TVFocusGuideView: jest.fn(),
    default: jest.fn(),
  };
});
jest.mock('lodash', () => ({
  isEqual: jest.fn(() => true),
}));
jest.mock('@amzn/react-native-device-info', () => ({
  getApplicationName: jest.fn().mockResolvedValue('Test Application'),
  getModel: jest.fn().mockResolvedValue('Test Model'),
  getSystemName: jest.fn().mockResolvedValue('Test System'),
  getVersion: jest.fn().mockResolvedValue('1.0'),
  getDeviceType: jest.fn().mockResolvedValue('Test Device'),
  getBaseOs: jest.fn().mockResolvedValue('Test Base OS'),
  getManufacturer: jest.fn().mockResolvedValue('Test Manufacturer'),
}));
jest.mock('@amzn/kepler-media-account-login', () => ({
  AccountLoginServerComponent: jest.fn(),
  IAccountLoginHandlerAsync: jest.fn(),
  IAccountLoginServerAsync: jest.fn(),
  IStatus: jest.fn(),
  StatusType: jest.fn(),
}));
jest.mock('@amzn/react-native-localize', () => ({
  getCountry: jest.fn(),
  getLocales: jest.fn(),
}));
jest.mock('@amzn/keplerscript-netmgr-lib', () => ({
  __esModule: true,
  fetch: jest.fn(),
  NetInfoConnectedDetails: jest.fn(),
  NetInfoState: jest.fn(),
  refresh: jest.fn(),
}));
jest.mock('@amzn/react-navigation__core', () => ({
  __esModule: true,
  useFocusEffect: jest.fn(),
}));
jest.mock('@amzn/keplerblocks-ui', () => ({
  SearchResultsScreen: jest.fn(() => null),
  SearchPageScreen: jest.fn(() => null),
}));
jest.mock('@amzn/kepler-file-system', () => ({
  handleReadFileAsString: jest.fn(() => null),
  handleGetEntries: jest.fn(() => null),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@amzn/react-navigation__native', () => ({
  ...jest.requireActual('@amzn/react-navigation__native'),
  useNavigation: jest.fn(),
}));
jest.mock('newrelic-kepler-agent', () => ({
  recordCustomEvent: jest.fn(),
}));

jest.mock('@amzn/react-navigation__drawer', () => ({
  useDrawerStatus: jest.fn().mockReturnValue('closed'),
}));
jest.mock('react-native-event-listeners', () => ({
  EventRegister: {
    addEventListener: jest.fn(_eventName => {
      return 'mockListenerId';
    }),
    removeEventListener: jest.fn(),
  },
}));
jest.mock('@amzn/kepler-performance-api', () => ({
  useReportFullyDrawn: jest.fn().mockReturnValue(jest.fn()),
}));
jest.mock('@amzn/kepler-media-content-launcher', () => ({
  ContentLauncherServerComponent: jest.fn().mockImplementation(() => ({
    getOrMakeServer: jest.fn().mockReturnValue({
      setHandler: jest.fn(),
    }),
    makeLauncherResponseBuilder: jest.fn().mockReturnValue({
      contentLauncherStatus: jest.fn().mockReturnValue({
        build: jest.fn().mockReturnValue({}),
      }),
    }),
  })),
  ContentLauncherStatusType: {
    SUCCESS: 'SUCCESS',
  },
  IContentLauncherHandler: jest.fn(),
  IContentSearch: jest.fn(),
  ILaunchContentOptionalFields: jest.fn(),
  ILauncherResponse: jest.fn(),
}));
jest.mock('./src/AccountLoginWrapper', () => ({
  AccountLoginWrapperInstance: {
    updateStatus: jest.fn(),
  },
  onStartService: jest.fn(),
  onStopService: jest.fn(),
}));
jest.mock('@amzn/kepler-channel', () => ({
  ChannelServerComponent: {
    channelServer: {
      handler: jest.fn(),
    },
  },
}));
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn().mockReturnValue({
    start: jest.fn(),
  });
  RN.Dimensions.get = jest.fn().mockReturnValue({ height: 800 });
  RN.PixelRatio.roundToNearestPixel = jest.fn().mockImplementation(uxUnit => {
    return uxUnit;
  });

  return RN;
});
jest.mock('./src/utils/pixelUtils', () => {
  const RN = jest.requireMock('react-native');

  return {
    scaleUxToDp: RN.PixelRatio.roundToNearestPixel,
  };
});
jest.mock('@amzn/react-navigation__stack', () => ({
  Header: jest.fn(),
}));
jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: jest.fn(),
  widthPercentageToDP: jest.fn(),
}));
jest.mock('@amzn/react-native-svg', () => ({
  Path: jest.fn(),
  Svg: jest.fn(),
}));

// Add mocks of internal files here
jest.mock('./src/iap/utils/IAPManager', () => ({
  IAPManager: {
    getPurchaseUpdates: jest.fn(),
    triggerPurchase: jest.fn(),
  },
}));
jest.mock('./src/iap/IAPConstants', () => ({
  IAPConstants: {
    MONTHLY_SUBSCRIPTION_SKU: 'monthly_subscription_sku',
    PURCHASE_TITLE_SKU: 'purchase_title_sku',
  },
}));
jest.mock('./src/mocks/ContentPersonalizationMocks', () => ({
  __esModule: true,
  getMockPlaybackEventForVideo: jest.fn(),
  getMockContentEntitlement: jest.fn(),
  getMockContentID: jest.fn(),
  getMockContentInteraction: jest.fn(),
  getMockCustomerListEntry: jest.fn(),
}));
jest.mock('./src/mocks/SubscriptionEntitlementMocks', () => ({
  getMockSubscriptionEntitlementEntry: jest.fn(),
}));
jest.mock('./src/config/AppConfig', () => ({
  isContentPersonalizationEnabled: jest.fn(() => true),
  isSubscriptionEntitlementEnabled: jest.fn(() => true),
  isInAppPurchaseEnabled: jest.fn(() => true),
  isAccountLoginEnabled: jest.fn(() => true),
  isDpadControllerSupported: jest.fn(() => true),
}));
jest.mock('./src/data', () => ({
  CostaRicaTopRatedData: jest.fn(() => []),
  AutoRotatorData: jest.fn(() => []),
  CostaRicaAttractionsData: jest.fn(() => []),
  CostaRicaIslandsData: jest.fn(() => []),
  CostaRicaUnderwaterData: jest.fn(() => []),
}));
jest.mock('./src/w3cmedia/shakaplayer/ShakaPlayer', () => ({
  ShakaPlayer: jest.fn(),
}));
jest.mock('./src/components/MovieCarousel', () => 'MovieCarousel');

jest.mock('./src/cfg/dataProviderFactory', () => ({
  createDataProvider: jest.fn(() => ({
    fetchData: jest.fn(),
  })),
}));
jest.mock('./src/utils/VideoHandler', () => ({
  VideoHandler: jest.fn().mockImplementation(() => ({
    destroyVideoElements: jest.fn(),
    setSelectedFileTypeAndData: jest.fn(),
    preBufferVideo: jest.fn(),
  })),
}));
jest.mock('./src/components/rotator/AutoRotator', () => 'AutoRotator');
jest.mock('./src/components/MovieGrid', () => 'MovieGrid');
jest.mock('./src/components/miniDetails/MiniDetails', () => 'MiniDetails');
jest.mock('./src/livetv/channelTunerHandler', () => {});
jest.mock('./src/components/RadioPicker', () => 'RadioPicker');
jest.mock('./src/components/GradientButton', () => 'GradientButton');
