import { create } from "zustand";

export interface ProfileState {
    firstName: string;
    lastName: string;
    username: string;
    profilePicture: string | File | null;
    profilePicturePreview: string | null | undefined;
    timezone: string | null;
    timezoneOffset: number | null;
    changeFirstName: (firstName: string) => void;
    changeLastName: (lastName: string) => void;
    changeUsername: (username: string) => void;
    changeProfilePicture: (profilePicture: string | File | null) => void;
    changeProfilePicturePreview: (profilePicturePreview: string | null | undefined) => void;
    changeTimezone: (timezone: string | null) => void;
    changeTimezoneOffset: (timezoneOffset: number | null) => void;
}


export const useProfileStore = create<ProfileState>((set) => ({
    firstName: "",
    lastName: "",
    username: "",
    profilePicture: null,
    profilePicturePreview: null,
    timezone: null,
    timezoneOffset: null,
    changeFirstName: (firstName: string) => set({ firstName }),
    changeLastName: (lastName: string) => set({ lastName }),
    changeUsername: (username: string) => set({ username }),
    changeProfilePicture: (profilePicture: string | File | null) => set({ profilePicture }),
    changeProfilePicturePreview: (profilePicturePreview: string | null | undefined) => set({ profilePicturePreview }),
    changeTimezone: (timezone: string | null) => set({ timezone }),
    changeTimezoneOffset: (timezoneOffset: number | null) => set({ timezoneOffset }),
}));