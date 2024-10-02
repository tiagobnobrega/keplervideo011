import { TVFocusGuideView } from '@amzn/react-native-kepler';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DPADEventType } from '../../constants';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';
import PlayerButton from './PlayerButton';
import { CaptionButtonProps } from './types/Captions';

const CaptionEnabledIcon = 'closed-caption';
const CaptionDisabledIcon = 'closed-caption-disabled';
const CaptionUnavailableIcon = 'closed-caption-off';

const CaptionButton = React.memo(
  ({
    onPress,
    video,
    captionMenuVisibility,
    testID,
    playerControlType,
    isCaptionButtonFocused,
  }: CaptionButtonProps) => {
    const captionsExist = video?.textTracks?.length > 0 ? true : false;
    const captionButtonRef = useRef<TouchableOpacity>(null);
    const onBlurCaptionButton = () => {
      captionButtonRef?.current?.blur();
    };
    let CaptionIcon = CaptionUnavailableIcon;
    if (captionsExist) {
      CaptionIcon = CaptionEnabledIcon;
    } else {
      CaptionIcon = CaptionDisabledIcon;
    }
    useEffect(() => {
      if (
        playerControlType === DPADEventType.BACK &&
        !captionMenuVisibility &&
        isCaptionButtonFocused
      ) {
        captionButtonRef.current?.focus();
      }
    }, [playerControlType, captionMenuVisibility, isCaptionButtonFocused]);

    return (
      <TVFocusGuideView trapFocusLeft={captionMenuVisibility}>
        <PlayerButton
          ref={captionButtonRef}
          onBlur={onBlurCaptionButton}
          onPress={onPress}
          icon={CaptionIcon}
          size={40}
          overrideStyle={
            captionMenuVisibility ? styles.captionSelected : undefined
          }
          testID={testID}
        />
      </TVFocusGuideView>
    );
  },
);

const styles = StyleSheet.create({
  captionSelected: {
    backgroundColor: COLORS.DARK_GRAY + 'D9',
    borderRadius: scaleUxToDp(40),
  },
});
export default CaptionButton;
