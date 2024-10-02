import {
  ContentPersonalizationServer,
  PlaybackState,
} from '@amzn/kepler-content-personalization';
import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { isContentPersonalizationEnabled } from '../../config/AppConfig';
import { getMockPlaybackEventForVideo } from '../../mocks/ContentPersonalizationMocks';
import PlayerButton from './PlayerButton';
import PlayPauseButton from './PlayPauseButton';
import { ControlBarButtonProps, PlayerControlType } from './types/ControlBar';

const DEFAULT_SEEK_TIME = 10;

export const seek = (
  seekSeconds: number,
  videoRef: React.MutableRefObject<VideoPlayer | null>,
) => {
  if (typeof videoRef.current?.currentTime === 'number') {
    const { currentTime, duration } = videoRef.current;
    let newTime = currentTime + seekSeconds;
    if (newTime > duration) {
      newTime = duration;
    } else if (newTime < 0) {
      newTime = 0;
    }
    videoRef.current.currentTime = newTime;
  } else {
    return;
  }
};

const seekForward = (videoRef: React.MutableRefObject<VideoPlayer | null>) => {
  seek(DEFAULT_SEEK_TIME, videoRef);
};
const seekBackward = (videoRef: React.MutableRefObject<VideoPlayer | null>) => {
  seek(-DEFAULT_SEEK_TIME, videoRef);
};

export let throttling = false;
export const throttleSeek = (func: () => void, delay: number) => {
  if (!throttling) {
    throttling = true;
    func();
    setTimeout(() => {
      throttling = false;
    }, delay);
  }
};

export const PlaybackControls = React.memo(
  ({ videoRef, playerControlType }: ControlBarButtonProps) => {
    const playPauseRef = useRef<TouchableOpacity>(null);
    const skipBackwardRef = useRef<TouchableOpacity>(null);
    const skipForwardRef = useRef<TouchableOpacity>(null);

    const onBlurPlayPause = () => {
      playPauseRef?.current?.blur();
    };
    const onBlurBackwardSeek = () => {
      skipBackwardRef?.current?.blur();
    };

    const onBlurForwardSeek = () => {
      skipForwardRef?.current?.blur();
    };
    useEffect(() => {
      playPauseRef?.current?.focus();
    }, []);

    useEffect(() => {
      switch (playerControlType) {
        case PlayerControlType.PLAYPAUSE:
          playPauseRef?.current?.focus();
          break;
        case PlayerControlType.SKIPBACKWARD:
          skipBackwardRef?.current?.focus();
          break;
        case PlayerControlType.SKIPFORWARD:
          skipForwardRef?.current?.focus();
          break;
      }
    }, [playerControlType]);

    const handleSeekBackward = useCallback(() => {
      console.info('k_content_per: calling seekBackward');
      throttleSeek(() => {
        seekBackward(videoRef);
      }, 500);
      try {
        if (isContentPersonalizationEnabled()) {
          const playbackEvent = getMockPlaybackEventForVideo(
            videoRef,
            videoRef.current!.currentSrc,
            PlaybackState.PLAYING,
          );
          ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
          console.log(
            `k_content_per: Seek Backwards : Reporting new playback event : ${JSON.stringify(
              playbackEvent,
            )}`,
          );
        }
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    }, [videoRef]);

    const handleSeekForward = useCallback(() => {
      console.info('k_content_per: calling seekForward');
      throttleSeek(() => {
        seekForward(videoRef);
      }, 500);
      try {
        if (isContentPersonalizationEnabled()) {
          const playbackEvent = getMockPlaybackEventForVideo(
            videoRef,
            videoRef.current!.currentSrc,
            PlaybackState.PLAYING,
          );
          ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
          console.log(
            `k_content_per: Seek Forwards : Reporting new playback event : ${JSON.stringify(
              playbackEvent,
            )}`,
          );
        }
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    }, [videoRef]);
    return (
      <View style={styles.playbackControls}>
        <PlayerButton
          key={'player-btn-seek-backward'}
          ref={skipBackwardRef}
          onBlur={onBlurBackwardSeek}
          onPress={handleSeekBackward}
          icon={'replay-10'}
          testID="player-btn-seek-backward"
          size={70}
        />
        <PlayPauseButton
          videoRef={videoRef}
          ref={playPauseRef}
          onBlur={onBlurPlayPause}
        />
        <PlayerButton
          key={'player-btn-seek-forward'}
          onPress={handleSeekForward}
          icon={'forward-10'}
          testID="player-btn-seek-forward"
          size={70}
          ref={skipForwardRef}
          onBlur={onBlurForwardSeek}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
