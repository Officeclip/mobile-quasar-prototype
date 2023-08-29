// Generated from: https://app.quicktype.io/#l=TypeScript
//
export interface ContactDetail {
  // value(value: any): unknown;
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
}
