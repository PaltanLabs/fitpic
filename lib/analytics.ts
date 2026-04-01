import posthog from "posthog-js";

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

export function trackUpload(props: UploadProps) {
  posthog.capture("file_uploaded", props);
}

export function trackProcessComplete(props: ProcessProps) {
  posthog.capture("process_complete", props);
}

export function trackDownload(props: DownloadProps) {
  posthog.capture("file_downloaded", props);
}

export function trackPresetSelected(props: {
  tool: ToolName;
  preset_id: string;
  exam_name: string;
  preset_type: string;
}) {
  posthog.capture("preset_selected", props);
}

export function trackProcessError(props: {
  tool: ToolName;
  error_message: string;
  preset_id?: string;
}) {
  posthog.capture("process_error", props);
}
