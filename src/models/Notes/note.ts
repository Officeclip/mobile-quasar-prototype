import { security } from '../security';
export interface Note {
  id: string;
  noteBookId: string;
  parent: {
    type: {
      id: string;
      name: string;
    };
    value: {
      id: string;
      name: string;
    };
  };
  title: string;
  description: string;
  isPrivate: boolean;
  createdByUserSid: string;
  createdDateTime: string;
  security: security;
}
