/*
 * Copyright (c) 2023 - 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import {
  ChannelLineupProvider,
  EpgLineupInformation,
  IllegalStateError,
  InternalError,
  InvalidArgumentError,
  IUpsertProgramFailure,
  ProgramLineupProvider2,
} from '@amzn/kepler-epg-provider';

// NOTE: MockSource provides functions that are supposed to mock network calls made to download channels, programs from the 3P cloud.
import {
  getMockedChannelLineup,
  getMockedChannelLineupSize,
  getMockedChannelLineupVersion,
  getMockedProgramLineupSize,
  getMockedProgramLineupVersion,
  getMockedPrograms,
} from '../mock/MockSource';

export const ingestChannelLineup = (
  progressCallback?: (channelProgress: number) => void,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const lastCommittedVersion =
        await EpgLineupInformation.getLastCommittedChannelLineupVersion();

      // NOTE: You should query your latest channel lineup version from your backend.
      const latestVersion = await getMockedChannelLineupVersion();

      // if the last committed channel lineup version is the latest, no updates are required.
      if (lastCommittedVersion === latestVersion) {
        console.info(
          `EpgSync - Latest Channel Lineup version: ${latestVersion} same as last committed version: ${lastCommittedVersion}, skipping sync.`,
        );
        resolve();
        return;
      }

      /*
        If the version is mismatched, download the customer's entitled
        Channel Lineup in pages, incrementally parse the payload,
        and add the lineup using ChannelLineupProvider interface.
       */
      const totalChannels = await getMockedChannelLineupSize();

      const page_size = 1000;
      let processedChannels = 0;
      let start = 0;
      let channels = await getMockedChannelLineup(start, page_size);

      while (channels.length !== 0) {
        await ChannelLineupProvider.add(channels);
        processedChannels += channels.length;
        if (progressCallback) {
          progressCallback(processedChannels / totalChannels);
        }
        start += page_size;
        channels = await getMockedChannelLineup(start, page_size);
      }

      await ChannelLineupProvider.commit(latestVersion);
      console.info('EpgSync - channel lineup ingestion completed');
      resolve();
    } catch (error) {
      /*
       * NOTE: You should log these errors. Also consider propagating these errors to your backend so you can work with your
       * Amazon contact to fix these errors. If you encounter an InvalidArgumentError, the error message includes the total
       * number of failed insertions and the reasons for the first 5 failed channels. Please fix the invalid channel data ASAP.
       */
      console.error(
        `EpgSync - Error during channel lineup ingestion: ${error}`,
      );
      reject(error);
    }
  });
};

export const ingestProgramLineup = (
  progressCallback?: (programProgress: number) => void,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const lastCommittedVersion =
        await EpgLineupInformation.getLastCommittedProgramLineupVersion();

      // NOTE: You should query your latest program lineup version from your backend.
      const latestVersion = await getMockedProgramLineupVersion();

      // if the last committed program lineup version is the latest, no updates are required.
      if (lastCommittedVersion === latestVersion) {
        console.info(
          `EpgSync - Latest Program Lineup version: ${latestVersion} same as last committed version: ${lastCommittedVersion}, skipping sync.`,
        );
        resolve();
        return;
      }

      /*
        NOTE: Optional - Use 'clearAllPrograms()' exclusively when there is a need to remove mistakenly
        added programs from the the Electronic Program Guide (EPG). This will not clear channel information from the data store.
        This function call 'clearAllPrograms()' must precede calls to 'upsert()' within the same transaction.
        ProgramLineupProvider actions are not persisted until 'commit()' is called.

        Please see ProgramLineupProvider2.clearAllPrograms.
      */

      /*
        If the version is mismatched, download your program lineup in pages,
        incrementally parse, and set the lineup using the ProgramLineupProvider interface.

        The ProgramLineupProvider.upsert operation fails if the channel corresponding to
        the program’s ChannelDescriptor has not been committed.
       */
      const totalPrograms = await getMockedProgramLineupSize();
      const page_size = 1000;
      let processedPrograms = 0;
      let start = 0;
      let programs = await getMockedPrograms(start, page_size);
      let total_program_failures = 0;

      while (programs.length !== 0) {
        const upsertProgramFailures: IUpsertProgramFailure[] =
          await ProgramLineupProvider2.upsert(programs);

        if (upsertProgramFailures.length > 0) {
          total_program_failures += upsertProgramFailures.length;
          // NOTE: You should catch all the failed programs information and push it to your backend to quickly resolve the issues with the program data.
          processUpsertProgramFailures(upsertProgramFailures);

          /* NOTE: You can choose to continue upserting the remaining programs or abort the program ingestion process.
            throw Error(
             'Abort the program ingestion process due to invalid program data',
            );
          */
        }
        processedPrograms += programs.length;
        if (progressCallback) {
          progressCallback(processedPrograms / totalPrograms);
        }
        start += page_size;
        programs = await getMockedPrograms(start, page_size);
      }
      if (total_program_failures > 0) {
        console.info(
          `EpgSync - total number of errored programs ${total_program_failures} which failed to be upserted`,
        );
      }

      /*
        If any programs failed to upsert, and you did not abort the process when receiving those failure errors,
        then you can update the latestVersion for the successfully upserted programs. Send the information about
        the failed programs back to your backend so they can be fixed before the next sync.
      */
      await ProgramLineupProvider2.commit(latestVersion);
      console.info('EpgSync - programs lineup ingestion completed');

      resolve();
    } catch (error) {
      // NOTE: Consider propagating these errors to your backend so you can work with your Amazon contact to fix these errors.
      console.error(
        `EpgSync - Error during program lineup ingestion: ${error}`,
      );
      reject(error);
    }
  });
};

// NOTE: You should add the failed programs' information in the log and upload to your backend to quickly fix the invalid data.
const processUpsertProgramFailures = (
  upsertProgramFailures: IUpsertProgramFailure[],
): void => {
  upsertProgramFailures.forEach((element: IUpsertProgramFailure) => {
    const program = element.program;
    const program_id = program.identifier;
    const channel = element.program.channelDescriptor;
    const err =
      element.error.message === undefined ? '' : element.error.message;
    console.error(
      `EpgSync failed to upsert program with id ${program_id} which belongs to channel id ${channel.identifier} with error message ${err}`,
    );
  });
};

const doTask = (): Promise<void> => {
  console.info('EpgSync - EpgSync task starting...');
  return new Promise(async (resolve, reject) => {
    try {
      await ingestChannelLineup();
      await ingestProgramLineup();
      resolve();
      console.info('EpgSync - EPG Sync completed successfully!');
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        console.error(
          `EpgSync - EPG Sync failed due to ${error}, which is caused by missing mandatory fields.`,
        );
      } else if (error instanceof IllegalStateError) {
        console.error(
          `EpgSync - EPG Sync failed due to ${error}, which is caused by using an invalidated object.`,
        );
      } else if (error instanceof InternalError) {
        console.error(
          `EpgSync - EPG Sync failed due to ${error}, which may be retried immediately.`,
        );
      }
      reject(error);
    }
  });
};

export default doTask;
