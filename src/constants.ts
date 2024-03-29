import { MiniTheme, Options } from './types';

export const MAIN_URL = 'https://music.youtube.com/*';

export const enum MessageType {
  DISLIKE_TRACK,
  GET_PLAYER_STATE,
  GET_SONG_INFO,
  LIKE_TRACK,
  NOTIFICATION,
  PLAY_PAUSE,
  PLAYER_STATE_UPDATED,
  PREVIOUS_TRACK,
  REMOTE_SESSION_UPDATED,
  SCROBBLE_TRACK,
  SET_CURRENT_TRACK,
  SET_TAB_AS_VIEWER,
  SET_TRACK_PROGRESS,
  SET_YTM_TAB_ID,
  SET_VOLUME,
  SKIP_TRACK,
  SONG_UPDATED,
  SPOTIFY_TO_YTM,
  YTM_THEME_UPDATED,
  REDIRECT_TO_OPTIONS,
}

export const DefaultMiniDarkTheme: MiniTheme = {
  primaryText: '#ffffff',
  secondaryText: '#b1b1b1',
  backgroundColor: '#141414',
  footerBackgroundColor: '#212121',
  primaryButton: '#dddddd',
  secondaryButton: '#909090',
  progressColor: '#e84844',
  queueBackground: '#141414',
};

export const DefaultMiniLightTheme: MiniTheme = {
  primaryText: '#e84844',
  secondaryText: '#727272',
  backgroundColor: '#ffffff',
  footerBackgroundColor: '#3b3b3b',
  primaryButton: '#ffffff',
  secondaryButton: '#B7B7B7',
  progressColor: '#e84844',
  queueBackground: '#ffffff',
};

export const DefaultOptions: Options = {
  lyrics: true,
  miniKeyControl: true,
  miniTheme: DefaultMiniDarkTheme,
  notifications: true,
  popoutWindow: false,
  spotifyToYTM: true,
  ytmKeyControl: true,
};

export const VOLUME_INCREMENT = 5;
