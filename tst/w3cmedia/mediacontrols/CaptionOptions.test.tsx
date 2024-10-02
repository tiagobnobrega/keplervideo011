import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import { render } from '@testing-library/react-native';
import React from 'react';
import CaptionOptions from '../../../src/w3cmedia/mediacontrols/CaptionOptions';
import { CaptionOptionProps } from '../../../src/w3cmedia/mediacontrols/types/Captions';

const mockEnableCaption = jest.fn();

const videoRef: React.MutableRefObject<VideoPlayer | null> = {
  current: {
    textTracks: {
      length: 0,
    },
  } as unknown as VideoPlayer,
};

const renderCaptionOptions = (props?: Partial<CaptionOptionProps>) => {
  return (
    <CaptionOptions
      video={videoRef.current as unknown as VideoPlayer}
      enableCaption={mockEnableCaption}
      selectedCaptionId={null}
      {...props}
    />
  );
};
describe('CaptionOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with props', () => {
    const tree = render(
      renderCaptionOptions({
        video: {
          ...videoRef.current,
          textTracks: {
            length: 0,
            getTrackById: jest.fn((id: number) => {
              if (id > 0) {
                return {
                  label: '',
                  id: '',
                };
              }
            }),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          },
        } as unknown as VideoPlayer,
        selectedCaptionId: '0',
      }),
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders without props', () => {
    const tree = render(renderCaptionOptions());
    expect(tree).toMatchSnapshot();
  });
  it('renders without crashing when there are no text tracks', () => {
    const { queryByTestId } = render(renderCaptionOptions());
    expect(queryByTestId('caption-menu-item')).toBeNull();
  });
  it('with props', () => {
    const { queryByTestId } = render(
      renderCaptionOptions({
        video: {
          ...videoRef.current,
          textTracks: {
            length: 0,
            getTrackById: jest.fn((id: number) => {
              if (id > 0) {
                return {
                  label: '',
                  id: '',
                };
              }
            }),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          },
        } as unknown as VideoPlayer,
      }),
    );
    expect(queryByTestId('caption-menu-item')).toBeNull();
  });
});
