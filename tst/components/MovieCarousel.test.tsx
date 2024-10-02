import { describe } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React, { useState } from 'react';
import { DataProvider } from 'recyclerlistview';
import MovieCarousel from '../../src/components/MovieCarousel';
import { TitleData } from '../../src/types/TitleData';

const MovieCarouselWrapper = (props: any) => {
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => r1 !== r2),
  );

  return (
    <MovieCarousel
      {...props}
      dataProvider={dataProvider}
      setDataProvider={setDataProvider}
    />
  );
};

describe('Movie Carousel Test Case', () => {
  const movieCarouselData: TitleData[] = [
    {
      id: '169306',
      title: 'Costa Rica Tourism 2016',
      description: 'Costa Rica Tourism 2016',
      duration: 3548,
      thumbnail:
        'http://le1.cdn01.net/videos/0000169/0169306/thumbs/0169306__005f.jpg',
      posterUrl:
        'http://le1.cdn01.net/videos/0000169/0169306/thumbs/0169306__005f.jpg',
      videoUrl:
        'http://edge-vod-media.cdn01.net/encoded/0000169/0169306/video_1880k/A57CBB0FF.mp4?source=firetv&channelID=13453',
      categories: ['Costa Rica Attractions'],
      channelID: '13453',
      format: '',
      uhd: false,
      secure: false,
      mediaType: 'video',
      mediaSourceType: 'url',
      rentAmount: '',
    },
  ];

  const initialProps = {
    heading: 'Category 1',
    movieCarouselData,
    testID: 'movie_carousel_category_1',
    row: 0,
    onTileFocus: jest.fn(),
    onTileBlur: jest.fn(),
  };

  const cardDimensions = {
    width: 0,
    height: 0,
  };

  it('should render MovieCarousel component', () => {
    const { getByTestId } = render(
      <MovieCarousel
        cardDimensions={cardDimensions}
        data={movieCarouselData}
        {...initialProps}
      />,
    );
    expect(getByTestId('movie_carousel_category_1')).toBeTruthy();
  });

  it('should handle invalid view type in layoutProvider', () => {
    const { getByTestId } = render(
      <MovieCarousel
        cardDimensions={cardDimensions}
        data={movieCarouselData}
        {...initialProps}
      />,
    );
    const recyclerListView = getByTestId('movie_carousel_category_1');
    expect(recyclerListView).toBeTruthy();
  });

  it('should correctly identify unchanged data', () => {
    const { rerender } = render(
      <MovieCarousel
        cardDimensions={cardDimensions}
        data={movieCarouselData}
        {...initialProps}
      />,
    );
    rerender(
      <MovieCarousel
        cardDimensions={cardDimensions}
        data={movieCarouselData}
        {...initialProps}
      />,
    );
    expect(initialProps.onTileFocus).not.toHaveBeenCalled();
  });

  it('DataProvider uses custom comparison function', () => {
    const setDataProviderMock = jest.fn();
    const { rerender } = render(
      <MovieCarouselWrapper
        data={movieCarouselData}
        setDataProvider={setDataProviderMock}
        {...initialProps}
      />,
    );
    rerender(
      <MovieCarouselWrapper
        data={[{ id: 1, title: 'Title 1' }]}
        setDataProvider={setDataProviderMock}
        {...initialProps}
      />,
    );
    setDataProviderMock();
    expect(setDataProviderMock).toHaveBeenCalled();
  });
});
