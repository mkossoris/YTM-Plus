import React, { useEffect } from 'react';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { authorizeUser, finishAuth } from '../util/lastFM';
import Option from './components/Option';
import PopupThemeEditor from './components/PopupThemeEditor';
import { LastFMSession, Options } from '../types';
import useStorage from '../hooks/useStorage';
import { sendEvent } from '../util/analytics';

export default function Options() {
  const { result: options, set: setOptions } = useStorage<Options>('options');
  const { result: lastFMSession, set: setLastFMSession } =
    useStorage<LastFMSession>('lastfm-info');

  console.log({ options });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      finishAuth(token)
        .then((res) => {
          sendEvent({
            name: 'lastfm_logged_in',
            params: {
              onUpdate: false,
            },
          });
          setLastFMSession(res);
          window.history.replaceState({}, document.title, '/options.html');
        })
        .catch(console.error);
    }
  }, []);

  const handleCheckboxClick = (id: keyof Options) => {
    sendEvent({
      name: `${id}_option_changed`,
      params: {
        enabled: !options[id],
        onUpdate: false,
      },
    });

    const newOptions = {
      ...options,
      [id]: !options[id],
    };

    setOptions(newOptions);
  };

  return (
    <OptionsStyled>
      <h1 className="settings-page-title">
        <FontAwesomeIcon icon={faCogs} />
        &nbsp;&nbsp;YTM+ Settings
      </h1>
      <div className="settings-page-container">
        <div className="settings-section">
          <h2>Announcements (2/21/2024)</h2>
          <ul>
            <li>
              The Spotify-to-YTM feature has been temporarily disabled. We are
              working with Spotify to get it re-enabled, and we apologize for
              the inconvenience.
            </li>
            <li>
              YTM+ will soon become SynQ, a more polished mini player that will
              work with multiple other music services! Keep an eye out for it!
            </li>
          </ul>
        </div>
      </div>
      <div className="settings-page-container">
        <div className="settings-section">
          <h2>Mini Player Theme</h2>
          <PopupThemeEditor />
        </div>
        <div className="settings-section">
          <h2>Mini Player Settings</h2>
          <Option
            title="Lyrics button enabled"
            checked={options?.lyrics}
            onClick={() => handleCheckboxClick('lyrics')}
          />
          <Option
            title="Key controls"
            checked={options?.miniKeyControl}
            description="Spacebar: Play/Pause | Up &amp; Down: Volume | Right &amp; Left: Skip"
            onClick={() => handleCheckboxClick('miniKeyControl')}
          />
          <p className="check-option-extra"></p>
        </div>
        <div className="settings-section">
          <h2>Notifications</h2>
          <Option
            title="Notifications on song change"
            checked={options?.notifications}
            onClick={() => handleCheckboxClick('notifications')}
          />
        </div>
        <div className="settings-section">
          <h2>YouTube Music Website</h2>
          <Option
            title="Key controls"
            description="Adds next and previous song controls with right and left arrow keys on YouTube Music page."
            checked={options?.ytmKeyControl}
            onClick={() => handleCheckboxClick('ytmKeyControl')}
          />
        </div>
        <div className="settings-section">
          <h2>LastFM</h2>
          <h3 className="last-fm-user">
            {lastFMSession?.name ? (
              <>
                <span>Signed in as</span> {lastFMSession.name}
              </>
            ) : (
              'No logged-in user.'
            )}
          </h3>
          <p>
            Note: Per LastFM rules, scrobbles only occur after listening to more
            than half of a song.
          </p>
          <button className="last-fm-button" onClick={authorizeUser}>
            LastFM Login
          </button>
        </div>
        <div className="settings-section">
          <h2>Spotify</h2>
          <Option
            title="Enable Spotify-to-YTM popup"
            description="Shows a popup on Spotify track links with a quick link to the same song on YouTube Music. NOTE: Spotify has restricted this use case for now. We are actively working to re-enable this feature."
            checked={false}
            disabled
          />
        </div>
      </div>
    </OptionsStyled>
  );
}

const OptionsStyled = styled.div`
  .settings-page-title {
    font-size: 24px;
    font-weight: 500;
    width: 800px;
    margin: 20px auto 10px auto;
    color: rgb(232, 72, 68);

    i {
      margin-right: 10px;
    }
  }

  .settings-page-container {
    width: 700px;
    box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.164);
    margin: 20px auto;
    background-color: rgb(40 40 40);
    border-radius: 15px;
    padding: 20px 50px;
  }

  .settings-section {
    margin-bottom: 35px;

    & > h2 {
      font-size: 20px;
      font-weight: 400;
      color: rgb(232, 72, 68);
      margin-bottom: 15px;
      margin-top: 0;
    }

    .last-fm-user {
      color: white;
      font-weight: 500;

      span {
        color: rgb(189, 189, 189);
        font-weight: 400;
      }
    }

    & > p {
      font-size: 12px;
      color: rgb(189, 189, 189);
    }

    & > ul {
      padding-left: 20px;
      margin: 0;

      li {
        font-size: 14px;
        color: white;
        margin-bottom: 10px;
      }
    }
  }

  .checkbox i {
    color: white;
    margin-top: 2px;
    display: block;
    text-align: center;
  }

  .last-fm-button {
    padding: 4px 13px;
    background-color: rgb(232, 72, 68);
    color: white;
    outline: none;
    border: 1px solid rgb(232, 72, 68);
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }

  .last-fm-button:hover,
  .save-button:hover {
    background-color: white;
    color: rgb(232, 72, 68);
  }
`;
