// src/context/AbilityContext.tsx
import React, { createContext, useContext, useMemo } from "react";
import defineAbilitiesFor from "../lib/abilities";

const AbilityContext = createContext(null);

export function AbilityProvider({ role, children }: { role: string; children: React.ReactNode }) {
  const ability = useMemo(() => defineAbilitiesFor(role), [role]);
  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
}

export function useAbility() {
  return useContext(AbilityContext);
}
