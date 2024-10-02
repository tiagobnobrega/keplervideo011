import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { CaptionMenu } from '../../../src/w3cmedia/mediacontrols/Captions';
import ControlBarMenu from '../../../src/w3cmedia/mediacontrols/ControlBarMenu';

jest.mock('../../../src/w3cmedia/mediacontrols/Captions', () => {
  return {
    CaptionMenu: jest.fn(() => null),
  };
});

describe('ControlBarMenu', () => {
  const videoRef = { current: {} as VideoPlayer };
  const setSelectedCaptionInMenuBarMock = jest.fn();

  it('renders without crashing', () => {
    const { toJSON } = render(
      <ControlBarMenu
        captionMenuVisibility={true}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders CaptionMenu with correct props when visible', () => {
    render(
      <ControlBarMenu
        captionMenuVisibility={true}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
      />,
    );
    expect(CaptionMenu).toHaveBeenCalledTimes(2);
  });

  it('applies correct styles to the container', () => {
    const { UNSAFE_getByType } = render(
      <ControlBarMenu
        captionMenuVisibility={true}
        videoRef={videoRef}
        setSelectedCaptionInMenuBar={setSelectedCaptionInMenuBarMock}
      />,
    );

    const container = UNSAFE_getByType(View);
    expect(container.props.style).toMatchObject({
      position: 'absolute',
      bottom: 90,
      right: 0,
    });
  });
});
