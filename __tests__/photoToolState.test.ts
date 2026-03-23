import {
  DEFAULT_CROP_BIAS_Y,
  getPhotoToolCategoryResetState,
  getPhotoToolPresetState,
} from "@/lib/photoToolState";

describe("photoToolState", () => {
  test("category reset state clears white background and date stamp controls", () => {
    const state = getPhotoToolCategoryResetState();
    expect(state.dateStampEnabled).toBe(false);
    expect(state.dateStamp).toBeUndefined();
    expect(state.cropBiasY).toBe(DEFAULT_CROP_BIAS_Y);
    expect(state.whiteBackgroundMode).toBe(false);
    expect(state.whiteBgError).toBeNull();
    expect(state.whiteBgDurationMs).toBeNull();
  });

  test("preset state enables date stamp only when required", () => {
    const requires = getPhotoToolPresetState(true);
    const notRequired = getPhotoToolPresetState(false);

    expect(requires.dateStampEnabled).toBe(true);
    expect(notRequired.dateStampEnabled).toBe(false);
    expect(requires.cropBiasY).toBe(DEFAULT_CROP_BIAS_Y);
    expect(notRequired.cropBiasY).toBe(DEFAULT_CROP_BIAS_Y);
    expect(requires.whiteBackgroundMode).toBe(false);
    expect(notRequired.whiteBackgroundMode).toBe(false);
  });
});
