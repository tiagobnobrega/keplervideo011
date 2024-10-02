import { describe } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { RotatorData } from '../../../src/components/rotator/type';
import { MovieRotatorGrid } from '../../../src/components/touchOptimized/MovieRotatorGrid';
import { MovieGridData } from '../../../src/types/MovieGridData';
import {
  MovieGridDataBuilder,
  RotatorDataBuilder,
  TitleDataBuilder,
} from '../../common/dataBuilders';

const gridData: MovieGridData[] = [
  new MovieGridDataBuilder('Sci-Fi', 'test-1')
    .addTile(
      new TitleDataBuilder('169313')
        .setTitle('Hitchhikers guide to galaxy')
        .setDuration(200)
        .setRentAmount('2.99$')
        .setSecure(true)
        .setDescription(
          'the answer to the ultimate question of life, the universe, and everything.',
        )
        .build(),
    )
    .build(),
];

const rotatorData: RotatorData[] = [
  new RotatorDataBuilder('1111').build(),
  new RotatorDataBuilder('1112').build(),
];

const screenDimensions = {
  fontScale: 1,
  height: 1080,
  scale: 1,
  width: 1920,
};

describe('Movie Rotator Grid Test Cases', () => {
  beforeEach(() => {
    const useWindowDimensionsSpy = jest.spyOn(
      require('react-native'),
      'useWindowDimensions',
    );
    useWindowDimensionsSpy.mockReturnValue(screenDimensions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Carousel is rendered', async () => {
    const { findAllByTestId } = render(
      <MovieRotatorGrid movieGridData={gridData} rotatorData={rotatorData} />,
    );

    const recyclerListView = await waitFor(() =>
      findAllByTestId('movie-rotator-grid'),
    );
    expect(recyclerListView.length === 1).toBeTruthy();

    // Force RecyclerListView to render (Make sure useWindowDimensions is mocked, else
    // the recyclerlistview code gets stuck in infinite loop).
    // https://github.com/Flipkart/recyclerlistview/issues/565
    fireEvent(recyclerListView[0], 'layout', {
      nativeEvent: {
        layout: {
          height: screenDimensions.height,
          width: screenDimensions.width,
          x: 0,
          y: 0,
        },
      },
    });

    const movieCarouselComponent = await waitFor(() =>
      findAllByTestId('movie_carousel_' + gridData[0].testID),
    );
    expect(movieCarouselComponent).toBeDefined();
  });
});
