import { SafeAreaView } from '@amzn/react-native-safe-area-context';
import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import { RouteProp } from '@amzn/react-navigation__core';
import { StackNavigationProp } from '@amzn/react-navigation__stack';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { fireEvent, render } from '@testing-library/react-native';
import { default as React } from 'react';
import 'react-native';
import { BackHandler } from 'react-native';
import {
  AppStackParamList,
  Screens,
} from '../../src/components/navigation/types';
import { CAPTION_DISABLE_ID } from '../../src/constants';
import PlayerScreen, { styles } from '../../src/screens/PlayerScreen';
import { TitleData } from '../../src/types/TitleData';
import { VideoHandler } from '../../src/utils/VideoHandler';
import { ShakaPlayer } from '../../src/w3cmedia/shakaplayer/ShakaPlayer';

const tileData: TitleData = {
  id: '169313',
  title: 'Beautiful Whale Tail Uvita Costa Rica',
  description: 'Beautiful Whale Tail Uvita Costa Rica',
  duration: 86,
  thumbnail:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  posterUrl:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  videoUrl:
    'https://edge-vod-media.cdn01.net/encoded/0000169/0169313/video_1880k/T7J66Z106.mp4?source=firetv&channelID=13454',
  categories: ['Costa Rica Islands'],
  channelID: '13454',
  rating: '2.5',
  mediaType: 'video',
  mediaSourceType: 'url',
  format: 'MP4',
  secure: false,
  uhd: true,
  rentAmount: '135',
} as TitleData;

const tileDataTwo: TitleData = {
  id: '169322',
  title: 'Big Buck Bunny: The Dark Truths',
  description: 'HLS format Big Buck Bunny: The Dark Truths',
  duration: 205,
  thumbnail:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  posterUrl:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  videoUrl:
    'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
  categories: ['Costa Rica Underwater'],
  channelID: '13455',
  rating: '2.5',
  mediaType: 'video',
  mediaSourceType: 'url',
  format: 'HLS',
  secure: false,
  uhd: false,
  textTrack: [
    {
      label: 'Sample CC 1',
      language: 'en',
      uri: 'https://mtoczko.github.io/hls-test-streams/test-vtt-ts-segments/text/1.vtt',
      mimeType: 'application/x-subtitle-vtt',
    },
    {
      label: 'Sample CC 2',
      language: 'es',
      uri: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt',
      mimeType: 'application/x-subtitle-vtt',
    },
  ],
  rentAmount: '135',
} as TitleData;

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  isTV: true,
}));
jest.mock('react-native', () => ({
  BackHandler: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    removeEventListener: jest.fn(),
  },
}));
jest.mock('../../src/constants', () => ({
  ReadyState: jest.requireActual('../../src/constants'),
  CAPTION_DISABLE_ID: jest.requireActual('../../src/constants')
    .CAPTION_DISABLE_ID,
}));

jest.mock('../../src/utils/VideoHandler', () => {
  let internalData = tileData;
  let internalFileType = tileData.format;
  const vidRef: React.MutableRefObject<VideoPlayer | null> = {
    current: {
      setSurfaceHandle: jest.fn(),
      setCaptionViewHandle: jest.fn(),
      currentTime: 1000,
      readyState: 3,
      play: jest.fn(),
      pause: jest.fn(),
      clearSurfaceHandle: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as VideoPlayer,
  };
  const playerRef: React.MutableRefObject<ShakaPlayer | null> = {
    current: {
      load: jest.fn(),
      unload: jest.fn(),
    } as unknown as ShakaPlayer,
  };
  return {
    VideoHandler: jest.fn().mockImplementation(() => ({
      selectedFileType: 'MP4',
      videRef: vidRef,
      playerRef: playerRef,
      data: internalData,
      internalFileType: internalFileType,
      destroyVideoElements: jest.fn(),
      preBufferVideo: jest.fn(),
      onLoadeMetaData: jest.fn(),
    })),
  };
});

jest.mock('@amzn/react-native-safe-area-context', () => {
  const MockSafeAreaView = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  return {
    __esModule: true,
    SafeAreaView: MockSafeAreaView,
  };
});

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Dimensions.get = jest.fn().mockImplementation(() => {
    return {
      width: 375,
      height: 667,
    };
  });
  return RN;
});

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    setSurfaceHandle: jest.fn(),
    setCaptionViewHandle: jest.fn(),
    currentTime: 1000,
    readyState: 3,
    play: jest.fn(),
    pause: jest.fn(),
    clearSurfaceHandle: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  } as unknown as VideoPlayer,
};

