import { defineStore } from 'pinia';
import util from 'src/helpers/util';
import { imageDetail } from 'src/models/imageDetail';
import { Constants } from '../stores/Constants';

export const useImageDetailStore = defineStore('imageDetailStore', {
  state: () => ({
    imageDetail: {} as imageDetail,
  }),

  getters: {
    ImageDetail: (state) => state.imageDetail,
  },

  actions: {
    async getImageDetail(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/image-detail?id=${id}`,
        );
        this.imageDetail = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async resetImageDetail() {
      this.imageDetail = {} as imageDetail;
    },

    async addImageDetail(image: imageDetail) {
      console.log('Adding image detail:XXXXXXXXXXXXXXXXXXXXXXX', image);
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${util.getEndPointUrl()}/image-detail`,
          image,
        );
        this.imageDetail = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async constructImageObjectAndSave(
      itemId: string,
      itemName: string,
      base64: string,
    ) {
      const base64Parts = base64.split(',');
      const srcTypeMatch = base64Parts[0].match(/:(.*?);/);
      // const srcTypeMatch = base64Parts[0].match(/data:image\/(\w+);base64/);
      const srcType = srcTypeMatch ? srcTypeMatch[1] : '';
      const src = base64Parts[1] || '';

      const imageDetailObj: imageDetail = {
        itemId: itemId,
        itemName: itemName,
        src: src,
        srcType: srcType,
      };
      await this.addImageDetail(imageDetailObj);
    },
  },
});
