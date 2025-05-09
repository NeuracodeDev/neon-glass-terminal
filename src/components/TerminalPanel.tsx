
import React, { useState } from 'react';
import { Plus, X, Maximize2, Minimize2 } from 'lucide-react';
import TerminalTab from './TerminalTab';
import TerminalInstance from './TerminalInstance';

interface TerminalPanelProps {
  className?: string;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ className = '' }) => {
  const [terminals, setTerminals] = useState([
    { id: 1, title: 'Terminal 1', active: true }
  ]);
  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Add a new terminal tab
  const addTerminal = () => {
    const newTerminal = {
      id: nextId,
      title: `Terminal ${nextId}`,
      active: true
    };
    
    setTerminals(
      terminals.map(term => ({
        ...term,
        active: false
      })).concat(newTerminal)
    );
    
    setActiveId(nextId);
    setNextId(nextId + 1);
  };

  // Close a terminal tab
  const closeTerminal = (id: number) => {
    const terminalIndex = terminals.findIndex(t => t.id === id);
    
    if (terminals.length === 1) {
      // Don't close the last terminal
      return;
    }
    
    const newTerminals = terminals.filter(t => t.id !== id);
    
    // If the active terminal is being closed, activate another one
    if (id === activeId) {
      const newActiveIndex = Math.min(terminalIndex, newTerminals.length - 1);
      const newActiveId = newTerminals[newActiveIndex].id;
      
      setTerminals(
        newTerminals.map(term => ({
          ...term,
          active: term.id === newActiveId
        }))
      );
      
      setActiveId(newActiveId);
    } else {
      setTerminals(newTerminals);
    }
  };

  // Activate a terminal tab
  const activateTerminal = (id: number) => {
    setTerminals(
      terminals.map(term => ({
        ...term,
        active: term.id === id
      }))
    );
    
    setActiveId(id);
  };

  // Toggle minimize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isExpanded) setIsExpanded(false);
  };

  // Toggle expand state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isMinimized) setIsMinimized(false);
  };

  return (
    <div 
      className={`flex flex-col terminal-glass rounded-t-md shadow-lg overflow-hidden ${className} ${
        isExpanded ? 'fixed inset-4 z-50' : 
        isMinimized ? 'h-10' : 'h-80'
      }`}
    >
      {/* Terminal header with tabs */}
      <div className="flex items-center bg-terminal-background border-b border-terminal-border/40">
        {/* Tab list */}
        <div className="flex-grow flex items-center overflow-x-auto scrollbar-none">
          {terminals.map(terminal => (
            <TerminalTab
              key={terminal.id}
              title={terminal.title}
              active={terminal.id === activeId}
              onSelect={() => activateTerminal(terminal.id)}
              onClose={() => closeTerminal(terminal.id)}
            />
          ))}
          
          {/* New tab button */}
          <button 
            className="p-1.5 text-terminal-foreground/50 hover:text-terminal-foreground focus:outline-none"
            onClick={addTerminal}
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center px-2 space-x-2">
          {isMinimized ? (
            <button 
              className="p-1 text-terminal-foreground/70 hover:text-terminal-accent focus:outline-none"
              onClick={toggleMinimize}
              title="Expand"
            >
              <Maximize2 size={14} />
            </button>
          ) : (
            <button 
              className="p-1 text-terminal-foreground/70 hover:text-terminal-accent focus:outline-none"
              onClick={toggleMinimize}
              title="Minimize"
            >
              <Minimize2 size={14} />
            </button>
          )}
          
          {isExpanded ? (
            <button 
              className="p-1 text-terminal-foreground/70 hover:text-terminal-accent focus:outline-none"
              onClick={toggleExpand}
              title="Restore"
            >
              <Minimize2 size={14} />
            </button>
          ) : (
            <button 
              className="p-1 text-terminal-foreground/70 hover:text-terminal-accent focus:outline-none"
              onClick={toggleExpand}
              title="Maximize"
            >
              <Maximize2 size={14} />
            </button>
          )}
        </div>
      </div>
      
      {/* Terminal content area */}
      {!isMinimized && (
        <div className="flex-grow bg-terminal-background overflow-hidden">
          {terminals.map(terminal => (
            <TerminalInstance
              key={terminal.id}
              active={terminal.id === activeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TerminalPanel;
