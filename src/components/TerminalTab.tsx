
import React from 'react';
import { Terminal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalTabProps {
  title: string;
  active: boolean;
  onSelect: () => void;
  onClose: () => void;
}

const TerminalTab: React.FC<TerminalTabProps> = ({ 
  title, 
  active, 
  onSelect, 
  onClose 
}) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 border-r border-terminal-border cursor-pointer transition-colors",
        active 
          ? "bg-terminal-tab-active text-terminal-accent" 
          : "bg-terminal-tab-inactive text-terminal-foreground/70 hover:text-terminal-foreground"
      )}
      onClick={onSelect}
    >
      <Terminal size={14} className={active ? "text-terminal-accent" : "text-terminal-foreground/60"} />
      <span className="text-sm font-medium select-none">{title}</span>
      <button 
        className="ml-1 text-terminal-foreground/50 hover:text-terminal-foreground focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default TerminalTab;
