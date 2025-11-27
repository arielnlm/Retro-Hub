import React, { useState } from 'react';
import { useFSStore } from '../../store/fs-store';
import { useOSStore } from '../../store/os-store';
import { IFileSystemItem } from '../../types';
import DraggableIcon from '../OS/DraggableIcon';

interface Props {
    initialPath?: string;
}

const FileExplorer: React.FC<Props> = ({ initialPath = 'my_computer' }) => {

    const [currentPathId, setCurrentPathId] = useState(initialPath);
    const [history, setHistory] = useState<string[]>([initialPath]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const { getItemsInFolder, items, moveItems } = useFSStore();
    const { openGame } = useOSStore();


    const currentItems = getItemsInFolder(currentPathId);
    const currentFolderInfo = items.find(i => i.id === currentPathId);


    const handleNavigate = (folderId: string) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(folderId);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentPathId(folderId);
    };

    const handleBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setCurrentPathId(history[historyIndex - 1]);
        }
    };

    const handleUp = () => {
        if (currentFolderInfo && currentFolderInfo.parentId && currentFolderInfo.parentId !== 'root') {
            handleNavigate(currentFolderInfo.parentId);
        }
    };


    const handleItemDoubleClick = (item: IFileSystemItem) => {
        if (item.type === 'folder') {
            handleNavigate(item.id);
        } else if (item.type === 'app' && item.appId) {

            import('../../games/registry').then(({ getGameById }) => {
                const gameConfig = getGameById(item.appId!);
                if (gameConfig) openGame(gameConfig);
            });
        }
    };




    const handleDropInWindow = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const rawIds = e.dataTransfer.getData('itemIds');
        if (rawIds) {
            const itemIds: string[] = JSON.parse(rawIds);

            moveItems(itemIds, currentPathId);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="status-bar" style={{ gap: 5, padding: 5 }}>
                <button onClick={handleBack} disabled={historyIndex === 0}>⬅ Back</button>
                <button onClick={handleUp} disabled={currentPathId === 'my_computer'}>⬆ Up</button>
                <div style={{ background: 'white', border: '1px solid gray', padding: '2px 5px', flex: 1 }}>
                    Address: {currentFolderInfo?.name}
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    border: '2px solid inset',
                    padding: 10,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'flex-start',
                    gap: 15,
                    overflowY: 'auto'
                }}

                onDrop={handleDropInWindow}
                onDragOver={(e) => e.preventDefault()}
            >
                {currentItems.length === 0 && <p style={{ color: 'gray' }}>This folder is empty.</p>}

                {currentItems.map(item => (
                    <DraggableIcon
                        key={item.id}
                        item={item}

                        isDesktop={false}
                        onDoubleClick={handleItemDoubleClick}
                    />
                ))}
            </div>

            <div className="status-bar">
                <p className="status-bar-field">{currentItems.length} object(s)</p>
            </div>
        </div>
    );
};

export default FileExplorer;