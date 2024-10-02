import {
  ContentPersonalizationServer,
  CustomerListType,
  IContentEntitlementsHandler,
  IContentEntitlementsProvider,
  ICustomerListEntriesHandler,
  ICustomerListEntriesProvider,
  IPlaybackEventsHandler,
  IPlaybackEventsProvider,
} from '@amzn/kepler-content-personalization';
import {
  ISubscriptionEntitlementsHandler,
  ISubscriptionEntitlementsProvider,
  SubscriptionEntitlementServer,
} from '@amzn/kepler-subscription-entitlement';
import {
  getDefaultMockPlaybackEvent,
  getMockContentEntitlement,
  getMockContentID,
  getMockCustomerListEntry,
} from '../mocks/ContentPersonalizationMocks';
import { getMockSubscriptionEntitlementEntry } from '../mocks/SubscriptionEntitlementMocks';
import { HeadlessServiceInterface } from './HeadlessInterface';

/***********Content Personalization Handlers*************/
const contentEntitlementsHandler: IContentEntitlementsHandler = {
  getAllContentEntitlements: (
    contentEntitlementsProvider: IContentEntitlementsProvider,
  ) => {
    console.log('getAllContentEntitlements function invoked');

    contentEntitlementsProvider.addContentEntitlementChunk([
      getMockContentEntitlement(),
    ]);

    contentEntitlementsProvider.commit();
  },
};

const customerListEntriesHandler: ICustomerListEntriesHandler = {
  getAllCustomerListEntries: (
    listType: CustomerListType,
    customerListEntriesProvider: ICustomerListEntriesProvider,
  ) => {
    console.log(
      `getAllCustomerListEntries function invoked for list Type: ${listType}`,
    );

    // the application has the ability to retrieve a chunks of data
    // and update the provider. Once all data is provided, `commit` can be
    // called to complete the transaction.
    customerListEntriesProvider.addCustomerListChunk(listType, [
      getMockCustomerListEntry(
        listType,
        getMockContentID('testId', 'testNamespace'),
      ),
    ]);

    customerListEntriesProvider.commit();
  },
};

const playbackEventsHandler: IPlaybackEventsHandler = {
  getPlaybackEventsSince: (
    sinceTimestamp: Date,
    playbackEventsProvider: IPlaybackEventsProvider,
  ) => {
    console.log('Playback event handler');
    // Apps can add all playback events to the playback provider.
    // This request can be batched and once done, a commit() can
    // be called to complete the transaction
    playbackEventsProvider.addPlaybackEventChunk([
      getDefaultMockPlaybackEvent(),
    ]);

    playbackEventsProvider.commit();
  },
};

/***********Subscription Entitlement Handlers*************/
const subscriptionEntitlementHandler: ISubscriptionEntitlementsHandler = {
  getAllSubscriptionEntitlements: (
    subscriptionEntitlementsProvider: ISubscriptionEntitlementsProvider,
  ) => {
    console.log('getAllSubscriptionEntitlements() called');

    subscriptionEntitlementsProvider.addSubscriptionEntitlementChunk([
      getMockSubscriptionEntitlementEntry(),
    ]);

    subscriptionEntitlementsProvider.commit();
  },
};

class HeadlessService implements HeadlessServiceInterface {
  onStart(): Promise<void> {
    console.log(
      'Headless Service: started. Setting the handlers for Content Personalization',
    );

    ContentPersonalizationServer.setContentEntitlementsHandler(
      contentEntitlementsHandler,
    );
    ContentPersonalizationServer.setCustomerListEntriesHandler(
      customerListEntriesHandler,
    );
    ContentPersonalizationServer.setPlaybackEventsHandler(
      playbackEventsHandler,
    );

    console.log(
      'Headless Service: Setting handlers for Subscription Entitlement',
    );

    SubscriptionEntitlementServer.setSubscriptionEntitlementsHandler(
      subscriptionEntitlementHandler,
    );

    return Promise.resolve();
  }

  onStop(): Promise<void> {
    console.log('Headless Service: onStop() called');
    return Promise.resolve();
  }
}

const HeadlessServiceInstance =
  new HeadlessService() as HeadlessServiceInterface;

export const onStartService = (): Promise<void> => {
  return HeadlessServiceInstance.onStart();
};

export const onStopService = (): Promise<void> => {
  return HeadlessServiceInstance.onStop();
};
