"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Component, type ReactNode, type ErrorInfo } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

// Catches React render errors
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    posthog.capture("$exception", {
      $exception_message: error.message,
      $exception_stack: error.stack,
      $exception_component: info.componentStack,
      $exception_type: "react_error_boundary",
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
          <div>
            <p className="text-neutral-400 mb-4">Something went wrong.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-yellow-400 text-neutral-900 rounded font-medium"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      capture_performance: true,
      autocapture: true,
    });

    // Catches unhandled JS errors (outside React)
    const onError = (event: ErrorEvent) => {
      posthog.capture("$exception", {
        $exception_message: event.message,
        $exception_stack: event.error?.stack,
        $exception_source: `${event.filename}:${event.lineno}:${event.colno}`,
        $exception_type: "window_onerror",
      });
    };

    // Catches unhandled promise rejections
    const onRejection = (event: PromiseRejectionEvent) => {
      posthog.capture("$exception", {
        $exception_message: String(event.reason),
        $exception_stack: event.reason?.stack,
        $exception_type: "unhandled_rejection",
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </PHProvider>
  );
}
