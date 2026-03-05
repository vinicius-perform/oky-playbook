import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { Accordion } from './components/Accordion';
import { StartScreen } from './components/StartScreen';
import { appData } from './data';
import { generatePDF } from './utils/pdfExport';
import './App.css';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);

  // Meeting Metadata
  const [meetingMeta, setMeetingMeta] = useState({ clientName: '', date: '', responsible: '' });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [textValues, setTextValues] = useState<Record<string, string>>({});

  // Parse URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('meetingId');
    if (id) {
      setMeetingId(id);
      setIsStarted(true);

      const savedChecked = localStorage.getItem(`okr-checked-${id}`);
      const savedText = localStorage.getItem(`okr-text-${id}`);
      const savedMeta = localStorage.getItem(`okr-meta-${id}`);
      if (savedChecked) setCheckedItems(JSON.parse(savedChecked));
      if (savedText) setTextValues(JSON.parse(savedText));
      if (savedMeta) setMeetingMeta(JSON.parse(savedMeta));
    }
  }, []);

  // Save to local storage on change, scoped by meeting ID
  useEffect(() => {
    if (meetingId) {
      localStorage.setItem(`okr-checked-${meetingId}`, JSON.stringify(checkedItems));
      localStorage.setItem(`okr-text-${meetingId}`, JSON.stringify(textValues));
      localStorage.setItem(`okr-meta-${meetingId}`, JSON.stringify(meetingMeta));
    }
  }, [checkedItems, textValues, meetingMeta, meetingId]);

  const handleStart = (clientName: string, date: string, responsible: string) => {
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    setMeetingId(newId);
    setMeetingMeta({ clientName, date, responsible });
    setIsStarted(true);

    // Update URL without reloading
    const newUrl = `${window.location.pathname}?meetingId=${newId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleCheckItem = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: checked }));
  };

  const handleTextChange = (inputId: string, value: string) => {
    setTextValues(prev => ({ ...prev, [inputId]: value }));
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o progresso desta reunião?')) {
      setCheckedItems({});
      setTextValues({});
      if (meetingId) {
        localStorage.removeItem(`okr-checked-${meetingId}`);
        localStorage.removeItem(`okr-text-${meetingId}`);
        // Keep meta so they're not kicked out, just clearing data
      }
    }
  };

  const handleFinish = () => {
    if (Object.keys(checkedItems).length === 0 && Object.keys(textValues).length === 0) {
      alert("A reunião está vazia. Preencha os dados antes de finalizar.");
      return;
    }

    // Try Generate PDF and catch any errors so it doesn't crash silently
    try {
      generatePDF(meetingMeta, checkedItems, textValues);

      // Wait a small bit to ensure save dialogue completes before prompting reset
      setTimeout(() => {
        if (window.confirm('PDF gerado com sucesso! Deseja iniciar uma nova reunião limpa agora?')) {
          // Clear local storage for this meeting so we start fresh
          if (meetingId) {
            localStorage.removeItem(`okr-checked-${meetingId}`);
            localStorage.removeItem(`okr-text-${meetingId}`);
            localStorage.removeItem(`okr-meta-${meetingId}`);
          }
          // Reload without query params to go back to StartScreen
          window.location.href = window.location.pathname;
        }
      }, 500);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Ocorreu um erro ao gerar o PDF. Verifique o console.");
    }
  };

  // Calculate overall progress
  const totalItems = appData.sections.reduce((acc, section) => acc + section.items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalItems === 0 ? 0 : Math.round((checkedCount / totalItems) * 100);

  if (!isStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="app-container">
      <main className="main-content">
        <Header onReset={handleReset} />

        <div className="content-body">
          <ProgressBar progress={progress} />

          <div className="sections-container">
            {appData.sections.map((section, index) => (
              <Accordion
                key={section.id}
                id={section.id}
                index={index}
                title={section.title}
                items={section.items}
                requiresDiagnostic={section.requiresDiagnostic}
                diagnosticPrompt={section.diagnosticPrompt}
                requiresReason={section.requiresReason}
                checkedItems={checkedItems}
                onCheckItem={handleCheckItem}
                textValues={textValues}
                onTextChange={handleTextChange}
              />
            ))}
          </div>

          <div className="finish-container fade-in" style={{ animationDelay: '1s' }}>
            <button className="finish-meeting-button" onClick={handleFinish}>
              Finalizar Reunião e Exportar PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
