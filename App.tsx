
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { SummaryView } from './components/SummaryView';
import { QuizView } from './components/QuizView';
import { FlashcardView } from './components/FlashcardView';
import { Loader } from './components/Loader';
import { Icon } from './components/Icon';
import { generateSummary, generateQuiz, generateFlashcards } from './services/geminiService';
import type { QuizQuestion, Flashcard } from './types';
import { Github } from 'lucide-react';

type ActiveTab = 'summary' | 'quiz' | 'flashcards';

const App: React.FC = () => {
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const [summary, setSummary] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  
  const [isLoading, setIsLoading] = useState({
    summary: false,
    quiz: false,
    flashcards: false,
  });
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');

  const resetState = () => {
    setOriginalContent(null);
    setFileName('');
    setSummary(null);
    setQuiz(null);
    setFlashcards(null);
    setError(null);
    setActiveTab('summary');
  };

  const handleFileProcess = useCallback(async (content: string, name: string) => {
    resetState();
    setOriginalContent(content);
    setFileName(name);
    setError(null);
    
    setIsLoading(prev => ({ ...prev, summary: true }));
    try {
      const generatedSummary = await generateSummary(content);
      setSummary(generatedSummary);
    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, summary: false }));
    }
  }, []);

  const fetchQuiz = async () => {
    if (!originalContent || quiz) return;
    setIsLoading(prev => ({ ...prev, quiz: true }));
    setError(null);
    try {
      const generatedQuiz = await generateQuiz(originalContent);
      setQuiz(generatedQuiz);
    } catch (e) {
      console.error(e);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, quiz: false }));
    }
  };

  const fetchFlashcards = async () => {
    if (!originalContent || flashcards) return;
    setIsLoading(prev => ({ ...prev, flashcards: true }));
    setError(null);
    try {
      const generatedFlashcards = await generateFlashcards(originalContent);
      setFlashcards(generatedFlashcards);
    } catch (e) {
      console.error(e);
      setError('Failed to generate flashcards. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, flashcards: false }));
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'quiz' && !quiz) {
      fetchQuiz();
    } else if (tab === 'flashcards' && !flashcards) {
      fetchFlashcards();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Smart Study Companion
          </h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your notes, get instant summaries, quizzes, and flashcards powered by AI.
          </p>
        </header>

        {!originalContent && <FileUpload onFileProcess={handleFileProcess} />}

        {originalContent && (
          <div className="space-y-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Icon name="document" className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-slate-700">{fileName}</span>
              </div>
              <button
                onClick={resetState}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Upload New File
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">An Error Occurred</p>
                <p>{error}</p>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <nav className="border-b border-slate-200">
                <div className="flex space-x-1 sm:space-x-2 p-2 bg-slate-50">
                  {(['summary', 'quiz', 'flashcards'] as ActiveTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`px-4 py-2.5 text-sm sm:text-base font-semibold rounded-md transition-all duration-200 ease-in-out w-full flex items-center justify-center space-x-2 ${
                        activeTab === tab 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon name={tab} className="w-5 h-5" />
                      <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </nav>

              <div className="p-6">
                {activeTab === 'summary' && (
                  isLoading.summary ? <Loader text="Generating your summary..." /> : <SummaryView summary={summary} />
                )}
                {activeTab === 'quiz' && (
                  isLoading.quiz ? <Loader text="Building your quiz..." /> : <QuizView questions={quiz} />
                )}
                {activeTab === 'flashcards' && (
                  isLoading.flashcards ? <Loader text="Creating your flashcards..." /> : <FlashcardView flashcards={flashcards} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center mt-12 text-slate-500 text-sm">
  <p className="flex justify-center items-center">
    <a
      href="https://github.com/msameer-ninja"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
    >
      <span>Powered by</span>
      <Github className="w-5 h-5" />
      <span>Sameer Khan</span>
    </a>
  </p>
</footer>
    </div>
  );
};

export default App;
