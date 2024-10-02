/*
 * Copyright (c) 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@amzn/react-navigation__drawer';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import HomeSvg from '../../assets/svgr/HomeSVG';
import SearchSvg from '../../assets/svgr/SearchSVG';
import SettingSvg from '../../assets/svgr/SettingSVG';
import HomeScreen from '../../screens/HomeScreen';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';
import DrawerContent from './navigationDrawerContent/DrawerContent';
import { AppDrawerParamList, DrawerType, Screens } from './types';

const SearchScreen = React.lazy(() => import('../../screens/SearchScreen'));
const SettingsScreen = React.lazy(() => import('../../screens/SettingsScreen'));
const Drawer = createDrawerNavigator<AppDrawerParamList>();

const AppDrawer = () => {
  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => <DrawerContent {...props} />,
    [],
  );

  const navigationOptions = {
    drawerType: DrawerType.PERMANENT,
    drawerStyle: styles.drawer,
    headerShown: false,
  };

  return (
    <Drawer.Navigator
      screenOptions={navigationOptions}
      initialRouteName={Screens.DEFAULT_SCREEN}
      drawerContent={renderDrawerContent}>
      <Drawer.Screen
        name={Screens.HOME_SCREEN}
        component={HomeScreen}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: props => (
            <HomeSvg
              testID="homesvg"
              width={40}
              height={40}
              stroke={COLORS.SMOKE_WHITE}
              fill={props.color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={Screens.SEARCH_SCREEN}
        component={SearchScreen}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: () => (
            <SearchSvg
              testID="searchsvg"
              width={40}
              height={40}
              stroke={COLORS.SMOKE_WHITE}
              fill={COLORS.SMOKE_WHITE}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={Screens.SETTINGS_SCREEN}
        component={SettingsScreen}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: props => (
            <SettingSvg
              testID="settingsvg"
              width={40}
              height={40}
              stroke={COLORS.SMOKE_WHITE}
              fill={props.color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
export default React.memo(AppDrawer);

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: COLORS.TRANSPARENT,
    borderRightColor: COLORS.TRANSPARENT,
    width: scaleUxToDp(100),
  },
  imageIcon: {
    width: scaleUxToDp(30),
    height: scaleUxToDp(30),
    tintColor: COLORS.SMOKE_WHITE,
  },
});
