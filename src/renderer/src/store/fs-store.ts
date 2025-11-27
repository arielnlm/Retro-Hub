import { create } from 'zustand';
import { FileType, IFileSystemItem } from '../types';
import { persist, createJSONStorage } from 'zustand/middleware'; 
interface FSState {
    items: IFileSystemItem[];
    getItemsInFolder: (folderId: string) => IFileSystemItem[];

    moveItem: (itemId: string, newParentId: string) => void;
    
    moveItems: (itemIds: string[], newParentId: string) => void;

    setItemPosition: (itemId: string, x: number, y: number) => void;
    
    updateItemsPosition: (updates: { id: string, x: number, y: number }[]) => void;

    createItem: (parentId: string, type: FileType, name: string) => void;

    deleteItem: (itemId: string) => void;
    
    deleteItems: (itemIds: string[]) => void;
    resetFS: () => void;
}

const INITIAL_ITEMS: IFileSystemItem[] = [
    { id: 'desktop', parentId: 'root', name: 'Desktop', type: 'folder', icon: '💻' },

    
    { id: 'my_computer', parentId: 'desktop', name: 'My Computer', type: 'folder', icon: '🖥️', x: 20, y: 20 },
    { id: 'recycle_bin', parentId: 'desktop', name: 'Recycle Bin', type: 'folder', icon: '🗑️', x: 20, y: 110 },
    { id: 'readme', parentId: 'desktop', name: 'ReadMe.txt', type: 'app', appId: 'notepad', icon: '📝', x: 20, y: 200 },

    { id: 'c_drive', parentId: 'my_computer', name: 'Local Disk (C:)', type: 'folder', icon: '💾' },
    { id: 'program_files', parentId: 'c_drive', name: 'Program Files', type: 'folder', icon: '📁' },
    { id: 'windows', parentId: 'c_drive', name: 'Windows', type: 'folder', icon: '📁' },
    { id: 'games', parentId: 'c_drive', name: 'Games', type: 'folder', icon: '🎮' },
    { id: 'mine_shortcut', parentId: 'games', name: 'Minesweeper', type: 'app', appId: 'minesweeper', icon: '💣' },
    { id: 'sol_shortcut', parentId: 'games', name: 'Solitaire', type: 'app', appId: 'solitaire', icon: '🃏' },
];

export const useFSStore = create<FSState>()(
  persist(
    (set, get) => ({
      items: INITIAL_ITEMS,

      getItemsInFolder: (folderId) => get().items.filter(i => i.parentId === folderId),

      moveItem: (itemId, newParentId) => 
        set(state => ({ items: state.items.map(i => i.id === itemId ? { ...i, parentId: newParentId } : i) })),

      moveItems: (itemIds, newParentId) => 
        set(state => ({ items: state.items.map(i => itemIds.includes(i.id) ? { ...i, parentId: newParentId } : i) })),

      setItemPosition: (itemId, x, y) => 
        set(state => ({ items: state.items.map(i => i.id === itemId ? { ...i, x, y } : i) })),

      updateItemsPosition: (updates) => {
        set(state => ({
          items: state.items.map(item => {
            const update = updates.find(u => u.id === item.id);
            return update ? { ...item, x: update.x, y: update.y } : item;
          })
        }));
      },

      createItem: (parentId, type, name) => {
        const newItem: IFileSystemItem = {
          id: crypto.randomUUID(),
          parentId, name, type,
          icon: type === 'folder' ? '📁' : '📄',
          x: 20, y: 20 
        };
        set(state => ({ items: [...state.items, newItem] }));
      },

      deleteItem: (itemId) => {
        set(state => ({ items: state.items.filter(i => i.id !== itemId) }));
      },

      deleteItems: (itemIds) => {
        set(state => ({ items: state.items.filter(i => !itemIds.includes(i.id)) }));
      },

      
      resetFS: () => set({ items: INITIAL_ITEMS }),
    }),
    {
      name: 'retro-os-filesystem', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);