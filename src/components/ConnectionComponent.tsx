import { Typography } from '@amzn/kepler-ui-components';
import {
  NetInfoConnectedDetails,
  NetInfoState,
  refresh,
} from '@amzn/keplerscript-netmgr-lib';
import MaterialIcons from '@amzn/react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@amzn/react-navigation__core';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NetworkStatus } from '../constants';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';
import FocusableElement from './FocusableElement';

interface ConnectionComponentProps {
  testID: string;
}
const ConnectionComponent = ({ testID }: ConnectionComponentProps) => {
  const [wifiStatus, setWifiStatus] = useState<string>('');
  const [wifiDetails, setWifiDetails] =
    useState<NetInfoConnectedDetails | null>(null);

  const onSuccess = (state: NetInfoState) => {
    const wifiStatusCheck = state.isConnected && state.isInternetReachable;
    const wifiStatusText = wifiStatusCheck
      ? NetworkStatus.CONNECTED
      : NetworkStatus.NOT_CONNECTED;
    setWifiStatus(wifiStatusText);
    if (state.isWifiEnabled && wifiStatusCheck) {
      setWifiDetails(state.details);
    } else {
      setWifiDetails(null);
    }
  };

  const onError = () => {
    setWifiStatus(NetworkStatus.NOT_CONNECTED);
    setWifiDetails(null);
  };

  const handleRefresh = () => {
    refresh()
      .then(state => {
        onSuccess(state);
      })
      .catch(() => {
        onError();
      });
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.detailContainer}>
        <FocusableElement
          style={styles.refreshIcon}
          onFocusOverrideStyle={styles.refreshButtonFocus}
          onPress={handleRefresh}
          testID="refresh-icon">
          <MaterialIcons name={'refresh'} size={40} color={COLORS.WHITE} />
        </FocusableElement>
        <View>
          <Typography
            variant={'title'}
            numberOfLines={1}
            color={COLORS.WHITE}
            testID="internet-status"
            style={styles.detailText}>
            Internet Status: {wifiStatus}
          </Typography>

          {wifiDetails && Object.keys(wifiDetails).length ? (
            <Typography
              variant={'title'}
              testID="wifi-name"
              numberOfLines={1}
              color={COLORS.WHITE}
              style={styles.detailText}>
              {/* @ts-ignore */}
              Wifi Name: {wifiDetails?.ssid}
            </Typography>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ConnectionComponent;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: scaleUxToDp(20),
    right: 0,
    margin: scaleUxToDp(20),
    marginRight: scaleUxToDp(60),
    alignItems: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  detailText: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(20),
    margin: scaleUxToDp(10),
    marginVertical: scaleUxToDp(2),
  },
  refreshIcon: {
    marginRight: scaleUxToDp(10),
    marginTop: scaleUxToDp(12),
    width: scaleUxToDp(50),
    height: scaleUxToDp(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonFocus: {
    backgroundColor: `${COLORS.SMOKE_WHITE}50`,
    borderRadius: scaleUxToDp(50),
  },
});
