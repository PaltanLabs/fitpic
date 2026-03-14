export interface WhiteBackgroundResult {
  image: HTMLImageElement;
  durationMs: number;
}

export interface PreparedPhotoSource {
  sourceImage: HTMLImageElement;
  whiteBgError: string | null;
  whiteBgDurationMs: number | null;
}

interface PreparePhotoSourceArgs {
  image: HTMLImageElement;
  whiteBackgroundMode: boolean;
  makeWhiteBackgroundFn: (img: HTMLImageElement) => Promise<WhiteBackgroundResult>;
}

export async function preparePhotoSourceImage({
  image,
  whiteBackgroundMode,
  makeWhiteBackgroundFn,
}: PreparePhotoSourceArgs): Promise<PreparedPhotoSource> {
  if (!whiteBackgroundMode) {
    return {
      sourceImage: image,
      whiteBgError: null,
      whiteBgDurationMs: null,
    };
  }

  try {
    const processed = await makeWhiteBackgroundFn(image);
    return {
      sourceImage: processed.image,
      whiteBgError: null,
      whiteBgDurationMs: processed.durationMs,
    };
  } catch (err) {
    return {
      sourceImage: image,
      whiteBgError:
        err instanceof Error
          ? err.message
          : "White background conversion failed. Try a clearer headshot with better lighting.",
      whiteBgDurationMs: null,
    };
  }
}
