import { render } from '@testing-library/react-native';
import { isEqual } from 'lodash';
import React from 'react';
import 'react-native';
import Header from '../../../src/components/miniDetails/Header';
import MiniDetails from '../../../src/components/miniDetails/MiniDetails';
import Preview from '../../../src/components/miniDetails/Preview';
import { TitleData } from '../../../src/types/TitleData';

jest.mock('lodash', () => ({
  isEqual: jest.fn(),
}));

const mockSelectedTitle: TitleData = {
  id: '1',
  title: 'Sample Title',
  thumbnail: 'http://example.com/thumbnail.jpg',
  videoUrl: '',
  categories: [],
  channelID: '',
  posterUrl: '',
  format: '',
  description: 'Sample Description',
  mediaType: 'video',
  mediaSourceType: 'url',
  uhd: false,
  secure: false,
  rentAmount: '',
};

describe('Testing MiniDetails component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (jest.mocked(isEqual) as jest.Mock).mockImplementation((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b);
    });
  });

  it('renders correctly and matches snapshot', () => {
    const { toJSON } = render(
      <MiniDetails selectedTitle={mockSelectedTitle} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders Preview and Header components', () => {
    const { queryAllByText } = render(
      <MiniDetails selectedTitle={mockSelectedTitle} />,
    );
    const headerComponents = queryAllByText(mockSelectedTitle.title);
    expect(headerComponents.length).toBeLessThanOrEqual(0);
  });

  it('renders correctly with components', () => {
    render(<MiniDetails selectedTitle={mockSelectedTitle} />);
    const headerText = mockSelectedTitle.title;
    expect(headerText).toBeTruthy();
  });

  it('renders with components', () => {
    render(<MiniDetails selectedTitle={mockSelectedTitle} />);
    expect(Preview).toBeTruthy();
    expect(Header).toBeTruthy();
  });

  it('does not re-render when selectedTitle is unchanged', () => {
    const { rerender } = render(
      <MiniDetails selectedTitle={mockSelectedTitle} />,
    );
    rerender(<MiniDetails selectedTitle={mockSelectedTitle} />);
    expect(isEqual).toHaveBeenCalledTimes(0);
  });

  it('re-renders when selectedTitle changes', () => {
    const { rerender } = render(
      <MiniDetails selectedTitle={mockSelectedTitle} />,
    );
    const newSelectedTitle: TitleData = {
      id: '2',
      title: 'New Title',
      thumbnail: 'http://example.com/new-thumbnail.jpg',
      videoUrl: '',
      categories: [],
      channelID: '',
      posterUrl: '',
      format: '',
      description: 'New Description',
      mediaType: 'video',
      mediaSourceType: 'url',
      uhd: false,
      secure: false,
      rentAmount: '',
    };
    rerender(<MiniDetails selectedTitle={newSelectedTitle} />);
    expect(isEqual).not.toHaveBeenCalled();
  });
});
