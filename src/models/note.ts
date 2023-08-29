export interface Note {
  id: number;
  parentObjectServiceType: number;
  parentObjectId: number;
  noteBookId: number;
  title: string;
  description: string;
  isPrivate: boolean;
  createdByUserId: number;
  createdDateTime: string;
}
