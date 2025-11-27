import React, { useEffect, useState, useRef, useCallback } from 'react';
import '98.css';
import './assets/main.css';

import { getGameById } from './games/registry';
import { useOSStore } from './store/os-store';
import { useFSStore } from './store/fs-store';
import { useContextMenuStore, IMenuItem } from './store/context-menu-store';
import { systemAudio } from './lib/audio';
import { IFileSystemItem } from './types';

import WindowFrame from './components/OS/WindowFrame';
import Taskbar from './components/OS/Taskbar';
import DraggableIcon from './components/OS/DraggableIcon';
import ContextMenu from './components/OS/ContextMenu';
import StartMenu from './components/OS/StartMenu';

const ScreenSaverOverlay = ({ type, onClose }: { type: string, onClose: () => void }) => {
  return (
    <div
      onClick={onClose}
      onMouseMove={onClose}
      onKeyDown={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 9999999, backgroundColor: 'black', cursor: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
      }}
    >
      {type === 'windows_logo' && (
        <div className="screensaver-logo">🪟 Windows</div>
      )}
      {type === 'matrix' && (
        <div style={{ color: '#0f0', fontFamily: 'monospace', fontSize: 20 }}>
          Wake up Neo... The Matrix has you...
        </div>
      )}
    </div>
  );
};

