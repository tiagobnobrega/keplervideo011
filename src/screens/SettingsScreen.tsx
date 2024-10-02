import { Button } from '@amzn/kepler-ui-components';
import LinearGradient from '@amzn/react-linear-gradient';
import {
  getApplicationName,
  getBaseOs,
  getDeviceType,
  getManufacturer,
  getModel,
  getSystemName,
  getVersion,
} from '@amzn/react-native-device-info';
import { TVFocusGuideView } from '@amzn/react-native-kepler';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AccountLoginWrapperInstance } from '../AccountLoginWrapper';
import ConnectionComponent from '../components/ConnectionComponent';
import LocaleComponent from '../components/LocaleComponent';
import LoginInformation from '../components/LoginInformation';
import { AppStackScreenProps, Screens } from '../components/navigation/types';
import { isAccountLoginEnabled } from '../config/AppConfig';
import {
  setLoginStatus,
  settingsSelectors,
} from '../store/settings/SettingsSlice';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';

interface ItemProps {
  title: string;
  value: string | undefined;
}
type DeviceInfoApi = {
  applicationName: string;
  modelName: string;
  systemName: string;
  versionName: string;
  deviceType: string;
  baseOS: string;
  manufacturer: string;
};

let didInit = false;
const SettingsScreen = React.memo(
  ({ navigation }: AppStackScreenProps<Screens.SETTINGS_SCREEN>) => {
    const [deviceInfoData, setDeviceInfoData] = useState<DeviceInfoApi>();
    const dispatch = useDispatch();
    const loginStatus = useSelector(settingsSelectors.loginStatus);
    const deviceInfoApiValues: DeviceInfoApi = {
      applicationName: '',
      modelName: '',
      systemName: '',
      versionName: '',
      deviceType: '',
      baseOS: '',
      manufacturer: '',
    };

    useEffect(() => {
      if (!didInit) {
        didInit = true;
        fetchDeviceInfo();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnToggleLoginStatus = () => {
      dispatch(setLoginStatus(!loginStatus));
      AccountLoginWrapperInstance.updateStatus(!loginStatus);
    };

    /*
     *  DeviceConfigManager Dependency
     */
    const fetchDeviceInfo = async () => {
      deviceInfoApiValues.applicationName = getApplicationName();
      deviceInfoApiValues.modelName = getModel();
      deviceInfoApiValues.systemName = getSystemName();
      deviceInfoApiValues.versionName = getVersion();
      deviceInfoApiValues.deviceType = getDeviceType();
      deviceInfoApiValues.baseOS = await getBaseOs();
      deviceInfoApiValues.manufacturer = await getManufacturer();
      setDeviceInfoData(deviceInfoApiValues);
    };

    /*  Created Flatlist Data  */
    const listData: ItemProps[] = [
      {
        title: 'Application Name',
        value: deviceInfoData?.applicationName,
      },
      {
        title: 'Model',
        value: deviceInfoData?.modelName,
      },
      {
        title: 'System Name',
        value: deviceInfoData?.systemName,
      },
      {
        title: 'Version',
        value: deviceInfoData?.versionName,
      },
      {
        title: 'Device Type',
        value: deviceInfoData?.deviceType,
      },
      {
        title: 'Base OS',
        value: deviceInfoData?.baseOS,
      },
      {
        title: 'Manufacturer',
        value: deviceInfoData?.manufacturer,
      },
    ];

    const renderItem = (item: ItemProps) => {
      if (item.value) {
        return (
          <View
            style={styles.rowView}
            key={item?.title}
            testID={`item-${item?.title}`}>
            <Text style={styles.subHeading}>{item.title}: </Text>
            <Text style={styles.subHeadingValue}>{item.value}</Text>
          </View>
        );
      } else {
        return null;
      }
    };

    return (
      <TVFocusGuideView
        style={styles.container}
        testID="settings-main-view"
        autoFocus>
        <LinearGradient
          testID={`${COLORS.GRAY}-${COLORS.DARK_GRAY}-${COLORS.DARK_GRAY}-${COLORS.BLACK}`}
          colors={[
            COLORS.GRAY,
            COLORS.DARK_GRAY,
            COLORS.DARK_GRAY,
            COLORS.BLACK,
          ]}
          style={styles.linearGradient}>
          <Text style={styles.title}>Settings</Text>
          <LocaleComponent />
          <ConnectionComponent testID="connection-component" />
          {isAccountLoginEnabled() ? (
            <LoginInformation
              loginStatus={loginStatus}
              handleOnToggleLoginStatus={handleOnToggleLoginStatus}
            />
          ) : null}

          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {listData && listData.map(item => renderItem(item))}
            </ScrollView>
          </View>
          <Button
            label="Feedback"
            onPress={() => {
              navigation.navigate(Screens.FEEDBACK_SCREEN);
            }}
            variant="secondary"
            mode="outlined"
            style={styles.feedbackButton}
          />
        </LinearGradient>
      </TVFocusGuideView>
    );
  },
  isEqual,
);

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  listContainer: {
    flexDirection: 'row',
  },
  title: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(70),
    marginTop: scaleUxToDp(20),
    marginBottom: scaleUxToDp(30),
  },
  linearGradient: {
    borderRadius: scaleUxToDp(5),
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: scaleUxToDp(20),
    paddingHorizontal: '25%',
  },
  list: {
    marginTop: 0,
  },
  rowView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaleUxToDp(25),
    paddingHorizontal: 0,
    borderBottomColor: COLORS.WHITE,
    borderBottomWidth: 1,
  },
  subHeading: {
    fontSize: scaleUxToDp(26),
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  subHeadingValue: {
    fontSize: scaleUxToDp(26),
    color: COLORS.WHITE,
  },
  feedbackButton: {
    marginTop: 10,
  },
});
