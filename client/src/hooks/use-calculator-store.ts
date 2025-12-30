import { create } from 'zustand';
import { type CalculatorInput, calculatorSchema } from '@shared/schema';

// This simple store could be used for persistence or more complex global state
// For now, we mainly rely on React Hook Form + URL params, but this is good practice for future expansion.

interface CalculatorState {
  hasCalculated: boolean;
  setHasCalculated: (value: boolean) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  hasCalculated: false,
  setHasCalculated: (value) => set({ hasCalculated: value }),
}));