function App() {
  const { getItemsInFolder, createItem, moveItems, updateItemsPosition, deleteItems } = useFSStore();
  const { showMenu } = useContextMenuStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { windows, isStartMenuOpen, openGame,
    clearSelection, setSelection, selectedIconIds,
    toggleStartMenu, wallpaperImage,
    wallpaperStyle, backgroundColor,
    windowHeaderColor,
    screenSaverType, screenSaverTimeout } = useOSStore();
  

  const desktopItems = getItemsInFolder('desktop');

  
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const selectionStart = useRef<{ x: number, y: number } | null>(null);

  const [showScreenSaver, setShowScreenSaver] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (showScreenSaver) {
      setShowScreenSaver(false); 
    }

    if (idleTimer.current) clearTimeout(idleTimer.current);

    if (screenSaverType !== 'none') {
      idleTimer.current = setTimeout(() => {
        setShowScreenSaver(true);
      }, screenSaverTimeout * 60 * 1000); 
    }
  }, [screenSaverType, screenSaverTimeout, showScreenSaver]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    
    if ((e.target as HTMLElement).closest('.taskbar') || (e.target as HTMLElement).closest('.window')) return;

    
    if ((e.target as HTMLElement).closest('.desktop-icon')) return;

    
    setIsSelecting(true);
    selectionStart.current = { x: e.clientX, y: e.clientY };
    clearSelection(); 

    
    
  };

  const triggerRefresh = () => {
    
    clearSelection();

    
    setIsRefreshing(true);

    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 150); 
  };

  useEffect(() => {
    
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);

    resetIdleTimer(); 

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('mousedown', resetIdleTimer);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  useEffect(() => {
    document.documentElement.style.setProperty('--title-bar-background',
      `linear-gradient(90deg, ${windowHeaderColor}, #1084d0)`
    );
  }, [windowHeaderColor]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selectionStart.current) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const startX = selectionStart.current.x;
    const startY = selectionStart.current.y;

    
    const newBox = {
      x: Math.min(startX, currentX),
      y: Math.min(startY, currentY),
      width: Math.abs(currentX - startX),
      height: Math.abs(currentY - startY)
    };

    setSelectionBox(newBox);

    
    
    const selectedIds: string[] = [];

    desktopItems.forEach(item => {
      
      
      const iconX = item.x || 0;
      const iconY = item.y || 0;
      const iconW = 80;
      const iconH = 80;

      
      if (
        iconX < newBox.x + newBox.width &&
        iconX + iconW > newBox.x &&
        iconY < newBox.y + newBox.height &&
        iconY + iconH > newBox.y
      ) {
        selectedIds.push(item.id);
      }
    });

    
    setSelection(selectedIds);
  };

  const handleGlobalMouseDown = (e: React.MouseEvent) => {
    
    handleMouseDown(e);

    
    if (isStartMenuOpen) {
      const target = e.target as HTMLElement;

      
      const clickedOnStartMenu = target.closest('.start-menu-wrapper');
      const clickedOnStartButton = target.closest('.start-button-wrapper'); 

      if (!clickedOnStartMenu && !clickedOnStartButton) {
        
        toggleStartMenu();
      }
    }

    
    if (!(e.target as HTMLElement).closest('.desktop-icon') && !e.shiftKey && !e.ctrlKey) {
      
    }
  };
  
  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionBox(null);
      selectionStart.current = null;
    }
  };

  
  const handleOpenItem = (item: IFileSystemItem) => {
    if (item.type === 'folder' || item.id === 'my_computer' || item.id === 'recycle_bin') {
      const explorerConfig = getGameById('explorer');
      if (explorerConfig) openGame(explorerConfig);
    } else if (item.type === 'app' && item.appId) {
      const gameConfig = getGameById(item.appId);
      if (gameConfig) openGame(gameConfig);
    }
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if ((e.target as HTMLElement).closest('.desktop-icon')) return;
    if ((e.target as HTMLElement).closest('.taskbar')) return;

    const menuItems: IMenuItem[] = [
      { label: 'View', disabled: true },
      { label: 'Sort by', disabled: true },
      { label: 'Refresh', action: triggerRefresh },
      {
        separator: true,
        label: ''
      },
      { label: 'New Folder', action: () => createItem('desktop', 'folder', 'New Folder') },
      {
        separator: true,
        label: ''
      },
      
      {
        label: 'Properties',
        action: () => {
          const config = getGameById('display_properties');
          if (config) openGame(config);
        }
      },
    ];

    showMenu(e.clientX, e.clientY, menuItems);
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Pixelated MS Sans Serif", Arial, sans-serif',
      
      backgroundColor: backgroundColor,
    };

    if (wallpaperImage) {
      style.backgroundImage = `url(${wallpaperImage})`;

      if (wallpaperStyle === 'center') {
        style.backgroundRepeat = 'no-repeat';
        style.backgroundPosition = 'center';
        style.backgroundSize = 'auto'; 
      } else if (wallpaperStyle === 'stretch') {
        style.backgroundRepeat = 'no-repeat';
        style.backgroundSize = '100% 100%';
      } else if (wallpaperStyle === 'tile') {
        style.backgroundRepeat = 'repeat';
        style.backgroundSize = 'auto'; 
      }
    }

    return style;
  };
  const handleIconContextMenu = (e: React.MouseEvent, item: IFileSystemItem) => {
    e.preventDefault();
    e.stopPropagation();

    
    const isGroup = selectedIconIds.includes(item.id) && selectedIconIds.length > 1;
    const count = isGroup ? selectedIconIds.length : 1;
    const itemsToDelete = isGroup ? selectedIconIds : [item.id];

    const menuItems: IMenuItem[] = [
      
      { label: 'Open', action: () => handleOpenItem(item), disabled: isGroup },
      {
        separator: true,
        label: ''
      },
      {
        label: isGroup ? `Delete (${count})` : 'Delete',
        action: () => {
          if (confirm(`Are you sure you want to delete ${count} item(s)?`)) {
            deleteItems(itemsToDelete); 
          }
        }
      },
      {
        separator: true,
        label: ''
      },
      { label: 'Properties', action: () => alert(`Properties for ${isGroup ? 'Selection' : item.name}`) },
    ];
    showMenu(e.clientX, e.clientY, menuItems);
  };

  const handleDesktopDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const rawIds = e.dataTransfer.getData('itemIds');
    const leaderId = e.dataTransfer.getData('leaderId');

    if (!rawIds || !leaderId) return;

    const itemIds: string[] = JSON.parse(rawIds);

    
    const rawX = e.clientX;
    const rawY = e.clientY;

    
    const snapX = Math.floor((rawX - 40) / 80) * 80 + 20;
    const snapY = Math.floor((rawY - 40) / 80) * 80 + 20;

    
    const leaderItem = desktopItems.find(i => i.id === leaderId);

    
    
    if (leaderItem) {
      const oldX = leaderItem.x || 0;
      const oldY = leaderItem.y || 0;

      
      const deltaX = snapX - oldX;
      const deltaY = snapY - oldY;

      
      const updates = itemIds.map(id => {
        const currentItem = desktopItems.find(i => i.id === id);

        
        if (currentItem) {
          return {
            id: id,
            x: (currentItem.x || 0) + deltaX,
            y: (currentItem.y || 0) + deltaY
          };
        }
        
        
        else {
          
          
          
          return { id: id, x: snapX, y: snapY };
        }
      });

      
      const itemsNotInDesktop = itemIds.filter(id => !desktopItems.find(i => i.id === id));
      if (itemsNotInDesktop.length > 0) {
        moveItems(itemsNotInDesktop, 'desktop');
      }

      
      updateItemsPosition(updates);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => systemAudio.play('startup'), 500);
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('.desktop-icon') || target.classList.contains('window-action')) {
        systemAudio.play('click');
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => { clearTimeout(timer); window.removeEventListener('mousedown', handleGlobalClick); };
  }, []);

  return (
    <div
      style={getBackgroundStyle()}
      onDrop={handleDesktopDrop}
      onDragOver={(e) => e.preventDefault()}
      onContextMenu={handleDesktopContextMenu}
      onMouseDown={handleGlobalMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {showScreenSaver && screenSaverType !== 'none' && (
        <ScreenSaverOverlay type={screenSaverType} onClose={() => setShowScreenSaver(false)} />
      )}
      <ContextMenu />

      {selectionBox && (
        <div className="selection-box" style={{
          left: selectionBox.x, top: selectionBox.y,
          width: selectionBox.width, height: selectionBox.height
        }} />
      )}
      {!isRefreshing && (
        <div style={{ width: '100%', height: '100%', zIndex: 0 }}>
          {desktopItems.map(item => (
            <DraggableIcon
              key={item.id}
              item={item}
              isDesktop={true}
              onDoubleClick={handleOpenItem}
              onContextMenu={(e) => handleIconContextMenu(e, item)}
            />
          ))}
        </div>
      )}

      {windows.map(win => <WindowFrame key={win.id} window={win} />)}

      {isStartMenuOpen && <StartMenu />}

      <Taskbar />
    </div>
  );
}

export default App;