import React from 'react';
import { IFileSystemItem } from '../../types';
import { useOSStore } from '../../store/os-store';
import clsx from 'clsx';

interface Props {
    item: IFileSystemItem;
    onDoubleClick: (item: IFileSystemItem) => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    isDesktop?: boolean;
}

const DraggableIcon: React.FC<Props> = ({ item, onDoubleClick, onContextMenu, isDesktop }) => {
    const { selectedIconIds, selectIcon, addIconToSelection } = useOSStore();
    const isSelected = selectedIconIds.includes(item.id);

    const handleDragStart = (e: React.DragEvent) => {
        let itemsToDrag = [item.id];

        if (isSelected) {
            itemsToDrag = selectedIconIds;
        } else {
            selectIcon(item.id);
        }



        e.dataTransfer.setData('itemIds', JSON.stringify(itemsToDrag));

        e.dataTransfer.setData('leaderId', item.id);

        e.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            addIconToSelection(item.id);
        } else {
            selectIcon(item.id);
        }
    };

    return (
        <div
            draggable="true"
            onDragStart={handleDragStart}
            onClick={handleClick}
            onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(item); }}
            onContextMenu={(e) => {


                if (!isSelected) selectIcon(item.id);
                if (onContextMenu) onContextMenu(e);
            }}
            className={clsx("desktop-icon", { "selected": isSelected })}
            style={{
                position: isDesktop ? 'absolute' : 'relative',
                left: isDesktop ? item.x : undefined,
                top: isDesktop ? item.y : undefined,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 80,
                padding: 5,
                userSelect: 'none',
                border: isSelected ? '1px dotted white' : '1px solid transparent'
            }}
        >
            <div style={{ fontSize: 32, pointerEvents: 'none', marginBottom: 2 }}>
                {item.icon}
            </div>

            <span style={{
                fontSize: 13,
                pointerEvents: 'none',
                color: isDesktop ? 'white' : 'black',
                backgroundColor: isSelected ? '#000080' : 'transparent',


                textAlign: 'center',
                width: '100%',
                wordWrap: 'break-word',
                lineHeight: '1.2',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textShadow: isDesktop && !isSelected ? '1px 1px 1px black' : 'none',
            }}>
                {item.name}
            </span>
        </div>
    );
};

export default DraggableIcon;