import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { summarizeArticle } from './utils/api';
import type { SummarizeResponse } from './types';

type Page = 'home' | 'about';

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [text, setText] = useState('');
  const [result, setResult] = useState<SummarizeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(article: string) {
    if (!article.trim()) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await summarizeArticle(article);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar currentPage={page} onNavigate={setPage} />
      <div className={page === 'home' ? '' : 'hidden'}>
        <HomePage text={text} setText={setText} result={result} isLoading={isLoading} error={error} onAnalyze={handleAnalyze} />
      </div>
      <div className={page === 'about' ? '' : 'hidden'}>
        <AboutPage />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}