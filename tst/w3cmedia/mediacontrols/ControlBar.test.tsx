/*
 * Copyright (c) 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ControlBar } from '../../../src/w3cmedia/mediacontrols/ControlBar';

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    textTracks: {
      length: 2,
    },
  } as unknown as VideoPlayer,
};
const renderCaptionButton = () => {
  return (
    <ControlBar
      captions={jest.fn()}
      videoRef={videoRef}
      captionMenuVisibility={false}
      isCaptionButtonFocused={true}
    />
  );
};
describe('ControlBarte sts', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
  });
});
