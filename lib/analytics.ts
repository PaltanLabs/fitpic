/** Centralized PostHog event tracking for FitPic tool usage funnel. */

type ToolName =
  | "photo_resizer"
  | "signature_resizer"
  | "photo_signature_joiner"
  | "background_remover"
  | "pdf_compressor"
  | "application_set"
  | "photo_validator"
  | "name_date_stamp";

interface UploadProps {
  tool: ToolName;
  file_type: string;
  file_size_kb: number;
  preset_id?: string;
  exam_name?: string;
}

interface ProcessProps {
  tool: ToolName;
  preset_id?: string;
  exam_name?: string;
  result_size_kb?: number;
  result_width?: number;
  result_height?: number;
  quality?: number;
  duration_ms?: number;
  validation_passed?: boolean;
}

interface DownloadProps {
  tool: ToolName;
  preset_id?: string;
  exam_name?: string;
  file_size_kb?: number;
}

function capture(event: string, props: Record<string, unknown>) {
  import("posthog-js").then((mod) => {
    if (mod.default.__loaded) {
      mod.default.capture(event, props);
    }
  }).catch(() => {});
}

export function trackUpload(props: UploadProps) {
  capture("file_uploaded", props as unknown as Record<string, unknown>);
}

export function trackProcessComplete(props: ProcessProps) {
  capture("process_complete", props as unknown as Record<string, unknown>);
}

export function trackDownload(props: DownloadProps) {
  capture("file_downloaded", props as unknown as Record<string, unknown>);
}

export function trackPresetSelected(props: {
  tool: ToolName;
  preset_id: string;
  exam_name: string;
  preset_type: string;
}) {
  capture("preset_selected", props as unknown as Record<string, unknown>);
}

export function trackProcessError(props: {
  tool: ToolName;
  error_message: string;
  preset_id?: string;
}) {
  capture("process_error", props as unknown as Record<string, unknown>);
}
