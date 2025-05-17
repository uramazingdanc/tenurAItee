
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim() || disabled) return;
    
    onSend(input);
    setInput("");
  };
  
  return (
    <form onSubmit={handleSend} className="p-3 bg-white border-t">
      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask your AI coach..."
          className="flex-1 border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
          rows={1}
          disabled={disabled}
        />
        <Button 
          type="submit" 
          className="bg-brand-blue hover:bg-brand-blue-dark"
          disabled={disabled}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
