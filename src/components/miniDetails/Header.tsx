import { isEqual } from 'lodash';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../styles/Colors';
import { TitleData } from '../../types/TitleData';
import { scaleUxToDp } from '../../utils/pixelUtils';

interface HeaderProps {
  data?: TitleData;
}

const Header = ({ data }: HeaderProps) => {
  return (
    <View style={styles.headerContent}>
      <Text style={styles.titleText} numberOfLines={2}>
        {data?.title}
      </Text>
      <Text style={styles.descriptionText} numberOfLines={3}>
        {data?.description}
      </Text>
    </View>
  );
};

const headerDataUnchanged = (
  prevProps: HeaderProps,
  nextProps: HeaderProps,
) => {
  return isEqual(prevProps.data, nextProps.data);
};

export default React.memo(Header, headerDataUnchanged);

const styles = StyleSheet.create({
  headerContent: {
    paddingStart: scaleUxToDp(120),
    paddingTop: scaleUxToDp(138),
    width: scaleUxToDp(884),
  },
  titleText: {
    fontSize: scaleUxToDp(60),
    fontWeight: 'bold',
    color: COLORS.SMOKE_WHITE,
    width: scaleUxToDp(800),
  },
  descriptionText: {
    fontSize: scaleUxToDp(30),
    color: COLORS.SMOKE_WHITE,
    width: scaleUxToDp(884),
  },
});
