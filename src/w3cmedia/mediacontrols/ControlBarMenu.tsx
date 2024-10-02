import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { scaleUxToDp } from '../../utils/pixelUtils';
import { CaptionMenu } from './Captions';

interface ControlBarMenuProps {
  captionMenuVisibility: boolean;
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  setSelectedCaptionInMenuBar: (id: string) => void;
}
const ControlBarMenu = React.memo(
  ({
    captionMenuVisibility,
    videoRef,
    setSelectedCaptionInMenuBar,
  }: ControlBarMenuProps) => {
    const setSelectedCaption = (id: string) => {
      setSelectedCaptionInMenuBar(id);
    };

    return (
      <View style={styles.playerMenusContainer}>
        <CaptionMenu
          captionMenuVisibility={captionMenuVisibility}
          video={videoRef.current as VideoPlayer}
          setSelectedCaption={setSelectedCaption}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  playerMenusContainer: {
    position: 'absolute',
    bottom: scaleUxToDp(90),
    right: 0,
  },
});

export default ControlBarMenu;
