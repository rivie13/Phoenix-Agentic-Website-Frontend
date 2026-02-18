import { type ReactNode } from "react";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return <div className="notice">{label}</div>;
}

interface ErrorStateProps {
  message: string;
  actions?: ReactNode;
}

export function ErrorState({ message, actions }: ErrorStateProps) {
  return (
    <div className="notice error">
      <p>{message}</p>
      {actions ? <div className="button-row">{actions}</div> : null}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="notice">
      <p className="value">{title}</p>
      <p>{description}</p>
    </div>
  );
}
