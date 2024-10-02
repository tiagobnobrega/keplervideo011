import React from 'react';

import { FiveStarRating, Typography } from '@amzn/kepler-ui-components';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import HdIcon from '../assets/hd_outline.png';
import { COLORS } from '../styles/Colors';
import { TitleData } from '../types/TitleData';
import { toHoursMinutes } from '../utils/commonFunctions';
import { scaleUxToDp } from '../utils/pixelUtils';

interface ContentDetailProps {
  tile: TitleData;
  containerStyle?: StyleProp<ViewStyle>;
}

const HDLabel = () => {
  return <Image source={HdIcon} style={styles.hdIcon} />;
};

export const ContentDetail = ({ tile, containerStyle }: ContentDetailProps) => {
  return (
    <View
      style={[styles.contentDetailPanel, containerStyle]}
      accessibilityElementsHidden>
      <Typography variant="headline" style={styles.typographyStyle}>
        {tile?.title}
      </Typography>
      <View style={styles.metadataRow}>
        <FiveStarRating
          ratingNumber={Number.parseInt(tile.rating ? tile.rating : '0', 10)}
          ratingText={`(${tile.id})`}
          tintColor={COLORS.ORANGE}
        />
        <Typography variant="body" style={styles.metadataItem}>
          {toHoursMinutes(tile?.duration ? tile?.duration : 0)}
        </Typography>
        <HDLabel />
      </View>
      <Typography variant="body">{tile?.description}</Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  typographyStyle: {
    color: COLORS.WHITE,
  },
  contentDetailPanel: {
    flex: 1,
    flexDirection: 'column',
  },
  metadataRow: {
    flexDirection: 'row',
    marginVertical: scaleUxToDp(4),
    alignItems: 'center',
  },
  metadataItem: {
    marginHorizontal: scaleUxToDp(20),
  },
  hdIcon: {
    height: scaleUxToDp(35),
    width: scaleUxToDp(50),
    tintColor: COLORS.WHITE,
    alignSelf: 'center',
  },
});
