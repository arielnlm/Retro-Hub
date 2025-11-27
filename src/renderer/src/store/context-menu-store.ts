import { create } from 'zustand';

export interface IMenuItem {
    label: string;
    action?: () => void;
    disabled?: boolean;
    separator?: boolean; 
}

interface ContextMenuState {
    isOpen: boolean;
    x: number;
    y: number;
    items: IMenuItem[];

    showMenu: (x: number, y: number, items: IMenuItem[]) => void;
    hideMenu: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
    isOpen: false,
    x: 0,
    y: 0,
    items: [],

    showMenu: (x, y, items) => set({ isOpen: true, x, y, items }),
    hideMenu: () => set({ isOpen: false }),
}));