import { preparePhotoSourceImage } from "@/lib/photoSource";

describe("preparePhotoSourceImage", () => {
  test("returns original image when white background mode is off", async () => {
    const img = {} as HTMLImageElement;
    const makeWhiteBackgroundFn = jest.fn();

    const result = await preparePhotoSourceImage({
      image: img,
      whiteBackgroundMode: false,
      makeWhiteBackgroundFn,
    });

    expect(result.sourceImage).toBe(img);
    expect(result.whiteBgError).toBeNull();
    expect(result.whiteBgDurationMs).toBeNull();
    expect(makeWhiteBackgroundFn).not.toHaveBeenCalled();
  });

  test("uses processed image when white background succeeds", async () => {
    const img = { id: "source" } as unknown as HTMLImageElement;
    const processedImage = { id: "processed" } as unknown as HTMLImageElement;
    const makeWhiteBackgroundFn = jest.fn().mockResolvedValue({
      image: processedImage,
      durationMs: 1234,
    });

    const result = await preparePhotoSourceImage({
      image: img,
      whiteBackgroundMode: true,
      makeWhiteBackgroundFn,
    });

    expect(makeWhiteBackgroundFn).toHaveBeenCalledTimes(1);
    expect(result.sourceImage).toBe(processedImage);
    expect(result.whiteBgError).toBeNull();
    expect(result.whiteBgDurationMs).toBe(1234);
  });

  test("returns error and original image when white background fails", async () => {
    const img = {} as HTMLImageElement;
    const makeWhiteBackgroundFn = jest
      .fn()
      .mockRejectedValue(new Error("segmentation failed"));

    const result = await preparePhotoSourceImage({
      image: img,
      whiteBackgroundMode: true,
      makeWhiteBackgroundFn,
    });

    expect(result.sourceImage).toBe(img);
    expect(result.whiteBgError).toBe("segmentation failed");
    expect(result.whiteBgDurationMs).toBeNull();
  });
});
