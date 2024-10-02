/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import { HeadlessEntryPointRegistry } from "@amzn/headless-task-manager";

import { default as doOnInstallOrUpdateTask } from "./src/livetv/task/OnInstallOrUpdateTask"
import { default as doEpgSyncTask } from "./src/livetv/task/EpgSyncTask"

HeadlessEntryPointRegistry.registerHeadlessEntryPoint("com.amazon.keplervideoapp.onInstallOrUpdateTask::doTask",
    () => doOnInstallOrUpdateTask);

HeadlessEntryPointRegistry.registerHeadlessEntryPoint("com.amazon.keplervideoapp.epgSyncTask::doTask",
    () => doEpgSyncTask);
