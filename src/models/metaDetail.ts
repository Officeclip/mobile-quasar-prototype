// Generated from: https://app.quicktype.io/#l=TypeScript
//
import { ListItem } from './metaList';

export interface MetaDetail {
  entityId: number;
  id: number;
  sections: Section[];
}

export interface Section {
  sectionId: number;
  sectionName: string;
  sectionEntries: SectionEntry[];
}

export interface SectionEntry {
  metaId: number;
  visibleName: string;
  type: string;
  visible: boolean;
  editable: boolean;
  value: string;
  options: ListItem[];
}
