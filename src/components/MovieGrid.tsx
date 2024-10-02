import { useReportFullyDrawn } from '@amzn/kepler-performance-api';
import { useTheme } from '@amzn/kepler-ui-components';
import { TVFocusGuideView } from '@amzn/react-native-kepler';
import { isEqual } from 'lodash';
import React, {
  memo,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview';
import { RecyclerListViewState } from 'recyclerlistview/dist/reactnative/core/RecyclerListView';
import MovieCarousel from '../components/MovieCarousel';
import { getVerticalCardDimensionsMd } from '../styles/ThemeAccessors';
import { MovieGridData } from '../types/MovieGridData';
import { CustomRecyclerListViewProps } from '../types/RecyclerListData';
import { TitleData } from '../types/TitleData';
import { scaleUxToDp } from '../utils/pixelUtils';

interface MovieGridProps {
  data: MovieGridData[];
  initialRowsToRender?: number;
  initialColumnsToRender?: number;
  onTileFocus?: (title?: TitleData) => void;
  onTileBlur?: (title?: TitleData) => void;
  testID: string;
  destinations: any;
}

const MovieGrid = React.forwardRef(
  (
    {
      data,
      initialRowsToRender,
      initialColumnsToRender,
      onTileFocus,
      onTileBlur,
      testID,
      destinations,
    }: MovieGridProps,
    ref,
  ) => {
    const [dataProvider, setDataProvider] = useState<DataProvider>(
      new DataProvider((r1, r2) => r1 !== r2),
    );
    const recyclerRef =
      useRef<
        RecyclerListView<CustomRecyclerListViewProps, RecyclerListViewState>
      >(null);

    const ViewTypes = {
      Grid: 1,
    };

    // This callback emits the trace needed for the calculation of Time to Fully Drawn KPI.
    const reportFullyDrawnCallback = useReportFullyDrawn();

    useEffect(() => {
      updateData(data);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const updateData = (
      // eslint-disable-next-line @typescript-eslint/no-shadow
      data: { heading: string; data: () => TitleData[] }[],
    ) => {
      setDataProvider(dataProvider.cloneWithRows(data));
    };

    const onCarouselTileInFocus = (
      rowIndex: number,
      title: TitleData | undefined,
    ) => {
      if (onTileFocus) {
        onTileFocus(title);
      }
      recyclerRef.current?.scrollToIndex(rowIndex, true);
    };

    const theme = useTheme();
    const cardDimensions = useMemo(
      () => getVerticalCardDimensionsMd(theme),
      [theme],
    );

    const rowRender = (
      type: string | number,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      data: { heading: String; testID: string; data: () => TitleData[] },
      index: number,
    ) => {
      //You can return any view here, CellContainer has no special significance
      switch (type) {
        case ViewTypes.Grid:
          return (
            <TVFocusGuideView destinations={destinations}>
              <MovieCarousel
                heading={data.heading}
                data={data.data()}
                testID={`movie_carousel_${data.testID}`}
                row={index}
                reportFullyDrawn={reportFullyDrawnCallback}
                initialColumnsToRender={initialColumnsToRender}
                cardDimensions={cardDimensions}
                onTileFocus={(title: TitleData | undefined) =>
                  onCarouselTileInFocus(index, title)
                }
                onTileBlur={onTileBlur}
                firstElementRef={ref as RefObject<View> | null}
              />
            </TVFocusGuideView>
          );
        default:
          return null;
      }
    };
    const layoutProvider = new LayoutProvider(
      () => {
        return ViewTypes.Grid;
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.Grid:
            dim.width = Dimensions.get('window').width;
            // Card height + Heading height.
            dim.height = cardDimensions.height + scaleUxToDp(54);
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      },
    );

    const isDataReady = () => dataProvider?.getSize() > 0;

    return (
      <View style={styles.container} testID={testID}>
        {isDataReady() ? (
          <RecyclerListView
            ref={recyclerRef}
            useWindowScroll={true}
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={rowRender}
            initialNumToRender={initialRowsToRender}
          />
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

const dataUnchanged = (
  prevProps: MovieGridProps,
  nextProps: MovieGridProps,
) => {
  const destinationsEqual = isEqual(
    prevProps.destinations,
    nextProps.destinations,
  );
  const dataEqual = isEqual(prevProps.data, nextProps.data);

  return destinationsEqual && dataEqual;
};

export default memo(MovieGrid, dataUnchanged);
