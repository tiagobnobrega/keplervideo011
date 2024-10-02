import {
  ContentPersonalizationServer,
  PlaybackState,
} from '@amzn/kepler-content-personalization';
import {
  BackHandler,
  HWEvent,
  KeplerAppStateChange,
  useAddKeplerAppStateListenerCallback,
  useTVEventHandler,
} from '@amzn/react-native-kepler';
import { SafeAreaView } from '@amzn/react-native-safe-area-context';
import {
  KeplerCaptionsView,
  KeplerVideoSurfaceView,
  VideoPlayer,
} from '@amzn/react-native-w3cmedia';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';

import { RouteProp } from '@amzn/react-navigation__core';
import { StackNavigationProp } from '@amzn/react-navigation__stack';
import {
  AppStateStatus,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  AppStackParamList,
  AppStackScreenProps,
  Screens,
} from '../components/navigation/types';
import { isContentPersonalizationEnabled } from '../config/AppConfig';
import { CAPTION_DISABLE_ID, EVENT_KEY_DOWN, ReadyState } from '../constants';
import { getMockPlaybackEventForVideo } from '../mocks/ContentPersonalizationMocks';
import { COLORS } from '../styles/Colors';
import { VideoHandler } from '../utils/VideoHandler';
import BufferingWindow from '../w3cmedia/mediacontrols/BufferingWindow';
import VideoPlayerUI from '../w3cmedia/mediacontrols/VideoPlayerUI';
import { ShakaPlayer } from '../w3cmedia/shakaplayer/ShakaPlayer';

const BACKGROUND_STATE: AppStateStatus = 'background';

interface PlayerProps {
  navigation: StackNavigationProp<AppStackParamList, Screens.PLAYER_SCREEN>;
  route: RouteProp<AppStackParamList, Screens.PLAYER_SCREEN>;
}

