import {
  ContentPersonalizationServer,
  IPlaybackEvent,
  PlaybackState,
} from '@amzn/kepler-content-personalization';
import { HWEvent, useTVEventHandler } from '@amzn/react-native-kepler';
import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { isContentPersonalizationEnabled } from '../../config/AppConfig';
import { DPADEventType, EVENT_KEY_DOWN } from '../../constants';
import { getMockPlaybackEventForVideo } from '../../mocks/ContentPersonalizationMocks';
import { ControlBar } from './ControlBar';
import ControlBarMenu from './ControlBarMenu';
import { PlaybackControls } from './PlaybackControls';
import Header from './VideoPlayerHeader';
interface VideoPlayerUIProps {
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  navigateBack: () => void;
  title: string;
  setCaptionStatus: (status: boolean) => void;
  setSelectedCaptionInVideoPlayer: (id: string) => void;
}

export const VideoPlayerUI = ({
  navigateBack,
  title,
  videoRef,
  setCaptionStatus,
  setSelectedCaptionInVideoPlayer,
}: VideoPlayerUIProps) => {
  const [captionMenuVisibility, setCaptionMenuVisibility] =
    useState<boolean>(false);

  const setSelectedCaptionInMenuBar = (id: string) => {
    setSelectedCaptionInVideoPlayer(id);
  };

  const [playerControlType, setPlayerControlType] = useState<string>('');
  const [isCaptionButtonFocused, setCaptionButtonFocused] = useState(false);

  useTVEventHandler((evt: HWEvent) => {
    if (!Platform.isTV) {
      return;
    }
    if (evt && evt.eventKeyAction === EVENT_KEY_DOWN) {
      let playbackEvent: IPlaybackEvent | undefined;
      setPlayerControlType(evt.eventType);

      if (videoRef.current) {
        try {
          if (evt.eventType === DPADEventType.PLAYPAUSE) {
            console.info('k_content_per: VideoPlayerUI : playpause');
            if (videoRef.current.paused) {
              playbackEvent = getMockPlaybackEventForVideo(
                videoRef,
                title,
                PlaybackState.PLAYING,
              );
            } else {
              playbackEvent = getMockPlaybackEventForVideo(
                videoRef,
                title,
                PlaybackState.PAUSED,
              );
            }
          } else if (evt.eventType === DPADEventType.PLAY) {
            console.info('k_content_per: VideoPlayerUI : play');
            playbackEvent = getMockPlaybackEventForVideo(
              videoRef,
              title,
              PlaybackState.PLAYING,
            );
          } else if (evt.eventType === DPADEventType.PAUSE) {
            console.info('k_content_per: VideoPlayerUI : pause');
            playbackEvent = getMockPlaybackEventForVideo(
              videoRef,
              title,
              PlaybackState.PAUSED,
            );
          } else if (evt.eventType === DPADEventType.SKIPFORWARD) {
            console.info('k_content_per: VideoPlayerUI : skip_forward');
            playbackEvent = getMockPlaybackEventForVideo(
              videoRef,
              title,
              PlaybackState.PLAYING,
            );
          } else if (evt.eventType === DPADEventType.SKIPBACKWARD) {
            console.info('k_content_per: VideoPlayerUI : skip_backward');
            playbackEvent = getMockPlaybackEventForVideo(
              videoRef,
              title,
              PlaybackState.PLAYING,
            );
          } else if (evt.eventType === DPADEventType.BACK) {
            if (captionMenuVisibility) {
              setCaptionMenuVisibility(false);
            }
            setCaptionStatus(captionMenuVisibility);
            setCaptionButtonFocused(captionMenuVisibility);
          }
        } catch (e) {
          console.error(`k_content_per: ${e}`);
        }
      }

      if (playbackEvent) {
        if (isContentPersonalizationEnabled()) {
          console.log(
            `k_content_per: useTvEventHandler: Reporting new playback event : ${JSON.stringify(
              playbackEvent,
            )}`,
          );
          ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
        }
      }
    }
  });

  const toggleCaption = () => {
    setCaptionMenuVisibility(!captionMenuVisibility);
  };

  return (
    <View style={styles.uiContainer} testID="video-player-ui-view">
      <View style={styles.ui}>
        <Header navigateBack={navigateBack} title={title} />
        <PlaybackControls
          videoRef={videoRef}
          playerControlType={playerControlType}
        />
        <ControlBar
          videoRef={videoRef}
          captions={toggleCaption}
          captionMenuVisibility={captionMenuVisibility}
          playerControlType={playerControlType}
          isCaptionButtonFocused={isCaptionButtonFocused}
        />
      </View>
      <ControlBarMenu
        captionMenuVisibility={captionMenuVisibility}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ui: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
  },
  uiContainer: {
    position: 'absolute',
    zIndex: 5,
    height: '100%',
    width: '100%',
  },
});

export default VideoPlayerUI;
