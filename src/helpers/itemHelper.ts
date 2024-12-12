import { MetaDetails, SectionEntry } from '../models/Meta/metaDetails';

export class itemHelper {
  itemDetail: MetaDetails;
  constructor(_itemDetail: MetaDetails) {
    this.itemDetail = _itemDetail;
  }

  getSectionEntries(sectionId: number, isOdd: boolean): SectionEntry[] {
    const _sectionEntries: SectionEntry[] = [];
    for (const section of this.itemDetail.sections) {
      if (section.sectionId != sectionId) continue;
      const indexStart = isOdd ? 1 : 0;
      for (
        let index = indexStart;
        index < section.sectionEntries.length;
        index += 2
      ) {
        const sectionEntry = section.sectionEntries[index];
        _sectionEntries.push(sectionEntry);
      }
    }
    return _sectionEntries;
  }
}
