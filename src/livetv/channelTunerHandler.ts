import {
  ChangeChannelStatus,
  ChannelServerComponent,
  IChangeChannelResponse,
  IChannelHandler,
} from '@amzn/kepler-channel';
import { EventRegister } from 'react-native-event-listeners';

/**
 * A handler that will be provided to ChannelServer to handle Channel commands
 */
const channelTunerHandler: IChannelHandler = {
  async handleChangeChannel(
    matchString: string,
  ): Promise<IChangeChannelResponse> {
    console.info(`ktf:Channel - ChangeChannel | ${matchString}`);
    const response = ChannelServerComponent.makeChannelResponseBuilder()
      .status(ChangeChannelStatus.SUCCESS)
      .data(matchString)
      .build();
    EventRegister.emit('LiveChannelEvent', response);
    return Promise.resolve(response);
  },

  async handleChangeChannelByNumber(
    majorNumber: number,
    minorNumber: number,
  ): Promise<IChangeChannelResponse> {
    console.info(
      `ktf:Channel - ChangeChannelByNumber | majorNumber: ${majorNumber}, minorNumber: ${minorNumber}`,
    );
    const response = ChannelServerComponent.makeChannelResponseBuilder()
      .status(ChangeChannelStatus.SUCCESS)
      .build();
    EventRegister.emit('LiveChannelEvent', response);
    return Promise.resolve(response);
  },

  async handleSkipChannel(
    channelCount: number,
  ): Promise<IChangeChannelResponse> {
    console.info(`ktf:Channel - SkipChannel | count: ${channelCount}`);
    const response = ChannelServerComponent.makeChannelResponseBuilder()
      .status(ChangeChannelStatus.SUCCESS)
      .build();
    EventRegister.emit('LiveChannelEvent', response);
    return Promise.resolve(response);
  },
};

export default channelTunerHandler;
