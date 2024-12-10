import { create } from "zustand";

/*
can only be called in client components

*/

interface PremiumModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

//state available throughout whole app
const usePremiumModal = create<PremiumModalState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));

export default usePremiumModal;
