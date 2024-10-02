import {
  ChannelServerComponent,
  IChangeChannelResponse,
} from '@amzn/kepler-channel';
import {
  ContentPersonalizationServer,
  CustomerListType,
} from '@amzn/kepler-content-personalization';
import {
  ContentLauncherServerComponent,
  ContentLauncherStatusType,
  IContentLauncherHandler,
  IContentSearch,
  ILaunchContentOptionalFields,
  ILauncherResponse,
} from '@amzn/kepler-media-content-launcher';
import { getMockedCurrentTitleDataForChannel } from '../livetv/mock/MockSource';

import { SubscriptionEntitlementServer } from '@amzn/kepler-subscription-entitlement';
import { useFocusEffect } from '@amzn/react-navigation__core';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { useDispatch, useSelector } from 'react-redux';
import {
  AccountLoginWrapperInstance,
  onStartService as onStartAccountLoginService,
  onStopService as onStopAccountLoginService,
} from '../AccountLoginWrapper';
import ContentPreview from '../components/ContentPreview';
import MovieGrid from '../components/MovieGrid';
import { AppStackScreenProps, Screens } from '../components/navigation/types';
import { OptionType } from '../components/RadioPicker';
import AutoRotator from '../components/rotator/AutoRotator';
import { MovieRotatorGrid } from '../components/touchOptimized/MovieRotatorGrid';
import {
  isAccountLoginEnabled,
  isContentPersonalizationEnabled,
  isDpadControllerSupported,
  isSubscriptionEntitlementEnabled,
} from '../config/AppConfig';
import { LoginStatus } from '../constants';
import { getClassics } from '../data/local/classics';
import { getLatestHits } from '../data/local/latestHits';
import { getNewHits } from '../data/local/newHits';
import { getRecommendations } from '../data/local/recommendations';
import { getRotator } from '../data/local/rotator';
import { getTestAssets } from '../data/local/testAssests';
import { getTrends } from '../data/local/trends';
import { tileData } from '../data/tileData';
import channelTunerHandler from '../livetv/channelTunerHandler';
import { setCurrentFocus } from '../store/focus/focusSlice';
import {
  setCountryCode,
  settingsSelectors,
} from '../store/settings/SettingsSlice';
import { COLORS } from '../styles/Colors';
import { MovieGridData } from '../types/MovieGridData';
import { TitleData } from '../types/TitleData';
import { recordCustomEvent } from '../utils/helperNewRelic';
import { scaleUxToDp } from '../utils/pixelUtils';
import { getSelectedLocale } from '../utils/translationHelper';

const AutoRotatorData = getRotator();

const data: MovieGridData[] = [
  {
    heading: 'Latest Hits',
    testID: 'costa_rica_top_rated',
    data: getLatestHits,
  },
  {
    heading: 'Classics',
    testID: 'costa_rica_attractions',
    data: getClassics,
  },
  {
    heading: 'Recommendation',
    testID: 'costa_rica_underwater',
    data: getRecommendations,
  },
  {
    heading: 'Test Assets',
    testID: 'test_assets',
    data: getTestAssets,
  },
  {
    heading: 'New hits',
    testID: 'new_hits',
    data: getNewHits,
  },
  {
    heading: 'Trends',
    testID: 'trends',
    data: getTrends,
  },
];

interface HomeProps {
  navigation: any;
}

