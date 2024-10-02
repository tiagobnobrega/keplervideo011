import { Typography } from '@amzn/kepler-ui-components';
import { isEqual } from 'lodash';
import React, {
  memo,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview';
import { RecyclerListViewState } from 'recyclerlistview/dist/reactnative/core/RecyclerListView';
import { COLORS } from '../styles/Colors';
import { CustomRecyclerListViewProps } from '../types/RecyclerListData';
import { TitleData } from '../types/TitleData';
import { scaleUxToDp } from '../utils/pixelUtils';
import VideoTile from './VideoTile';

interface MovieCarouselProps {
  heading: String;
  row?: number;
  data: TitleData[];
  reportFullyDrawn?: () => void;
  initialColumnsToRender?: number;
  cardDimensions: { width: number; height: number };
  onTileFocus?: (title?: TitleData) => void;
  onTileBlur?: (title?: TitleData) => void;
  firstElementRef?: RefObject<View> | null;
  testID?: string;
}

const cardHorizontalMargin = scaleUxToDp(12);
const cardVerticalMargin = scaleUxToDp(2);
const ROW_INDEX_TO_FULLY_DRAWN = 2;
const VIDEO_TILE_INDEX_TO_FULLY_DRAWN = 5;

const MovieCarousel = ({
  data,
  heading,
  row,
  initialColumnsToRender,
  cardDimensions,
  reportFullyDrawn,
  onTileFocus,
  onTileBlur,
  firstElementRef,
  testID,
}: MovieCarouselProps) => {
  const [dataProvider, setDataProvider] = useState<DataProvider>(
    new DataProvider((r1, r2) => r1 !== r2),
  );
  const ViewTypes = {
    Tiles: 1,
  };
  const recyclerRef = useRef<RecyclerListView<
    CustomRecyclerListViewProps,
    RecyclerListViewState
  > | null>(null);

  useEffect(() => {
    updateData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = (titleData: TitleData[]) => {
    setDataProvider(dataProvider.cloneWithRows(titleData));
  };

  /**
   * Function to report TTFD (time to fully drawn) performance metric,
   * It is reported based on the row and video tile that is being rendered
   */
  const validateFullyDrawnReport = (index: number) => {
    if (
      row === ROW_INDEX_TO_FULLY_DRAWN &&
      index === VIDEO_TILE_INDEX_TO_FULLY_DRAWN &&
      reportFullyDrawn
    ) {
      reportFullyDrawn();
    }
  };

  /**
   * Process card focus event and scroll the Flat list to selected
   * card.
   */
  const onCarouselTileInFocus = (
    columnIndex: number,
    title: TitleData | undefined,
  ) => {
    if (onTileFocus) {
      onTileFocus(title);
    }
    recyclerRef.current?.bringToFocus(columnIndex, false);
  };

  const rowRender = (
    type: string | number,
    titleData: TitleData,
    index: number,
  ) => {
    validateFullyDrawnReport(index);

    switch (type) {
      case ViewTypes.Tiles:
        return (
          <VideoTile
            row={row}
            index={index}
            data={titleData}
            onFocus={(title: TitleData | undefined) =>
              onCarouselTileInFocus(index, title)
            }
            onBlur={onTileBlur}
            firstElementRef={firstElementRef}
          />
        );
      default:
        return null;
    }
  };

  const layoutProvider = new LayoutProvider(
    () => {
      return ViewTypes.Tiles;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.Tiles:
          dim.width = cardDimensions.width + cardHorizontalMargin * 2;
          dim.height = cardDimensions.height + cardVerticalMargin * 10;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  const isDataReady = () => dataProvider?.getSize() > 0;

  const computedStyle = useMemo(() => {
    return StyleSheet.create({
      recylerListView: {
        height: cardDimensions.height + cardVerticalMargin * 6 + scaleUxToDp(8),
      },
    });
  }, [cardDimensions.height]);

  return (
    <View nativeID="carousel-container" testID={testID}>
      <Typography variant="body" style={styles.heading}>
        {heading}
      </Typography>
      {isDataReady() ? (
        <RecyclerListView
          ref={recyclerRef}
          useWindowScroll={true}
          isHorizontal={true}
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={rowRender}
          style={computedStyle.recylerListView}
          initialNumToRender={initialColumnsToRender}
        />
      ) : null}
    </View>
  );
};

const dataUnchanged = (
  prevProps: MovieCarouselProps,
  nextProps: MovieCarouselProps,
) => {
  return isEqual(prevProps.data, nextProps.data);
};

const styles = StyleSheet.create({
  heading: {
    fontSize: scaleUxToDp(25),
    color: COLORS.LIGHT_GRAY,
  },
});

export default memo(MovieCarousel, dataUnchanged);
