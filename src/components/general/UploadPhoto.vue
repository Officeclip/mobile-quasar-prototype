<script setup>
import { ref, nextTick, watch, defineEmits, defineProps } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

// const props = defineProps({
//   modelValue: String, // v-model for file name
//   showGallery: { type: Boolean, default: true }, // show/hide gallery button
// });
const props = defineProps(['showCamera']);
const emit = defineEmits(['update:modelValue', 'error']);

const imageSrc = ref(null);
const showCropModal = ref(false);
const cameraImage = ref(null);
const cropperInstance = ref(null);
const imageToCrop = ref(null);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      // Optionally, load the image if you want to show the thumbnail
      // You can implement loading from Filesystem if needed
    }
  }
);

const openCamera = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      direction: 'rear',
    });
    cameraImage.value = photo.dataUrl;
    showCropModal.value = true;
  } catch (error) {
    emit('error', 'Camera error');
  }
};

const selectFromGallery = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });
    cameraImage.value = photo.dataUrl;
    showCropModal.value = true;
  } catch (error) {
    emit('error', 'Gallery error');
  }
};

const initCropper = () => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy();
    cropperInstance.value = null;
  }
  if (imageToCrop.value) {
    cropperInstance.value = new Cropper(imageToCrop.value, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 0.8,
      background: false,
      zoomable: true,
    });
  }
};

const cropAndSave = async () => {
  await nextTick();
  if (!cropperInstance.value) {
    emit('error', 'Cropper is not ready.');
    return;
  }
  const croppedCanvas = cropperInstance.value.getCroppedCanvas({
    width: 500,
    height: 500,
  });
  const dataUrl = croppedCanvas.toDataURL('image/png');
  imageSrc.value = dataUrl;
  showCropModal.value = false;
  try {
    const base64 = dataUrl.split(',')[1];
    const fileName = `cropped_${Date.now()}.png`;
    await Filesystem.writeFile({
      path: `Pictures/QuasarCrops/${fileName}`,
      data: base64,
      directory: Directory.External,
      recursive: true,
    });
    emit('update:modelValue', dataUrl);
  } catch {
    emit('error', 'Failed to save image.');
  }
};

const cancelCrop = () => {
  showCropModal.value = false;
};
</script>

<template>
  <div class="column items-center">
    <div class="q-mb-md row justify-center">
      <q-btn
        v-if="showCamera"
        flat
        color="primary"
        label="Open Camera"
        @click="openCamera"
        class="q-mr-sm"
        icon="photo_camera"
        no-caps
      />
      <q-btn
        flat
        color="secondary"
        label="Select from Gallery"
        @click="selectFromGallery"
        icon="photo_library"
        no-caps
      />
    </div>
    <!-- commented these lines not required to show whole cropped image will see later if required -->

    <!-- <q-card v-if="imageSrc" class="q-mt-md rounded-lg shadow-lg">
      <q-card-section>
        <div class="text-h6 text-center">Last Cropped Image</div>
      </q-card-section>
      <q-card-section class="flex flex-center">
        <q-avatar color="grey-3" size="200px">
          <q-img :src="imageSrc" alt="Cropped Image" />
        </q-avatar>
      </q-card-section>
    </q-card>
    <div v-else class="text-grey-6 text-center q-mt-md">
      No image captured yet.
    </div> -->

    <q-dialog v-model="showCropModal" persistent full-width>
      <q-card class="column full-height">
        <q-card-section class="q-pb-none">
          <div class="text-h6">Crop & Save Image</div>
        </q-card-section>
        <q-card-section class="col flex flex-center">
          <div v-if="cameraImage">
            <img
              ref="imageToCrop"
              :src="cameraImage"
              alt="Image to Crop"
              @load="initCropper"
            />
          </div>
          <div v-else class="text-grey-6">Loading image...</div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            color="negative"
            @click="cancelCrop"
            rounded
          />
          <q-btn
            v-if="cameraImage"
            label="Crop & Save"
            color="primary"
            @click="cropAndSave"
            rounded
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
/* ... (reuse your styles here) ... */
</style>
