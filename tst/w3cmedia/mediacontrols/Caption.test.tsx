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
import { CaptionMenu } from '../../../src/w3cmedia/mediacontrols/Captions';
import { CaptionMenuProps } from '../../../src/w3cmedia/mediacontrols/types/Captions';

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    textTracks: {
      length: 1,
      getTrackById: jest.fn(id => ({
        mode: id === '0' ? 'showing' : 'hidden',
      })),
    },
  } as unknown as VideoPlayer,
};
const renderCaptionButton = (props?: Partial<CaptionMenuProps>) => {
  const setSelectedCaptionMock = jest.fn();

  return (
    <CaptionMenu
      captionMenuVisibility={true}
      setSelectedCaption={setSelectedCaptionMock}
      video={videoRef.current as VideoPlayer}
      {...props}
    />
  );
};
describe('ControlBar tests', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with captionMenuVisibility enabled', () => {
    const component = render(
      renderCaptionButton({ captionMenuVisibility: true }),
    );
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with captionMenuVisibility disabled', () => {
    const component = render(
      renderCaptionButton({ captionMenuVisibility: false }),
    );
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with textTracks 0 length', () => {
    const component = render(
      renderCaptionButton({
        video: {
          current: {
            ...videoRef.current,
            textTracks: {
              length: 0,
              getTrackById: jest.fn(),
            },
          } as unknown as VideoPlayer,
        } as unknown as VideoPlayer,
      }),
    );
    expect(component).toMatchSnapshot();
  });
});
describe('Functions gets call properly', () => {
  test('CaptionOptions useCallback', () => {
    render(renderCaptionButton({ captionMenuVisibility: true }));
    expect(videoRef.current?.textTracks.getTrackById('0')?.mode).toBe(
      'showing',
    );
    expect(videoRef.current?.textTracks.getTrackById('1')?.mode).toBe('hidden');
  });
});
