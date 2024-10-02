import { VideoPlayer } from '@amzn/react-native-w3cmedia';

export enum PlayerControlType {
  PLAY = 'play',
  PAUSE = 'pause',
  PLAYPAUSE = 'playpause',
  SKIPBACKWARD = 'skip_backward',
  SKIPFORWARD = 'skip_forward',
}
export interface ControlBarButtonProps {
  videoRef: React.MutableRefObject<VideoPlayer | null>;
  onBlur?: () => void;
  playerControlType?: string;
}
