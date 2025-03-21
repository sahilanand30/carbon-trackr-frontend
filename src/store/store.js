import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      history: [],
      addEntry: (entry) => set((state) => ({ history: [...state.history, entry] })),
    }),
    { name: 'carbon-storage' }
  )
);

export default useStore;