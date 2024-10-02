/*
 * Copyright (c) 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { consoleInfoSpy } from '../../../jest.setup';
import {
  PlaybackControls,
  seek,
  throttleSeek,
  throttling,
} from '../../../src/w3cmedia/mediacontrols/PlaybackControls';
import {
  ControlBarButtonProps,
  PlayerControlType,
} from '../../../src/w3cmedia/mediacontrols/types/ControlBar';

jest.mock('@amzn/kepler-content-personalization', () => ({
  __esModule: true,
  ContentPersonalizationServer: {
    reportNewPlaybackEvent: jest.fn(),
  },
}));

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    setSurfaceHandle: jest.fn(),
    setCaptionViewHandle: jest.fn(),
    currentTime: 0,
    duration: 1000,
    readyState: 3,
    play: jest.fn(),
    pause: jest.fn(),
    clearSurfaceHandle: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    currentSrc: '',
  } as unknown as VideoPlayer,
};

const renderCaptionButton = (props?: Partial<ControlBarButtonProps>) => {
  return <PlaybackControls videoRef={videoRef} {...props} />;
};

describe('PlaybackControls tests', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
  });

  it('component renders correctly: PlayerControlType.PLAYPAUSE', () => {
    const component = render(
      renderCaptionButton({ playerControlType: PlayerControlType.PLAYPAUSE }),
    );
    expect(component).toMatchSnapshot();
  });

  it('component renders correctly: PlayerControlType.SKIPBACKWARD', () => {
    const component = render(
      renderCaptionButton({
        playerControlType: PlayerControlType.SKIPBACKWARD,
      }),
    );
    expect(component).toMatchSnapshot();
  });

  it('component renders correctly: PlayerControlType.SKIPFORWARD', () => {
    const component = render(
      renderCaptionButton({
        playerControlType: PlayerControlType.SKIPFORWARD,
      }),
    );
    expect(component).toMatchSnapshot();
  });
});

describe('PlaybackControls onPress tests', () => {
  it('Seek Backward renders correctly', () => {
    const { getByTestId } = render(renderCaptionButton());
    const playerButton = getByTestId('player-btn-seek-backward');
    expect(playerButton).toBeDefined();
  });

  it('Seek Forward renders correctly', () => {
    const { getByTestId } = render(renderCaptionButton());
    const playerButton = getByTestId('player-btn-seek-forward');
    expect(playerButton).toBeDefined();
  });

  it('Play Pause renders correctly', () => {
    const { getByTestId } = render(renderCaptionButton());
    const playerPause = getByTestId('player-btn-play-pause');
    expect(playerPause).toBeDefined();
  });
});

describe('Check if functions called properly', () => {
  it('Seek Backward onPress gets called properly', () => {
    jest.spyOn(React, 'useRef');
    const { getByTestId } = render(renderCaptionButton());
    fireEvent.press(getByTestId('player-btn-seek-backward'));
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: calling seekBackward',
    );
  });

  it('Seek Forward onPress gets called properly', () => {
    const { getByTestId } = render(renderCaptionButton());
    fireEvent.press(getByTestId('player-btn-seek-forward'));
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'k_content_per: calling seekForward',
    );
  });

  it('Seek Backward onBlur gets called properly', () => {
    const screen = render(renderCaptionButton());
    const component = screen.getByTestId('player-btn-seek-backward');

    fireEvent(component, 'focus');
    expect(component?.props.style).toEqual(
      expect.objectContaining({ borderRadius: 70 }),
    );
    fireEvent(component, 'blur');
    expect(component?.props.style).not.toEqual(
      expect.objectContaining({ borderRadius: 70 }),
    );
  });

  it('Seek Forward onBlur gets called properly', () => {
    const { getByTestId } = render(renderCaptionButton());
    const component = getByTestId('player-btn-seek-forward');

    fireEvent(component, 'focus');
    expect(component?.props.style).toEqual(
      expect.objectContaining({ borderRadius: 70 }),
    );
    fireEvent(component, 'blur');
    expect(component?.props.style).not.toEqual(
      expect.objectContaining({ borderRadius: 70 }),
    );
  });

  it('Play Pause onBlur gets called properly', () => {
    const { getByTestId } = render(renderCaptionButton());
    const component = getByTestId('player-btn-play-pause');

    fireEvent(component, 'focus');
    expect(component?.props.style).toEqual(
      expect.objectContaining({ borderRadius: 70 }),
    );
    fireEvent(component, 'blur');
    expect(component?.props.style).not.toEqual(
      expect.objectContaining({ borderRadius: 70 }),
    );
  });
});

describe('seek function', () => {
  it('should seek forward within video duration', () => {
    const seekSeconds = 10;
    const initialTime = videoRef.current!.currentTime;
    seek(seekSeconds, videoRef);
    expect(videoRef.current!.currentTime).toBe(initialTime + seekSeconds);
  });

  it('should not update currentTime if videoRef does not have currentTime', () => {
    const seekSeconds = 10;
    videoRef.current = null;
    seek(seekSeconds, videoRef);
    expect(videoRef.current).toBe(null);
  });
});

describe('throttle function', () => {
  jest.useFakeTimers();
  it('should update throttling value when seek forward/backward get called', () => {
    const delay = 500;
    throttleSeek(() => {}, delay);
    expect(throttling).toBe(true);
  });
});
