export const DEFAULT_CROP_BIAS_Y = 0.2;

export interface PhotoToolStateReset {
  dateStampEnabled: boolean;
  dateStamp: undefined;
  cropBiasY: number;
  whiteBackgroundMode: boolean;
  whiteBgError: null;
  whiteBgDurationMs: null;
}

export function getPhotoToolCategoryResetState(): PhotoToolStateReset {
  return {
    dateStampEnabled: false,
    dateStamp: undefined,
    cropBiasY: DEFAULT_CROP_BIAS_Y,
    whiteBackgroundMode: false,
    whiteBgError: null,
    whiteBgDurationMs: null,
  };
}

export function getPhotoToolPresetState(requiresDateStamp: boolean): PhotoToolStateReset {
  return {
    dateStampEnabled: requiresDateStamp,
    dateStamp: undefined,
    cropBiasY: DEFAULT_CROP_BIAS_Y,
    whiteBackgroundMode: false,
    whiteBgError: null,
    whiteBgDurationMs: null,
  };
}
