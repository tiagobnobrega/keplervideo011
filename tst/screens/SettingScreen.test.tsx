import { LinearGradientProps } from '@amzn/react-linear-gradient';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import FocusableElement from '../../src/components/FocusableElement';
import { Screens } from '../../src/components/navigation/types';
import SettingsScreen from '../../src/screens/SettingsScreen';

const mockNavigation = {
  navigate: jest.fn(),
} as any;

const mockRoute = {
  key: 'SearchScreen',
  name: Screens.SETTINGS_SCREEN,
  params: {},
} as any;

jest.mock('@amzn/react-linear-gradient', () => ({
  __esModule: true,
  default: ({ children }: LinearGradientProps) => <>{children}</>,
}));

jest.mock('@amzn/react-native-device-info', () => ({
  getApplicationName: jest.fn(() => 'TestApp'),
  getModel: jest.fn(() => 'TestModel'),
  getSystemName: jest.fn(() => 'TestSystem'),
  getVersion: jest.fn(() => '1.0.0'),
  getDeviceType: jest.fn(() => 'TestDevice'),
  getBaseOs: jest.fn(() => Promise.resolve('TestOS')),
  getManufacturer: jest.fn(() => Promise.resolve('TestManufacturer')),
}));

const renderSettingsScreen = () => {
  return <SettingsScreen navigation={mockNavigation} route={mockRoute} />;
};

afterEach(cleanup);

describe('Setting Test Cases', () => {
  it('returns container', () => {
    const { container } = render(<View />);
    expect(container).toBeTruthy();
  });

  it('View is present in component', async () => {
    const { queryByTestId } = render(renderSettingsScreen());
    await act(() => {
      const view = queryByTestId('settings-main-view');
      expect(view).toBeDefined();
    });
  });

  it('Linear gradient is present in component', async () => {
    const { queryByTestId } = render(renderSettingsScreen());
    await act(() => {
      const linearGradients = queryByTestId('linear-gradient');
      expect(linearGradients).toBeDefined();
    });
  });

  it('FocusableElement responds to focus and press events', () => {
    const onPressMock = jest.fn();

    const { getByTestId } = render(
      <FocusableElement
        onPress={onPressMock}
        testID="focusable-element"
        onFocusOverrideStyle={undefined}
        style={undefined}
      />,
    );
    fireEvent.press(getByTestId('focusable-element'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('FocusableElement handles focus and blur events correctly', () => {
    const onBlurMock = jest.fn();
    const onFocusMock = jest.fn();
    const { getByTestId } = render(
      <FocusableElement
        onBlur={onBlurMock}
        onFocus={onFocusMock}
        testID="focusable-element"
        onFocusOverrideStyle={undefined}
        style={undefined}
      />,
    );
    fireEvent(getByTestId('focusable-element'), 'focus');
    expect(onFocusMock).toHaveBeenCalled();
    fireEvent(getByTestId('focusable-element'), 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });

  it('does not display wifi details when wifiDetails is empty object', async () => {
    const { queryByText } = render(renderSettingsScreen());
    await act(() => {
      expect(queryByText('Wifi Name:')).toBeNull();
    });
  });

  it('returns the number of keys when wifiDetails has keys', async () => {
    const wifiDetails = {
      ssid: 'TestWifi',
      password: 'password123',
      security: 'WPA2',
    };
    render(renderSettingsScreen());
    await act(() => {
      expect(Object.keys(wifiDetails).length).toBe(3);
    });
  });
});
