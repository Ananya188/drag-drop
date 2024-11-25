import { createRef, useEffect, useRef } from "react";
import Note from "./note";

const Notes = ({ notes = [], setNotes = () => {} }) => {
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const updateedNotes = notes.map((note) => {
      const savedNote = savedNotes.find((n) => n.id === note.id);
      if (savedNote) {
        return { ...note, position: savedNote.position };
      } else {
        const position = determinNewPosition();
        return { ...note, position };
      }
    });
    setNotes(updateedNotes);
    localStorage.setItem("notes", JSON.stringify(updateedNotes));
  }, [notes.length]);
  const noteRefs = useRef([]);
  const determinNewPosition = () => {
    const maxX = window.innerWidth - 250;
    const maxY = window.innerHeight - 250;

    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };
  const handleDragStart = (note, e) => {
    const { id } = note;
    const noteRef = noteRefs.current[id].current;
    const rect = noteRefs.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const startPos = note.position;

    const handleMouseMove = (e) => {
      const newX = e.clientX - offsetX;
      const newY = e.clinetY - offsetY;

      noteRef.style.left = `${newX}px`;
      noteRef.style.top = `${newY}px`;
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      const finalRect = noteRef.getBoundingClientRect();
      const newPostition = { x: finalRect.left, y: finalRect.top };
      if (chechkForOverlap(id)) {
        noteRef.style.left = `${startPos.x}px`;
        noteRef.style.top = `${startPos.y}px`;
      } else {
        updateNotePosition(id, newPosition);
      }
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };
    const checkForOverlap = (id) => {
      const currentNoteRef = noteRefs.current[id].current;
      const currentRect = currentNoteRef.getBoundingClientRect();

      return notes.some((note) => {
        if (note.id === id) return false;

        const otherNoteRef = noteRef.current[(note, id)].current;
        const otherRect = otherNoteRef.getBoundingClientRect();

        const overlap = !(
          currentRect.right < otherRect.left ||
          currentRect.left > otherRect.right ||
          currentRect.bottom < otherRect.top ||
          currentRect.top > otherRect.bottom
        );

        return overlap;
      });
    };
    const updateNotePostion = (id, newPosition) => {
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, position: newPosition } : note
      );

      return (
        <div>
          {notes.map((note) => {
            return (
              <Note
                key={note.id}
                ref={
                  noteRefs.current[note.id]
                    ? noteRefs.current[note.id]
                    : (noteRefs.current[note.id] = createRef())
                }
                initialPos={note.position}
                content={note.text}
                onMouseDown={(e) => handleDragStart(note, e)}
              />
            );
          })}
        </div>
      );
    };
  };
};
export default Notes;
