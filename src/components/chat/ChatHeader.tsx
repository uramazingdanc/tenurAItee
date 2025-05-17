
import { motion } from "@/components/ui/motion";

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="bg-brand-blue text-white p-3 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3C16.9706 3 21 6.80558 21 11.5C21 16.1944 16.9706 20 12 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 3C7.02944 3 3 6.80558 3 11.5C3 12.93 3.51314 14.6699 4.39448 16.0837L3 20L7.25464 18.7917C8.6395 19.5575 10.2686 20 12 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 8.5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7.5 15.5H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-sm">AI Coach</h3>
          <p className="text-xs opacity-80">Here to help with your training</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white"
        aria-label="Close chat"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default ChatHeader;
