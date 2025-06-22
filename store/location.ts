import { Coordinates } from "@/types";
import { create } from "zustand";

type State = {
    start : Coordinates | null;
    end : Coordinates | null;
    setStart : (coord : Coordinates) => void;
    setEnd : (coord : Coordinates) => void;
}

export const useLocationStore = create<State>((set) => ({
    start : null,
    end : null,
    setStart : (coord) => set({start : coord}),
    setEnd : (coord) => set({end : coord})
}))