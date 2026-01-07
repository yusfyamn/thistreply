"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqChatProps {
  data: FAQItem[];
  className?: string;
}

export function FaqChat({ data, className }: FaqChatProps) {
  const [openItems, setOpenItems] = React.useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={cn("faq-chat-container", className)}>
      {data.map((item, index) => (
        <div key={item.id} className="faq-chat-item">
          {/* Question - User message (right side, gray) */}
          <motion.div
            className="faq-message-row faq-question-row"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                "faq-bubble faq-question-bubble",
                openItems.includes(item.id) && "active"
              )}
            >
              <span>{item.question}</span>
              <span className="faq-tap-hint">
                {openItems.includes(item.id) ? "tap to close" : "tap to answer"}
              </span>
            </button>
          </motion.div>

          {/* Answer - Bot message (left side, blue) */}
          <AnimatePresence>
            {openItems.includes(item.id) && (
              <motion.div
                className="faq-message-row faq-answer-row"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="faq-bubble faq-answer-bubble">
                  <span>{item.answer}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
