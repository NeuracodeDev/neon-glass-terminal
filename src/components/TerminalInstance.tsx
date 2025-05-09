
import React, { useState, useRef, useEffect } from 'react';

interface AnsiToken {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  foreground?: string;
  background?: string;
}

interface TerminalInstanceProps {
  active: boolean;
}

// Simple ANSI escape code parser
const parseAnsiText = (text: string): AnsiToken[] => {
  // This is a simplified parser for demo purposes
  // A real implementation would handle more ANSI codes
  
  const tokens: AnsiToken[] = [];
  const defaultToken: AnsiToken = { text: '' };
  let currentToken = { ...defaultToken };
  
  // Add the text as a basic token for now
  // A full implementation would parse ANSI codes
  currentToken.text = text.replace(/\u001b\[\d+m/g, '');
  tokens.push(currentToken);
  
  return tokens;
};

const TerminalInstance: React.FC<TerminalInstanceProps> = ({ active }) => {
  const [history, setHistory] = useState<string[]>([
    'Welcome to the terminal',
    'Type commands below...',
    '$ _'
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Handle terminal focus
  useEffect(() => {
    if (active && inputRef.current) {
      inputRef.current.focus();
    }
  }, [active]);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Simulate running a command
  const executeCommand = (command: string) => {
    // Add command to history
    setHistory(prev => [...prev.slice(0, -1), `$ ${command}`, '$ _']);
    
    // Store in command history if not empty
    if (command.trim()) {
      setCommandHistory(prev => [command, ...prev]);
      setHistoryIndex(-1);
    }
    
    // Here you would normally send the command to your backend system
    // For now, we'll just simulate some basic commands
    if (command.trim() === 'clear' || command.trim() === 'cls') {
      setTimeout(() => {
        setHistory(['$ _']);
      }, 100);
    } else if (command.trim()) {
      // Simulate command output
      setTimeout(() => {
        setHistory(prev => {
          // Remove the trailing prompt
          const withoutPrompt = prev.slice(0, -1);
          return [
            ...withoutPrompt,
            `Command executed: ${command}`,
            // Add a new prompt line
            '$ _'
          ];
        });
      }, 300);
    }
    
    setCurrentInput('');
    setCursorPosition(0);
  };

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        executeCommand(currentInput);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
          setHistoryIndex(newIndex);
          const command = commandHistory[newIndex];
          setCurrentInput(command);
          setCursorPosition(command.length);
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const command = commandHistory[newIndex];
          setCurrentInput(command);
          setCursorPosition(command.length);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentInput('');
          setCursorPosition(0);
        }
        break;
        
      case 'ArrowLeft':
        if (cursorPosition > 0) {
          setCursorPosition(cursorPosition - 1);
        }
        break;
        
      case 'ArrowRight':
        if (cursorPosition < currentInput.length) {
          setCursorPosition(cursorPosition + 1);
        }
        break;
        
      case 'Home':
        e.preventDefault();
        setCursorPosition(0);
        break;
        
      case 'End':
        e.preventDefault();
        setCursorPosition(currentInput.length);
        break;
        
      case 'c':
        // Handle Ctrl+C
        if (e.ctrlKey) {
          e.preventDefault();
          setHistory(prev => [...prev.slice(0, -1), '^C', '$ _']);
          setCurrentInput('');
          setCursorPosition(0);
        }
        break;
        
      case 'l':
        // Handle Ctrl+L (clear screen)
        if (e.ctrlKey) {
          e.preventDefault();
          setHistory(['$ _']);
          setCurrentInput('');
          setCursorPosition(0);
        }
        break;
    }
  };

  // Handle text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  // Handle terminal click to focus input
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Render terminal output lines
  const renderOutputLine = (line: string, index: number) => {
    // Check if this is the last line (current prompt)
    const isPrompt = index === history.length - 1 && line.endsWith('_');
    
    // If it's the prompt line, render it without the underscore,
    // which will be handled by the cursor
    let displayText = isPrompt ? line.slice(0, -1) : line;
    
    // Parse ANSI escape codes
    const tokens = parseAnsiText(displayText);
    
    return (
      <div key={index} className="whitespace-pre-wrap break-all terminal-text-selection">
        {tokens.map((token, tokenIndex) => (
          <span
            key={tokenIndex}
            style={{
              fontWeight: token.bold ? 'bold' : 'normal',
              fontStyle: token.italic ? 'italic' : 'normal',
              textDecoration: token.underline ? 'underline' : 'none',
              color: token.foreground || 'inherit',
              backgroundColor: token.background || 'transparent',
            }}
          >
            {token.text}
          </span>
        ))}
        
        {isPrompt && (
          <>
            <span>{currentInput.substring(0, cursorPosition)}</span>
            <span className="inline-block w-2 h-5 bg-terminal-cursor animate-blink" />
            <span>{currentInput.substring(cursorPosition)}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`w-full h-full flex flex-col ${active ? '' : 'hidden'}`} 
      onClick={handleTerminalClick}
    >
      {/* Hidden input to capture keyboard events */}
      <input
        ref={inputRef}
        type="text"
        className="sr-only"
        value={currentInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
      
      {/* Terminal output area */}
      <div 
        ref={terminalRef}
        className="flex-grow overflow-y-auto p-3 font-mono text-sm terminal-scrollbar terminal-text-selection"
      >
        {history.map(renderOutputLine)}
      </div>
    </div>
  );
};

export default TerminalInstance;
