import { create } from "zustand";
type Role="patient"|"therapist"|"admin";
type State = { token?: string; role?: Role; };
type Actions = { setToken:(t?:string)=>void; setRole:(r?:Role)=>void; logout:()=>void; };
export const useSession = create<State & Actions>((set)=>({
  token: undefined, role: undefined,
  setToken:(t)=>set({token:t}), setRole:(r)=>set({role:r}),
  logout:()=>set({token:undefined, role:undefined})
}));
