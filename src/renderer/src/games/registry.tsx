import React, { Suspense } from 'react';
import { IGameConfig } from '../types';


const FileExplorer = React.lazy(() => import('../components/Apps/FileExplorer'));
const DisplayProperties = React.lazy(() => import('../components/Apps/DisplayProperties'));


const ExplorerWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <FileExplorer />
    </Suspense>
);

const DisplayWrapper = () => (<Suspense fallback={<div>Loading...</div>}><DisplayProperties /></Suspense>);

const PlaceholderGame = () => <div style={{ padding: 20 }}>WIP</div>;

export const GAME_REGISTRY: IGameConfig[] = [
    {
        id: 'explorer',
        title: 'File Explorer',
        icon: '📂',
        component: <ExplorerWrapper />, 
        preferredWidth: 600,
        preferredHeight: 400,
        isResizeable: true
    },
    {
        id: 'minesweeper',
        title: 'Minesweeper',
        icon: '💣',
        component: <PlaceholderGame />, 
        preferredWidth: 300,
        preferredHeight: 350,
    },
    {
        id: 'solitaire',
        title: 'Solitaire',
        icon: '🃏',
        component: <PlaceholderGame />,
        preferredWidth: 600,
        preferredHeight: 450,
    },
    {
        id: 'notepad',
        title: 'ReadMe.txt',
        icon: '📝',
        component: <div style={{ padding: 10 }}>Dobrodošli!</div>,
        preferredWidth: 400,
        preferredHeight: 300,
    },
    {
        id: 'display_properties',
        title: 'Display Properties',
        icon: '🎨', 
        component: <DisplayWrapper />,
        preferredWidth: 420,
        preferredHeight: 480,
        isResizeable: false 
    },
];

export const getGameById = (id: string) => GAME_REGISTRY.find(g => g.id === id);