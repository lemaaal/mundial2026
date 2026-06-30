interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = 'No pudimos cargar los datos',
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-secondary/40 bg-secondary-tint p-5">
      <h3 className="text-text font-semibold mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-3">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-bg-card border border-border-soft px-3 py-1.5 text-sm hover:border-primary"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
