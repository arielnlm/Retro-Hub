import { create } from 'zustand';
import { IWindow, IGameConfig } from '../types';


export type WallpaperStyle = 'tile' | 'center' | 'stretch';
export type ScreenSaverType = 'none' | 'blank' | 'windows_logo' | 'matrix';

interface OSState {
  windows: IWindow[];
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  selectedIconIds: string[];
  wallpaperImage: string | null;
  wallpaperStyle: WallpaperStyle;
  backgroundColor: string;
  screenSaverType: ScreenSaverType;
  screenSaverTimeout: number;
  isScreenSaverActive: boolean;


  windowHeaderColor: string;


  setScreenSaver: (type: ScreenSaverType, timeout: number) => void;
  setScreenSaverActive: (active: boolean) => void;
  setTheme: (headerColor: string, desktopColor: string) => void;


  setWallpaper: (image: string | null, style: WallpaperStyle, color: string) => void;

  openGame: (game: IGameConfig) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleStartMenu: () => void;
  toggleMaximize: (id: string) => void;
  setWindowSize: (id: string, width: number, height: number) => void;
  setWindowPosition: (id: string, x: number, y: number) => void;
  selectIcon: (id: string) => void;
  addIconToSelection: (id: string) => void;
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  isStartMenuOpen: false,
  selectedIconId: null,

  selectedIconIds: [],
  wallpaperImage: null,
  wallpaperStyle: 'center',
  backgroundColor: '#008080',
  windowHeaderColor: '#000080',

  screenSaverType: 'windows_logo',
  screenSaverTimeout: 1,
  isScreenSaverActive: false,


  setScreenSaver: (type, timeout) => set({
    screenSaverType: type, screenSaverTimeout: timeout
  }),

  setScreenSaverActive: (active) => set({ isScreenSaverActive: active }),

  setTheme: (headerColor, desktopColor) => set({
    windowHeaderColor: headerColor,
    backgroundColor: desktopColor
  }),
  setWallpaper: (image, style, color) => set({
    wallpaperImage: image,
    wallpaperStyle: style,
    backgroundColor: color
  }),
  addIconToSelection: (id) => set(state => ({
    selectedIconIds: state.selectedIconIds.includes(id)
      ? state.selectedIconIds
      : [...state.selectedIconIds, id]
  })),


  setSelection: (ids) => set({ selectedIconIds: ids }),


  clearSelection: () => set({ selectedIconIds: [] }),

  selectIcon: (id) => set({ selectedIconIds: [id] }),

  toggleMaximize: (id) => {
    const { windows } = get();
    const win = windows.find(w => w.id === id);
    if (!win) return;

    if (win.isMaximized) {

      set(state => ({
        windows: state.windows.map(w => {
          if (w.id !== id) return w;

          const restored = w.preMaximizeState || { x: 50, y: 50, width: 400, height: 300 };
          return {
            ...w,
            isMaximized: false,
            x: restored.x,
            y: restored.y,
            width: restored.width,
            height: restored.height,
            preMaximizeState: undefined
          };
        })
      }));
    } else {

      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? {
            ...w,
            isMaximized: true,

            preMaximizeState: { x: w.x, y: w.y, width: w.width, height: w.height },

            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - 30
          } : w
        ),
        activeWindowId: id
      }));
    }
  },


  setWindowSize: (id, width, height) => {
    set(state => ({
      windows: state.windows.map(w => w.id === id ? { ...w, width, height } : w)
    }));
  },


  setWindowPosition: (id, x, y) => {
    set(state => ({
      windows: state.windows.map(w => w.id === id ? { ...w, x, y } : w)
    }));
  },
  openGame: (game) => {
    console.log("OS-STORE: Opening game...", game.title);
    const { windows } = get();
    const maxZ = windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) : 0;
    const newId = crypto.randomUUID();
    console.log("OS-STORE: Generated Window ID:", newId);
    const newWindow: IWindow = {

      id: newId,
      gameId: game.id,
      title: game.title,
      x: 50 + (windows.length * 30) % 300,
      y: 50 + (windows.length * 30) % 300,
      width: game.preferredWidth || 400,
      height: game.preferredHeight || 300,
      isMinimized: false,
      isMaximized: false,
      zIndex: maxZ + 1,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      isStartMenuOpen: false,
      selectedIconIds: []
    });

    console.log("OS-STORE: Windows count after update:", [...windows, newWindow].length);
  },

  closeWindow: (id) => {
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: null
    }));
  },

  restoreWindow: (id) => {
    const { windows } = get();
    const maxZ = windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) : 0;

    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w
      ),
      activeWindowId: id
    }));
  },

  focusWindow: (id) => {
    const { windows } = get();
    const maxZ = Math.max(...windows.map(w => w.zIndex), 0);

    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
      ),
      activeWindowId: id,
      isStartMenuOpen: false
    }));
  },

  toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
}));