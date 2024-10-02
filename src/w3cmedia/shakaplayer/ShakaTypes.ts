import { TitleData } from '../../types/TitleData';

export interface PlayerInterface {
  load(content: TitleData, autoplay: boolean): void;
  play(): void;
  pause(): void;
  seekBack(): void;
  seekFront(): void;
  unload(): void;
}
export interface ServerMap {
  [index: string]: string;
}
export interface ShakaPlayerSettings {
  secure: boolean;
  abrEnabled: boolean;
  abrMaxWidth?: number;
  abrMaxHeight?: number;
}
