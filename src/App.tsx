/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
import { ThemeProvider } from '@amzn/kepler-ui-components';
import {
  useHideSplashScreenCallback,
  usePreventHideSplashScreen,
} from '@amzn/react-native-kepler';
import { NavigationContainer } from '@amzn/react-navigation__native';
import { Store } from '@reduxjs/toolkit';
import React, { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import AppStack from './components/navigation/AppStack';
import { initializeStore } from './store';
import { createTheme } from './styles/ThemeBuilders';

const App = () => {
  usePreventHideSplashScreen();

  const [isAppReady, setIsAppReady] = useState(false);
  const [store, setStore] = useState<Store | null>(null);

  setTimeout(() => setIsAppReady(true), 4000);
  const hideSplashScreenCallback = useHideSplashScreenCallback();

  const initStore = async () => {
    const initializedStore = await initializeStore();
    setStore(initializedStore);
  };

  useEffect(() => {
    initStore();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      // Hide the splash screen and render content
      hideSplashScreenCallback();
    }
  }, [isAppReady, hideSplashScreenCallback]);
  const theme = useMemo(() => createTheme(), []);

  if (!store) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
