"use client";

import { useState, useRef, useEffect } from "react";
import { LifeBuoy, Mail, MessageSquare, Plus, Minus, X, Send, User } from "lucide-react";
import { sanitizeText } from "@/lib/sanitize";

const faqs = [
  {
    question: "How long does it take for pre-orders to ship?",
    answer: "Pre-orders typically ship within 4-6 weeks after the pre-order window closes. You will receive an email with tracking information once your hardware leaves our facility."
  },
  {
    question: "Can I withdraw my hot wallet balance at any time?",
    answer: "Yes. Your hot wallet balance is available for instant withdrawal 24/7. Cold vault withdrawals require a 24-hour security clearance period."
  },
  {
    question: "How do I connect my hardware?",
    answer: "Each miner comes with a secure auto-configuration script. Once powered on and connected to ethernet, the device will automatically appear in your 'Live Telemetry' dashboard."
  }
];

export default function SupportView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Interactive Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      sender: "agent",
      text: "Welcome back, Operator! I am your AppsMiners AI Support Specialist. How can I help you deploy your hardware or manage your wallet balances today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = sanitizeText(inputText);
    if (!cleanInput) return;

    const userMsg = cleanInput;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, {
      sender: "user",
      text: userMsg,
      time: currentTime
    }]);
    
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "Understood, Operator. I have logged your request. Is there anything else about your active rigs or wallet status that I can check?";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes("ship") || lower.includes("preorder") || lower.includes("order") || lower.includes("bought") || lower.includes("buy")) {
        replyText = "Congratulations on your purchase! You can track all orders directly in your 'Order History' tab. Rigs will appear under the 'Mining' tab as 'Awaiting Setup', where you can click 'Deploy Rig' to choose between Cloud Rending or Physical Shipping.";
      } else if (lower.includes("wallet") || lower.includes("withdraw") || lower.includes("deposit") || lower.includes("funds") || lower.includes("btc")) {
        replyText = "For quick transactions, you can access your 'Hot Wallet' directly in the Wallet tab to Send or Deposit funds. For maximum security of large holding allocations, you can unlock and access your air-gapped 'Cold Vault' using your physical USB security key.";
      } else if (lower.includes("mining") || lower.includes("yield") || lower.includes("rate") || lower.includes("active") || lower.includes("hash")) {
        replyText = "Rented Cloud Rigs active on our cluster mine 24/7 in the cloud (returning an 85% yield net of lease fees). Physical hardware shipped home returns 100% yield but requires setup configuration. You can also toggle 'Overclocking' in the Admin tab to boost cluster throughput.";
      } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
        replyText = "Hello, Operator! Ready to assist you. Let me know if you need help starting your rigs or authorizing wallet transfers.";
      }

      setMessages(prev => [...prev, {
        sender: "agent",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Contact Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {isChatOpen ? (
          /* Live Chat Console */
          <div className="glass-card p-6 border border-white/10 md:col-span-2 flex flex-col h-[500px] relative overflow-hidden bg-[#091433]">
            {/* Chat Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#60a5fa]/10 flex items-center justify-center text-[#60a5fa]">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">AppsMiners AI Assistant</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Active Operator Link</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user" ? "bg-orange-500/10 text-orange-400" : "bg-[#60a5fa]/10 text-[#60a5fa]"
                  }`}>
                    {msg.sender === "user" ? <User size={14} /> : <MessageSquare size={14} />}
                  </div>
                  <div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-orange-500/10 text-orange-200 border border-orange-500/20 rounded-tr-none" 
                        : "bg-white/5 text-gray-300 border border-white/10 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-gray-600 font-mono mt-1 block px-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-[#60a5fa]/10 flex items-center justify-center text-[#60a5fa]">
                    <MessageSquare size={14} />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about shipping preorders, active mining rates, or wallet withdrawals..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#60a5fa] placeholder:text-zinc-700"
              />
              <button
                type="submit"
                className="px-5 bg-[#60a5fa] hover:bg-[#3b82f6] hover:text-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                Send <Send size={12} />
              </button>
            </form>
          </div>
        ) : (
          /* Live Operator Info Card */
          <div className="glass-card p-8 border border-white/5 space-y-6">
            <div className="w-12 h-12 bg-[#60a5fa]/10 rounded-xl flex items-center justify-center text-[#60a5fa]">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Live Operator</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Connect with our specialized support team for technical assistance or account management.
              </p>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full py-4 bg-white/5 hover:bg-[#60a5fa] hover:text-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Start Chat
              </button>
            </div>
          </div>
        )}

        <div className="glass-card p-8 border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Email Support</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                For complex inquiries, enterprise sales, or security concerns, please email us directly.
              </p>
            </div>
          </div>
          <a href="mailto:support@appsminers.com" className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all block text-center mt-auto">
            support@appsminers.com
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-card p-8 border border-white/5">
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
          <LifeBuoy className="text-[#60a5fa]" />
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-white/10 bg-white/5 rounded-xl overflow-hidden transition-all">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors animate-none"
              >
                <span className="font-bold text-sm text-white">{faq.question}</span>
                {openFaq === idx ? <Minus size={16} className="text-[#60a5fa]" /> : <Plus size={16} className="text-gray-500" />}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? "max-h-40" : "max-h-0"}`}
              >
                <div className="p-5 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
