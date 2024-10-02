import { Button } from '@amzn/kepler-ui-components';
import MaterialIcons from '@amzn/react-native-vector-icons/MaterialIcons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';

interface LoginInformationProps {
  loginStatus: boolean;
  handleOnToggleLoginStatus: () => void;
}

const USER_IMAGE = require('../assets/user_example_icon.png');

const LoginInformation = ({
  loginStatus,
  handleOnToggleLoginStatus,
}: LoginInformationProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        {loginStatus ? (
          <Image
            style={styles.profileImage}
            source={USER_IMAGE}
            resizeMode={'contain'}
          />
        ) : (
          <MaterialIcons
            name={'account-circle'}
            size={80}
            color={COLORS.WHITE}
          />
        )}

        <Text style={styles.text}>
          {loginStatus ? 'Hi, Johannes!' : 'You are not logged in'}
        </Text>
      </View>
      <Button
        label={loginStatus ? 'Log out' : 'Log in'}
        onPress={handleOnToggleLoginStatus}
        variant={'primary'}
        mode="contained"
        focusedStyle={styles.buttonFocused}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        size="sm"
      />
    </View>
  );
};

export default LoginInformation;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaleUxToDp(20),
    paddingHorizontal: 0,
    borderBottomColor: COLORS.WHITE,
    borderBottomWidth: 1,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageBackground: {
    borderRadius: scaleUxToDp(40),
    width: scaleUxToDp(80),
    height: scaleUxToDp(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: scaleUxToDp(80),
    height: scaleUxToDp(80),
    borderRadius: scaleUxToDp(40),
  },
  text: {
    marginLeft: scaleUxToDp(10),
    fontSize: scaleUxToDp(28),
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: COLORS.TRANSPARENT,
    color: COLORS.GRAY,
    borderColor: COLORS.WHITE,
    borderWidth: 3,
    borderRadius: scaleUxToDp(15),
    paddingHorizontal: scaleUxToDp(20),
  },
  buttonLabel: {
    color: COLORS.WHITE,
    fontSize: scaleUxToDp(22),
  },
  buttonFocused: {
    backgroundColor: COLORS.GRAY,
  },
});
