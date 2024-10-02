import {
  ContentIdNamespaces,
  ContentInteractionType,
  ContentPersonalizationServer,
  CustomerListType,
} from '@amzn/kepler-content-personalization';
import { SubscriptionEntitlementServer } from '@amzn/kepler-subscription-entitlement';
import {
  Button,
  Header,
  Typography,
  useTheme,
} from '@amzn/kepler-ui-components';
import { RouteProp } from '@amzn/react-navigation__core';
import { StackNavigationProp } from '@amzn/react-navigation__stack';
import { isEqual } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import MovieCarousel from '../components/MovieCarousel';
import {
  AppStackParamList,
  AppStackScreenProps,
  ButtonConfig,
  Screens,
} from '../components/navigation/types';
import Rating from '../components/Rating';
import { VideoFileType } from '../components/VideoFileType';
import {
  isContentPersonalizationEnabled,
  isInAppPurchaseEnabled,
  isSubscriptionEntitlementEnabled,
} from '../config/AppConfig';
import { IAPConstants } from '../iap/IAPConstants';
import { IAPManager } from '../iap/utils/IAPManager';
import {
  getMockContentEntitlement,
  getMockContentID,
  getMockContentInteraction,
  getMockCustomerListEntry,
} from '../mocks/ContentPersonalizationMocks';
import { getMockSubscriptionEntitlementEntry } from '../mocks/SubscriptionEntitlementMocks';

import { getClassics } from '../data/local/classics';
import { settingsSelectors } from '../store/settings/SettingsSlice';
import {
  addToPurchaseList,
  addToRentList,
  addToWatchList,
  removeFromPurchaseList,
  removeFromRentList,
  removeFromWatchList,
  RentListItem,
  videoDetailSelectors,
} from '../store/videoDetail/videoDetailSlice';
import { COLORS } from '../styles/Colors';
import { getVerticalCardDimensionsMd } from '../styles/ThemeAccessors';
import { customFormatDate } from '../utils/commonFunctions';
import { recordCustomEvent } from '../utils/helperNewRelic';
import { scaleUxToDp } from '../utils/pixelUtils';
import { translate } from '../utils/translationHelper';

const AddIcon: ImageSourcePropType = require('../assets/add_solid.png');
const DeleteIcon: ImageSourcePropType = require('../assets/delete_icon.png');
const HdIcon: ImageSourcePropType = require('../assets/hd_outline.png');
const PlayIcon: ImageSourcePropType = require('../assets/play_solid.png');
const TransactionIcon: ImageSourcePropType = require('../assets/transaction_solid.png');
const Constants = {
  PLAY_MOVIE: 'Play Movie',
  ADD_TO_LIST: 'Add to List',
  PLAY_TRAILER: 'Play Trailer',
  PURCHASE_SUBSCRIPTION: 'Purchase Subscription',
  RENT: 'Rent',
  RELATED_MOVIES: 'Related Movies:',
  REMOVE_FROM_LIST: 'Remove from  List',
  REMOVE_SUBSCRIPTION: 'Remove Subscription',
  REMOVE_RENTAL: 'Remove Rental',
};

interface DetailsProps {
  navigation: StackNavigationProp<AppStackParamList, Screens.DETAILS_SCREEN>;
  route: RouteProp<AppStackParamList, Screens.DETAILS_SCREEN>;
}

