import { messaging } from '../util/chrome';
import { MessageType } from '../constants';
import { getSongInfo, getPlayerState } from './shared';
import { Message } from 'src/types';

const scrobbledTracks = new Set();

// Mix of event listeners and MutationObservers
const initializeChangeEmitters = () => {
  // Update song info on title change
  const songInfoObserver = new MutationObserver(() => {
    updateSongInfo();
    updateTabTitle();
  });

  const titleElement = document.querySelector<HTMLElement>('.title.ytmusic-player-bar');
  titleElement && songInfoObserver.observe(titleElement, { attributeFilter: ['title'] });

  // Update player state on play/pause, track progress, like/dislike, and volume
  const playerStateObserver = new MutationObserver(() => {
    updatePlayerState();
  });

  const playPauseElement = document.querySelector('.play-pause-button');
  playPauseElement && playerStateObserver.observe(playPauseElement, { attributeFilter: ['title'] });

  // Update tab title with song name. Needs to watch <title> because YT stupidly changes the title whenever you pause
  const baseTitle = "YouTube Music";
  const updateTabTitle = () => {
    if (titleElement?.innerText && tabTitleElement?.innerText === baseTitle)
      tabTitleElement.innerText = titleElement.innerText + " - " + baseTitle;
  }
  const tabTitleObserver = new MutationObserver(updateTabTitle);
  
  const tabTitleElement = document.querySelector('title');
  tabTitleElement && tabTitleObserver.observe(tabTitleElement, { subtree: true, characterData: true, childList: true });

  const progressBarKnobElement = document.querySelector('#progress-bar #sliderKnob .slider-knob-inner');
  progressBarKnobElement && playerStateObserver.observe(progressBarKnobElement, { attributeFilter: ['value'] });

  const likeButton = document.querySelector('.ytmusic-like-button-renderer.like');
  const dislikeButton = document.querySelector('.ytmusic-like-button-renderer.dislike');
  likeButton && playerStateObserver.observe(likeButton, { attributeFilter: ['aria-pressed'] });
  dislikeButton && playerStateObserver.observe(dislikeButton, { attributeFilter: ['aria-pressed'] });

  const volumeElement = document.getElementById('volume-slider');
  volumeElement && playerStateObserver.observe(volumeElement, { attributeFilter: ['value'] });

  likeButton?.addEventListener('click', () => {
    const isLiked = likeButton.getAttribute('aria-pressed') === 'true';
    messaging.sendToRuntime({ type: MessageType.LIKE_TRACK, payload: isLiked });
  })

  dislikeButton?.addEventListener('click', () => {
    const isDisliked = dislikeButton.getAttribute('aria-pressed') === 'true';
    messaging.sendToRuntime({ type: MessageType.DISLIKE_TRACK, payload: isDisliked });
  })

  setInterval(() => {
    tryScrobble();
  }, 5000);
}

const updateSongInfo = () => {
  const songInfo = getSongInfo();
  const message: Message = {
    type: MessageType.SONG_UPDATED,
    payload: songInfo
  }

  messaging.sendToRuntime(message).catch(null);
}

const updatePlayerState = () => {
  const playerState = getPlayerState();
  const message: Message = {
    type: MessageType.PLAYER_STATE_UPDATED,
    payload: playerState
  };

  messaging.sendToRuntime(message).catch(null);
}

const tryScrobble = () => {
  try {
    var time = document.querySelector(".time-info")?.textContent?.split(' / ')

    if (time) {
      var curTimeSec = parseInt(time[0].split(':')[0])*60 + parseInt(time[0].split(':')[1])
      var endTimeSec = parseInt(time[1].split(':')[0])*60 + parseInt(time[1].split(':')[1])
  
      if (curTimeSec/endTimeSec > 0.5) {
        scrobbleTrack()
      }
    }
  } catch(e) {
    return
  }
}

const scrobbleTrack = () => {
  const songInfo = getSongInfo();
  if (!scrobbledTracks.has(songInfo.title + songInfo.artist + songInfo.album)) {
    console.log("Scrobbling...")
    scrobbledTracks.add(songInfo.title + songInfo.artist + songInfo.album);
    messaging.sendToRuntime({type: MessageType.SCROBBLE_TRACK, payload: songInfo});
  }
}

export default initializeChangeEmitters;
