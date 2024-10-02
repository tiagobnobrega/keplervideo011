import { isEqual } from 'lodash';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';

interface PageIndicatorProps {
  autoRotatingItems: any;
  currentScrollIndex: number;
}

const PageIndicator = ({
  autoRotatingItems,
  currentScrollIndex,
}: PageIndicatorProps) => {
  return (
    <Animated.View style={[styles.pageIndicatorContainerView]}>
      <View style={[styles.pageIndicatorContainerView]}>
        <View style={styles.pageIndicatorBackground}>
          {autoRotatingItems.map((i: Animated.Animated, index: number) => {
            const translateX = Animated.multiply(
              Animated.subtract(currentScrollIndex, i),
              10,
            );
            const transform = {
              transform: [{ translateX }],
            };
            return (
              <View style={styles.pageIndicatorCircleView} key={index}>
                <Animated.View
                  testID={`id_autorotator_progress_${index}`}
                  style={[styles.pageIndicatorMovingCircleView, transform]}
                />
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

const PageIndicatorUnchanged = (
  prevProps: PageIndicatorProps,
  nextProps: PageIndicatorProps,
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(PageIndicator, PageIndicatorUnchanged);

const styles = StyleSheet.create({
  pageIndicatorBackground: {
    flexDirection: 'row',
  },
  pageIndicatorCircleView: {
    width: scaleUxToDp(10),
    height: scaleUxToDp(10),
    borderRadius: scaleUxToDp(20),
    marginRight: scaleUxToDp(5),
    overflow: 'hidden',
    backgroundColor: COLORS.GRAY,
  },
  pageIndicatorMovingCircleView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: scaleUxToDp(10),
    height: scaleUxToDp(10),
    borderRadius: scaleUxToDp(20),
    backgroundColor: COLORS.ORANGE,
  },
  pageIndicatorContainerView: {
    width: '100%',
    height: 1,
    borderRadius: scaleUxToDp(20),
    padding: scaleUxToDp(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: scaleUxToDp(20),
    flexDirection: 'column',
  },
});
