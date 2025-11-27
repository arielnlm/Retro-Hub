import { useEffect, useRef } from 'react';
import { useContextMenuStore } from '../../store/context-menu-store';

const ContextMenu = () => {
  const { isOpen, x, y, items, hideMenu } = useContextMenuStore();
  const menuRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        hideMenu();
      }
    };
    
    
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', hideMenu);
    
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', hideMenu);
    };
  }, [hideMenu]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="window" 
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 999999, 
        minWidth: 150,
        padding: 2,
        boxShadow: '1px 1px 0px black' 
      }}
      
      onContextMenu={(e) => e.preventDefault()} 
    >
      <div className="window-body" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
        {items.map((item, index) => {
          if (item.separator) {
            return <hr key={index} style={{ margin: '4px 0', borderBottom: '1px solid white' }} />;
          }

          return (
            <div
              key={index}
              onClick={() => {
                if (!item.disabled && item.action) {
                  item.action();
                  hideMenu(); 
                }
              }}
              style={{
                padding: '4px 8px',
                cursor: item.disabled ? 'default' : 'pointer',
                color: item.disabled ? 'gray' : 'black',
                textShadow: item.disabled ? '1px 1px 0px white' : 'none',
                
                
              }}
              className="menu-item" 
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContextMenu;