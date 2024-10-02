import { getModel } from '@amzn/react-native-device-info';
import { Dimensions, Platform } from 'react-native';

const modelValue = getModel();

const isContentPersonalizationEnabled = () => {
  return !modelValue.includes('simulator') && Platform.isTV;
};

const isSubscriptionEntitlementEnabled = () => {
  return !modelValue.includes('simulator') && Platform.isTV;
};

const isInAppPurchaseEnabled = () => {
  return Platform.isTV;
};

const isAccountLoginEnabled = () => {
  return Platform.isTV;
};

/**
 * Based on the device dimensions, we can enable or disable the control of the D-pad.
 *
 * @returns flag to indicate if D-pad controller is supported.
 */
const isDpadControllerSupported = () => {
  if (Dimensions.get('window').width < Dimensions.get('window').height) {
    return false;
  }
  return true;
};

export {
  isContentPersonalizationEnabled,
  isSubscriptionEntitlementEnabled,
  isInAppPurchaseEnabled,
  isAccountLoginEnabled,
  isDpadControllerSupported,
};