const PlayerScreen = ({
  navigation,
  route,
}: AppStackScreenProps<Screens.PLAYER_SCREEN>) => {
  const { data, sendDataOnBack } = route.params;
  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions();
  const addKeplerAppStateListenerCallback =
    useAddKeplerAppStateListenerCallback();
  const [showBuffering, setShowBuffering] = React.useState<boolean>(true);
  // After media initialization once media loads isVideoInitialized will change to true.
  const [isVideoInitialized, setIsVideoInitialized] =
    React.useState<boolean>(false);
  const surfaceHandle = useRef<string | null>(null);
  const captionViewHandle = useRef<string | null>(null);

  const captionStatus = useRef<boolean | null>(null);
  const setCaptionStatus = (status: boolean) => {
    captionStatus.current = status;
  };
  const [captionID, setCaptionID] = React.useState<string>(CAPTION_DISABLE_ID);
  const setSelectedCaptionInVideoPlayer = (id: string) => {
    setCaptionID(id);
  };
  const [isVideoEnded, setVideoEnded] = React.useState<boolean>(false);
  const timer = useRef<null | ReturnType<typeof setTimeout> | number>(null);

  const videoRef = useRef<VideoPlayer | null>(null);
  const player = useRef<ShakaPlayer | null>(null);
  const TIME_TO_GO_BACK_IF_VIDEO_ENDS = 2300;
  const BACK_NAVIGATION_DELAY = 700;

  const videoHandler = new VideoHandler(
    videoRef,
    player,
    data,
    setIsVideoInitialized,
    setVideoEnded,
  );

  useTVEventHandler((evt: HWEvent) => {
    if (!Platform.isTV) {
      return;
    }
    if (evt && evt.eventKeyAction === EVENT_KEY_DOWN) {
      if (isVideoEnded) {
        clearTimeout(Number(timer.current));
        setVideoEnded(false);
      }
    }
  });

  useEffect(() => {
    if (!isVideoEnded) {
      return;
    }
    timer.current = setTimeout(() => {
      navigateBack();
    }, TIME_TO_GO_BACK_IF_VIDEO_ENDS);

    return () => clearTimeout(Number(timer.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoEnded]);

  useEffect(() => {
    //Initialize media player
    videoHandler.preBufferVideo();
    setupEventListeners();
    const changeSubscription = addKeplerAppStateListenerCallback(
      'change',
      handleAppStateChange,
    );
    return () => {
      changeSubscription.remove();
      clearTimeout(Number(timer.current));
      removeEventListeners();
      sendDataOnBack();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAppStateChange = (nextAppState: KeplerAppStateChange): void => {
    if (!videoRef.current || !videoRef?.current?.currentTime) {
      return;
    }
    if (
      nextAppState === BACKGROUND_STATE &&
      videoRef.current.currentTime > 0 &&
      !videoRef.current.paused &&
      !videoRef.current.ended &&
      videoRef.current.readyState > ReadyState.HAVE_CURRENT_DATA
    ) {
      setShowBuffering(false);
      videoRef.current?.pause();
      reportVideoPaused();
    }
  };

  const reportVideoPaused = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }

    console.log(
      'k_content_per: Reporting new playback event while navigating back',
    );
    try {
      const playbackEvent = getMockPlaybackEventForVideo(
        videoRef,
        videoRef.current!.currentSrc,
        PlaybackState.PAUSED,
      );
      ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
  }, []);

  useEffect(() => {
    return () => {
      /*
        When the player is unmounted we check if the instance is correctly destroyed,
        if not, it is destroyed (Used commonly with integration like EPG)
      */
      if (videoRef?.current) {
        surfaceHandle.current = null;
        captionViewHandle.current = null;
        videoRef.current?.clearSurfaceHandle('');
        videoRef?.current?.clearCaptionViewHandle('');
        videoHandler.destroyVideoElements();
        videoRef.current = null;
        clearTimeout(Number(timer.current));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateBack = useCallback(() => {
    if (captionStatus.current) {
      captionStatus.current = false;
      return true;
    }
    surfaceHandle.current = null;
    captionViewHandle.current = null;
    videoRef?.current?.clearSurfaceHandle('');
    videoRef?.current?.clearCaptionViewHandle('');
    videoHandler.destroyVideoElements();
    videoRef.current = null;
    clearTimeout(Number(timer.current));

    //Approx delay added to destroy media instance
    setTimeout(() => navigation.goBack(), BACK_NAVIGATION_DELAY);
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupEventListeners = useCallback(() => {
    if (Platform.isTV) {
      BackHandler.addEventListener('hardwareBackPress', navigateBack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Platform.isTV]);

  const removeEventListeners = useCallback(() => {
    if (Platform.isTV) {
      BackHandler.removeEventListener('hardwareBackPress', navigateBack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Platform.isTV]);

  const reportVideoPlaying = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }

    console.info('k_content_per: Reporting new playback event on playVideo()');
    try {
      const playbackEvent = getMockPlaybackEventForVideo(
        videoRef,
        videoRef.current!.currentSrc,
        PlaybackState.PLAYING,
      );
      console.info(
        `k_content_per: Reporting new playback event for PLAYING state: ${JSON.stringify(
          playbackEvent,
        )}`,
      );
      ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
  }, [videoRef]);

  const playVideo = useCallback(() => {
    // Hide bufferview and Play the video if allowed...
    videoRef?.current?.play();
    setShowBuffering(false);
    reportVideoPlaying();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef]);

  const setSurface = useCallback(() => {
    if (surfaceHandle.current) {
      videoRef.current?.setSurfaceHandle(surfaceHandle.current);
      // Play video once surface has created and set to media reference
      playVideo();
    }
  }, [playVideo]);

  const onSurfaceViewCreated = useCallback(
    (_surfaceHandle: string): void => {
      console.info('Creating video surface');
      surfaceHandle.current = _surfaceHandle;
      setSurface();
    },
    [setSurface],
  );

  const onSurfaceViewDestroyed = useCallback((_surfaceHandle: string): void => {
    // Clear surface on screen unmount
    videoRef.current?.clearSurfaceHandle(_surfaceHandle);
  }, []);

  const onCaptionViewCreated = useCallback((captionsHandle: string): void => {
    console.info('Creating video captions');
    captionViewHandle.current = captionsHandle;
    setCaptionViewHandle();
  }, []);

  const setCaptionViewHandle = () => {
    console.info('setting captionViewHandle on video');
    if (videoRef.current !== null && captionViewHandle.current !== null) {
      (videoRef.current as VideoPlayer).setCaptionViewHandle(
        captionViewHandle.current,
      );
    }
  };
  const onCaptionViewDestroyed = (captionsHandle: string): void => {
    console.log(`Destroying captionsHandle=${captionsHandle}`);
    if (videoRef.current !== null) {
      (videoRef.current as VideoPlayer).clearCaptionViewHandle(captionsHandle);
    }
    captionViewHandle.current = null;
  };

  return (
    <SafeAreaView style={styles.playerContainer} testID="safe-area-view">
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.surfaceContainer,
          {
            width: deviceWidth,
            height: deviceHeight,
          },
        ]}
        testID="touchable-opacity">
        {isVideoInitialized && (
          <>
            <KeplerVideoSurfaceView
              style={styles.videoSurface}
              onSurfaceViewCreated={onSurfaceViewCreated}
              onSurfaceViewDestroyed={onSurfaceViewDestroyed}
              testID="kepler-video-surface-view"
            />
            <KeplerCaptionsView
              onCaptionViewCreated={onCaptionViewCreated}
              onCaptionViewDestroyed={onCaptionViewDestroyed}
              style={styles.captions}
              show={captionID !== CAPTION_DISABLE_ID}
              testID="kepler-captions-view"
            />
          </>
        )}
        {showBuffering && <BufferingWindow />}
        {!showBuffering && (
          <VideoPlayerUI
            videoRef={videoRef}
            navigateBack={navigateBack}
            title={route.params.data.title}
            setCaptionStatus={setCaptionStatus}
            setSelectedCaptionInVideoPlayer={setSelectedCaptionInVideoPlayer}
          />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const playerScreenUnchanged = (
  prevProps: PlayerProps,
  nextProps: PlayerProps,
) => {
  return isEqual(prevProps, nextProps);
};
export default React.memo(PlayerScreen, playerScreenUnchanged);

export const styles = StyleSheet.create({
  captions: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  playerContainer: { backgroundColor: COLORS.GRAY, height: '100%' },
  surfaceContainer: { backgroundColor: COLORS.WHITE, alignItems: 'stretch' },

  videoSurface: { zIndex: 0 },
});
