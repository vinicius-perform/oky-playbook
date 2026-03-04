import { RotateCcw } from 'lucide-react';
import { appData } from '../data';
import './Header.css';

interface HeaderProps {
    onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
    return (
        <header className="app-header fade-in">
            <div className="header-content">
                <div className="logo-title">
                    <div className="logo">FA</div>
                    <div className="title-group">
                        <h1>{appData.title}</h1>
                        <p>{appData.subtitle}</p>
                    </div>
                </div>
                <button className="reset-button" onClick={onReset} aria-label="Reset Progress">
                    <RotateCcw size={20} />
                </button>
            </div>
        </header>
    );
}
