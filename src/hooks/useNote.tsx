import { Note, useNoteStore } from "@/store/note-store";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useNote = () => {
  const { notes, setNotes } = useNoteStore();
  const { error, isLoading, mutate } = useSWR("/api/note", fetcher, {
    onSuccess: (data) => {
      if (data?.data) {
        setNotes(data?.data);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });


  const createNote = async (note: Note) => {
    try {
      const res = await fetch("/api/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });
      if (res.ok) {
        mutate();
      }
    } catch (error) {
      console.log(error);
    }
  };


  const updateNote = async (note: Note, id: number) => {
    try {
      const res = await fetch(`/api/note/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });
      if (res.ok) {
        mutate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { notes, error, isLoading, createNote, updateNote };
};
