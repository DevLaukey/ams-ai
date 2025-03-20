// 'use client';

// // File: /workspaces/medical_supplies/component/Chat/Chat.tsx
// import React, { useState, useRef } from 'react';
// import {
//   Send,
//   Upload,
//   Paperclip,
//   Camera,
// } from 'lucide-react';

// interface ChatMessage {
//   role: 'user' | 'assistant';
//   text: string;
// }

// interface ChatProps {
//   onFileUpload?: (files: FileList) => void;
// }

// export default function Chat({ onFileUpload }: ChatProps) {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [message, setMessage] = useState('');
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const photoInputRef = useRef<HTMLInputElement>(null);

//   const handleSend = () => {
//     const trimmed = message.trim();
//     if (!trimmed) return;
//     setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
//     setMessage('');

//     setTimeout(() => {
//       setMessages((prev) => [...prev, {
//         role: 'assistant',
//         text: generateAIResponse(trimmed),
//       }]);
//     }, 600);
//   };

//   const generateAIResponse = (userText: string) => {
//     if (userText.toLowerCase() === 'hi') {
//       return 'Hello! How can I help you today?';
//     }
//     return `Simulated AI says: I heard you say "${userText}".`;
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const filesArray = Array.from(e.target.files);
//       setUploadedFiles(prev => [...prev, ...filesArray]);
//       onFileUpload?.(e.target.files);
//       // Reset the input value to allow selecting the same file again
//       e.target.value = '';
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col">
//       {/* Messages Display */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg, idx) => (
//           <div key={idx} className="mb-4">
//             <div className={msg.role === 'user' ? "text-white" : "text-blue-400"}>
//               <strong>{msg.role === 'user' ? 'You:' : 'Assistant:'}</strong> {msg.text}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* File Preview */}
//       {uploadedFiles.length > 0 && (
//         <div className="p-4 border-t border-gray-700">
//           <h4 className="text-sm text-gray-300 mb-2">Uploaded Files:</h4>
//           <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
//             {uploadedFiles.map((file, index) => {
//               const isImage = file.type.startsWith('image/');
//               const fileURL = URL.createObjectURL(file);
//               return (
//                 <div key={index} className="border border-gray-700 p-2 rounded-lg flex flex-col items-center">
//                   {isImage ? (
//                     <img src={fileURL} alt={file.name} className="max-h-32 object-cover mb-1 rounded" />
//                   ) : (
//                     <div className="text-xs text-gray-300 break-all">{file.name}</div>
//                   )}
//                   <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Input Area */}
//       <div className="p-4 border-t border-gray-700">
//         <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
//             placeholder="Ask about medical supplies."
//             className="flex-1 bg-transparent focus:outline-none placeholder-gray-400"
//           />

//           {/* Hidden File Inputs */}
//           <input
//             ref={fileInputRef}
//             type="file"
//             onChange={handleFileChange}
//             className="hidden"
//             multiple
//             accept="*/*"
//           />
//           <input
//             ref={photoInputRef}
//             type="file"
//             onChange={handleFileChange}
//             className="hidden"
//             accept="image/*"
//             capture="user"
//           />

//           {/* Upload Button with Dropdown */}
//           <div className="relative group">
//             <button
//               type="button"
//               className="p-2 text-gray-300 hover:text-white focus:outline-none rounded-lg"
//               aria-label="Upload files"
//             >
//               <Upload className="w-5 h-5" />
//             </button>

//             {/* Dropdown Menu */}
//             <div
//               className="absolute right-0 bottom-full mb-2 translate-y-2 opacity-0 invisible
//                          group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible
//                          transition-all duration-200 ease-out z-50"
//             >
//               <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
//                 >
//                   <Paperclip className="w-4 h-4" />
//                   Choose Files
//                 </button>
//                 <button
//                   onClick={() => photoInputRef.current?.click()}
//                   className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
//                 >
//                   <Camera className="w-4 h-4" />
//                   Take Photo
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Send Button */}
//           <button
//             onClick={handleSend}
//             className="p-2 text-gray-300 hover:text-white focus:outline-none ml-1"
//             aria-label="Send message"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

// File: /workspaces/medical_supplies/component/Chat/Chat.tsx
import React, { useState, useRef } from "react";
import { Send, Upload, Paperclip, Camera } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatProps {
  onFileUpload?: (files: FileList) => void;
}

export default function Chat({ onFileUpload }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [hoverUpload, setHoverUpload] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  console.log("uploadedFiles", uploadedFiles);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: generateAIResponse(trimmed),
        },
      ]);
    }, 600);
  };

  const generateAIResponse = (userText: string) => {
    if (userText.toLowerCase() === "hi") {
      return "Hello! How can I help you today?";
    }
    return `Simulated AI says: I heard you say "${userText}".`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...filesArray]);
      onFileUpload?.(e.target.files);
      // Reset the input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-4">
            <div
              className={msg.role === "user" ? "text-white" : "text-blue-400"}
            >
              <strong>{msg.role === "user" ? "You:" : "Assistant:"}</strong>{" "}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about medical supplies."
            className="flex-1 bg-transparent focus:outline-none placeholder-gray-400"
          />

          {/* Upload Button with Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="p-2 text-gray-300 hover:text-white focus:outline-none rounded-lg"
              aria-label="Upload files"
              onMouseEnter={() => setHoverUpload(true)}
              onMouseLeave={() => setHoverUpload(false)}
            >
              <Upload className="w-5 h-5" />
            </button>

            {/* Hidden File Inputs - Placed at the bottom of the DOM */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="*/*"
            />
            <input
              ref={photoInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              capture="user"
            />

            {/* Dropdown Menu */}
            {hoverUpload && (
              <div className="absolute right-0 bottom-full mb-2 z-50">
                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <Paperclip className="w-4 h-4" />
                    Choose Files
                  </button>
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="p-2 text-gray-300 hover:text-white focus:outline-none ml-1"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
