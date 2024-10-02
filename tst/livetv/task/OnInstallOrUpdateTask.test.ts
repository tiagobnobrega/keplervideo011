/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import { EpgSyncTaskScheduler } from '@amzn/kepler-epg-sync-scheduler';

import 'react-native';
import { default as doTask } from '../../../src/livetv/task/OnInstallOrUpdateTask';

jest.mock('@amzn/kepler-epg-sync-scheduler', () => ({
  EpgSyncTaskScheduler: {
    scheduleTask: jest.fn((_componentId: string, _interval: number) =>
      Promise.resolve(),
    ),
  },
}));

describe('OnInstall Task Test', () => {
  it('should be able to call doTask and execute scheduleTask function', async () => {
    await expect(doTask()).resolves.toBeUndefined();
    expect(EpgSyncTaskScheduler.scheduleTask).toBeCalledTimes(1);
  });
});
