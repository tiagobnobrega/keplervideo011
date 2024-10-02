import { useTVEventHandler } from '@amzn/react-native-kepler';
import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import { consoleInfoSpy } from '../../../jest.setup';
import { DPADEventType } from '../../../src/constants';
import { getMockPlaybackEventForVideo } from '../../../src/mocks/ContentPersonalizationMocks';
import VideoPlayerUI from '../../../src/w3cmedia/mediacontrols/VideoPlayerUI';
import { asMock } from '../../common/testsHelper';

jest.mock('@amzn/kepler-content-personalization', () => ({
  __esModule: true,
  ContentPersonalizationServer: jest.fn(),
}));
let videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    setSurfaceHandle: jest.fn(),
    setCaptionViewHandle: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    textTracks: {
      length: 2,
      getTrackById: jest.fn(id => ({
        mode: id === '0' ? 'showing' : 'hidden',
      })),
    },
  } as unknown as VideoPlayer,
};
const setCaptionStatusMock = jest.fn();
const setSelectedCaptionInVideoPlayerMock = jest.fn();
const renderVideoPlayerUI = (
  videoRefParam?: React.MutableRefObject<VideoPlayer | null> | undefined,
) => {
  return (
    <VideoPlayerUI
      videoRef={videoRefParam || videoRef}
      title={'Beautiful Whale Tail Uvita Costa Rica'}
      navigateBack={jest.fn()}
      setCaptionStatus={setCaptionStatusMock}
      setSelectedCaptionInVideoPlayer={setSelectedCaptionInVideoPlayerMock}
    />
  );
};
describe('BufferingWindow Test Cases', () => {
  it('renders correctly', () => {
    const tree = render(renderVideoPlayerUI());
    expect(tree).toMatchSnapshot();
  });

  it('View main is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('video-player-ui-view');
    expect(view).toBeDefined();
  });

  it('SubView is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('video-player-ui-view-two');
    expect(view).toBeDefined();
  });

  it('PlaybackControls is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('player-btn-seek-backward');
    expect(view).toBeDefined();
  });

  it('ControlBar is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('control-bar');
    expect(view).toBeDefined();
  });

  it('ControlBarMenu is present in component', async () => {
    const { queryByTestId } = render(renderVideoPlayerUI());
    const view = queryByTestId('view-control-bar-menu');
    expect(view).toBeDefined();
  });
});

describe('PlayerScreen hooks', () => {
  let mockUseTVEventHandler: (arg0: {
    eventKeyAction: number;
    eventType: DPADEventType | 'error';
  }) => void;

  beforeEach(() => {
    jest
      .spyOn(require('react-native').Platform, 'isTV', 'get')
      .mockReturnValue(true);
    mockUseTVEventHandler = asMock(useTVEventHandler).mock.calls[0][0];
  });

  test('useTVEventHandler called with TV and DPADEventType.PLAYPAUSE with pause', async () => {
    videoRef = {
      current: {
        ...videoRef.current,
        paused: true,
      } as unknown as VideoPlayer,
    };
    render(renderVideoPlayerUI(videoRef));
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.PLAYPAUSE,
    });

    expect(videoRef?.current?.paused).toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : playpause',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.PLAYPAUSE without pause', async () => {
    videoRef = {
      current: {
        ...videoRef.current,
        paused: false,
      } as unknown as VideoPlayer,
    };
    render(renderVideoPlayerUI());
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.PLAYPAUSE,
    });

    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : playpause',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.PLAY', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.PLAY,
    });
    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : play',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.PAUSE', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.PAUSE,
    });
    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : pause',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.SKIPFORWARD', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.SKIPFORWARD,
    });
    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : skip_forward',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.SKIPBACKWARD', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.SKIPBACKWARD,
    });
    expect(videoRef?.current?.paused).not.toBeTruthy();
    expect(getMockPlaybackEventForVideo).toBeDefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: VideoPlayerUI : skip_backward',
    );
  });

  test('useTVEventHandler called with TV and DPADEventType.BACK', async () => {
    videoRef = {
      current: {
        ...videoRef.current,
        paused: false,
      } as unknown as VideoPlayer,
    };
    const { getByTestId } = render(renderVideoPlayerUI());
    const controlBar = getByTestId('control-bar');

    expect(controlBar.props.children.props.captionMenuVisibility).toBe(false);

    controlBar.props.children.props.onPress();
    expect(controlBar.props.children.props.captionMenuVisibility).toBe(true);
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: DPADEventType.BACK,
    });

    expect(setCaptionStatusMock).toHaveBeenCalled();
  });

  test('useTVEventHandler called with TV and error', async () => {
    mockUseTVEventHandler({
      eventKeyAction: 0,
      eventType: 'error',
    });
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});
