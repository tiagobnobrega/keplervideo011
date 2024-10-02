import { isEqual } from 'lodash';
import React, { memo, RefObject, useRef } from 'react';
import { Animated, StyleSheet, Systrace, View } from 'react-native';

import {
  ContentIdNamespaces,
  ContentInteractionType,
  ContentPersonalizationServer,
} from '@amzn/kepler-content-personalization';
import { Card } from '@amzn/kepler-ui-components';
import { useNavigation } from '@amzn/react-navigation__native';
import { isContentPersonalizationEnabled } from '../config/AppConfig';
import {
  getMockContentID,
  getMockContentInteraction,
} from '../mocks/ContentPersonalizationMocks';
import { TitleData } from '../types/TitleData';
import { HomeScreenNavigationProps, Screens } from './navigation/types';

const FOCUSED_TILE_SCALE = 1.05;
const DEFAULT_TILE_SCALE = 1.0;
export interface VideoTileProps {
  index: number;
  data: TitleData;
  onFocus?: (title?: TitleData) => void;
  onBlur?: (title?: TitleData) => void;
  row?: number;
  firstElementRef?: RefObject<View> | null;
}

const VideoTile = ({
  data,
  onFocus,
  onBlur,
  index,
  row,
  firstElementRef,
}: VideoTileProps) => {
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const focusableElementRef = useRef<View>(null);
  const animatedScale = useRef(new Animated.Value(DEFAULT_TILE_SCALE)).current;

  const reportContentNavigation = () => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }

    const contentInteraction = getMockContentInteraction(
      ContentInteractionType.DETAIL_VIEW,
      getMockContentID(data.title, ContentIdNamespaces.NAMESPACE_CDF_ID),
    );
    console.info(
      `k_content_per: Reporting new content interaction. Ingressing into Detail view for title : ${data.title}`,
    );
    ContentPersonalizationServer.reportNewContentInteraction(
      contentInteraction,
    );
  };

  const navigateToDetailsScreen = async () => {
    Systrace.beginEvent('nav:detail-screen');
    reportContentNavigation();

    navigation.push(Screens.DETAILS_SCREEN, {
      data: data,
      sendDataOnBack: handleFocusOnBack,
    });

    Systrace.endEvent();
  };

  const handleFocusOnBack = (id: number | string) => {
    if (id === data.id) {
      //if user clicked first tile then focus on first tile when user comes back
      if (index === 0 && row === 0) {
        firstElementRef?.current?.focus();
      } else {
        focusableElementRef.current?.focus();
      }
    }
  };

  const startScaledAnimation = (scale: number) => {
    Animated.timing(animatedScale, {
      toValue: scale,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const onFocusHandler = () => {
    startScaledAnimation(FOCUSED_TILE_SCALE);
    onFocus?.(data);
  };

  const firstTileBlur = () => {
    firstElementRef?.current?.blur();
  };

  const onBlurHandler = () => {
    startScaledAnimation(DEFAULT_TILE_SCALE);
    if (index === 0 && row === 0) {
      firstTileBlur();
    } else {
      focusableElementRef.current?.blur();
    }
    onBlur?.(data);
  };

  return (
    <Animated.View
      ref={index === 0 && row === 0 ? firstElementRef : focusableElementRef}
      testID={`tileContainer${data.id}`}
      style={[styles.container, { transform: [{ scale: animatedScale }] }]}
      // @ts-ignore // TS 2339: Property 'onFocus' does not exist on type 'Animated.View'.
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}>
      <Card
        orientation={'vertical'}
        size="md"
        testID={`card${data.id}`}
        onPress={navigateToDetailsScreen}>
        <Card.Image
          source={{
            uri: data.thumbnail,
          }}
          edgeToEdge
        />
      </Card>
    </Animated.View>
  );
};

const dataUnchanged = (
  prevProps: VideoTileProps,
  nextProps: VideoTileProps,
) => {
  return isEqual(prevProps.data, nextProps.data);
};
export default memo(VideoTile, dataUnchanged);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
