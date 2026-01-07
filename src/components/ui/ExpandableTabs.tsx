"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Tab {
  title: string;
  icon: LucideIcon;
  href: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  href?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  activeIndex?: number | null;
  onChange?: (index: number) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? "0.5rem" : 0,
    paddingLeft: isSelected ? "1.25rem" : "1rem",
    paddingRight: isSelected ? "1.25rem" : "1rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-[#ff4d6d]",
  activeIndex = null,
  onChange,
}: ExpandableTabsProps) {
  const Separator = () => (
    <div className="mx-1 h-[20px] w-[1.2px] bg-gray-200" aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full p-1.5",
        className
      )}
      style={{
        background: 'var(--nav-bg, #ffffff)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
        border: '1px solid var(--nav-border, rgba(0, 0, 0, 0.06))',
      }}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        const isSelected = activeIndex === index;

        return (
          <motion.button
            key={tab.title}
            layout
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap={{ scale: 0.95 }}
            custom={isSelected}
            onClick={() => onChange?.(index)}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              layout: { type: "spring", stiffness: 500, damping: 30 }
            }}
            className={cn(
              "relative flex items-center rounded-full py-2.5 text-sm font-medium transition-colors expandable-tab-btn",
              isSelected
                ? cn("bg-[#fff0f3] active-tab", activeColor)
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 inactive-tab"
            )}
          >
            <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
            <AnimatePresence mode="popLayout">
              {isSelected && (
                <motion.span
                  key="label"
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30 
                  }}
                  className="overflow-hidden whitespace-nowrap font-medium"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
