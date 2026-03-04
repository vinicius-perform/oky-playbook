import { useState } from 'react';
import './StartScreen.css';

interface StartScreenProps {
    onStart: (clientName: string, date: string, responsible: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
    const [clientName, setClientName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [responsible, setResponsible] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (clientName && date && responsible) {
            onStart(clientName, date, responsible);
        } else {
            alert('Por favor, preencha todos os campos para iniciar a reunião.');
        }
    };

    return (
        <div className="start-screen fade-in">
            <div className="start-content">
                <div className="start-logo">FA</div>
                <h1 className="start-title">Reunião Estratégica</h1>
                <p className="start-subtitle">OKR Playbook</p>

                <form className="start-form" onSubmit={handleSubmit}>
                    <div className="start-input-group">
                        <label htmlFor="clientName">Nome do Cliente</label>
                        <input
                            id="clientName"
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Ex: Empresa X"
                            required
                        />
                    </div>

                    <div className="start-input-group">
                        <label htmlFor="date">Data da Reunião</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="start-input-group">
                        <label htmlFor="responsible">Responsável (FA)</label>
                        <input
                            id="responsible"
                            type="text"
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                            placeholder="Ex: João Silva"
                            required
                        />
                    </div>

                    <button type="submit" className="start-button">
                        Iniciar Reunião
                    </button>
                </form>
            </div>
        </div>
    );
}
