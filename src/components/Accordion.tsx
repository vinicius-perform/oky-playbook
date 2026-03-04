import { useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './Accordion.css';

interface AccordionProps {
    id: string;
    index: number;
    title: string;
    items: string[];
    requiresDiagnostic?: boolean;
    diagnosticPrompt?: string;
    requiresReason?: boolean;

    // State from parent
    checkedItems: Record<string, boolean>;
    onCheckItem: (itemId: string, checked: boolean) => void;

    textValues: Record<string, string>;
    onTextChange: (inputId: string, value: string) => void;
}

export function Accordion({
    id,
    index,
    title,
    items,
    requiresDiagnostic,
    diagnosticPrompt,
    requiresReason,
    checkedItems,
    onCheckItem,
    textValues,
    onTextChange
}: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Calculate completed items for this section
    const totalItems = items.length;
    // If there are no items, we might just be relying on the diagnostic text? 
    // Based on Notion/Lovable, sections without items still have the diagnostic box.
    // We'll count the completion of items.
    const completedItems = items.filter(item => checkedItems[`${id}-${item}`]).length;

    const formattedIndex = (index + 1).toString().padStart(2, '0');

    return (
        <div className="accordion fade-in" style={{ animationDelay: `${(index + 2) * 0.1}s` }}>
            <button
                className="accordion-header"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="accordion-header-left">
                    <span className="accordion-number">{formattedIndex}</span>
                    <div className="accordion-title-group">
                        <h2 className="accordion-title">{title}</h2>
                        <span className="accordion-subtitle">{completedItems}/{totalItems} itens</span>
                    </div>
                </div>
                <div className={`accordion-icon ${isOpen ? 'open' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            <div
                className="accordion-content-wrapper"
                style={{
                    maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
                    opacity: isOpen ? 1 : 0
                }}
            >
                <div className="accordion-content" ref={contentRef}>
                    {items.length > 0 && (
                        <div className="checklist-items">
                            {items.map((item, i) => {
                                const itemId = `${id}-${item}`;
                                const isChecked = checkedItems[itemId] || false;

                                return (
                                    <label
                                        key={i}
                                        className={`checklist-item ${isChecked ? 'checked' : ''}`}
                                    >
                                        <div className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={isChecked}
                                                onChange={(e) => onCheckItem(itemId, e.target.checked)}
                                            />
                                            <div className="custom-checkbox">
                                                {isChecked && <Check size={14} strokeWidth={3} />}
                                            </div>
                                        </div>
                                        <span className="item-text">{item}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {(requiresReason || requiresDiagnostic) && (
                        <div className="diagnostic-section">
                            {requiresReason && (
                                <div className="input-group">
                                    <label htmlFor={`reason-${id}`}>Motivo:</label>
                                    <textarea
                                        id={`reason-${id}`}
                                        placeholder="Digite o motivo..."
                                        value={textValues[`reason-${id}`] || ''}
                                        onChange={(e) => onTextChange(`reason-${id}`, e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            )}

                            {requiresDiagnostic && (
                                <div className="input-group highlight-group">
                                    <label htmlFor={`diag-${id}`}>Saída Obrigatória:</label>
                                    <textarea
                                        id={`diag-${id}`}
                                        placeholder={diagnosticPrompt}
                                        value={textValues[`diag-${id}`] || ''}
                                        onChange={(e) => onTextChange(`diag-${id}`, e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
