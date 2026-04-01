"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState, Component, type ReactNode, type ErrorInfo } from "react";
import type { PostHog } from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

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
    import("posthog-js").then((mod) => {
      mod.default.capture("$exception", {
        $exception_message: error.message,
        $exception_stack: error.stack,
        $exception_component: info.componentStack,
        $exception_type: "react_error_boundary",
      });
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
  const [client, setClient] = useState<PostHog | null>(null);

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    import("posthog-js").then((mod) => {
      const posthog = mod.default;
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        capture_performance: true,
        autocapture: true,
      });
      setClient(posthog);
    });

    const onError = (event: ErrorEvent) => {
      import("posthog-js").then((mod) => {
        mod.default.capture("$exception", {
          $exception_message: event.message,
          $exception_stack: event.error?.stack,
          $exception_source: `${event.filename}:${event.lineno}:${event.colno}`,
          $exception_type: "window_onerror",
        });
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      import("posthog-js").then((mod) => {
        mod.default.capture("$exception", {
          $exception_message: String(event.reason),
          $exception_stack: event.reason?.stack,
          $exception_type: "unhandled_rejection",
        });
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (!POSTHOG_KEY) return <ErrorBoundary>{children}</ErrorBoundary>;

  return client ? (
    <PHProvider client={client}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </PHProvider>
  ) : (
    <ErrorBoundary>{children}</ErrorBoundary>
  );
}
