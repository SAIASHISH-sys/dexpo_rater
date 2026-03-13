// QR Scanner Configuration
export const QR_SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0,
  showTorchButtonIfSupported: true,
  defaultZoomValueIfSupported: 2,
  rememberLastUsedCamera: true,
  supportedScanTypes: ['IMAGE', 'CAMERA_STREAMING'],
};

export const QR_SCANNER_PERMISSIONS = {
  video: {
    facingMode: 'environment', // Use back camera on mobile
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};
