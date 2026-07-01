import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TabsNav } from './components/TabsNav';
import { ClasificacionPage } from './pages/Clasificacion';
import { BracketPage } from './pages/Bracket';
import { PrediccionPage } from './pages/Prediccion';
import { CuadrosPage } from './pages/Cuadros';
import { CuadroDetailPage } from './pages/CuadroDetail';
import { PartidosPage } from './pages/Partidos';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});

const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={ROUTER_BASE}>
        <div className="min-h-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="relative inline-flex items-center justify-center w-11 h-11 rounded-lg overflow-hidden shadow-sm"
                style={{
                  background:
                    'linear-gradient(135deg, #1B3A6F 0%, #1B3A6F 33%, #C8102E 33%, #C8102E 66%, #006847 66%, #006847 100%)',
                }}
              >
                <span className="text-white text-lg font-bold drop-shadow">
                  ⚽
                </span>
              </span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-text leading-none">
                  Quiniela Mundial 2026
                </h1>
                <p className="text-xs text-text-muted mt-1">
                  8 amigos, 1 bracket, todo el Mundial.
                </p>
              </div>
            </div>
          </header>
          <TabsNav />
          <main className="mt-6">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<ClasificacionPage />} />
                <Route path="/bracket" element={<BracketPage />} />
                <Route path="/partidos" element={<PartidosPage />} />
                <Route path="/prediccion" element={<PrediccionPage />} />
                <Route path="/cuadros" element={<CuadrosPage />} />
                <Route
                  path="/cuadros/:name"
                  element={<CuadroDetailPage />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <footer className="text-center text-xs text-text-muted mt-12 pb-4">
            Datos de{' '}
            <a
              className="underline hover:text-primary"
              href="https://github.com/openfootball/worldcup.json"
              target="_blank"
              rel="noreferrer"
            >
              openfootball/worldcup.json
            </a>{' '}
            · cache 5 min
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
