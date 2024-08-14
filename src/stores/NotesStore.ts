import { defineStore } from 'pinia';
import { Note } from '../models/note';
import { NoteBook } from '../models/noteBook';
import { Constants } from 'stores/Constants';
import logger from 'src/helpers/logger';

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
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/notebook`
        );
        logger.log(`@@@@@: ${this.noteBooks}`);
        this.noteBooks = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getNotes(
      parentObjectServiceType: string,
      parentObjectId: string,
      noteBookId: string
    ) {
      // if all three are empty then ignore
      if (parentObjectId === '' && parentObjectId === '' && noteBookId === '') {
        return;
      }
      const callStr =
        parentObjectId != '' && parentObjectServiceType != ''
          ? `${Constants.endPointUrl}/note-summary?parentSid=${parentObjectId}`
          : `${Constants.endPointUrl}/note-summary?noteBookSId=${noteBookId}`;

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.notes = response.data;
      } catch (error) {
        Constants.throwError(error);
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
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/note-detail/${id}`
        );
        this.note = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addNotes(note: Note) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${Constants.endPointUrl}/note-detail`,
          note
        );
        if (response.status === 200) {
          this.getNote(note.id);
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async editNote(note: Note) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/note-detail/${note.id}`,
          note
        );
        if (response.status === 200) {
          this.note = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async deleteNote(id: string | undefined) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/note-detail/${id}`
        );
        if (response.status === 200) {
          this.note = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