const HomeScreen = ({
  navigation,
}: AppStackScreenProps<Screens.HOME_SCREEN>) => {
  const dispatch = useDispatch();
  const countryCode = useSelector(settingsSelectors.countryCode);
  const [selectedTitle, setSelectedTitle] = useState<TitleData | undefined>(
    undefined,
  );
  const firstTileRef = React.useRef<View>(null);
  const [destination, setDestination] = useState<any>([]);
  const destinations = destination?.current ? [destination?.current] : [];
  let listener: string | boolean;
  const NAVIGATION_DELAY = 700;

  if (!countryCode) {
    const selectedLocale = getSelectedLocale();
    if (selectedLocale) {
      dispatch(setCountryCode(selectedLocale as OptionType));
    }
  }
  const callCustomerListRefresh = () => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }
    console.log('k_content_per: Calling Report Refreshed Customer List');
    ContentPersonalizationServer.reportRefreshedCustomerList(
      CustomerListType.WATCHLIST,
    );
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(
        setCurrentFocus({
          currentFocusedScreen: Screens.HOME_SCREEN,
        }),
      );
      return () => {
        dispatch(
          setCurrentFocus({
            currentFocusedScreen: '',
          }),
        );
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const callContentEntitlementsRefresh = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }
    console.log('k_content_per: Calling Report Refreshed Content Entitlements');
    ContentPersonalizationServer.reportRefreshedContentEntitlements();
  }, []);

  const callPlaybackEventsRefresh = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }
    console.log('k_content_per: Calling Report Refreshed PlaybackEvents');
    ContentPersonalizationServer.reportRefreshedPlaybackEvents();
  }, []);

  const callSubscriptionEntitlementsRefresh = useCallback(() => {
    if (!isSubscriptionEntitlementEnabled()) {
      return;
    }
    console.log(
      'k_sub_ent: Calling Report Refreshed Subscription Entitlements',
    );
    SubscriptionEntitlementServer.reportRefreshedSubscriptions();
  }, []);

  const navigateToPlayer = useCallback(
    (changeChannelResponse?: IChangeChannelResponse) => {
      navigation.navigate(Screens.HOME_SCREEN);
      setTimeout(async () => {
        // Try to match the changeChannelResponseData with a specific EPG program.
        const mockedData = await getMockedCurrentTitleDataForChannel(
          changeChannelResponse?.data ?? '',
        );
        const videoData = { ...tileData, ...mockedData };
        const params = {
          data: videoData,
          sendDataOnBack: () => {},
        };
        try {
          navigation.navigate(Screens.PLAYER_SCREEN, params);
          recordCustomEvent('Navigated: ', {
            name: Screens.PLAYER_SCREEN,
            params: videoData,
          });
        } catch {
          navigation.goBack();
        }
        // Simulating load time.
      }, NAVIGATION_DELAY);
    },
    [navigation],
  );

  const onTileFocus = useCallback(
    (title?: TitleData) => {
      setSelectedTitle(title);
      setDestination(null);
    },
    [setSelectedTitle],
  );

  const setNextFocusDestination = () => {
    setDestination(firstTileRef);
  };

  const setFocusDestinationFromRotator = () => {
    firstTileRef?.current?.focus();
    setDestination(firstTileRef);
  };

  useEffect(() => {
    ChannelServerComponent.channelServer.handler = channelTunerHandler;
    callCustomerListRefresh();
    callContentEntitlementsRefresh();
    callPlaybackEventsRefresh();
    callSubscriptionEntitlementsRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const factory = new ContentLauncherServerComponent();
    const contentLauncherHandler: IContentLauncherHandler = {
      async handleLaunchContent(
        contentSearch: IContentSearch,
        autoPlay: boolean,
        _optionalFields: ILaunchContentOptionalFields,
      ): Promise<ILauncherResponse> {
        console.log(
          'HeadlessLaunchContentHandler handleLaunchContent invoked.',
        );

        // iterator to print
        let searchParameters = contentSearch.getParameterList();
        if (searchParameters.length > 0) {
          console.log(
            `Content Launcher: Search param List Length: ${searchParameters.length}`,
          );

          let searchString = '';
          for (var j = 0; j < searchParameters.length; j++) {
            let additionalInfoList = searchParameters[j].getExternalIdList();
            console.log(
              `Content Launcher: additionalInfoList.length : ${additionalInfoList.length}`,
            );
            for (var i = 0; i < additionalInfoList.length; i++) {
              searchString += '\n';
              searchString += additionalInfoList[i].getName();
              searchString += ' : ';
              searchString += additionalInfoList[i].getValue();
              console.log(
                `Content Launcher: Search Str in additionalInfoList  ${i} : ${searchString}`,
              );
            }
            searchString += '\n\n';
            console.log(`Content Launcher: Final Search str ${searchString}`);
          }

          console.log('Content Launcher: Going to tell launch type');
          if (autoPlay) {
            console.log(`Content Launcher: Quickplay ${searchString}`);
          } else {
            console.log(`Content Launcher: In-App search ${searchString}`);
          }
        } else {
          console.log('Content Launcher: Error fetching search string');
        }
        //iterator to print

        console.log(
          'HeadlessLaunchContentHandler handleLaunchContent invoked.',
        );

        const launcherResponse = factory
          .makeLauncherResponseBuilder()
          .contentLauncherStatus(ContentLauncherStatusType.SUCCESS)
          .build();

        if (
          launcherResponse.getContentLauncherStatus() ===
          ContentLauncherStatusType.SUCCESS
        ) {
          navigateToPlayer();
        }
        return Promise.resolve(launcherResponse);
      },
    };
    const contentLauncherServer = factory.getOrMakeServer();
    contentLauncherServer.setHandler(contentLauncherHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    listener = EventRegister.addEventListener(
      'LiveChannelEvent',
      navigateToPlayer,
    );

    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, []);

  useEffect(() => {
    if (!isAccountLoginEnabled()) {
      return;
    }

    const startAccountLoginInstance = async () => {
      await onStartAccountLoginService();
      AccountLoginWrapperInstance.updateStatus(LoginStatus.SIGNED_IN);
    };

    startAccountLoginInstance();

    return () => {
      onStopAccountLoginService();
    };
  }, []);

  if (!isDpadControllerSupported()) {
    // Render touch optimized Home Screen that scrolls banner and video tiles
    // as one unit.
    return (
      <View style={styles.movieGridContainer}>
        <MovieRotatorGrid rotatorData={AutoRotatorData} movieGridData={data} />
      </View>
    );
  }

  // Render DPad optimized Home Screen that utilizes the banner area to show
  // content preview for the in-focus video tile.
  return (
    <View style={styles.container}>
      <View style={styles.contentPreviewAndRotatorContainer}>
        {selectedTitle ? (
          <ContentPreview
            tile={selectedTitle}
            onFocus={setNextFocusDestination}
          />
        ) : (
          <AutoRotator
            data={AutoRotatorData}
            onFocus={setFocusDestinationFromRotator}
          />
        )}
      </View>
      <View style={styles.movieGridContainer}>
        <MovieGrid
          data={data}
          initialColumnsToRender={6}
          initialRowsToRender={3}
          onTileFocus={onTileFocus}
          ref={firstTileRef}
          testID={'movieGrid'}
          destinations={destinations}
        />
      </View>
    </View>
  );
};

const homeScreenDataUnchanged = (
  prevProps: HomeProps,
  nextProps: HomeProps,
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(HomeScreen, homeScreenDataUnchanged);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
    paddingLeft: scaleUxToDp(29),
  },
  contentPreviewAndRotatorContainer: {
    flex: 0.8,
    width: '100%',
    height: '100%',
  },
  movieGridContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.BLACK,
    marginBottom: 20,
  },
});
