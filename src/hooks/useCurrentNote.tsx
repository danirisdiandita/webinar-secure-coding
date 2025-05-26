'use client'
import { useNoteStore } from "@/store/note-store";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const useCurrentNote = (id: number) => {
  const { currentNote, setCurrentNote } = useNoteStore();
  const { error, isLoading, mutate } = useSWR(`/api/note/${id}`, fetcher, {
    onSuccess: (data) => {
        console.log('data', data)
      if (data?.data) {
        console.log('data?.data', data?.data)
        setCurrentNote(data?.data);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { error, isLoading, mutate, currentNote };
};
