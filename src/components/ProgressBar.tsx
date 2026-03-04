import './ProgressBar.css';

interface ProgressBarProps {
    progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="progress-container fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="progress-header">
                <span className="progress-label">Progresso geral</span>
                <span className="progress-value">{progress}%</span>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div
                    className="progress-fill"
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                />
            </div>
        </div>
    );
}
