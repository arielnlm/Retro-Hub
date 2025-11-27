import React, { useRef } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import { IWindow } from '../../types';
import { useOSStore } from '../../store/os-store';
import { getGameById } from '../../games/registry';
import clsx from 'clsx';
import 'react-resizable/css/styles.css';

interface Props {
    window: IWindow;
}

const WindowFrame: React.FC<Props> = ({ window }) => {
    const {
        closeWindow, minimizeWindow, toggleMaximize, focusWindow,
        activeWindowId, setWindowPosition, setWindowSize
    } = useOSStore();

    const gameConfig = getGameById(window.gameId);
    const nodeRef = useRef<HTMLDivElement>(null);


    const isResizable = gameConfig?.isResizeable !== false;


    const handleDragStop: DraggableEventHandler = (_e, data) => {

        setWindowPosition(window.id, data.x, data.y);
    };


    const handleResizeStop = (_e: any, { size }: ResizeCallbackData) => {
        setWindowSize(window.id, size.width, size.height);
    };

    if (!gameConfig) return null;
    const isActive = activeWindowId === window.id;

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".title-bar"

            position={window.isMaximized ? { x: 0, y: 0 } : { x: window.x, y: window.y }}

            disabled={window.isMaximized}
            onMouseDown={() => focusWindow(window.id)}
            onStop={handleDragStop}
        >
            <div
                ref={nodeRef}
                className={clsx("window", { "active": isActive })}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: window.zIndex,
                    visibility: window.isMinimized ? 'hidden' : 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#c0c0c0',
                    boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff',

                    width: window.width,
                    height: window.height,
                }}
            >
                {!window.isMaximized && isResizable ? (
                    <Resizable
                        width={window.width}
                        height={window.height}
                        onResize={handleResizeStop}

                        handle={
                            <div
                                className="resize-handle"
                                style={{
                                    position: 'absolute', bottom: 4, right: 4,
                                    width: 10, height: 10, cursor: 'se-resize',

                                    background: 'linear-gradient(135deg, transparent 50%, gray 50%)',
                                    zIndex: 100
                                }}
                            />
                        }
                    >
                        <div style={{ width: window.width, height: window.height, display: 'flex', flexDirection: 'column' }}>
                            <TitleBar
                                title={window.title}
                                isMaximized={window.isMaximized}
                                onMinimize={() => minimizeWindow(window.id)}
                                onMaximize={() => toggleMaximize(window.id)}
                                onClose={() => closeWindow(window.id)}
                            />
                            <WindowContent component={gameConfig.component} />
                        </div>
                    </Resizable>
                ) : (

                    <>
                        <TitleBar
                            title={window.title}
                            isMaximized={window.isMaximized}
                            onMinimize={() => minimizeWindow(window.id)}
                            onMaximize={() => toggleMaximize(window.id)}
                            onClose={() => closeWindow(window.id)}
                        />
                        <WindowContent component={gameConfig.component} />
                    </>
                )}
            </div>
        </Draggable>
    );
};


const TitleBar = ({ title, isMaximized, onMinimize, onMaximize, onClose }: any) => (
    <div className="title-bar" style={{ flexShrink: 0 }}>
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize(); }} />
            <button
                aria-label={isMaximized ? "Restore" : "Maximize"}
                onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            />
            <button aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose(); }} />
        </div>
    </div>
);

const WindowContent = ({ component }: any) => (
    <div className="window-body" style={{ flex: 1, margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', width: '100%', overflow: 'auto', padding: 2 }}>
            {component}
        </div>
    </div>
);

export default WindowFrame;