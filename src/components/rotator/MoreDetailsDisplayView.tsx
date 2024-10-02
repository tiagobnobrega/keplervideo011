import { isEqual } from 'lodash';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';
import { RotatorData } from './type';

interface MoreDetailsDisplayProps {
  data: RotatorData;
}

const MoreDetailsDisplayView = ({ data }: { data: RotatorData }) => {
  return (
    <Animated.View style={[styles.infoContainerView]}>
      <Animated.View style={[styles.InfoView]}>
        <Animated.View style={[styles.titleMoreDetailsDisplayView]}>
          <Text style={[styles.titleText]} testID={'carousel-title'}>
            {data.title}
          </Text>
        </Animated.View>
        <Text style={[styles.descriptionText]} testID={'carousel-sub-title'}>
          {data.description}
        </Text>
      </Animated.View>
      <View style={[styles.InfoView]} />
    </Animated.View>
  );
};

const MoreDetailsDisplayUnchanged = (
  prevProps: MoreDetailsDisplayProps,
  nextProps: MoreDetailsDisplayProps,
) => {
  return isEqual(prevProps.data, nextProps.data);
};

export default React.memo(MoreDetailsDisplayView, MoreDetailsDisplayUnchanged);

const styles = StyleSheet.create({
  infoContainerView: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  titleMoreDetailsDisplayView: {
    borderRadius: scaleUxToDp(10),
    justifyContent: 'flex-end',
    width: '80%',
    height: scaleUxToDp(200),
    opacity: 1,
    marginTop: '10%',
  },
  titleText: {
    fontSize: scaleUxToDp(54),
    fontWeight: '700',
    width: '80%',
    height: scaleUxToDp(175),
    color: COLORS.WHITE,
  },
  descriptionText: {
    fontSize: scaleUxToDp(24),
    fontWeight: '700',
    width: '80%',
    height: scaleUxToDp(50),
    color: COLORS.WHITE,
  },
  InfoView: {
    width: '100%',
    height: '50%',
    marginStart: '5%',
  },
});
