import { render } from '@testing-library/react-native';
import { isEqual } from 'lodash';
import React from 'react';
import Preview from '../../../src/components/miniDetails/Preview';

jest.mock('lodash', () => ({
  isEqual: jest.fn(),
}));

describe('Preview renders correctly', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (jest.mocked(isEqual) as jest.Mock).mockImplementation((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b);
    });
  });

  it('renders correctly with a posterUrl', () => {
    const posterUrl = 'http://example.com/poster.jpg';
    const { toJSON, getByTestId } = render(<Preview posterUrl={posterUrl} />);
    expect(toJSON()).toMatchSnapshot();
    expect(getByTestId('poster-image')).toBeTruthy();
  });

  it('renders GradientOverlay correctly', () => {
    const { getByTestId } = render(<Preview />);
    expect(getByTestId('left-gradient')).toBeTruthy();
    expect(getByTestId('bottom-gradient')).toBeTruthy();
  });
});

describe('React.memo behavior for Preview', () => {
  const mockPosterUrl = 'http://example.com/poster.jpg';

  it('does not re-render when posterUrl is unchanged', () => {
    const { rerender } = render(<Preview posterUrl={mockPosterUrl} />);

    rerender(<Preview posterUrl={mockPosterUrl} />);
    expect(isEqual).toHaveBeenCalledWith(mockPosterUrl, mockPosterUrl);
    expect(isEqual).toHaveBeenCalledTimes(1);
  });

  it('re-renders when posterUrl changes', () => {
    const { rerender } = render(<Preview posterUrl={mockPosterUrl} />);

    const newPosterUrl = 'http://example.com/new-poster.jpg';

    rerender(<Preview posterUrl={newPosterUrl} />);
    expect(isEqual).toHaveBeenCalledWith(mockPosterUrl, newPosterUrl);
  });
});
