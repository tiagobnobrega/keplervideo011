import {
  AccountLoginServerComponent,
  IAccountLoginHandlerAsync,
  IAccountLoginServerAsync,
  IStatus,
  StatusType,
} from '@amzn/kepler-media-account-login';
import { store } from './store';

const accountLoginServerComponent = new AccountLoginServerComponent();

export class AccountLoginWrapper {
  m_accountLoginServer?: IAccountLoginServerAsync;

  async updateStatus(loginStatus: boolean) {
    console.info(
      'AccountLoginWrapper::updateStatus invoked with: ',
      loginStatus,
    );
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
          // Example of returning an app Login status from Redux
          const statusBuilder = accountLoginServerComponent.makeStatusBuilder();
          const appLoginStatus = store.getState().settings.loginStatus;

          statusBuilder.status(
            appLoginStatus ? StatusType.SIGNED_IN : StatusType.SIGNED_OUT,
          );

          const status = statusBuilder.build();

          console.info('AccountLoginWrapper:: App read status: ', status);

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
      console.info('AccountLoginWrapper::set Handler in process.');
      this.m_accountLoginServer?.setHandler(accountLoginHandler);
    } catch (err) {
      console.error(
        'AccountLoginWrapper::setupAccountLoginServer failed to set handler: ',
        err,
      );
    }
  }

  onStart(): Promise<void> {
    console.info('AccountLoginWrapper onStart()');
    this.setupAccountLoginServer();
    return Promise.resolve();
  }

  onStop(): Promise<void> {
    // add stop service code here.
    console.info('AccountLoginWrapper onStop()');
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
