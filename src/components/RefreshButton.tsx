interface RefreshButtonProps {
  onRefresh: () => void;
  isFetching: boolean;
  lastUpdate?: string;
}

function formatLast(iso: string | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function RefreshButton({
  onRefresh,
  isFetching,
  lastUpdate,
}: RefreshButtonProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-text-muted">
      {lastUpdate && (
        <span className="hidden sm:inline">
          Actualizado {formatLast(lastUpdate)}
        </span>
      )}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="rounded-md bg-bg-card border border-border-soft px-3 py-1.5 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isFetching ? 'Actualizando…' : 'Actualizar'}
      </button>
    </div>
  );
}
