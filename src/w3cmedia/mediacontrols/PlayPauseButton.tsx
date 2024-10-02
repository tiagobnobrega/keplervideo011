import {
  ContentPersonalizationServer,
  PlaybackState,
} from '@amzn/kepler-content-personalization';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { isContentPersonalizationEnabled } from '../../config/AppConfig';
import { getMockPlaybackEventForVideo } from '../../mocks/ContentPersonalizationMocks';
import PlayerButton from './PlayerButton';
import { ControlBarButtonProps } from './types/ControlBar';

const PlayPauseButton = React.forwardRef(
  (
    { videoRef, onBlur }: ControlBarButtonProps,
    ref: React.ForwardedRef<TouchableOpacity>,
  ) => {
    const initalPlayingState =
      !videoRef.current?.paused && !videoRef.current?.ended;
    const [playing, setPlaying] = useState<boolean>(initalPlayingState);

    useEffect(() => {
      addEventListeners();
      return () => {
        removeEventListeners();
      };
    });

    const onEndedUpdate = (): void => {
      if (videoRef.current) {
        //When the video ends, the play/pause icon does not change, and isPaused returns 0.
        //To handle that call pause API when the video ends.
        videoRef.current.pause();
        setPlaying(false);
      }
    };

    const addEventListeners = () => {
      videoRef.current?.addEventListener('play', onPlay);
      videoRef.current?.addEventListener('pause', onPause);
      videoRef.current?.addEventListener('ended', onEndedUpdate);
    };

    const removeEventListeners = () => {
      videoRef.current?.removeEventListener('play', onPlay);
      videoRef.current?.removeEventListener('pause', onPause);
      videoRef.current?.removeEventListener('ended', onEndedUpdate);
    };

    const onPause = () => {
      setPlaying(false);
    };

    const onPlay = () => {
      setPlaying(true);
    };

    const pause = () => {
      videoRef?.current?.pause();

      try {
        if (isContentPersonalizationEnabled()) {
          console.info('k_content_per: Creating playbackEvent object in pause');
          const playbackEvent = getMockPlaybackEventForVideo(
            videoRef,
            videoRef.current!.currentSrc,
            PlaybackState.PAUSED,
          );
          ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
          console.log(
            `k_content_per: Pause : Reporting new playback event :${JSON.stringify(
              playbackEvent,
            )}`,
          );
        }
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    };

    const play = () => {
      videoRef?.current?.play();
      try {
        if (isContentPersonalizationEnabled()) {
          console.info('k_content_per: Creating playbackEvent object in play');
          const playbackEvent = getMockPlaybackEventForVideo(
            videoRef,
            videoRef.current!.currentSrc,
            PlaybackState.PLAYING,
          );
          ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
          console.log(
            `k_content_per: Reporting new playback event : ${JSON.stringify(
              playbackEvent,
            )}`,
          );
        }
      } catch (e) {
        console.error(`k_content_per: ${e}`);
      }
    };
    return (
      <PlayerButton
        onPress={playing ? pause : play}
        icon={playing ? 'pause' : 'play-arrow'}
        size={70}
        ref={ref}
        onBlur={onBlur}
        testID="player-btn-play-pause"
      />
    );
  },
);

export default PlayPauseButton;
