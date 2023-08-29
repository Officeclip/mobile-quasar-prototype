import { ContactDetail, SectionEntry } from '../models/contactDetail';

export class contactHelper {
  contactDetail: ContactDetail;
  constructor(_contactDetail: ContactDetail) {
    this.contactDetail = _contactDetail;
  }

  getSectionEntries(sectionId: number, isOdd: boolean): SectionEntry[] {
    const _sectionEntries: SectionEntry[] = [];
    //debugger;
    for (const section of this.contactDetail.sections) {
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

// export default {
//   contactHelper,
// };
