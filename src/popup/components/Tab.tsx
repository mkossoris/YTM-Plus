import styled from 'styled-components';
import React from 'react';
import imageComingSoon from '../../assets/image-coming-soon.png';
import { DefaultMiniDarkTheme } from '../../constants';

interface ITabProps {
  isActive: boolean;
  albumArtUrl?: string;
  title?: string;
  artist?: string;
  onClick: () => void;
}

export const Tab = ({
  isActive,
  albumArtUrl,
  title,
  artist,
  onClick,
}: ITabProps) => {
  return (
    <StyledTab onClick={onClick}>
      {isActive ? (
        <>
          <img className="album-art" src={albumArtUrl} />
          <div className="song-info">
            <h3 className="song-title">{title}</h3>
            <h4 className="song-artist">{artist}</h4>
          </div>
        </>
      ) : (
        <>
          <img className="album-art" src={imageComingSoon} />
          <div className="song-info">
            <h3 className="song-title">&lt;Nothing Playing&gt;</h3>
          </div>
        </>
      )}
    </StyledTab>
  );
};

const StyledTab = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  background-color: transparent;
  color: ${DefaultMiniDarkTheme.primaryText};
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid transparent;

  & > .album-art {
    width: 60px;
    height: 60px;
    margin: 5px;
    border-radius: 5px;
  }

  & > .song-info {
    margin-top: 5px;
    margin-left: 5px;

    & > .song-title {
      margin: 0;
      font-weight: 600;
      font-size: 13px;
    }

    & > .song-artist {
      margin: 0;
      font-weight: 600;
      color: ${DefaultMiniDarkTheme.secondaryText};
    }
  }

  &:hover {
    cursor: pointer;
    border: 1px solid ${(props) => props.theme.primaryText};
  }
`;
