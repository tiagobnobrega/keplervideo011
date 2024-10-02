/*
 * Copyright 2022-2023 Amazon.com, Inc. or its affiliates. All rights reserved.
 *
 * AMAZON PROPRIETARY/CONFIDENTIAL
 *
 * You may not use this file except in compliance with the terms and
 * conditions set forth in the accompanying LICENSE.TXT file.
 *
 * THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY
 * DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS,
 * IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
 */

import LottieView from '@amzn/lottie-react-native';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { COLORS } from '../../styles/Colors';
import { scaleUxToDp } from '../../utils/pixelUtils';

const BufferingWindow = React.memo((props: ViewProps) => {
  return (
    <View {...props} style={styles.container} testID="buffering-view">
      <LottieView
        testID="video-buffer-view"
        source={require('../../js/resources/loader.json')}
        autoPlay
        loop
        style={styles.loader}
      />
    </View>
  );
});

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    flex: 1,
    backgroundColor: COLORS.BLACK,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  loader: {
    width: scaleUxToDp(80),
    height: scaleUxToDp(320),
    alignSelf: 'center',
  },
});
export default BufferingWindow;
