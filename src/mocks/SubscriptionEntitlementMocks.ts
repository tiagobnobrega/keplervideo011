import {
  ISubscriptionEntitlementEntry,
  SubscriptionEntitlementEntryBuilder,
} from '@amzn/kepler-subscription-entitlement';

export function getMockSubscriptionEntitlementEntry(): ISubscriptionEntitlementEntry {
  return new SubscriptionEntitlementEntryBuilder()
    .acquisitionTimestamp(new Date())
    .expirationTimestamp(new Date())
    .subscriptionId('testSubscriptionId')
    .build();
}