const playerRef: React.MutableRefObject<ShakaPlayer | null> = {
  current: {
    load: jest.fn(),
    unload: jest.fn(),
  } as unknown as ShakaPlayer,
};

const mockedNavigate = jest.fn();
const sendDataOnBack = jest.fn();
const mockedNavigation = {
  navigate: mockedNavigate,
  goBack: mockedNavigate,
} as unknown as StackNavigationProp<
  AppStackParamList,
  Screens.PLAYER_SCREEN,
  undefined
>;
const mockRoute = {
  key: '',
  params: {
    data: tileData,
    sendDataOnBack: sendDataOnBack,
  },
  name: Screens.PLAYER_SCREEN,
} as unknown as RouteProp<AppStackParamList, Screens.PLAYER_SCREEN>;

const renderPlayerScreen = () => {
  return (
    <PlayerScreen
      navigation={mockedNavigation}
      route={{
        ...mockRoute,
        params: {
          ...mockRoute.params,
        },
      }}
    />
  );
};

jest.mock('../../src/w3cmedia/mediacontrols/BufferingWindow');
jest.mock('../../src/w3cmedia/mediacontrols/VideoPlayerUI');

describe('PlayerScreen rendering Test Cases', () => {
  const setState = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockSetState: any;
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetState = jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, setState]) //setShowBuffering
      .mockImplementationOnce(() => [false, setState]) //setIsVideoInitialized
      .mockImplementationOnce(() => [CAPTION_DISABLE_ID, setState]); //setCaptionID
  });

  it('renders correctly screenshot match', () => {
    const tree = render(renderPlayerScreen());
    expect(tree).toMatchSnapshot();
  });

  it('SafeAreaView is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const safeAreaView = queryByTestId('safe-area-view');
    expect(safeAreaView).toBeDefined();
  });

  it('SafeAreaView is rendered with correct styles', async () => {
    const { UNSAFE_queryAllByType } = render(renderPlayerScreen());
    const safeAreaView = UNSAFE_queryAllByType(SafeAreaView);
    const safeAreaViewWithStyles = safeAreaView.find(
      safeArea => safeArea.props.style === styles.playerContainer,
    );
    expect(safeAreaViewWithStyles).toBeTruthy();
  });

  it('TouchableOpacity is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const touchableOpacity = queryByTestId('touchable-opacity');
    expect(touchableOpacity).toBeDefined();
  });

  it('KeplerVideoSurfaceView is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const keplerVideoSurfaceView = queryByTestId('kepler-video-surface-view');
    expect(keplerVideoSurfaceView).toBeDefined();
  });

  it('KeplerVideoSurfaceView should not show on initial render', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const keplerVideoSurfaceView = queryByTestId('kepler-video-surface-view');
    expect(keplerVideoSurfaceView).not.toBeOnTheScreen();
  });

  it('KeplerCaptionsView is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const keplerCaptionsView = queryByTestId('kepler-captions-view');
    expect(keplerCaptionsView).toBeDefined();
  });

  it('KeplerCaptionsView should not show on initial render', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const keplerCaptionsView = queryByTestId('kepler-captions-view');
    expect(keplerCaptionsView).not.toBeOnTheScreen();
  });

  it('BufferingWindow is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const bufferingWindow = queryByTestId('buffering-view');
    expect(bufferingWindow).toBeDefined();
  });

  it('BufferingWindow should show on initial render', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const bufferingWindow = queryByTestId('buffering-view');
    expect(bufferingWindow).not.toBeOnTheScreen();
  });

  it('VideoPlayerUI is present in component', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const videoPlayerUIView = queryByTestId('video-player-ui-view');
    expect(videoPlayerUIView).toBeDefined();
  });

  it('VideoPlayerUi should not show on initial render', async () => {
    const { queryByTestId } = render(renderPlayerScreen());
    const videoPlayerUi = queryByTestId('video-player-ui-view');
    expect(videoPlayerUi).not.toBeOnTheScreen();
  });
});
describe('VideoHandler.....', () => {
  let setIsVideoInitialized, setIsVideoEnded;
  beforeEach(() => {
    setIsVideoInitialized = jest.fn();
    setIsVideoEnded = jest.fn();
  });
  test('should initialize VideoHandler with correct values', () => {
    const handler = new VideoHandler(
      videoRef,
      playerRef,
      tileData,
      setIsVideoInitialized,
      setIsVideoEnded,
    );
    expect(handler).not.toBeNull();
    expect(handler.selectedFileType).toEqual('MP4');
    expect(handler.videoRef).not.toBeNull();
    expect(handler.player).not.toBeNull();
    expect(handler.data).toBe(tileData);
  });
});

