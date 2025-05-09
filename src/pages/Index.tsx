
import React from 'react';
import TerminalPanel from '../components/TerminalPanel';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] to-[#020617] p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-terminal-accent">Neon</span> Terminal IDE
        </h1>
        <p className="text-gray-400 text-sm">
          Modern command-line interface with dark blue neon glass aesthetic
        </p>
      </header>
      
      <main className="flex-grow flex flex-col">
        <div className="flex-grow flex flex-col mb-4 rounded-lg terminal-glass p-4">
          <h2 className="text-lg font-semibold text-terminal-foreground mb-2">
            Project Explorer
          </h2>
          <div className="text-sm text-terminal-foreground/70">
            <p>This is a placeholder for the IDE's file explorer panel.</p>
            <p className="mt-2">The terminal panel below is fully functional:</p>
            <ul className="list-disc ml-6 mt-1 space-y-1">
              <li>Try typing commands like <code className="text-terminal-accent">help</code>, <code className="text-terminal-accent">ls</code>, or <code className="text-terminal-accent">pwd</code></li>
              <li>Press <code className="text-terminal-accent">Ctrl+C</code> to interrupt</li>
              <li>Press <code className="text-terminal-accent">Ctrl+L</code> or type <code className="text-terminal-accent">clear</code> to clear the screen</li>
              <li>Use up/down arrows to navigate command history</li>
              <li>Create multiple tabs with the + button</li>
              <li>Try the minimize/maximize buttons</li>
            </ul>
          </div>
        </div>
        
        <TerminalPanel className="animate-terminal-glow" />
      </main>
    </div>
  );
};

export default Index;
