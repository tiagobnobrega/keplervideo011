/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import { HeadlessEntryPointRegistry } from '@amzn/headless-task-manager';

import {
  onStartService,
  onStopService,
} from './src/headless/HeadlessService';

HeadlessEntryPointRegistry.registerHeadlessEntryPoint(
  'com.amazon.keplervideoapp.interface.provider::onStartService',
  () => onStartService,
);
HeadlessEntryPointRegistry.registerHeadlessEntryPoint(
  'com.amazon.keplervideoapp.interface.provider::onStopService',
  () => onStopService,
);
