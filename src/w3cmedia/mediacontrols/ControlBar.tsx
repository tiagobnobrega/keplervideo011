import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CaptionButton from './CaptionButton';

export interface ControlBarProps {
  captions: () => void;
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  captionMenuVisibility: boolean;
  playerControlType?: string;
  isCaptionButtonFocused: boolean | null;
}
export const ControlBar = ({
  captions,
  videoRef,
  captionMenuVisibility,
  playerControlType,
  isCaptionButtonFocused,
}: ControlBarProps) => {
  return (
    <View style={styles.controlBar} testID="control-bar">
      <CaptionButton
        playerControlType={playerControlType}
        video={videoRef.current as VideoPlayer}
        onPress={captions}
        testID={'video-player-caption-btn'}
        captionMenuVisibility={captionMenuVisibility}
        isCaptionButtonFocused={isCaptionButtonFocused}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
