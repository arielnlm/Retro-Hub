import React from 'react';

interface Props {
  children: React.ReactNode;
}

const MonitorPreview: React.FC<Props> = ({ children }) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: 152, 
      height: 118, 
      margin: '10px auto',
      backgroundImage: 'url("https://win98icons.alexmeub.com/images/computer-monitor.png")',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }}>
      <div style={{
        position: 'absolute',
        top: 14, left: 19, right: 19, bottom: 28,
        backgroundColor: 'black',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {children}
      </div>
    </div>
  );
};

export default MonitorPreview;