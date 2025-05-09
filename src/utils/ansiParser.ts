
// Basic ANSI escape sequence constants
export const ANSI_RESET = '\u001b[0m';
export const ANSI_BOLD = '\u001b[1m';
export const ANSI_DIM = '\u001b[2m';
export const ANSI_ITALIC = '\u001b[3m';
export const ANSI_UNDERLINE = '\u001b[4m';

// Foreground colors
export const ANSI_BLACK = '\u001b[30m';
export const ANSI_RED = '\u001b[31m';
export const ANSI_GREEN = '\u001b[32m';
export const ANSI_YELLOW = '\u001b[33m';
export const ANSI_BLUE = '\u001b[34m';
export const ANSI_MAGENTA = '\u001b[35m';
export const ANSI_CYAN = '\u001b[36m';
export const ANSI_WHITE = '\u001b[37m';

// Background colors
export const ANSI_BG_BLACK = '\u001b[40m';
export const ANSI_BG_RED = '\u001b[41m';
export const ANSI_BG_GREEN = '\u001b[42m';
export const ANSI_BG_YELLOW = '\u001b[43m';
export const ANSI_BG_BLUE = '\u001b[44m';
export const ANSI_BG_MAGENTA = '\u001b[45m';
export const ANSI_BG_CYAN = '\u001b[46m';
export const ANSI_BG_WHITE = '\u001b[47m';

// Interface for tokenized ANSI text
export interface AnsiToken {
  text: string;
  bold?: boolean;
  italic?: boolean;
  dim?: boolean;
  underline?: boolean;
  foreground?: string;
  background?: string;
}

// Color mapping (ANSI -> CSS)
const colorMap: Record<string, string> = {
  '30': '#000000', // Black
  '31': '#ff0000', // Red
  '32': '#00ff00', // Green
  '33': '#ffff00', // Yellow
  '34': '#0088ff', // Blue (brightened for visibility)
  '35': '#ff00ff', // Magenta
  '36': '#00ffff', // Cyan
  '37': '#ffffff', // White
  '90': '#888888', // Bright Black
  '91': '#ff8888', // Bright Red
  '92': '#88ff88', // Bright Green
  '93': '#ffff88', // Bright Yellow
  '94': '#88aaff', // Bright Blue
  '95': '#ff88ff', // Bright Magenta
  '96': '#88ffff', // Bright Cyan
  '97': '#ffffff', // Bright White
};

/**
 * Parse ANSI escape sequences in text
 * @param text Text with ANSI escape sequences
 * @returns Array of tokens with styling information
 */
export function parseAnsi(text: string): AnsiToken[] {
  // This is a simplified parser for demonstration
  // A production parser would need to be more robust
  
  const tokens: AnsiToken[] = [];
  let currentToken: AnsiToken = { text: '' };
  let position = 0;
  
  while (position < text.length) {
    // Check for escape sequence
    if (text[position] === '\u001b' && text[position + 1] === '[') {
      // If current token has text, push it to tokens array
      if (currentToken.text) {
        tokens.push({ ...currentToken });
        currentToken.text = '';
      }
      
      // Find the end of the escape sequence
      let end = text.indexOf('m', position);
      if (end === -1) {
        // No end of sequence found, treat as normal text
        currentToken.text += text[position];
        position++;
        continue;
      }
      
      // Extract the sequence code
      const code = text.substring(position + 2, end);
      position = end + 1;
      
      // Handle the escape code
      if (code === '0') {
        // Reset all formatting
        currentToken = { text: '' };
      } else if (code === '1') {
        // Bold
        currentToken.bold = true;
      } else if (code === '2') {
        // Dim
        currentToken.dim = true;
      } else if (code === '3') {
        // Italic
        currentToken.italic = true;
      } else if (code === '4') {
        // Underline
        currentToken.underline = true;
      } else if (colorMap[code]) {
        // Foreground color
        currentToken.foreground = colorMap[code];
      } else if (code.startsWith('4') && colorMap[code.substring(1)]) {
        // Background color (40-47, 100-107)
        currentToken.background = colorMap[code.substring(1)];
      }
      // Note: We're omitting many other ANSI codes for simplicity
      
    } else {
      // Normal text character
      currentToken.text += text[position];
      position++;
    }
  }
  
  // Push any remaining token
  if (currentToken.text) {
    tokens.push(currentToken);
  }
  
  return tokens;
}

/**
 * Create a mock command response with ANSI formatting
 */
export function createMockResponse(command: string): string {
  // This function generates sample responses with ANSI formatting
  // for demonstration purposes
  
  if (command.includes('help')) {
    return [
      `${ANSI_BOLD}${ANSI_GREEN}Available Commands:${ANSI_RESET}`,
      `${ANSI_YELLOW}help${ANSI_RESET}       - Display this help message`,
      `${ANSI_YELLOW}clear${ANSI_RESET}      - Clear the terminal screen`,
      `${ANSI_YELLOW}ls${ANSI_RESET}         - List files in current directory`,
      `${ANSI_YELLOW}pwd${ANSI_RESET}        - Print working directory`,
      `${ANSI_YELLOW}echo${ANSI_RESET}       - Echo a message back`,
    ].join('\n');
  }
  
  if (command.includes('ls')) {
    return [
      `${ANSI_BOLD}${ANSI_BLUE}src${ANSI_RESET}          ${ANSI_DIM}Directory${ANSI_RESET}`,
      `${ANSI_BOLD}${ANSI_BLUE}public${ANSI_RESET}       ${ANSI_DIM}Directory${ANSI_RESET}`,
      `${ANSI_GREEN}package.json${ANSI_RESET}  ${ANSI_DIM}File${ANSI_RESET}`,
      `${ANSI_GREEN}tsconfig.json${ANSI_RESET} ${ANSI_DIM}File${ANSI_RESET}`,
      `${ANSI_GREEN}README.md${ANSI_RESET}     ${ANSI_DIM}File${ANSI_RESET}`,
    ].join('\n');
  }
  
  if (command.includes('pwd')) {
    return `${ANSI_GREEN}/home/user/project${ANSI_RESET}`;
  }
  
  if (command.startsWith('echo ')) {
    const message = command.substring(5);
    return message;
  }
  
  // Default response
  return `${ANSI_YELLOW}Command not recognized: ${ANSI_RED}${command}${ANSI_RESET}\n${ANSI_DIM}Type 'help' for available commands.${ANSI_RESET}`;
}
