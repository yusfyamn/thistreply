"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: "left" | "right";
  color?: string;
}

interface FaqAccordionProps {
  data: FAQItem[];
  className?: string;
  timestamp?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export function FaqAccordion({
  data,
  className,
  timestamp,
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <div className={cn("faq-accordion-wrapper", className)}>
      {timestamp && (
        <div className="faq-timestamp">{timestamp}</div>
      )}
      <Accordion.Root
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={(value) => setOpenItem(value)}
      >
        {data.map((item) => (
          <Accordion.Item 
            value={item.id.toString()} 
            key={item.id} 
            className="faq-item"
            style={item.color ? { backgroundColor: item.color } : undefined}
          >
            <Accordion.Header>
              <Accordion.Trigger className="faq-trigger">
                <div
                  className={cn(
                    "faq-question",
                    openItem === item.id.toString() && "active",
                    questionClassName
                  )}
                >
                  {item.icon && (
                    <span
                      className={cn(
                        "faq-icon",
                        item.iconPosition === "right" ? "icon-right" : "icon-left"
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="faq-question-text">{item.question}</span>
                </div>
                <span className={cn("faq-toggle", openItem === item.id.toString() && "active")}>
                  {openItem === item.id.toString() ? (
                    <Minus className="toggle-icon" />
                  ) : (
                    <Plus className="toggle-icon" />
                  )}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content asChild forceMount>
              <motion.div
                initial="collapsed"
                animate={openItem === item.id.toString() ? "open" : "collapsed"}
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="faq-content-wrapper"
              >
                <div className="faq-answer-container">
                  <div className={cn("faq-answer", answerClassName)}>
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
