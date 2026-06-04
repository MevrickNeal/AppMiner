"use client";

import { useState } from "react";
import { LifeBuoy, Mail, MessageSquare, Plus, Minus } from "lucide-react";

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

  return (
    <div className="space-y-8">
      {/* Contact Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-8 border border-white/5 space-y-6">
          <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-xl flex items-center justify-center text-[#00f2ff]">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Live Operator</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Connect with our specialized support team for technical assistance or account management.
            </p>
            <button className="w-full py-4 bg-white/5 hover:bg-[#00f2ff] hover:text-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Start Chat
            </button>
          </div>
        </div>

        <div className="glass-card p-8 border border-white/5 space-y-6">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Email Support</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              For complex inquiries, enterprise sales, or security concerns, please email us directly.
            </p>
            <a href="mailto:support@appsminers.com" className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all block text-center">
              support@appsminers.com
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-card p-8 border border-white/5">
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
          <LifeBuoy className="text-[#00f2ff]" />
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-white/10 bg-white/5 rounded-xl overflow-hidden transition-all">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-sm text-white">{faq.question}</span>
                {openFaq === idx ? <Minus size={16} className="text-[#00f2ff]" /> : <Plus size={16} className="text-gray-500" />}
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
