import { VideoPlayer } from '@amzn/react-native-w3cmedia';
import React, { useCallback } from 'react';
import { VideoFileTypes } from '../data/videos';
import { TitleData } from '../types/TitleData';
import { ShakaPlayer } from '../w3cmedia/shakaplayer/ShakaPlayer';

export class VideoHandler {
  public videoRef: React.MutableRefObject<VideoPlayer | null>;
  public player: React.MutableRefObject<ShakaPlayer | null>;
  public selectedFileType: string;
  public data: TitleData;

  public setIsVideoInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  public setIsVideoEnded: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(
    videoRef: React.MutableRefObject<VideoPlayer | null>,
    player: React.MutableRefObject<ShakaPlayer | null>,
    data: TitleData,
    setIsVideoInitialized: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVideoEnded: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.videoRef = videoRef;
    this.player = player;
    this.data = data;
    this.selectedFileType = data.format;
    this.setIsVideoInitialized = setIsVideoInitialized;
    this.setIsVideoEnded = setIsVideoEnded;
  }
  setMediaData = (mediaData: TitleData) => {
    this.data = mediaData;
    this.selectedFileType = mediaData.format;
  };

  preBufferVideo = useCallback(async () => {
    await this.destroyVideoElements();
    console.log('Attempt to prebuffer Video Player');
    if (this.videoRef.current == null) {
      this.videoRef.current = new VideoPlayer();
    }
    (global as any).gmedia = this.videoRef.current;
    this.videoRef.current
      .initialize()
      .then(() => {
        console.log('Video Player Prebuffering Initialized');
        this.setupEventListeners();
        this.videoRef!!.current!!.autoplay = false;
        this.loadVideoElements();
      })
      .catch(error => {
        console.error('Failed to initialized Video');
        console.error(error);
      });
  }, []);

  loadVideoElements = useCallback(() => {
    if (this.videoRef !== null && this.videoRef.current !== null) {
      try {
        this.loadSubtitles();
      } catch (error) {
        console.error('Failed to load subtitles');
        console.error(error);
      }
      this.videoRef.current.autoplay = false;
      if (this.selectedFileType === VideoFileTypes.MP4) {
        this.loadStaticMediaPlayer(this.videoRef.current);
      } else {
        this.loadAdaptiveMediaPlayer();
      }
    }
  }, []);

  loadStaticMediaPlayer = useCallback(
    (video: {
      src: string;
      autoplay: boolean;
      pause: () => void;
      load: () => void;
    }) => {
      video.src = this.data.videoUrl;
      video.pause();
      console.log(`Loading static player with: ${video.src}`);
      video.load();
    },
    [],
  );

  loadAdaptiveMediaPlayer = useCallback(() => {
    if (this.videoRef !== null && this.videoRef.current !== null) {
      this.player.current = new ShakaPlayer(this.videoRef.current);
      if (this.player.current !== null) {
        console.log(`Loading Adaptive Media player (Shaka) with: ${this.data}`);
      }
      this.player.current.load(this.data, false);
    }
  }, []);

  loadSubtitles = useCallback(() => {
    const source = this.data;
    if (source?.textTrack && source.textTrack.length > 0) {
      for (let i: number = 0; i < source.textTrack.length; i++) {
        console.log(
          `Loading subtitles from: ${source.videoUrl} [${source.textTrack[i].language}]`,
        );
        this.videoRef.current?.addTextTrack(
          'subtitles',
          source.textTrack[i].label,
          source.textTrack[i].language,
          source.textTrack[i].uri,
          source.textTrack[i].mimeType,
        );
        console.log(
          `Loaded ${this.videoRef.current?.textTracks.length || 0} subtitles:`,
        );
      }
    }
  }, []);

  onLoadeMetaData = () => {
    if (this.videoRef.current) {
      console.log('onLoadeMetaData');
      this.setIsVideoInitialized(true);
    }
  };

  onEnded = () => {
    if (this.videoRef.current?.ended) {
      console.log('onEnded');
      this.setIsVideoEnded(true);
    }
  };

  setupEventListeners = useCallback(() => {
    this.videoRef.current?.addEventListener(
      'loadedmetadata',
      this.onLoadeMetaData,
    );
    this.videoRef.current?.addEventListener('ended', this.onEnded);
  }, []);

  removeEventListeners = useCallback(() => {
    this.videoRef.current?.removeEventListener(
      'loadedmetadata',
      this.onLoadeMetaData,
    );
    this.videoRef.current?.removeEventListener('ended', this.onEnded);
  }, []);

  onVideoUnmount = () => {
    this.removeEventListeners();
    (global as any).gmedia = null;
    this.videoRef.current?.pause();
    this.videoRef.current = null;
    this.player.current = null;
  };

  destroyMediaPlayer = useCallback(
    async (
      selectedFileType: String,
      player: { unload: () => any } | null,
      video: { deinitialize: () => any } | null,
    ) => {
      if (selectedFileType !== VideoFileTypes.MP4) {
        console.log('Destroying Adaptive Media Player (shaka)');
        try {
          if (player) {
            console.log('Unloading only Adaptive Media Player (shaka)');
            await player.unload();
          } else {
            console.log('Destroying Adaptive Media Player (shaka) skipped');
          }
        } catch (err) {
          console.error(
            'Found an error when destroying Adaptive Media Player: ',
            err,
          );
        }
      }
      try {
        if (video) {
          console.log('Deinitializing both Adaptive and Non Adaptive Video');
          await video.deinitialize();
          this.onVideoUnmount();
        } else {
          console.log(
            'Destroying both Adaptive and Non Adaptive Video (shaka) skipped',
          );
        }
      } catch (err) {
        console.error('Found an error when destroying Video: ', err);
      }
      console.info('Finished Destroying Adaptaive Media player!');
    },
    [],
  );

  destroyVideoElements = async () => {
    if (!this.videoRef.current) {
      return false;
    }

    this.videoRef.current.pause();
    console.log('Trigger before async Destroying Video elements');
    await this.destroyMediaPlayer(
      this.selectedFileType,
      this.player.current,
      this.videoRef.current,
    );
    console.log('Triggered Destroying Video elements');
    return true;
  };
}
