import { ReactNode } from 'react';

export interface IGameConfig {
    id: string;
    title: string;
    icon: string; 
    component: ReactNode;
    preferredWidth?: number;
    preferredHeight?: number;
    isResizeable?: boolean;
}

export interface IWindow {
    id: string;
    gameId: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;

    
    preMaximizeState?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export type FileType = 'folder' | 'file' | 'app';

export interface IFileSystemItem {
    id: string;
    parentId: string | null;
    name: string;
    type: FileType;
    icon: string;
    appId?: string;
    content?: string;
    x?: number;
    y?: number;
}