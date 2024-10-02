/*
 * Copyright (c) 2023 - 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import { EpgSyncTaskScheduler } from '@amzn/kepler-epg-sync-scheduler';

const DAY_HOURS_IN_MINUTES = 60 * 24;
const SYNC_TASK_COMPONENT_ID = 'com.amazon.keplervideoapp.epgSyncTask';

/**
 * Function to schedule EPG sync task.
 *
 * Option 1: Schedule EPG Sync task with a given interval.
 *           Please see EpgSyncTaskScheduler.scheduleTask.
 *
 * Option 2: Schedule task with an execution window. For example, run the task between 2am - 4am UTC every day.
 *           Please see EpgSyncTaskScheduler.scheduleTaskWithExecutionWindow.
 *
 * If you call 'scheduleTask()' or 'scheduleTaskWithExecutionWindow()' multiple times,
 * the most recent EPG Sync Task method call is fulfilled and persisted across reboots
 *
 */
const doTask = (): Promise<void> => {
  console.info('ktf:EpgSync - Scheduling EPG Sync task');

  // Schedule EPG Sync task with a given interval.
  EpgSyncTaskScheduler.scheduleTask(
    SYNC_TASK_COMPONENT_ID,
    DAY_HOURS_IN_MINUTES,
  );

  return Promise.resolve();
};

export default doTask;
