// Which note the Notebook should show: set just before the window opens (the desktop sticky asks for
// "now"), or while it's open (it listens for the event).
import type { NoteId } from "@/data/notebook";

export const NOTE_EVENT = "notebook-open-note";
let requested: NoteId | null = null;

export function openNote(id: NoteId) {
  requested = id;
  window.dispatchEvent(new CustomEvent<NoteId>(NOTE_EVENT, { detail: id }));
}

export function takeRequestedNote(): NoteId | null {
  const id = requested;
  requested = null;
  return id;
}
