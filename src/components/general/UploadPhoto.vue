<script setup>
import { ref, onBeforeUnmount, watch, nextTick } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const emit = defineEmits(['photo-updated', 'error']);
const isMobileApp = !!(
  window.Capacitor &&
  window.Capacitor.isNativePlatform &&
  window.Capacitor.isNativePlatform()
);
const imageSrc = ref(null);
const showCropModal = ref(false);
const cameraImage = ref(null);
const cropperInstance = ref(null);
const imageToCrop = ref(null);

const videoElement = ref(null);
const videoStream = ref(null);
const videoActive = ref(false);
const loading = ref(false);

const openMobileCamera = async () => {
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
    console.error('Camera error:', error);
  }
};

const openWebCamera = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      loading.value = true;
      videoStream.value = null;
      videoActive.value = false;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStream.value = stream;
      videoActive.value = true;
      loading.value = false;
    } catch (error) {
      alert('Could not access camera. Please allow camera permission.');
      videoActive.value = false;
      loading.value = false;
    }
  } else {
    alert('getUserMedia is not supported by your browser.');
  }
};

const openCamera = async () => {
  if (isMobileApp) {
    await openMobileCamera();
  } else {
    await openWebCamera();
  }
};

const selectFromGallery = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos, // Use gallery
    });
    cameraImage.value = photo.dataUrl;
    showCropModal.value = true;
  } catch (error) {
    emit('Gallery error:', error);
  }
};
// Assign stream to video element as soon as both are available
watch([videoStream, videoElement], ([stream, video]) => {
  if (stream && video) {
    video.srcObject = stream;
  }
});

const capturePhoto = () => {
  if (!videoElement.value) return;
  const video = videoElement.value;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  // Always use drawImage for both web and mobile webview
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  cameraImage.value = canvas.toDataURL('image/png');
  stopCamera();
  showCropModal.value = true;
};

const initCropper = () => {
  // Defensive destroy previous instance
  if (cropperInstance.value) {
    try {
      cropperInstance.value.destroy();
    } catch (e) {
      // Ignore errors if already destroyed or undefined
    }
    cropperInstance.value = null;
  }
  // Defensive: ensure imageToCrop is defined and loaded
  if (imageToCrop.value && imageToCrop.value.complete) {
    try {
      cropperInstance.value = new Cropper(imageToCrop.value, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 0.8,
        background: false,
        zoomable: true,
      });
    } catch (e) {
      // If Cropper fails, log error
      emit('Cropper initialization failed:', e);
    }
  } else {
    // If image is not loaded yet, wait for next tick and try again
    nextTick(() => {
      if (imageToCrop.value) {
        try {
          cropperInstance.value = new Cropper(imageToCrop.value, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 0.8,
            background: false,
            zoomable: true,
          });
        } catch (e) {
          emit('Cropper initialization failed (delayed):', e);
        }
      }
    });
  }
};

const cropAndSave = async () => {
  await nextTick();
  if (!cropperInstance.value) {
    emit('Cropper is not ready. Please wait for the image to load.');
    return;
  }
  const croppedCanvas = cropperInstance.value.getCroppedCanvas({
    width: 120,
    height: 120,
  });
  const dataUrl = croppedCanvas.toDataURL('image/png');
  imageSrc.value = dataUrl;
  showCropModal.value = false;
  try {
    // Compress the image losslessly (or with minimal quality loss)
    // Use JPEG with quality 0.8 for much smaller size, or PNG for lossless but larger
    // Here, we use JPEG for better size reduction
    const compressedDataUrl = croppedCanvas.toDataURL('image/jpeg', 0.8); // 0.8 = 80% quality
    //const dataUrl = croppedCanvas.toDataURL('image/png');
    const base64 = compressedDataUrl.split(',')[1];
    const fileName = `cropped_${Date.now()}.jpg`;
    await Filesystem.writeFile({
      path: `Pictures/QuasarCrops/${fileName}`,
      data: base64,
      directory: Directory.External,
      recursive: true,
    });
    emit('photo-updated', compressedDataUrl);
  } catch {
    alert('Failed to save image to gallery.');
  }
};
const stopCamera = () => {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach((track) => track.stop());
    videoStream.value = null;
  }
  videoActive.value = false;
};
const cancelCrop = () => {
  showCropModal.value = false;
};
onBeforeUnmount(() => {
  stopCamera();
});
</script>

<template>
  <!-- <q-page class="flex flex-center q-pa-md"> -->
  <div class="column items-center">
    <div class="column">
      <q-btn
        v-if="!videoActive"
        color="primary"
        label="Open-Camera"
        @click="openCamera"
        class="q-mb-md"
        rounded
      />
      <q-btn
        v-if="!videoActive"
        color="secondary"
        label="Select from Gallery"
        @click="selectFromGallery"
        rounded
      />
    </div>
    <q-btn
      v-if="videoActive && !loading"
      label="Capture Photo"
      color="secondary"
      @click="capturePhoto"
      class="q-mb-md"
    />
    <div
      v-if="videoActive && !loading && videoStream"
      class="camera-container"
      style="width: 100%; margin: 0 auto"
    >
      <video
        ref="videoElement"
        autoplay
        playsinline
        class="camera-feed"
        style="width: 100%; height: auto; display: block; border-radius: 12px"
      ></video>
    </div>
  </div>
  <q-dialog v-model="showCropModal" persistent full-width>
    <q-card class="column full-height">
      <q-card-section class="q-pb-none">
        <div class="text-h6">Crop & Save Image</div>
      </q-card-section>
      <q-card-section class="col flex flex-center cropper-container">
        <div v-if="cameraImage" class="cropper-image-wrapper">
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
  <!-- </q-page> -->
</template>
<style scoped></style>
