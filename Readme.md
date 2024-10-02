# **Kepler Video App**

## About the application

The Kepler Video App is a reference app built with the Kepler SDK. The app demonstrates how to implement core multimedia functionalities relevant to typical video streaming applications.

## 1. Prerequisites

### 1.1 Setup Kepler SDK - [Download and install](https://developer.amazon.com/docs/kepler-tv/install-mac-linux.html) the Kepler SDK, and note down the installation path.

The absolute path for the Kepler SDK will vary for each developer, so it is very important to note down the correct path. For example, an absolute path for the Kepler SDK could look like: `~/.kepler`.

## 2. Building the app

In a terminal window, navigate to the KeplerVideoApp directory and run the following commands sequentially.

### 2.1 Source the Kepler SDK environment

If you have installed the SDK using the default settings, run the following script to source the environment:

```bash
    source ~/.kepler/kntools/sdk/<SDK Version>/environment-setup-sdk.sh 
```

### 2.2 Build the app to generate .vpkg files. This command also installs app dependencies.

```bash
    npm install
    npm run build:app
```

## 3. Installing and Running the app on a Simulator or Device

Verify that we have .vpkg artifacts generated in the build folder. The armv7 build artifact is always generated and  either the x86_64 or the aarch64 build artifact is generated based on your machine architecture. 
The path should look something like this:

```bash
KeplerVideoApp/build/
                |-- vega-tv2023-armv7-release/keplervideoapp_armv7.vpkg
                |-- vega-tv2023-x86_64-release/keplervideoapp_x86_64.vpkg (generated on x86_64 machine)
                |-- vega-tv2023-aarch64-release/keplervideoapp_aarch64.vpkg (generated on Mac M-series machine)
```

- The x86_64 version of .vpkg (keplervideoapp_x86_64.vpkg) will be used to install and run the application on the Kepler Simulator, for x86_64 based machines.

- The aarch_64 version of .vpkg (keplervideoapp_aarch64.vpkg) will be used to install and run the application on the Kepler Simulator, for Mac M-series based machines.

- The armv7 version of .vpkg (keplervideoapp_armv7.vpkg) will be used to install and run the application on a Kepler physical device.

### 3.1 Testing on Simulator

Start the Kepler Simulator.

```bash
    kepler device simulator start
```

Install the app on the simulator.

- For Mac M-series based machines.

```bash
    kepler device install-app -d Simulator -p  <ProjectDirPath>/build/vega-tv2023-aarch64-release/keplervideoapp_aarch64.vpkg
```

- For x86_64 based machines.
```bash
    kepler device install-app -d Simulator -p <ProjectDirPath>/build/vega-tv2023-x86_64-release/keplervideoapp_x86_64.vpkg
```

Launch the app.

```bash
    kepler device launch-app -d Simulator -a com.amazon.keplervideoapp.main
```

### 3.2 Testing on a Fire TV Stick

Turn on the FireTV device and note the Device ID from the following command.

```bash
    vda devices
```

Install the app on the device.

```bash
    kepler device install-app -d <device-id> -p ./build/vega-tv2023-armv7-release/keplervideoapp_armv7.vpkg
```

Launch the app.

```bash
    kepler device launch-app -d <device-id> -a com.amazon.keplervideoapp.main
```

### 4. Setup In-App Purchasing (Optional)

Please refer to the In-App Purchasing section of the Appendix for documentation on how to setup and configure the environment needed to use IAP-related features.

### 5. Setup Content Launcher integration (Optional)

To set up and configure your environment to use Content Launcher features, please refer to the _Content Launcher integration_ section of the appendix.

### 6. Live TV Integration (Optional)
 
Fire TV content can be explored through browsing, voice control, or searching. Through Kepler Live TV integrations, your Live TV and events can be promoted and made easily discoverable, encouraging users to engage with your app.

