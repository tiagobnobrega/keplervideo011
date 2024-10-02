import { useTheme } from '@amzn/kepler-ui-components';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview';
import { getVerticalCardDimensionsMd } from '../../styles/ThemeAccessors';
import { MovieGridData } from '../../types/MovieGridData';
import { TitleData } from '../../types/TitleData';
import MovieCarousel from '../MovieCarousel';
import AutoRotator from '../rotator/AutoRotator';
import { RotatorData } from '../rotator/type';

type MovieRotatorGridItem = {
  type: 'rotator' | 'carousel';
  heading: string;
  testID: string;
  data: () => RotatorData[] | TitleData[];
};

export interface MovieRotatorGridProps {
  rotatorData: RotatorData[];
  movieGridData: MovieGridData[];
}

/**
 * MovieRotatorGrid combines Auto Rotator and Movie Grid as part of one
 * Scroll view such that they scroll together.
 * This is more optimized for touch screens as we do not show content
 * preview when video tile goes in focus (on touch screens, elements
 * do not get focus).
 */
export const MovieRotatorGrid = (props: MovieRotatorGridProps) => {
  const [dataProvider, setDataProvider] = useState<DataProvider>(
    new DataProvider((r1, r2) => r1 !== r2),
  );

  const ViewTypes = {
    Rotator: 1,
    Carousel: 2,
  };

  useEffect(() => {
    const gridRotatorItem: MovieRotatorGridItem = {
      heading: 'Costa Rica Attractions',
      testID: 'grid-rotator',
      type: 'rotator',
      data: () => props.rotatorData,
    };

    const gridCarouselItems: MovieRotatorGridItem[] = props.movieGridData.map(
      (item: MovieGridData) => {
        return {
          ...item,
          type: 'carousel',
        };
      },
    );
    setDataProvider(provider =>
      provider.cloneWithRows([gridRotatorItem, ...gridCarouselItems]),
    );
  }, [props.rotatorData, props.movieGridData]);

  const theme = useTheme();
  const cardDimensions = useMemo(
    () => getVerticalCardDimensionsMd(theme),
    [theme],
  );

  const rowRender = (
    type: string | number,
    data: MovieRotatorGridItem,
    index: number,
  ) => {
    //You can return any view here, CellContainer has no special significance
    switch (type) {
      case ViewTypes.Rotator:
        return <AutoRotator data={data.data() as RotatorData[]} />;
      case ViewTypes.Carousel:
        return (
          <View style={styles.carouselContainer}>
            <MovieCarousel
              heading={data.heading}
              data={data.data() as TitleData[]}
              testID={`movie_carousel_${data.testID}`}
              row={index}
              initialColumnsToRender={6}
              cardDimensions={cardDimensions}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const windowDimension = useWindowDimensions();

  const layoutProvider = new LayoutProvider(
    index => {
      if (index === 0) {
        const dataItem = dataProvider.getDataForIndex(
          index,
        ) as MovieRotatorGridItem;
        if (dataItem.type === 'rotator') {
          return ViewTypes.Rotator;
        }
      }
      return ViewTypes.Carousel;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.Rotator:
          dim.width = windowDimension.width;
          dim.height = (windowDimension.height * 51.74) / 100;
          break;
        case ViewTypes.Carousel:
          dim.width = windowDimension.width;
          // Card height + Heading height.
          dim.height = cardDimensions.height + 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  const isDataReady = () => dataProvider?.getSize() > 0;

  if (isDataReady()) {
    return (
      <RecyclerListView
        testID="movie-rotator-grid"
        useWindowScroll={true}
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={rowRender}
        initialNumToRender={1}
      />
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    marginLeft: 28,
    marginBottom: 22,
  },
});
