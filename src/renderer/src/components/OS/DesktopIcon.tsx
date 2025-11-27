import React from 'react';
import { IGameConfig } from '../../types';
import { useOSStore } from '../../store/os-store';

interface Props {
  game: IGameConfig;
}

const DesktopIcon: React.FC<Props> = ({ game }) => {
  const { openGame } = useOSStore();

  return (
    <div
      onDoubleClick={() => openGame(game)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 80,
        cursor: 'pointer',
        padding: 5,
        userSelect: 'none' 
      }}
      className="desktop-icon" 
    >
      <div style={{ fontSize: 32, marginBottom: 5 }}>{game.icon}</div>
      <span style={{ 
        color: 'white', 
        textShadow: '1px 1px 1px black', 
        textAlign: 'center',
        fontFamily: '"MS Sans Serif", Arial, sans-serif'
      }}>
        {game.title}
      </span>
    </div>
  );
};

export default DesktopIcon;