Basic Live TV integration is included in the Kepler Video reference app. For instructions on how to integrate Live TV into your app, visit [Kepler Live TV Overview](https://developer.amazon.com/docs/kepler-tv/live-tv-overview.html).
 
### 7. Setup Content Personalization integration (Optional)
 
To set up and configure your environment to use Content Personalization features, please refer to the _Content Personalization integration_ section of the appendix.


### 8. Adaptive Search Based on Uploaded Data

Sample JSON file used in search flow

You can upload a sample JSON file to a specified location, allowing you to search the data from the uploaded file. If the file is uploaded, the search only utilizes the data from the file. If the file is not uploaded, the search uses the existing data from the Home screen video tiles.

**Rules for JSON structure and file naming**

File name: `KVATestData.json`

Path: `/home/app_user/packages/com.amazon.keplervideoapp/data`

Command to push the file in device:

```bash
adb push KVATestData.json /home/app_user/packages/com.amazon.keplervideoapp/data
```

_JSON Structure:_

```
[
  {
    medias: [
      {
      videoUrl: string;
      categories: string[];
      channelID: string;
      posterUrl: string;
      format: string;
      drmScheme?: DrmScheme;
      textTrack?: TextTrack[];
      uhd: boolean;
      secure: boolean;
      aCodec?: string;
      vCodec?: string;
      rentAmount: string;
      },
    ...
    ],
    playlistName: string;
  },
...
]
```

_Example:_

```
[
  {
    "playlistName": "Test file ",
    "medias": [
      {
        "id": "13342393",
        "title": "Sample file",
        "description": "Hey Everyone,,,Travel a little south of Uvita and across from Playa Ocochal (Ojochal), and then take a left at the sign advertising the Tilapa El Pavon Restaurant. On the way to the restaurant (which we have a video about and also recommend), on the left hand side, you should see the sign for La Cascada el Pavon (Turkey Waterfall). We highly suggest you stop and take the very short hike down to the waterfall and check it out. Way COOL! Don't take our word for it- Check out this video. Pura Vida!",
        "duration": 105,
        "thumbnail": "http://le1.cdn01.net/videos/0000133/0133420/thumbs/0133420__005f.jpg",
        "posterUrl": "http://le1.cdn01.net/videos/0000133/0133420/thumbs/0133420__005f.jpg",
        "videoUrl": "https://edge-vod-media.cdn01.net/encoded/0000133/0133420/video_1880k/G0CXIG1LX.mp4?source=firetv&channelID=13454",
        "categories": ["Costa Rica Islands"],
        "channelID": "13454",
        "rating": "2.5",
        "mediaType": "video",
        "mediaSourceType": "url",
        "format": "MP4",
        "secure": false,
        "uhd": true,
        "rentAmount": "135"
      },
    ]
  }
]
 
## Appendix

### W3C Media APIs

This app uses Kepler's W3C Media API (`@amzn/react-native-w3cmedia`) for video playback and demonstrates some of its features:

- [Adaptive Streaming Playback](#adaptive-streaming-playback)
- [Pre-buffering](#pre-buffering)
- [Custom UI](#custom-ui)

For a more in-depth details of this API please refer to the [kepler documentation](https://developer.amazon.com/docs/kepler-tv/media-player.html)

#### Adaptive Streaming Playback

Adaptive streaming playback is a core feature of the W3C Media API. You can try out these different file types by using the [file type picker](src/components/VideoFileTypePicker.tsx) found on the [Details screen](src/screens/Details.tsx). The following file types are demonstrated:

- `MPEG DASH (MPD)`
- `HTTP Live Streaming (HLS)`
- `MP4`
- `Encrypted/DRM MPD` (_only on TV devices_)

To use the W3C Media API for adaptive streaming we need a separate Media Source Extension (MSE) player. In this app we use the [Shaka Player](#shaka-player).

#### Pre-buffering

Pre-buffering allows video content to be loaded outside of the player component. In this app, pre-buffering begins on the [Details screen](src/screens/Details.tsx#L45). This allows the video to start loading before the user reaches the [Player screen](src/screens/Player.tsx). This greatly decreases how long the user has to wait for the video to start. The utility class [VideoHandler.ts](src/utils/VideoHandler.ts) handles pre-buffering and its clean-up functions.

#### Custom UI

The W3C Media API allows you to hide the standard UI and display your own UI on top of the video player. In this app a [custom UI](src/w3cmedia/mediacontrols/VideoPlayerUI.tsx) was created to demonstrate this. The buttons of this custom UI connect to the `VideoPlayer` object and trigger the appropriate actions.

#### Shaka Player

Shaka Player is a JavaScript (JS) player created for adaptive streaming on the web. The architecture of the W3C Media API allows this web player to also be used in Kepler apps. A port of the Shaka player's code is included in [`src/w3cmedia/shakaplayer`](src/w3cmedia/shakaplayer). A helper function [ShakaPlayer.ts](src/w3cmedia/shakaplayer/ShakaPlayer.ts) was created to instantiate the Shaka player class and link it to the W3C Media API.

### In-App Purchasing

The In-App Purchasing (IAP) API allows apps to present, process, and fulfill purchases of digital content and subscriptions within the app. The Kepler Video App demonstrates a simple use-case of the IAP APIs through the "Purchase Subscription" button on the Details Screen.
The IAP implementation for the Kepler Video App references the [IAP Sample App](https://developer.amazon.com/docs/kepler-tv-iap/use-iap-kepler-sample.html) to showcase a simple Purchasing transaction for monthly subscriptions. For other in-depth IAP features, developers can explore the IAP Sample App.

Prior setup is needed in order to utilize the IAP APIs and handle transactions properly. This setup is required everytime when the simulator or device is launched. Please follow the [IAP documentation](https://developer.amazon.com/docs/kepler-tv-iap/kepler-iap-overview.html) to onboard and setup the [IAP Tester App](https://developer.amazon.com/docs/kepler-tv-iap/configure-app-tester.html). Developers can reference the IAP documentation and follow the formats, to properly configure the IAP environment. Some commands specific or useful to the Kepler Video App has been included below for convenience.

After installing and setting up the IAP Tester App, we need to create directories for the config files for the IAP Tester App and Kepler Video App.

#### Setup and configure IAP artifacts

##### From the Simulator or Device

```bash
mkdir /tmp/scratch/com.amazon.iap.tester
mkdir /tmp/scratch/com.amazon.keplervideoapp
```

##### From the Kepler Video App root directory (Simulator)

```bash
scp ./src/iap/amazon.sdktester.json sim:/tmp/scratch/com.amazon.iap.tester/
scp ./src/iap/amazon.config.json sim:/tmp/scratch/com.amazon.keplervideoapp/
```

##### From the Kepler Video App root directory (Device)

```bash
vda push ./src/iap/amazon.sdktester.json /tmp/scratch/com.amazon.iap.tester/
vda push ./src/iap/amazon.config.json /tmp/scratch/com.amazon.keplervideoapp/
```

#### Launch the IAP Tester App

##### Simulator

```bash
kepler device launch-app -d Simulator -a com.amazon.iap.tester.ui
```

##### Device

```bash
kepler device launch-app -d <device-id> -a com.amazon.iap.tester.ui
```

After setting up the IAP environment and launching the IAP Tester App, the Kepler Video App is ready to be launched with IAP enabled.

### Content Launcher integration
_Content Launcher_ is an interface provided to support media content launch on an app (also known as  _Cluster Provider App_). Launching content on an app requires apps to upload their catalog and associate the app to the catalog using a “partner id”. The KeplerVideoApp demonstrate a simple use case of receiving the intent receive as a part of content Launcher trigger and how to process it. This triggers can be initiated from the native TV Launcher application once the app uploads their catalog. 

In order to enable app to receive his trigger following things needs to be performed:
- Update the *manifest.toml* file so that app is registered to the Content Launcher Service. 
Ensure to have an interactive component defined under components as follows

```bash
[components]
[[components.interactive]]
id = "com.amazon.sampleapp.main"
```
Under extra section ensure to have `interface-provider` defined as key

```bash
[[extras]]
key = "interface.provider"
component-id = "com.amazon.sampleapp.interface.provider"
```

Define the `IContentLauncherServer` interface under application.interface with proper partner-id which will be received by catalog creation process

```bash
[[extras.value.application.interface]]
interface_name = "com.amazon.kepler.media.IContentLauncherServer"
override_command_component = { LaunchContent = "com.amazon.sampleapp.main"}
attribute_options = ["partner-id"]

[extras.value.application.interface.static-values]
partner-id = "AmazonMusic"
```

Define the `IAccountLoginServer` interface if app needs to receive the account login specific status

```bash
[[extras.value.application.interface]]
interface_name = "com.amazon.kepler.media.IAccountLoginServer"
attribute_options = ["Status"]
```

- Update package.json with proper dependencies: The services has a dependency on two packages which is shared by Amazon. These needs to added into the package.json file under dependency section as follows

```bash
"dependencies": {
:
"@amzn/kepler-media-account-login": "*",
"@amzn/kepler-media-content-launcher": "*",
:
}
```

- Define Launcher Handler: The handler is basically an implementation for the `IContentLauncherHandler` interface and application should provide this implementation in order to receive the events or triggers related to Content Launcher.  Once a well defined handler is in place, then it can be used in the React Components under useEffect as follows: 

```bash
import {
    ILauncherResponse,
    IContentLauncherHandler,
    ContentLauncherStatusType,
    ContentLauncherServerComponent,
    IContentSearch,
  } from '@amzn/kepler-media-content-launcher';
  
  :
  //Other part of the application
  :

React.useEffect(() => {
  let factory = new ContentLauncherServerComponent();
  const contentLauncherHandler: IContentLauncherHandler = {
    async handleLaunchContent(
      contentSearch: IContentSearch,
      autoPlay: Boolean,
      _data: string | undefined,
    ): Promise<ILauncherResponse> {
      console.log(
        'HeadlessLaunchContentHandler handleLaunchContent invoked.',
      );
      let searchParameters = contentSearch.getParameterList();
          :
          // Process the search parameters as per application needs
          :
  let launcherResponse = factory
    .makeLauncherResponseBuilder()
    .contentLauncherStatus(ContentLauncherStatusType.SUCCESS)
    .build();

  return Promise.resolve(launcherResponse);
},
    };


let contentLauncherServer = factory.getOrMakeServer();
contentLauncherServer.setHandler(contentLauncherHandler);
    

  }, []);

``` 

### Content Launcher Verification Process
 
- We have a KCP Client tool which used to verify Content Launcher in your App.
 
##### Steps To follow
 
- Install/Side load the vpkg on Vega device.
- Note that if you launch this application, it will show a blank screen.
- Use this tool by launching it from the command line as
 
```bash
adb shell vlcm launch-app "orpheus://com.amazon.kcpsampleclient.main\?packageId=<<packageId>>\&searchTerm=<< Search term >>"
```
- packageId is the Package Id of the ContentLauncher app that needs to launched. (This field is required). If missing, nothing is launched and shows an error in the logs.
- searchTerm is the Search term that is passed to ContentLauncher app after it is launched. This field is optional. When missing, "Stranger Things" is the default searchTerm.
 
-For example: If you want to launch PrimeVideo with "Wheel of Time" as searchTerm, here is the command:
 
```bash
adb shell vlcm launch-app "orpheus://com.amazon.kcpsampleclient.main\?packageId=com.amazon.frenchpress\&searchTerm=Wheel\ of\ Time"
```
 
##### Note -  Your Content Launcher app should be installed/running on Tv before you trigger a given command.


### Content Launcher Account Login

In order to implement the Account Login feature, you must follow [this guide](https://developer.amazon.com/docs/kepler-tv/content-launcher-integration-guide.html#step-4-add-support-for-account-login). 

It is an example of the Account Login Wrapper implemented in the app:

```js
import {
  AccountLoginServerComponent,
  IAccountLoginHandlerAsync,
  IAccountLoginServerAsync,
  IStatus,
  StatusType,
} from '@amzn/kepler-media-account-login';

const accountLoginServerComponent = new AccountLoginServerComponent();

export class AccountLoginWrapper {
  m_accountLoginServer?: IAccountLoginServerAsync;

  async updateStatus(loginStatus: boolean) {
    try {
      const statusBuilder = accountLoginServerComponent.makeStatusBuilder();
      statusBuilder.status(
        loginStatus ? StatusType.SIGNED_IN : StatusType.SIGNED_OUT,
      );
      const status = statusBuilder.build();
      await this.m_accountLoginServer?.updateStatus(status);
    } catch (err) {
      console.error(
        'AccountLoginWrapper::updateStatus Failed updating login status: ',
        err,
      );
    }
  }

  setupAccountLoginServer() {
    try {
      this.m_accountLoginServer = accountLoginServerComponent.getOrMakeServer();
    } catch (err) {
      this.m_accountLoginServer = undefined;
      console.error(
        'AccountLoginWrapper::setupAccountLoginServer failed creating account login server: ',
        err,
      );
      return;
    }

    const accountLoginHandler: IAccountLoginHandlerAsync = {
      handleReadStatus(): Promise<IStatus> {
        console.info('AccountLoginWrapper::handleReadStatus invoked.');
        try {
          const statusBuilder = accountLoginServerComponent.makeStatusBuilder();
          const appLoginStatus = // Add your app login status
          statusBuilder.status(
            appLoginStatus ? StatusType.SIGNED_IN : StatusType.SIGNED_OUT,
          );
          const status = statusBuilder.build();
          return Promise.resolve(status);

        } catch (err) {
          console.error(
            'AccountLoginWrapper::handleReadStatus exception: ',
            err,
          );
        }

        return Promise.reject(
          'AccountLoginWrapper::handleReadStatus creating login status failed.',
        );
      },
    };

    try {
      this.m_accountLoginServer?.setHandler(accountLoginHandler);
    } catch (err) {
      console.error(
        'AccountLoginWrapper::setupAccountLoginServer failed to set handler: ',
        err,
      );
    }
  }

  onStart(): Promise<void> {
    this.setupAccountLoginServer();
    return Promise.resolve();
  }

  onStop(): Promise<void> {
    // Add stop service code here.
    return Promise.resolve();
  }
}

export const AccountLoginWrapperInstance = new AccountLoginWrapper();

export const onStartService = (): Promise<void> => {
  return AccountLoginWrapperInstance.onStart();
};

export const onStopService = (): Promise<void> => {
  return AccountLoginWrapperInstance.onStop();
};
```



After completing all the steps, you will be able to call the `updateStatus` method, which should be called whenever the following happens:

- Your app is launched
- Your app’s login status changes, either from logged in to logged out, or from logged out to logged in.

Additionally, the `handleReadStatus` method is called when the app’s login status is required. Your app should return it’s login status.

To test that the integration is complete, follow [these steps](https://developer.amazon.com/docs/kepler-tv/content-launcher-integration-guide.html#test-account-login).
 
 
### Content Personalization
 
#### Prerequisites
 
- Access to the source code of your app for Fire TV.
- A Fire TV device that supports this integration. Check with your Amazon contact for a list of device types currently supported.
- Your app must participate in the Catalog Ingestion process, so Fire TV recognizes the content IDs that your app is passing through these APIs.
- Your app must share entitlements for each customer, so Fire TV shows the entitled provider as part of our content discovery experience. For further documentation reach out to your Amazon contact.
 
#### Integration Steps
 
##### Step 1. Include the necessary package dependencies  in your app
 
Add the ‘Kepler-Content-Personalization’ package and headless-task-manager dependencies in your package.json file. For example:
 
```bash
"dependencies": {
    "@amzn/kepler-content-personalization": "^1.0.0",
    "@amzn/headless-task-manager": "^0.1.0"
  } 
```
 
-  The kepler-content-personalization package provides APIs for sending your content personalization data into the system.
-  The headless-task-manager package provides APIs to register your data-pull background service with the system (more details below).
 
##### Step 2. Update your manifest file
 
- Update your manifest.toml file to include Content Personalization support. Below is an example for a sample app:
 
```bash
schema-version = 1
 
## Define your package
[package]
title = "Kepler Video app"
version = "0.1.0"
id = "com.amazon.keplervideoapp"
 
[components]
## Define your app's interactive component (if it doesn't already exist)
[[components.interactive]]
id = "com.amazon.keplervideoapp.main"
library-name = "KeplerVideoApp"
runtime-module = "/com.amazon.kepler.keplerscript.runtime.loader_2@IKeplerScript_2_0"
categories = ["com.amazon.category.kva"]
launch-type = "singleton"
 
[[components.service]]
## Define your interface.provider service component (if it doesn't already exist)
id = "com.amazon.keplervideoapp.interface.provider"
runtime-module = "/com.amazon.kepler.keplerscript.runtime.loader_2@IKeplerScript_2_0"
launch-type = "singleton"
categories = ["com.amazon.category.kepler.media"]
 
## Define a process group for each component
[processes]
## <other process related entries>
[[processes.group]]
component-ids = ["com.amazon.keplervideoapp.main"]
 
[[processes.group]]
component-ids = ["com.amazon.keplervideoapp.interface.provider"]
 
[wants]
## Defines that your app has a dependency on the Content Personalization data service
[[wants.service]]
id = "com.amazon.tv.developer.dataservice.main"
 
[needs]
## Defines the privilege your app needs in order to use the Content Personalization interface to provide data
[[needs.privilege]]
id = "com.amazon.tv.content-personalization.privilege.provide-data"
 
[offers]
## Defines the service that your app offers
[[offers.service]]
id = "com.amazon.keplervideoapp.interface.provider"
 
## Defines the interactive components of your app
[[offers.interaction]]
id = "com.amazon.keplervideoapp.main"
 
## Add extras to declare support for Content Personalization
[[extras]]
key = "interface.provider"
component-id="com.amazon.keplervideoapp.interface.provider"
 
[extras.value.application]
## Defines support for the Content Personalization interface and the attributes
[[extras.value.application.interface]]
interface_name = "com.amazon.kepler.media.IContentPersonalizationServer"
attribute_options = ["SupportedCustomerLists"]
 
[extras.value.application.interface.static_values]
SupportedCustomerLists = ["Watchlist"]
```
 
##### Step 3. Make a sample API call
 
- Begin with a sample/mock event generated at app launch. To construct the event and send it, use the following code:
 
```bash 
 
// Example playback event generated when user starts watching content
 
const playbackEvent: IPlaybackEvent = new PlaybackEventBuilder()
    .playbackPositionMs(0)
    .playbackState(PlaybackState.PLAYING)
    .durationMs(2000)
    .eventTimestampMs(Date.now())
    .contentId(
    new ContentIdBuilder()
        .id('content_CDF_ID')
        .idNamespace(ContentIdNamespaces.NAMESPACE_CDF_ID)
        .build(),
    )
    .profileId(
    new ProfileIdBuilder()
        .id('myProfileId')
        .idNamespace(ProfileIdNamespaces.NAMESPACE_APP_INTERNAL)
        .build(),
    )
    .buildActiveEvent();
 
// Send the event
ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
```
 
##### Step 4. Validate the integration
 
Trigger the sample event code you constructed to run inside your app. After you run the code successfully, view the logs to validate the SDK has been linked to your app and is processing the message.
 
You can monitor these logs from the command line by running:
 
```bash 
journalctl -f |grep -Ei 'kepler.tv.personalization'
```
 
##### Step 5. Make API calls as part of in-app functionality
 
- For each data type, review the data type's When to Send section to understand where in your code you will need to make calls to Kepler Content Personalization. Find the relevant parts of your code that run when customers take each action and add an API call. Each data type has different specific triggers.
##### For Watch Activity
 
- When to send
 
When these triggers occur, send the event info in the following scenarios:
 
- On the Playback state change (start, stop, pause, or exit).
- On seeking to a new playback position.
- Once every 60 seconds while in the player, regardless of playback state.
- For an activity taking place on other types of devices:
    - Fire TV’s on-device service will periodically wake up and ask your app to sync this data. This includes a parameter indicating the time window for which you should share data. Instead of sending every playback event that occurred in that time window, you can send the playback exit events, which gives us the content and its last viewed progress.
    - When in the foreground on a Fire TV device, have your app sync this data from your service and send us the latest viewing progress.
 
Use this sample code to send watch activity events as the user is interacting with your app:
 
```bash
// Example playback event generated when user starts watching Live content
 
const playbackEvent: IPlaybackEvent = new PlaybackEventBuilder()
    .playbackPositionMs(0)
    .playbackState(PlaybackState.PLAYING)
    .durationMs(2000)
    .eventTimestampMs(Date.now())
    .contentId(
    new ContentIdBuilder()
        .id('content_CDF_ID')
        .idNamespace(ContentIdNamespaces.NAMESPACE_CDF_ID)
        .build(),
    )
   .channelDescriptor(new ChannelDescriptorBuilder()
       .majorNumber(0)
       .minorNumber(1)
       .identifier('channelID')
       .build(),
   )
    .profileId(
    new ProfileIdBuilder()
        .id('myProfileId')
        .idNamespace(ProfileIdNamespaces.NAMESPACE_APP_INTERNAL)
        .build(),
    )
    .buildActiveEvent();
 
// Send the event
ContentPersonalizationServer.reportNewPlaybackEvent(playbackEvent);
 
```
##### For Individual Content Entitlement
 
When to send
 
- On initial app launch and sign-in.
- On purchasing or renting new individual content.
- If an individual content entitlement expires or is no longer valid.
- If the expiration date or time changes.
- When asked to refresh by Fire TV’s on-device service.
 
Use this code to send individual content entitlement data:
 
```bash 
// Example content entitlement event generated when user purchases new content in the app
 
const entitlements: IContentEntitlement = new ContentEntitlementBuilder()
    .acquisitionTimestamp(Date.now())
    .contentId(
    new ContentIdBuilder()
        .id('content_CDF_ID')
        .idNamespace(ContentIdNamespaces.NAMESPACE_CDF_ID)
        .build(),
    )
    .entitlementType(EntitlementType.PURCHASE)
    .withExpirationTimestamp(Date.now() + 50000)
    .build();
 
 // Send the event
 ContentPersonalizationServer.reportNewContentEntitlement(entitlements);
```
 
##### For Watchlist
 
When to send
 
- On initial app launch and sign-in.
- On adding or removing an item from the customer’s watchlist. This action can occur off-device.
- When asked to refresh by Fire TV’s on-device service.
- When switching to a new profile.
 
To share the latest title the customer added to the watchlist, use the following code:
 
```bash
// Example customer entry event generated when user starts watching content
 
const customerListEntry: ICustomerListEntry = new CustomerListEntryBuilder()
    .addedTimestampMs(Date.now())
    .contentId(
    new ContentIdBuilder()
        .id('string')
        .idNamespace(ContentIdNamespaces.NAMESPACE_CDF_ID)
        .build(),
    )
    .profileId(
    new ProfileIdBuilder()
        .id('myProfileId1')
        .idNamespace(ProfileIdNamespaces.NAMESPACE_APP_INTERNAL)
        .build(),
    )
    .build();
 
// Send the event
ContentPersonalizationServer.reportNewCustomerListEntry(
    CustomerListType.WATCHLIST,
    customerListEntry,
);
```
 
For example, when a customer adds an item to their watchlist, we expect you call the reportNewCustomerListEntry API with the relevant information. You will need to first locate the code in your app that handles adding items to the watchlist and then make the API call as part of your logic.
 
##### Step 6. Implement your data pull service for background or off-device data
 
To allow Amazon to pull data from your app, implement the service as described below. The service contains everything needed for service setup and connection and only requires you to implement functions to send data to a receiver object. The object allows you to share data in chunks, as needed. This prevents loading large lists into memory.
 
1. Create a service.js file with the same path where the package.json is located with the following content. This tells the system about the entry points for your interface.provider service.
 
```bash 
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
```
2. Create your Headless Service Interface file under src/headless/HeadlessServiceInterface.ts with the following content:
 
```bash 
export interface HeadlessServiceInterface {
  /**
   * This function is called when native service onStart is called.
   */
  onStart(): Promise<void>;
  /**
   * This function is called when native service onStop is called.
   */
  onStop(): Promise<void>;
}
```
 
3. Create your data pull service under src/headless/HeadlessService.ts with the following content:
 
```bash 
import { ContentPersonalizationServer, CustomerListType, IContentEntitlementsHandler, IContentEntitlementsProvider, ICustomerListEntriesHandler, ICustomerListEntriesProvider, IPlaybackEventsHandler, IPlaybackEventsProvider } from "@amzn/kepler-content-personalization";
import { HeadlessServiceInterface } from "./HeadlessInterface";
 
/*********** Content Personalization Handlers *************/
const contentEntitlementsHandler: IContentEntitlementsHandler = {
    getAllContentEntitlements: (
      contentEntitlementsProvider: IContentEntitlementsProvider,
    ) => {
      contentEntitlementsProvider.addContentEntitlementChunk(<ADD ENTITLEMENTS>);
      contentEntitlementsProvider.commit();
    },
};
  
const customerListEntriesHandler: ICustomerListEntriesHandler = {
    getAllCustomerListEntries: (
      listType: CustomerListType,
      customerListEntriesProvider: ICustomerListEntriesProvider,
    ) => {
      customerListEntriesProvider.addCustomerListChunk(listType, <ADD LIST ENTRIES>);
      customerListEntriesProvider.commit();
    },
};
  
const playbackEventsHandler: IPlaybackEventsHandler = {
    getPlaybackEventsSince: (
      sinceTimestamp: Date,
      playbackEventsProvider: IPlaybackEventsProvider,
    ) => {
      playbackEventsProvider.addPlaybackEventChunk(<ADD PLAYBACK EVENTS>);
      playbackEventsProvider.commit();
    },
};  
 
class HeadlessService implements HeadlessServiceInterface {
    onStart(): Promise<void> {
      ContentPersonalizationServer.setContentEntitlementsHandler(
        contentEntitlementsHandler,
      );
      ContentPersonalizationServer.setCustomerListEntriesHandler(
        customerListEntriesHandler,
      );
      ContentPersonalizationServer.setPlaybackEventsHandler(
        playbackEventsHandler,
      );
 
      return Promise.resolve();
    }
    onStop(): Promise<void> {
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
  
```
#### Implementation details
 
##### Make changes to your catalog integration (when directed by your Amazon contact)
To make use of the entitlement and activity data, Fire TV needs the following data from your existing Fire TV catalog integration. Fire TV’s public catalog integration documentation will be updated to include these elements in the future, but here is a preview of what will be needed concerning the Kepler Content Personalization integration. Your Amazon contact will inform you of the right time to begin these catalog changes.
 
-  TVOD (Purchases and Rentals) - Add new purchase and rental offers to applicable titles. They will look identical to subscription offers, but without the Subscription ID.
-  International - For expansion into other countries, Fire TV will move from per-country catalogs to Fire TV’s global catalog format. The above mentioned catalog changes will enable an easier transition if included and launched as part of your global catalog. However, Fire TV can still support these changes in your per-country catalogs instead, if needed.
 
 
##### Amazon content ID
Kepler Content Personalization supports content identification across different namespaces. Therefore, all content IDs must be passed with an associated namespace in order for Amazon to properly identify the content item. Amazon supports the following namespace:
 
```bash
cdf_id : This is the ID space, since data is shared in your Amazon catalog integration. These are the IDs you have specified on each piece of content. It corresponds specifically to the CommonWorkType/ID field in the Catalog Data Format (CDF).
```
##### Amazon profile ID
 
All data types allow you to share an associated profile ID. Since there are different profile types, specify the namespace. Amazon currently supports the following profile ID namespace:
 
```bash
app_internal : This namespace indicates you are sharing a string representation of your internal profile ID for the active profile. This ID serves to identify specific profiles in your app, so we can attribute activity to the right Fire TV profile. Do not provide the actual ID you use internally, and the provided value should not be capable of identifying the customer. We recommend taking a hash value of your internal profile ID, which should be the same across all devices. Also, do not send us the profile name provided by the customer. Even if your app doesn't use profiles, provide a consistent value.
```
 
#### Reporting Updates
 
The SDK contains functionality to share information using three types of operations:
 
- New (example: reportNewCustomerListEntry)- This represents an incremental update to add a new entry to the dataset.
- Removed (example: reportRemovedCustomerListEntry)  - This represents a decremental update to remove an entry from the dataset.
- Refreshed (example: reportRefreshedCustomerList) - This indicates that there have been changes to the dataset due to off-device actions and a new refreshed version of the list needs to be fetched using the data pull service.
 
New and Removed are useful when the customer is interacting with content in the app and performing adds or removes. The Refreshed update is useful for situations when there are significant changes to the list due to customer sign-in, off-device activity, or if you suspect the list is out of sync for any other reason.
 
#### Providing Large Sets of Data
 
When supplying large amounts of data through the data pull service, pull the data in reasonably small pages from your cloud backend and call the provider APIs as the data is is being pulled down. This will limit the memory usage of your service and prevent your app from being terminated by the system.
 
An example flow could look something like this:
 
```bash 
const contentEntitlementsHandler: IContentEntitlementsHandler = {
    getAllContentEntitlements: (
      provider: IContentEntitlementsProvider,
    ) => {
        let myCloudHasMoreData = true;
        while(myCloudHasMoreData){
            let myCloudResponse = getNextPageFromMyBackend(); 
            let myCloudData = myCloudResponse.getData();
            let entitlements: IContentEntitlements[] = [];
            for(let element in myCloudData){
                let entitlement = <build data with ContentEntitlementBuilder>
                entitlements.push(entitlement)
            }
            provider.addContentEntitlementChunk(entitlements);
            
            myCloudHasMoreData = myCloudResponse.hasMoreData();
        }
        provider.commit();
    },
  };
```
### Verification Process For Live and Content Personalization
 
As of now we don't have provision to verify the Live and Content Personalization process in the current Tool.
 
### Focus Management
 
##### How to provide initial focus 
 
Initial focus can be specified by App using the `hasTVPreferredFocus` props,follow the example.
 
```bash
 <ImageBackground
    ...
    style={styles.imageBackgroundContainer}>
##<BackButton> is a wrapper component over primitive React Native component
- <BackButton overrideStyle={styles.backButton} onPress={navigateBack} />
+ <BackButton overrideStyle={styles.backButton} hasTVPreferredFocus={true} 
     onPress={navigateBack} />
        <View style={styles.content}>
           <Text style={styles.titleText} numberOfLines={1}>
                 {route.params.data.title}
           </Text>
           ...
  </ImageBackground>
```

## Known Issues

#### Feature Rotator

The Feature Rotator is currently intended to be auto-rotating only, and is not meant to be interacted with by the user. D-Pad commands will have no effect on the feature rotator, and any Touch interactions may cause unintended behaviors for the component.

#### Non-functional buttons on Details Screen

Some of the buttons on the Details Screen are non-functional, and are added for visuals and developer reference only.
Non-functional buttons currently include:

- Play Trailer
- Add to List

#### Player Screen

##### Caption Menu resets on close

The caption menu is hardcoded to have the first option selected when it opens. This can lead to a mismatch between the actual caption that is displayed and the one that appears to be selected on the caption menu.

_Example scenario:_ Captions are turned off by selecting the "Off" option and the caption menu is closed. When the caption menu is reopened, the first caption will appear as though it is selected even though the captions are actually off on the video. The first caption option can't be re-enabled because it appears to already be selected on the caption menu.

_Recommendation:_ When switching to a new caption (after closing the caption menu), Set the caption to the "Off" option first. Then switch to the desired option.

##### Player Control Buttons have inconsistent behavior

Buttons such as fast forward, rewind, play, and pause button may behave differently depending on the currently playing file type. As a result, users may notice out-of-sync behavior when interacting in combination with these buttons. For example, when pressing the Fast Forward / Rewind buttons, the video may continue playing but the UI button still is showing as "Paused".

A few more examples of inconsistent behavior are:

- Fast Forward / Rewind buttons trigger video playback even when video is paused, for certain non-MP4 file types.
- Fast Forward / Rewind buttons do not have any effect when the video is paused, for MP4 file types.

When these buttons become out of sync with the video playback (i.e UI shows paused but the video is continuing to play), the reccomended workaround is to press the Play/Pause button a few times until the buttons are accurate and in-sync with the playback.

##### Video not loading or app crashing during playback

Occasionally the video content may never fully load when trying to navigate to the Video Player, indicated by a never-ending loading indicator. In more rare scenarios, the app may crash. In either of these cases, the reccomendation is to re-launch the application. If the issue persists, there may be a problem with the video content source.

##### App shows black screen with only audio playback
When a video is played from the detail page after performing back navigation from the player, occasionally a black screen appears with only audio playback.

The recommended workaround is to click the back button on the remote control or the screen navigation. The home page is displayed, and you can start or select another video.

#### In-App Purchasing Stability

The In-App Purchasing APIs can be unstable. Some common issues developers may encounter include:

- IAP APIs being unresponsive.
  - i.e, pressing the "Purchase Subscription" button on the Details Screen showing no effect.
- IAP UI being unresponsive.
  - Upon navigating to the IAP UI, users may not be able to interact with the UI to continue the IAP transaction. The unresponsiveness may resolve itself after some time, but may require an app restart if the issue persists.
- General intermittent error responses from the IAP client.
  - When initiating an IAP transaction and navigating to the IAP User Interface, issues could occur involving the communication between the Kepler Video App and the IAP Tester App that results in error messages.

When encountering any disruptive issues surrounding IAP, developers are advised to restart the Kepler Video App and/or the IAP Tester App. In some cases, developers may also need to restart the simulator or device, and repeat the IAP setup.

## 3P library integration

This section provides the minimum integration steps necessary to integrate the 3P libraries with the sample app.

- [react-native-svg](#react-native-svg)
- [react-native-vector-icons](#react-native-vector-icons)
- [lottie-react-native](#lottie-react-native)
- [react-native-navigation](#react-native-navigation)
- [react-linear-gradient](#react-linear-gradient)
- [react-native-netinfo](#react-native-netinfo)
- [react-native-device-info](#react-native-device-info)
- [reduxjs/toolkit](#reduxjs/toolkit)
- [lodash](#lodash)
- [react-native-localize](#react-native-localize)
- [react-native-async-storage](#react-native-async-storage)
- [formik](#formik)
- [newrelic-kepler-agent](#newrelic-kepler-agent)

### react-native-svg

To integrate this library:
1. Add the following package dependency in your [package.json](./package.json) file:
```typescript
"dependencies": {
...
"@amzn/react-native-svg": "~2.0.0"
}
```
2. Reinstall the dependencies using `npm install`.

Note: This app uses the React component generated from the [SVGR](https://react-svgr.com/playground/) tool with some minor modification with respect to the imports. For additional information, refer to the file [HomeSVG.tsx](src/assets/svgr/HomeSVG.tsx)

3. Import the corresponding SVG component.
```typescript
 import HomeSvg from '../../assets/svgr/HomeSVG';
```

4. In the render block of your app, add the imported component:
```typescript
 <HomeSvg         
      width={40}
      height={40}
      stroke={'#F1F1F1'}
      fill={'#F1F1F1'}
    />
```

For more details about this kepler supported library, see [react-native-svg](https://developer.amazon.com/docs/kepler-tv-api/react-native-svg.html) in the Kepler documentation.


### react-native-vector-icons

To integrate this library:
1. Add the following package dependency in your [package.json](./package.json) file:
```typescript
"dependencies": {
...
"@amzn/react-native-vector-icons": "~2.0.0"
}
```
2. Reinstall the dependencies using `npm install`:

3. Add your font files to <app_package_root>/assets/raw/fonts.

4. Import the corresponding MaterialIcons component:
```typescript
import MaterialIcons from '@amzn/react-native-vector-icons/MaterialIcons';
```

5. In the render block of your app, add the MaterialIcons component:
 ```typescript
 <MaterialIcons name={'play'} size={50} color={#ffffff} />; 
 ```

For more details about this kepler supported library, see [react-native-vector-icons](https://developer.amazon.com/docs/kepler-tv-api/react-native-vector-icons.html) in the Kepler documentation.


### lottie-react-native

To integrate this library:
1. Add the following package dependency in your [package.json](./package.json) file:
```typescript
"dependencies": {
...
"@amzn/lottie-react-native": "~2.0.0"
}
```
2. Reinstall the dependencies using `npm install`:

3. Add your Lottie animation to `<app_package_root>/src/js/resources/`. Add images for Lottie animation to `<app_package_root>/assets/image/`.

Note: On Kepler, Lottie animations (not its image assets) can alternatively be placed in `<app_package_root>/assets/raw/`. Other than a small difference in path, this is similar to behavior on Android.

4. Import the corresponding LottieView component:
```typescript
import LottieView from "@amzn/lottie-react-native";
```

5. In the render block of your app, add the LottieView component:
 ```typescript
 <LottieView source={require("../path/to/animation.json")} autoPlay loop />
 ```

For more details about this kepler supported library, see [lottie-react-native](https://developer.amazon.com/docs/kepler-tv-api/lottie-react-native.html) in the Kepler documentation.


### react-native-navigation

Warning: Due to recent dependency update in React Navigation, it is now required that you add `"@amzn/react-native-screens": "~2.0.0"` as a dependency for any package that uses Navigation, failure to do so results in an app crash.

To integrate this library:
1. Add the subset of VegaUIReact-Navigation dependencies that are needed to support your app in your project's [package.json](./package.json) file:
```typescript
"dependencies": {
...
"@amzn/keplerscript-react-native-reanimated": "~2.0.0",
"@amzn/react-native-safe-area-context": "~2.0.0",
"@amzn/react-navigation__routers": "~2.0.0",
"@amzn/react-navigation__core": "~2.0.0",
"@amzn/react-navigation__native": "~2.0.0",
"@amzn/react-navigation__stack": "~2.0.0",
"@amzn/react-navigation__drawer": "~2.0.0",
"@amzn/react-native-screens": "~2.0.0",
}
```
	> Note: The subpackage `react-navigation/native-stack` is not supported on Kepler Platform.

	While Kepler platform does have a fork of React Native Reanimated, React Native Safe Area Context and React Native Screens, they are not officially supported on Kepler Platform. @amzn/keplerscript-react-native-reanimated, @amzn/keplerscript-react-native-safe-area-context and @amzn/react-native-screens were created to rectify build issues found when supporting @amzn/keplerscript-react-navigation-* packages.

2. Install the required peer dependencies to your project's [package.json](./package.json) file:
```typescript
"devDependencies": {
...
"react-native-gesture-handler": "~2.13.0",
}
```

3. Wrap your returned app code in with the NavigationContainer component. Typically, you do this in your entry file, such as `index.js` or `App.js`:

 * Import the below libraries:
 ```typescript
 import 'react-native-gesture-handler';
 import * as React from 'react';
 import { NavigationContainer } from '@amzn/react-navigation__native';
 ```
 * In the render block, add the NavigationContainer component:
 ```typescript
 export default App = () => {
   return (
     <NavigationContainer>
       {/* Rest of your app code */}
     </NavigationContainer>
   );
 };
 ```

For more details about this kepler supported library, see [react-native-navigation](https://developer.amazon.com/docs/kepler-tv-api/react-native-navigation.html) in the Kepler documentation.

### react-linear-gradient

To integrate this library:
1. Add the following package dependency in your [package.json](./package.json) file:
```typescript
"dependencies": {
...
"@amzn/react-linear-gradient": "~2.0.0"
}
```
2. Reinstall the dependencies using `npm install`:

3. Import the corresponding LinearGradient component:
```typescript
 import LinearGradient from '@amzn/react-linear-gradient';
```

4. In the render block of your app, add the imported component:
```typescript
<LinearGradient
  colors={['#4c669f', '#3b5998', '#192f6a']}
  style={styles.linearGradient}>
  <Text style={styles.buttonText}>Here Is My Text</Text>
</LinearGradient>;
```

For more details about this kepler supported library, see [react-linear-gradient](https://developer.amazon.com/docs/kepler-tv-api/react-linear-gradient.html) in the Kepler documentation.


### react-native-netinfo

To integrate this library:
1. Add the following package dependency in your [package.json](./package.json) file:
```typescript
"dependencies": {
     ...
     "@amzn/keplerscript-netmgr-lib": "~2.0.2",
     ...
}
```
2. Add com.amazon.network.service to [wants.service] in your KeplerScript application's manifest.toml:
```
[[wants.service]]
id = "com.amazon.network.service"
```
3. Add API permission to [needs.privilege] in your KeplerScript application's manifest.toml:
```
[needs]
[[needs.privilege]]
id="com.amazon.network.privilege.net-info"
```

4. Reinstall the dependencies using `npm install`:

5. Import the corresponding NetInfo component:
```typescript
import {NetInfoStateType, fetch} from "@amzn/keplerscript-netmgr-lib";
```

6. Get the network status using fetch method:
```typescript
fetch().then(state => {
    console.log("is connected? " + state.isConnected);
    if (state.type === NetInfoStateType.wifi) {
      console.log("ssid is " + state.details.ssid);
    }
});
```

For more details about this Kepler supported library, see [net-info](https://developer.amazon.com/docs/kepler-tv-api/react-native-net-info.html).

### react-native-device-info

To integrate this library:

1. Add the following package dependency in your [package.json](./package.json) file.

 ```typescript
"dependencies": {
...
"@amzn/react-native-device-info": "~2.0.0+10.11.0"
}
```

2. Reinstall the dependencies using `npm install`.

3. Usage:

 ```typescript
 import DeviceInfo from '@amzn/react-native-device-info';

 // or ES6+ destructured imports

 import { getBaseOs } from '@amzn/react-native-device-info';
```

### API:
Most of the functions return a Promise but also have a corresponding function with Sync on the end that operates synchronously. For example, you may prefer to call `getBaseOsSync()` during your app bootstrap to avoid async calls during the first parts of app startup.

 Note : Values used in examples don't represent the actual output.

 #### getBaseOs()
The base OS build the product is based on.

 Example:
```typescript
DeviceInfo.getBaseOs().then((baseOs) => {
  // "kepler"
});
```

For more details about this Kepler supported library, see [react-native-device-info](https://developer.amazon.com/docs/kepler-tv-api/react-native-device-info.html) in the Kepler documentation.

### reduxjs/toolkit

`Redux Toolkit` (also known as "RTK" for short) is an approach for writing Redux logic. The `@reduxjs/toolkit` package wraps around the core Redux package, and contains API methods and common dependencies that are essential for building a Redux app. The Redux Toolkit implements best practices, simplifies suggested best practices, simplifies most Redux tasks, prevents common mistakes, and makes it easier to write Redux applications.

To integrate this library:

1. Add the following package dependencies in your [package.json](./package.json) file:

 ```typescript
"dependencies": {
...
"@reduxjs/toolkit": "2.2.4",
"react-redux": "9.1.2",
}
```

2. Reinstall the dependencies using `npm install`:

3. Define slice state and action types in the `features/counter/counterSlice.ts` file.

   * Import `createSlice`, `PayloadAction`, `RootState`:

     ```typescript
    import { createSlice } from '@reduxjs/toolkit';
    import type { PayloadAction } from '@reduxjs/toolkit';
    import type { RootState } from '../../app/store';
    ```
   
   * Usage:
   
     ```
    // Define a type for the slice state
    interface CounterState {
      value: number;
    }

    // Define the initial state using that type
    const initialState: CounterState = {
      value: 0,
    };

    export const counterSlice = createSlice({
      name: 'counter',
      // `createSlice` will infer the state type from the `initialState` argument
      initialState,
      reducers: {
        increment: state => {
          state.value += 1;
        },
        decrement: state => {
          state.value -= 1;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmount: (state, action: PayloadAction<number>) => {
          state.value += action.payload;
        },
      },
    });
    
    export const { increment, decrement, incrementByAmount } = counterSlice.actions;

    // Other code such as selectors can use the imported `RootState` type
    export const selectCount = (state: RootState) => state.counter.value;

    export default counterSlice.reducer;
    ```
4. Define root state and dispatch types in the `app/store.ts` file:
   * Import `configureStore`:
   ```typescript
   import { configureStore } from '@reduxjs/toolkit';
   import counterReducer from './features/counter/counterSlice';
   ```
   
   * Usage:
   
     ```typescript
     export const store = configureStore({
      reducer: {
        counter: counterReducer,
      },
    });
     
    // Infer the `RootState` and `AppDispatch` types from the store itself
    export type RootState = ReturnType<typeof store.getState>;
    // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
    export type AppDispatch = typeof store.dispatch;
    ```

For more details about this library, see [reduxjs/toolkit](https://redux-toolkit.js.org/tutorials/overview).


### lodash
  		  
To integrate this library:
  		  
1. Add the following package dependency in your [package.json](./package.json) file.
  		  
  ```typescript
  "dependencies": {
  ...
  "lodash": "^4.17.21",
  }
  ```
  		  
2. Reinstall the dependencies using `npm install`.
3. Import the corresponding `isEqual` method
  		  
  ```typescript
  import { isEqual } from 'lodash';
  ```
  		  
4. `isEqual` function Performs a deep comparison between two values to determine if they are equivalent.
  		  
 ```typescript
 Example;
  		  
 const obj1 = { a: 1, b: { c: 2 } };
 const obj2 = { a: 1, b: { c: 2 } };
  		  
  // Comparing two objects
  console.log(isEqual(obj1, obj2));
  // Output: true (obj1 and obj2 are deeply equal)
 ```
  		  
For more details about this kepler supported library, see [lodash](https://lodash.com/docs/4.17.15) in the documentation.
 
### react-native-localize

To integrate this library:
1. Add the following package dependency in your [package.json](./package.json) file:
```typescript
"dependencies": {
...
"@amzn/react-native-localize": "~2.0.0"
}
```
2. Reinstall the dependencies using `npm install`:

3. Within the translations folder, define the list of key-value pairs with the necessary localised strings in JSON files according to their language.

4. Import the corresponding `getCountry`and `getLocales` methods, and necessary localised string JSON files:
```typescript
  import { getCountry, getLocales } from '@amzn/react-native-localize';
  import en from '../translations/en.json';
  // Other string JSON files
```

5. Usage:
```typescript
 const translations: any = {
  en,
};

export const appLocales = ['en-US'];

export const getCurrentCountry = () => {
  return getCountry();
};

export const getAppLocales = () => {
  const filteredLocales = getLocales().filter(locale => {
    return appLocales.includes(locale.languageTag);
  });
  return filteredLocales;
};

export const translate = (key: string) => {
  const currentLocale = getAppLocales()[0].languageCode;
  return translations[currentLocale][key] || key;
};
```

For more details about this kepler supported library, see [react-native-localize](https://developer.integ.amazon.com/docs/kepler-tv-api/react-native-localize.html) in the Kepler documentation.

### react-native-async-storage

To integrate this library:
1. Add the following package dependency in your [package.json](./package.json) file.
```typescript
"dependencies": {
  ...
  "@react-native-async-storage/async-storage": "npm:@amzn/react-native-async-storage__async-storage@~2.0.0"
}

"overrides": {
  "@react-native-async-storage/async-storage": "npm:@amzn/react-native-async-storage__async-storage@~2.0.0"
}
```
2. Reinstall the dependencies using `npm install`.

3. Import `AsyncStorage` from the `@react-native-async-storage/async-storage` package.
```typescript
  import AsyncStorage from '@react-native-async-storage/async-storage';
```

Usage:

```typescript
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('my-key', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('my-key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
```

For more details about this Kepler supported library, see [react-native-async-storage](https://developer.amazon.com/docs/kepler-tv-api/react-native-async-storage.html).

### formik:

To integrate this library:

1. Add the following package dependency in your [package.json](./package.json) file.
   ```typescript
   "dependencies": {
     ...
     "formik": "^2.4.6",
     "yup": "^1.4.0",
   }
   ```
2. Reinstall the dependencies using `npm install`.
3. Import `Formik` from  `formik`.
4. Import `yup` from  `yup`.

```typescript
import { Formik } from 'formik';
import * as Yup from 'yup';
```

Usage:

```typescript

  const Form = () => {
 const FeedbackSchema = Yup.object().shape({
   name: Yup.string()
     .min(2, 'Too Short!')
     .max(50, 'Too Long!')
     .required('Required'),
   email: Yup.string()
     .email('Invalid email')
     .required('Required'),
   feedback: Yup.string()
     .min(5, 'Too Short!')
     .max(500, 'Too Long!')
     .required('Required'),
 });

 return (
   <Formik
     initialValues={{ name: '', email: '', feedback: '' }}
     validationSchema={FeedbackSchema}
     onSubmit={(values) => {
       // handle form submission
       console.log(values);
     }}
   >
     {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
       <View>
         <TextInput
           placeholder="Name"
           onChangeText={handleChange('name')}
           onBlur={handleBlur('name')}
           value={values.name}
         />
         {touched.name && errors.name && <Text>{errors.name}</Text>}

         <TextInput
           placeholder="Email"
           onChangeText={handleChange('email')}
           onBlur={handleBlur('email')}
           value={values.email}
           keyboardType="email-address"
         />
         {touched.email && errors.email && <Text>{errors.email}</Text>}

         <TextInput
           placeholder="Feedback"
           onChangeText={handleChange('feedback')}
           onBlur={handleBlur('feedback')}
           value={values.feedback}
           multiline
         />
         {touched.feedback && errors.feedback && <Text>{errors.feedback}</Text>}

         <Button onPress={handleSubmit} title="Submit" />
       </View>
     )}
   </Formik>
 );
};

export default Form;
```

For more information, see [https://formik.org/].

### newrelic-kepler-agent

The New Relic Kepler agent is in preview and licensed under the New Relic Pre-Release.

Software Notice.
Agent Version - v0.8.0
You need a [License (Ingest) Key](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/#license-key) and your [Account ID](https://docs.newrelic.com/docs/accounts/accounts-billing/account-structure/account-id/) to initialize the agent.

To integrate this library:
1. Download the pre-release Kepler agent package by following these steps:
   * Go to [Kepler supported libraries and services](https://community.amazondeveloper.com/t/kepler-supported-libraries-and-services/1552).
   * Look for **New Relic** in the Kepler supported libraries and services.
   * In the _New Relic_ section, click **read the docs here**. This takes you to Google Drive.
   * Locate the path to New Relic pre-release Kepler agent bundle: **Shared with me>newrelic-kepler-agent>releases.**

2. Add the following package dependency in your [package.json](./package.json) file.
```typescript
"dependencies": {
...
"newrelic-kepler-agent": "file:../path-to-file/newrelic-kepler-agent-0.7.0.tgz",
}
```
3. Reinstall the dependencies using `npm install`.

4. Import the `NewRelic` in [index.js](./index.js) file:
```typescript
 import NewRelic from 'newrelic-kepler-agent';
```

5. Add the following code to initialize the agent in the [index.js](./index.js) file.
```typescript
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
   };

   /// Set Account ID, API Key and Endpoint (either "US" or "EU").
   NewRelic.startAgent(
     "<ACCOUNT_ID>",
     "<API_KEY>",
     "<ENDPOINT>",
     config,
   );
```

For more details about this Kepler supported library, see [newrelic-kepler-agent](https://community.amazondeveloper.com/t/kepler-supported-libraries-and-services/1552).
