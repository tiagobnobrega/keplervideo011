/*
 * Copyright (c) 2023 - 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import {
  ChannelDescriptorBuilder,
  ChannelInfoBuilder,
  ChannelMetadataBuilder,
  ExternalIdBuilder,
  IChannelInfo,
  IProgram,
  ProgramBuilder,
  SeriesInfoBuilder,
} from '@amzn/kepler-epg-provider';
import { KeplerFileSystem as FileSystem } from '@amzn/kepler-file-system';
import { tileData } from '../../data/tileData';
import { TitleData } from '../../types/TitleData';

/*
  Added default data for channels, programs and lineupVersion to read
  from json files upon app install. But Partners are supposed to fetch
  data from their backend.
*/
const channelsJsonData = require('./data/channels.json');
const programsJsonData = require('./data/programs.json');
const lineupVersionJsonData = require('./data/lineupVersion.json');

/*
  This method is used to read a file for channels data placed
  in the app's data folder e.g. /home/app_user/packages/com.amazon.keplervideoapp/data
  on the device. This feature is added so developers can push different data on device
  and reinstall the KVA's vpkg to test the EPG sync task without rebuilding the app
  Partners will read data from their respective backend.
 */
const readChannelDataFromFile = async (): Promise<any> => {
  try {
    const response = await FileSystem.readFileAsString(
      '/data/channels.txt',
      'UTF-8',
    );
    return JSON.parse(response);
  } catch (error) {
    console.error(
      'ktf: Error received on reading channel data from file placed on device, returning default value',
      error,
    );
    return channelsJsonData;
  }
};

/*
  This method is used to read a file for programs data placed
  in the app's data folder e.g. /home/app_user/packages/com.amazon.keplervideoapp/data
  on the device. This feature is added so developers can push different data on device
  and reinstall the KVA's vpkg to test the EPG sync task without rebuilding the app
  Partners will read data from their respective backend.
*/
const readProgramDataFromFile = async (): Promise<any> => {
  try {
    const response = await FileSystem.readFileAsString(
      '/data/programs.txt',
      'UTF-8',
    );
    return JSON.parse(response);
  } catch (error) {
    console.error(
      'ktf: Error received on reading program data from file placed on device, returning default value',
      error,
    );
    return programsJsonData;
  }
};

const channelsJsonPromise: Promise<any> = readChannelDataFromFile();
const programsJsonPromise: Promise<any> = readProgramDataFromFile();

/*
  This method is used to read a file for lineupVersion data placed
  in the app's data folder e.g. /home/app_user/packages/com.amazon.keplervideoapp/data
  on the device. To enable epg sync, would need to update the version.
  Partners will read data from their respective backend.
*/
export const getMockedChannelLineupVersion = async (): Promise<string> => {
  try {
    const response = await FileSystem.readFileAsString(
      '/data/lineupVersion.txt',
      'UTF-8',
    );
    const jsonData = JSON.parse(response);
    return jsonData.mockedChannelLineupVersion;
  } catch (error) {
    console.error(
      'ktf: Error received on reading mockedChannelLineupVersion data from file placed on device, returning default value',
      error,
    );
    return lineupVersionJsonData.mockedChannelLineupVersion;
  }
};

export const getMockedProgramLineupVersion = async (): Promise<string> => {
  try {
    const response = await FileSystem.readFileAsString(
      '/data/lineupVersion.txt',
      'UTF-8',
    );
    const jsonData = JSON.parse(response);
    return jsonData.mockedProgramLineupVersion;
  } catch (error) {
    console.error(
      'ktf: Error received on reading mockedProgramLineupVersion data from file placed on device, returning default value',
      error,
    );
    return lineupVersionJsonData.mockedProgramLineupVersion;
  }
};

