import { DrawerActions, useNavigation } from '@amzn/react-navigation__core';
import { DrawerContentComponentProps } from '@amzn/react-navigation__drawer/lib/typescript/src/types';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import NavBackgroundGradient from '../../../assets/nav_drawer_background_gradient.png';
import { COLORS } from '../../../styles/Colors';
import { scaleUxToDp } from '../../../utils/pixelUtils';
import DrawerItemList from './DrawerItemList';
const drawerAverageWidth = scaleUxToDp(100);
const drawerExpandedWidth = scaleUxToDp(300);

const DrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation();

  const [isDrawerInFocus, setDrawerInFocus] = useState(false);
  const drawerWidth = isDrawerInFocus
    ? drawerExpandedWidth
    : drawerAverageWidth;

  const onFocusHandler = () => {
    setDrawerInFocus(true);
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const onBlurHandler = () => {
    setDrawerInFocus(false);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <ImageBackground
      source={NavBackgroundGradient}
      style={[styles.drawerBackground, { width: drawerWidth }]}>
      <DrawerItemList
        isDrawerInFocus={isDrawerInFocus}
        onDrawerListFocus={onFocusHandler}
        onDrawerListBlur={onBlurHandler}
        drawerWidth={drawerWidth}
        {...props}
      />
    </ImageBackground>
  );
};

const drawerDataUnchanged = (
  prevProps: DrawerContentComponentProps,
  nextProps: DrawerContentComponentProps,
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(DrawerContent, drawerDataUnchanged);

const styles = StyleSheet.create({
  drawerBackground: {
    height: '100%',
    backgroundColor: COLORS.DARK_GRAY,
    position: 'absolute',
  },
});
