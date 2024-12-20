import { defineStore } from 'pinia';
import { Note } from '../models/Notes/note';
import { NoteBook } from '../models/Notes/noteBook';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';

export const useNotesStore = defineStore('notesStore', {
  state: () => ({
    notes: [] as Note[],
    note: undefined as Note | undefined,
    noteBooks: [] as NoteBook[],
    errorMsg: '' as string,
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
          `${util.getEndPointUrl()}/notebook`
        );
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
      if (
        parentObjectServiceType === '' &&
        parentObjectId === '' &&
        noteBookId === ''
      ) {
        return;
      }
      const callStr =
        parentObjectId != '' && parentObjectServiceType != ''
          ? `${util.getEndPointUrl()}/note-summary?parentSid=${parentObjectId}`
          : `${util.getEndPointUrl()}/note-summary?noteBookSId=${noteBookId}`;

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        if (response.status === 200) {
          this.notes = response.data;
          this.errorMsg = '';
        }
        if (response.status === 204) {
          await this.resetNotesList();
          this.errorMsg = response.statusText;
          return true;
        }
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
          `${util.getEndPointUrl()}/note-detail/${id}`
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
          `${util.getEndPointUrl()}/note-detail`,
          note
        );
        if (response.status === 200) {
          this.getNote(response.data);
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async editNote(note: Note) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${util.getEndPointUrl()}/note-detail/${note.id}`,
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
          `${util.getEndPointUrl()}/note-detail/${id}`
        );
        if (response.status === 200) {
          this.note = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async resetNotesList() {
      this.notes = [];
    },
  },
});