export const getMockedChannelLineup = async (
  start: number,
  page_size: number,
): Promise<IChannelInfo[]> => {
  const channelsJson = await channelsJsonPromise;
  var channels: IChannelInfo[] = [];
  const availableChannels = channelsJson.length;
  if (start >= availableChannels) {
    // mock no more pages available
    return Promise.resolve(channels);
  }

  try {
    let end = Math.min(availableChannels, start + page_size);
    for (let i = start; i < end; i++) {
      const channel = buildChannelInfo(channelsJson[i]);
      channels.push(channel);
    }
    return Promise.resolve(channels);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMockedChannelLineupSize = async (): Promise<number> => {
  const channelsJson = await channelsJsonPromise;
  return Promise.resolve(channelsJson.length);
};

export const getMockedPrograms = async (
  start: number,
  page_size: number,
): Promise<IProgram[]> => {
  const programsJson = await programsJsonPromise;
  var programs: IProgram[] = [];
  const availablePrograms = programsJson.length;
  if (start >= availablePrograms) {
    // mock no more pages available
    return Promise.resolve(programs);
  }

  try {
    // The first program starts 45 mins earlier than current system time.
    let first_program_start_time_ms = Date.now() - 45 * 60 * 1000;
    let end = Math.min(availablePrograms, start + page_size);
    for (let i = start; i < end; i++) {
      const programs_for_one_channel = programsJson[i];
      var temp_time = first_program_start_time_ms;
      programs_for_one_channel.forEach((element: any) => {
        const start_time_ms = temp_time;
        // Set the interval of the program as 1 hour.
        const end_time_ms = start_time_ms + 60 * 60 * 1000;
        // If the program from Json file doesn't provide startTime and endTime,
        // the program will be assigned with the given start_time_ms and end_time_ms.
        const program = buildProgram(element, start_time_ms, end_time_ms);
        programs.push(program);
        temp_time = end_time_ms;
      });
    }
    return Promise.resolve(programs);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMockedProgramLineupSize = async (): Promise<number> => {
  let length = 0;
  const programsJson = await programsJsonPromise;
  programsJson.map((item: any[]) => (length += item.length));
  return Promise.resolve(length);
};

const getMpaaRating = (program: any): string | undefined => {
  // We're parsing through an array of string ratings. Just pick the
  // first one we recognize and translate it into a format Parental
  // Controls will recognize. A real implementation will need a more
  // robust solution.
  const ratings: string[] = program?.ratings;
  if (Array.isArray(ratings)) {
    for (const rating of ratings) {
      switch (rating) {
        case 'MPAA::G':
          return 'US_MV_G';
        case 'MPAA::PG':
          return 'US_MV_PG';
        case 'MPAA::PG-13':
          return 'US_MV_PG13';
        case 'MPAA::R':
          return 'US_MV_R';
        case 'MPAA::NC-17':
          return 'US_MV_NC17';
      }
    }
  }

  // Default to an undefined rating, which indicates unrated content.
  return undefined;
};

export const getMockedCurrentTitleDataForChannel = async (
  matchString: string,
): Promise<TitleData> => {
  // Return the first program found with a matching channel ID, since
  // start and end times can be generated arbitrarily. See
  // `getMockedPrograms` for this logic.  A real implementation will
  // be able to look this up on the catalog server.
  const channels = await programsJsonPromise;
  for (const channel of channels) {
    for (const program of channel) {
      if (program.channelIdentifier === matchString) {
        const result: TitleData = {
          ...program,
          mpaaRating: getMpaaRating(program),
        };
        return Promise.resolve(result);
      }
    }
  }

  // If we can't find a program, just default to a hard-coded one.
  return Promise.resolve(tileData);
};

const buildChannelInfo = (element: any): IChannelInfo => {
  // build ChannelDescriptor
  const channel_descriptor_builder = new ChannelDescriptorBuilder();
  if ('identifier' in element) {
    channel_descriptor_builder.identifier(element.identifier);
  }
  if ('majorNumber' in element) {
    channel_descriptor_builder.majorNumber(element.majorNumber);
  }
  if ('minorNumber' in element) {
    channel_descriptor_builder.minorNumber(element.minorNumber);
  }
  const descriptor = channel_descriptor_builder.build();

  // build MetaData
  const metadata_builder = new ChannelMetadataBuilder();
  if ('name' in element) {
    metadata_builder.name(element.name);
  }
  if ('type' in element) {
    metadata_builder.channelType(element.type);
  }
  if ('url' in element) {
    metadata_builder.logoUrl(element.url);
  }
  if ('genres' in element) {
    metadata_builder.genres(element.genres);
  }
  if ('attributes' in element) {
    metadata_builder.attributes(element.attributes);
  }
  if ('resolution' in element) {
    metadata_builder.videoResolution(element.resolution);
  }
  if ('rank' in element) {
    metadata_builder.sortRank(element.rank);
  }
  if ('externalIds' in element) {
    let ids = element.externalIds.map(
      (x: { idType: string; value: string }) => {
        let externalId_builder = new ExternalIdBuilder();
        externalId_builder.idType(x.idType);
        externalId_builder.value(x.value);
        return externalId_builder.build();
      },
    );
    metadata_builder.externalIdList(ids);
  }
  const metadata = metadata_builder.build();

  // build ChannelInfo
  return new ChannelInfoBuilder()
    .channelDescriptor(descriptor)
    .channelMetadata(metadata)
    .build();
};

const buildProgram = (
  element: any,
  start_time_ms: number,
  end_time_ms: number,
): IProgram => {
  // build ChannelDescriptor
  const channel_descriptor_builder = new ChannelDescriptorBuilder();
  if ('channelIdentifier' in element) {
    channel_descriptor_builder.identifier(element.channelIdentifier);
  }
  if ('channelMajorNumber' in element) {
    channel_descriptor_builder.majorNumber(element.channelMajorNumber);
  }
  if ('channelMinorNumber' in element) {
    channel_descriptor_builder.minorNumber(element.channelMinorNumber);
  }
  const descriptor = channel_descriptor_builder.build();

  // build program
  const program_builder = new ProgramBuilder();
  program_builder.channelDescriptor(descriptor);
  if ('id' in element) {
    program_builder.identifier(element.id);
  }
  if ('title' in element) {
    program_builder.title(element.title);
  }
  if ('startTime' in element) {
    program_builder.startTimeMs(element.startTime);
  } else {
    program_builder.startTimeMs(start_time_ms);
  }
  if ('endTime' in element) {
    program_builder.endTimeMs(element.endTime);
  } else {
    program_builder.endTimeMs(end_time_ms);
  }
  if ('subtitle' in element) {
    program_builder.subtitle(element.subtitle);
  }
  if ('description' in element) {
    program_builder.description(element.description);
  }
  if ('thumbnailUrl' in element) {
    program_builder.thumbnailUrl(element.thumbnailUrl);
  }
  if ('posterArtUrl' in element) {
    program_builder.posterArtUrl(element.posterArtUrl);
  }
  if ('ratings' in element) {
    program_builder.ratings(element.ratings);
  }
  if ('genres' in element) {
    program_builder.genres(element.genres);
  }
  if ('attributes' in element) {
    program_builder.attributes(element.attributes);
  }
  if ('seriesInfo' in element) {
    const { season, episode } = element.seriesInfo;
    const builder = new SeriesInfoBuilder();
    builder.season(season);
    builder.episode(episode);
    const seriesInfo = builder.build();
    program_builder.seriesInfo(seriesInfo);
  }
  return program_builder.build();
};
