import { useState, useEffect } from 'react';
import { useOSStore } from '../../store/os-store';
import { format } from 'date-fns';
import { systemAudio } from '../../lib/audio';
import { IMenuItem, useContextMenuStore } from '@renderer/store/context-menu-store';

const Taskbar = () => {
    const { windows, activeWindowId, restoreWindow, minimizeWindow, toggleStartMenu, isStartMenuOpen } = useOSStore();
    const [time, setTime] = useState(new Date());
    const [isMuted, setIsMuted] = useState(false); 
    const { showMenu } = useContextMenuStore();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTaskClick = (winId: string, isMinimized: boolean, isActive: boolean) => {
        if (isMinimized || !isActive) {
            restoreWindow(winId);
        } else {
            minimizeWindow(winId);
        }
    };

    const toggleAudio = () => {
        const muted = systemAudio.toggleMute();
        setIsMuted(muted);
    };

    const handleTaskbarContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); 

        const menuItems: IMenuItem[] = [
            { label: 'Toolbars', disabled: true },
            { label: 'Cascade Windows', disabled: true },
            { label: 'Tile Windows', disabled: true },
            {
                separator: true,
                label: ''
            },
            { label: 'Task Manager', action: () => alert("Task Manager WIP") },
            {
                separator: true,
                label: ''
            },
            { label: 'Properties', action: () => alert("Taskbar Properties") },
        ];

        showMenu(e.clientX, e.clientY, menuItems);
    };
    return (
        <div className="taskbar"
            onContextMenu={handleTaskbarContextMenu}
            style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 28,
                background: '#c0c0c0', borderTop: '2px solid #fff', display: 'flex',
                alignItems: 'center', padding: '2px', zIndex: 99999
            }
            }>
            <button
                onClick={toggleStartMenu}
                
                className={`start-button-wrapper ${isStartMenuOpen ? 'active' : ''}`}
                style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 5, height: '100%' }}
            >
                <span style={{ fontSize: 16 }}>🪟</span>
                Start
            </button>

            <div style={{ borderLeft: '2px solid #808080', borderRight: '2px solid #fff', height: '80%', margin: '0 5px' }} />

            <div style={{ display: 'flex', flex: 1, gap: 2, overflowX: 'auto' }}>
                {windows.map(win => (
                    <button
                        key={win.id}
                        className={activeWindowId === win.id && !win.isMinimized ? 'active' : ''}
                        onClick={() => handleTaskClick(win.id, win.isMinimized, activeWindowId === win.id)}
                        style={{
                            minWidth: 100,
                            maxWidth: 150,
                            textAlign: 'left',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {win.title}
                    </button>
                ))}
            </div>

            <div className="status-bar-field" style={{
                padding: '0 5px',
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 10
            }}>
                <div onClick={toggleAudio} style={{ cursor: 'pointer', fontSize: 14 }}>
                    {isMuted ? '🔇' : '🔊'}
                </div>

                <div>
                    {format(time, 'HH:mm')}
                </div>
            </div>
        </div >
    );
};

export default Taskbar;