/**
 * Parses a message and splits it into text and code blocks
 * @param {string} message - The message to parse
 * @returns {Array} - Array of message parts with type and content
 */
export function parseMessageContent(message) {
  if (!message) return [];
  
  // Regex to match code blocks with optional language specification
  // ```language
  // code
  // ```
  const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // Find all code blocks
  while ((match = codeBlockRegex.exec(message)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: message.substring(lastIndex, match.index)
      });
    }
    
    // Add code block
    parts.push({
      type: 'code',
      language: match[1] || 'javascript', // Default to javascript if no language specified
      content: match[2].trim()
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after last code block
  if (lastIndex < message.length) {
    parts.push({
      type: 'text',
      content: message.substring(lastIndex)
    });
  }
  
  // If no code blocks were found, return the entire message as text
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: message
    });
  }
  
  return parts;
} 