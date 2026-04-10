import { create } from 'zustand';

interface ViewState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
