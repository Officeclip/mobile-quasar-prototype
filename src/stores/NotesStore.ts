import { defineStore } from 'pinia';
import { Note } from '../models/note';
import { NoteBook } from '../models/noteBook';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useNotesStore = defineStore('notesStore', {
  state: () => ({
    notes: [] as Note[],
    note: undefined as Note | undefined,
    noteBooks: [] as NoteBook[],
  }),

  getters: {
    Notes: (state) => state.notes,
    NotesCount: (state) => state.notes.length,
    Note: (state) => state.note,
    NoteBooks: (state) => state.noteBooks,
    NoteBooksCount: (state) => state.noteBooks.length,
  },

  actions: {
    async getNoteBooks() {
      try {
        const response = await axios.get(`${Constants.endPointUrl}/notebooks`);
        this.noteBooks = response.data;
        //console.log(`NotesStore: getNoteBooks: Count: ${this.NoteBooksCount}`);
      } catch (error) {
        console.error(error);
      }
    },

    async getNotes(
      parentObjectServiceType: string,
      parentObjectId: string,
      noteBookId: string
    ) {
      console.log(
        `NotesStore: getNotes: parameters: ${parentObjectServiceType}, ${parentObjectId}, ${noteBookId}`
      );
      const callStr =
        parentObjectId != '' && parentObjectServiceType != ''
          ? `${Constants.endPointUrl}/note-summary?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/notes?noteBookId=${noteBookId}`;

      try {
        const response = await axios.get(callStr);
        this.notes = response.data;
        console.log(`NotesStore: getNotes: notes data: ${this.notes}`);
      } catch (error) {
        console.error(error);
      }
    },

    async GetNotesByParent(
      parentObjectServiceType: string,
      parentObjectId: string
    ) {
      await this.getNotes(parentObjectServiceType, parentObjectId, '');
    },

    async GetNotesByNotebook(noteBookId: string) {
      await this.getNotes('', '', noteBookId);
    },

    async getNote(id: string) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/note-summary?id=${id}`
        );
        this.note = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },

    async addNotes(note: Note) {
      this.notes.push(note);

      const res = await axios.post(
        `${Constants.endPointUrl}/note-details`,
        note
      );

      if (res.status === 200) {
        this.getNote(note.id);
      } else {
        console.error(res);
      }
    },

    async editNote(note: Note) {
      console.log(`editNote 1: ${this.note?.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `${Constants.endPointUrl}/note-details?id=${note.id}`,
          note
        );
        if (response.status === 200) {
          //debugger;
          this.note = response.data;
          console.log(`editNote 3: ${this.note?.title}`);
        }
      } catch (error) {
        console.error(`editNote Error: ${error}`);
      }
    },

    async deleteNote(id: string | undefined) {
      try {
        const response = await axios.delete(
          `${Constants.endPointUrl}/note-details/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.note = response.data;
          //  console.log(`editNote 3: ${this.note?.title}`);
        }
      } catch (error) {
        console.error(`deleteNote Error: ${error}`);
      }
    },
  },
});