describe('PlayerScreen with React.memo', () => {
  it('renders only when props change', async () => {
    const { rerender, getByTestId } = render(
      <PlayerScreen navigation={mockedNavigation} route={mockRoute} />,
    );
    const isEqualSpy = jest.spyOn(require('lodash'), 'isEqual');
    rerender(<PlayerScreen navigation={mockedNavigation} route={mockRoute} />);
    expect(isEqualSpy).toHaveBeenCalledWith(
      {
        navigation: mockedNavigation,
        route: mockRoute,
      },
      {
        navigation: mockedNavigation,
        route: mockRoute,
      },
    );
    rerender(
      <PlayerScreen
        navigation={mockedNavigation}
        route={{
          ...mockRoute,
          params: {
            ...mockRoute.params,
            data: tileDataTwo,
          },
        }}
      />,
    );
    expect(isEqualSpy).toHaveBeenCalledWith(
      {
        navigation: mockedNavigation,
        route: mockRoute,
      },
      {
        navigation: mockedNavigation,
        route: {
          ...mockRoute,
          params: {
            ...mockRoute.params,
            data: tileDataTwo,
          },
        },
      },
    );
    expect(getByTestId('touchable-opacity')).toBeTruthy();
  });
});

describe('PlayerScreen hooks', () => {
  let component: any;
  let clearTimeOutSpy: any;

  beforeEach(() => {
    component = render(renderPlayerScreen());
    clearTimeOutSpy = jest.spyOn(global, 'clearTimeout');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('useTVEventHandler: clearTimeOut when video is finished', async () => {
    fireEvent(component.queryByTestId('touchable-opacity'), 'TVRemoteCommand', {
      eventKeyAction: 0,
    });
    expect(clearTimeOutSpy).not.toHaveBeenCalled();
  });

  test('BackHandler.addEventListener needs to defined', () => {
    jest
      .spyOn(BackHandler, 'addEventListener')
      .mockImplementation((eventName: any, navigateBack: any) => {
        if (eventName === 'hardwareBackPress') {
          navigateBack();
        }
        return {
          remove: () => {},
        };
      });

    expect(BackHandler.addEventListener).toBeDefined();
  });

  let mockAddKeplerAppStateListenerCallback;

  test('useAddKeplerAppStateListenerCallback ', () => {
    const {
      useAddKeplerAppStateListenerCallback,
    } = require('@amzn/react-native-kepler');
    const mockChangeSubscription = {
      remove: jest.fn(),
    };
    mockAddKeplerAppStateListenerCallback = jest
      .fn()
      .mockReturnValue(mockChangeSubscription);
    useAddKeplerAppStateListenerCallback.mockReturnValue(
      mockAddKeplerAppStateListenerCallback,
    );
    const { unmount } = render(renderPlayerScreen());
    expect(mockAddKeplerAppStateListenerCallback).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
    const handleAppStateChange =
      mockAddKeplerAppStateListenerCallback.mock.calls[0][1];
    handleAppStateChange('background');
    expect(mockChangeSubscription.remove).not.toHaveBeenCalled();
    unmount();
    expect(mockChangeSubscription.remove).toHaveBeenCalledWith();
  });

  test('useAddKeplerAppStateListenerCallback With videoRef.current as null', () => {
    const {
      useAddKeplerAppStateListenerCallback,
    } = require('@amzn/react-native-kepler');
    const mockChangeSubscription = {
      remove: jest.fn(),
    };
    mockAddKeplerAppStateListenerCallback = jest
      .fn()
      .mockReturnValue(mockChangeSubscription);
    useAddKeplerAppStateListenerCallback.mockReturnValue(
      mockAddKeplerAppStateListenerCallback,
    );
    const { unmount } = render(renderPlayerScreen());
    expect(mockAddKeplerAppStateListenerCallback).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
    const handleAppStateChange =
      mockAddKeplerAppStateListenerCallback.mock.calls[0][1];
    handleAppStateChange('background');
    expect(mockChangeSubscription.remove).not.toHaveBeenCalled();
    unmount();
    expect(mockChangeSubscription.remove).toHaveBeenCalledWith();
  });
});
