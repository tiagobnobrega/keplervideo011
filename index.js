/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import NewRelic from 'newrelic-kepler-agent';
import { AppRegistry, LogBox } from 'react-native';
import { name as appName, syncSourceName } from './app.json';
import { version } from './package.json';
import App from './src/App';
import LiveForceSync from './src/LiveForceSync';

/// Config keys (if not set, default value is true)
let config = {
  /// Capture Javascript errors
  recordJsErrors: true,
  /// Capture Promise rejections
  recordPromiseRejections: true,
  /// Capture HTTP requests
  recordFetchResults: true,
  /// Capture console logs
  recordConsoleLogs: true,
  //Android Specific
  // Optional:Enable or disable collection of event data.
  analyticsEventEnabled: true,

  // Optional:Enable or disable crash reporting.
  crashReportingEnabled: true,

  // Optional:Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
  interactionTracingEnabled: true,

  // Optional:Enable or disable reporting successful HTTP requests to the MobileRequest event type.
  networkRequestEnabled: true,

  // Optional:Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
  networkErrorRequestEnabled: true,

  // Optional:Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
  httpResponseBodyCaptureEnabled: true,

  // Optional:Enable or disable agent logging.
  loggingEnabled: true,
};

/// Set Account ID, API Key and Endpoint (either "US" or "EU").
NewRelic.startAgent(
  process.env.ACCOUNT_ID,
  process.env.API_KEY,
  process.env.ENDPOINT,
  config,
);
NewRelic.setAppVersion(version);

// Temporary workaround for problem with nested text
// not working currently.
LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(syncSourceName, () => LiveForceSync);
