import {
  ContentEntitlementBuilder,
  ContentIdBuilder,
  ContentIdNamespaces,
  ContentInteractionBuilder,
  ContentInteractionType,
  CustomerListEntryBuilder,
  CustomerListType,
  EntitlementType,
  IContentEntitlement,
  IContentId,
  IContentInteraction,
  ICustomerListEntry,
  IPlaybackEvent,
  IProfileId,
  PlaybackEventBuilder,
  PlaybackState,
  ProfileIdBuilder,
  ProfileIdNamespaces,
} from '@amzn/kepler-content-personalization';
import {
  ChannelDescriptorBuilder,
  IChannelDescriptor,
} from '@amzn/kepler-epg-provider';
import { VideoPlayer } from '@amzn/react-native-w3cmedia';

export function getMockContentID(id: string, namespace: string): IContentId {
  return new ContentIdBuilder().id(id).idNamespace(namespace).build();
}

export function getMockContentEntitlement(): IContentEntitlement {
  console.info('k_content_per: Building ContentEntitlement object in App');
  return new ContentEntitlementBuilder()
    .acquisitionTimestamp(new Date())
    .contentId(getMockContentID('testId', ContentIdNamespaces.NAMESPACE_CDF_ID))
    .entitlementType(EntitlementType.PURCHASE)
    .expirationTimestamp(new Date())
    .build();
}

export function getMockContentInteraction(
  interactionType: ContentInteractionType,
  content: IContentId,
): IContentInteraction {
  console.info('k_content_per: Building ContentInteraction object in App');
  return new ContentInteractionBuilder()
    .contentId(content)
    .interactionTimestamp(new Date())
    .contentInteractionType(interactionType)
    .profileId(getMockProfileId())
    .build();
}

export function getMockCustomerListEntry(
  listType: CustomerListType,
  content: IContentId,
): ICustomerListEntry {
  console.info('k_content_per: Building CustomerListEntry object in App');
  return new CustomerListEntryBuilder()
    .contentId(
      content
        ? content
        : getMockContentID('testId', ContentIdNamespaces.NAMESPACE_CDF_ID),
    )
    .addedTimestamp(new Date())
    .build();
}

export function getMockProfileId(): IProfileId {
  return new ProfileIdBuilder()
    .id('testProfile')
    .idNamespace(ProfileIdNamespaces.NAMESPACE_APP_INTERNAL)
    .build();
}

function getMockChannelDescriptor(): IChannelDescriptor {
  return new ChannelDescriptorBuilder()
    .identifier('UniqueChannelIdentifier')
    .majorNumber(1)
    .minorNumber(0)
    .build();
}

export function getDefaultMockPlaybackEvent(): IPlaybackEvent {
  console.info('k_content_per: Building PlaybackEvent object in App');
  return new PlaybackEventBuilder()
    .channelDescriptor(getMockChannelDescriptor())
    .contentId(getMockContentID('testId', ContentIdNamespaces.NAMESPACE_CDF_ID))
    .creditsPositionMs(5000)
    .durationMs(50000)
    .playbackPositionMs(100)
    .playbackState(PlaybackState.PAUSED)
    .profileId(getMockProfileId())
    .eventTimestamp(new Date())
    .buildActiveEvent();
}

export function getMockPlaybackEventForVideo(
  videoRef: React.MutableRefObject<VideoPlayer | null>,
  title: string,
  playbackState: PlaybackState,
): IPlaybackEvent {
  if (!videoRef.current) {
    throw new Error('k_content_per: Video player is not initialized');
  }
  return (
    new PlaybackEventBuilder()
      .playbackState(playbackState)
      .profileId(getMockProfileId())
      .contentId(
        getMockContentID('title', ContentIdNamespaces.NAMESPACE_CDF_ID),
      )
      // Multiplying it by 1000 since the duration retrieved from the player is in seconds
      .durationMs(videoRef.current.duration * 1000)
      // Multiplying it by 1000 since the currentTime retrieved from the player is in seconds
      .playbackPositionMs(videoRef.current.currentTime * 1000)
      .buildActiveEvent()
  );
}