const DetailsScreen = ({
  navigation,
  route,
}: AppStackScreenProps<Screens.DETAILS_SCREEN>) => {
  const videoID = route.params.data.id;
  const watchList = useSelector(videoDetailSelectors.watchList);
  const purchasedList = useSelector(videoDetailSelectors.purchasedList);
  const rentList = useSelector(videoDetailSelectors.rentList);
  const dispatch = useDispatch();

  const [format, setFormat] = useState(route.params.data.format);
  const [showAddToWatchList, setShowAddToWatchList] = useState(true);
  const [showAddSubscription, setShowAddSubscription] = useState(true);
  const [showAddRental, setShowAddRental] = useState(true);
  const [rentalTimestamp, setRentalTimestamp] = useState<string | null>(null);

  let currentTitle = useRef<string>(route.params.data.title);

  const focusableElementRef = useRef<TouchableOpacity>(null);
  const playMovieButtonRef = useRef<View>(null);
  const rating = route.params.data.rating ?? '';
  const countryCode = useSelector(settingsSelectors.countryCode);
  const rentAmount =
    `${translate('currency', countryCode?.code)}${
      route.params.data.rentAmount
    }` ?? '';

  const checkDetailScreenChanged = useCallback(() => {
    return currentTitle.current !== route.params.data.title;
  }, [currentTitle, route.params.data.title]);

  const navigateBack = useCallback(() => {
    navigation.navigate(Screens.HOME_SCREEN);
    recordCustomEvent('Navigated: ', {
      name: Screens.HOME_SCREEN,
    });
    return true;
  }, [navigation]);

  useEffect(() => {
    if (Platform.isTV) {
      const backAction = () => {
        navigateBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }
  }, [navigateBack]);

  React.useEffect(() => {
    playMovieButtonRef?.current?.focus();
    return () => {
      route.params.sendDataOnBack(videoID);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react/no-unstable-nested-components
  const HDLabel = () => {
    return <Image source={HdIcon} style={styles.hdIcon} />;
  };

  useEffect(() => {
    if (isInAppPurchaseEnabled()) {
      IAPManager.getPurchaseUpdates();
    }
  }, []);

  useEffect(() => {
    const { data } = route.params;
    if (checkDetailScreenChanged()) {
      console.info('Moved onto new Detail Screen');
      setFormat(data.format);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.data]);

  const onPressPurchaseSubscription = useCallback(() => {
    IAPManager.triggerPurchase(IAPConstants.MONTHLY_SUBSCRIPTION_SKU);

    try {
      // Wrapping all getMock functions in try block as they can throw exceptions which are cascaded back from the JS Turbo Module
      if (isSubscriptionEntitlementEnabled()) {
        console.info('k_sub_ent: Reporting new Subscription Entitlement');
        const subscriptionEntitlementEntry =
          getMockSubscriptionEntitlementEntry();
        SubscriptionEntitlementServer.reportNewSubscription(
          subscriptionEntitlementEntry,
        );
      }
      dispatch(addToPurchaseList(videoID));
      setShowAddSubscription(false);
    } catch (e) {
      console.error(`k_sub_ent: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoID]);

  const onPressRemoveSubscription = useCallback(() => {
    IAPManager.triggerPurchase(IAPConstants.MONTHLY_SUBSCRIPTION_SKU);
    try {
      if (isSubscriptionEntitlementEnabled()) {
        console.info('k_sub_ent: Reporting removed Subscription Entitlement');
        const subscriptionEntitlementEntry =
          getMockSubscriptionEntitlementEntry();
        SubscriptionEntitlementServer.reportRemovedSubscription(
          subscriptionEntitlementEntry,
        );
      }
      dispatch(removeFromPurchaseList(videoID));
      setShowAddSubscription(true);
    } catch (e) {
      console.error(`k_sub_ent: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoID]);

  const onPressRent = useCallback(() => {
    IAPManager.triggerPurchase(IAPConstants.PURCHASE_TITLE_SKU);

    try {
      const currentDate = new Date().toISOString();
      const rentDetails = {
        videoID,
        rentedOn: currentDate,
      };
      setRentalTimestamp(currentDate);
      if (isContentPersonalizationEnabled()) {
        console.info(
          'k_content_per: Reporting new Content entitlement for the purchase/rent',
        );
        const contentEntitlement = getMockContentEntitlement();
        ContentPersonalizationServer.reportNewContentEntitlement(
          contentEntitlement,
        );
      }
      dispatch(addToRentList(rentDetails));
      setShowAddRental(false);
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoID]);

  const onPressRemoveRent = useCallback(() => {
    IAPManager.triggerPurchase(IAPConstants.PURCHASE_TITLE_SKU);

    try {
      if (isContentPersonalizationEnabled()) {
        console.info(
          'k_content_per: Reporting removed Content Entitlement or the purchase/rent',
        );
        const contentEntitlement = getMockContentEntitlement();
        ContentPersonalizationServer.reportRemovedContentEntitlement(
          contentEntitlement,
        );
      }
      dispatch(removeFromRentList(videoID));
      setShowAddRental(true);
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoID]);

  const reportAddToWatchList = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }

    console.info(
      'k_content_per: Reporting new Customer List entry for add to list',
    );
    try {
      const contentId = getMockContentID(
        videoID,
        ContentIdNamespaces.NAMESPACE_CDF_ID,
      );
      const customerListEntry = getMockCustomerListEntry(
        CustomerListType.WATCHLIST,
        contentId,
      );
      ContentPersonalizationServer.reportNewCustomerListEntry(
        CustomerListType.WATCHLIST,
        customerListEntry,
      );
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentPersonalizationEnabled, videoID]);

  const onPressAddToListHandler = useCallback(() => {
    dispatch(addToWatchList(videoID));
    reportAddToWatchList();
    setShowAddToWatchList(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoID]);

  const reportRemoveFromWatchList = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }

    console.info(
      'k_content_per: Reporting Customer List entry for removing from list',
    );
    try {
      const contentId = getMockContentID(
        videoID,
        ContentIdNamespaces.NAMESPACE_CDF_ID,
      );
      const customerListEntry = getMockCustomerListEntry(
        CustomerListType.WATCHLIST,
        contentId,
      );
      ContentPersonalizationServer.reportRemovedCustomerListEntry(
        CustomerListType.WATCHLIST,
        customerListEntry,
      );
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentPersonalizationEnabled, videoID]);

  const onPressRemoveFromListHandler = useCallback(() => {
    dispatch(removeFromWatchList(videoID));
    reportRemoveFromWatchList();
    setShowAddToWatchList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoID]);

  const reportNavigatePlayerContentInteraction = useCallback(() => {
    if (!isContentPersonalizationEnabled()) {
      return;
    }

    console.info(
      'k_content_per: Reporting new Content Interaction for INGRESS',
    );
    try {
      const contentId = getMockContentID(
        videoID,
        ContentIdNamespaces.NAMESPACE_CDF_ID,
      );
      const contentInteraction = getMockContentInteraction(
        ContentInteractionType.INGRESS,
        contentId,
      );
      ContentPersonalizationServer.reportNewContentInteraction(
        contentInteraction,
      );
    } catch (e) {
      console.error(`k_content_per: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentPersonalizationEnabled, videoID]);

  const handleFocusOnBack = useCallback(() => {
    focusableElementRef.current?.focus();
    playMovieButtonRef.current?.focus();
  }, [focusableElementRef]);

  const checkIfMovieIsRented = () => {
    const foundMovie = rentList.find(
      (item: RentListItem) => item.videoID === videoID,
    );
    if (foundMovie) {
      setRentalTimestamp(foundMovie.rentedOn);
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (videoID) {
      setShowAddToWatchList(!watchList.includes(videoID));
      setShowAddSubscription(!purchasedList.includes(videoID));
      setShowAddRental(checkIfMovieIsRented());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoID]);

  const navigateToPlayer = useCallback(async () => {
    reportNavigatePlayerContentInteraction();
    const data = {
      data: route.params.data,
      sendDataOnBack: handleFocusOnBack,
    };

    console.log('@@@@@@@@@@@@@@@@@@@@@@ data=>',{data})
    navigation.navigate(Screens.PLAYER_SCREEN, data);
    recordCustomEvent('Navigated: ', {
      name: Screens.PLAYER_SCREEN,
      params: route.params.data,
    });
  }, [
    reportNavigatePlayerContentInteraction,
    navigation,
    route.params.data,
    handleFocusOnBack,
  ]);

  const buttonConfig: ButtonConfig[] = [
    {
      onPress: navigateToPlayer,
      image: PlayIcon,
      label: Constants.PLAY_MOVIE,
      ref: focusableElementRef,
      testID: 'details-action-play-movie-btn',
    },
    {
      onPress: showAddToWatchList
        ? onPressAddToListHandler
        : onPressRemoveFromListHandler,
      image: showAddToWatchList ? AddIcon : DeleteIcon,
      label: showAddToWatchList
        ? Constants.ADD_TO_LIST
        : Constants.REMOVE_FROM_LIST,
      testID: 'details-action-add-remove-btn',
    },
  ];
  if (isInAppPurchaseEnabled()) {
    buttonConfig.push({
      onPress: showAddSubscription
        ? onPressPurchaseSubscription
        : onPressRemoveSubscription,
      image: showAddSubscription ? TransactionIcon : DeleteIcon,
      label: showAddSubscription
        ? Constants.PURCHASE_SUBSCRIPTION
        : Constants.REMOVE_SUBSCRIPTION,
      testID: 'details-action-purchase-remove-subscription-btn',
    });
    buttonConfig.push({
      onPress: showAddRental ? onPressRent : onPressRemoveRent,
      image: showAddRental ? TransactionIcon : DeleteIcon,
      label: showAddRental ? Constants.RENT : Constants.REMOVE_RENTAL,
      testID: 'details-action-rent-remove-btn',
    });
  }

  const getActionButtons = () => {
    return (
      <View style={styles.movieButtonsContainer}>
        {buttonConfig.map(btn => {
          return (
            <Button
              label={btn.label}
              onPress={btn.onPress}
              variant={'primary'}
              mode="contained"
              focusedStyle={styles.movieButton}
              iconSource={btn.image}
              iconSize={'sm'}
              iconPosition="start"
              style={styles.buttonStyle}
              key={btn.testID}
              testID={btn.testID}
              ref={
                btn.label === Constants.PLAY_MOVIE ? playMovieButtonRef : null
              }
              onBlur={onBlurPlayMovie}
            />
          );
        })}
      </View>
    );
  };

  const theme = useTheme();
  const cardDimensions = useMemo(
    () => getVerticalCardDimensionsMd(theme),
    [theme],
  );

  const onBlurPlayMovie = () => {
    playMovieButtonRef?.current?.blur();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={{ uri: route.params.data.posterUrl }}
        imageStyle={styles.imageBackground}
        style={styles.imageBackgroundContainer}>
        <View style={styles.headerStyle}>
          <Header
            iconSize={44}
            title={route.params.data.title}
            titleAlignment={'start'}
            titleSize="lg"
            titleVariant="headline"
            headerColor={COLORS.WHITE}
            backIconFocusedStyle={styles.headerBackIconStyle}
            onBackPress={navigateBack}
            testID="detail-header"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.landscape} accessibilityElementsHidden={true}>
            <Rating rating={parseFloat(rating)} id={videoID} />
            <HDLabel />
          </View>
          <Typography variant={'title'} numberOfLines={1} color={COLORS.WHITE}>
            {route.params.data.description}
          </Typography>
          {getActionButtons()}
          {!showAddRental && rentalTimestamp ? (
            <Typography
              variant={'label'}
              color={COLORS.WHITE}
              testID="text-rent-success">
              Rented for {rentAmount} on{' '}
              {customFormatDate(new Date(rentalTimestamp))}
            </Typography>
          ) : null}
          <VideoFileType selectedFileType={format} />
          <MovieCarousel
            cardDimensions={cardDimensions}
            heading={Constants.RELATED_MOVIES}
            testID={'movie_carousel_related_movies'}
            data={getClassics()}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const detailDataUnchanged = (
  prevProps: DetailsProps,
  nextProps: DetailsProps,
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(DetailsScreen, detailDataUnchanged);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  landscape: {
    flexDirection: 'row',
  },
  imageBackgroundContainer: {
    flex: 1,
  },
  imageBackground: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    marginLeft: scaleUxToDp(80),
  },
  titleText: {
    fontSize: scaleUxToDp(70),
    fontWeight: 'bold',
    color: COLORS.WHITE,
    width: '60%',
  },
  hdIcon: {
    height: scaleUxToDp(35),
    width: scaleUxToDp(50),
    tintColor: COLORS.WHITE,
    alignSelf: 'center',
    marginLeft: scaleUxToDp(15),
  },
  descriptionText: {
    fontSize: scaleUxToDp(30),
    color: COLORS.LIGHT_GRAY,
    marginVertical: scaleUxToDp(7.5),
    width: '40%',
  },
  backButton: {
    marginTop: scaleUxToDp(10),
    marginHorizontal: scaleUxToDp(10),
  },
  movieButtonsContainer: {
    width: '20%',
    margin: scaleUxToDp(30),
  },
  movieButton: {
    borderRadius: scaleUxToDp(7.5),
    borderColor: COLORS.ORANGE,
    borderWidth: 3,
    margin: scaleUxToDp(5),
  },
  ratingIcon: {
    height: scaleUxToDp(35),
    width: scaleUxToDp(35),
    tintColor: COLORS.YELLOW,
  },
  ratingText: {
    fontSize: scaleUxToDp(26),
    color: COLORS.WHITE,
    marginLeft: scaleUxToDp(10),
  },
  movieCarouselContainer: {
    minHeight: scaleUxToDp(300),
  },
  movieCarouselHeading: {
    fontSize: scaleUxToDp(32),
    color: COLORS.WHITE,
  },
  overrideListContentContainer: {
    marginTop: 0,
  },
  buttonStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: COLORS.BLACK,
    opacity: 0.8,
    height: scaleUxToDp(60),
    borderColor: COLORS.TRANSPARENT,
    margin: scaleUxToDp(5),
    borderRadius: scaleUxToDp(7.5),
  },
  headerStyle: {
    height: scaleUxToDp(150),
    width: '100%',
    justifyContent: 'center',
    marginLeft: scaleUxToDp(20),
  },
  headerBackIconStyle: {
    borderColor: COLORS.ORANGE,
    borderWidth: 2,
    borderRadius: scaleUxToDp(33),
    padding: scaleUxToDp(10),
  },
  containerFocusGuide: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
});
