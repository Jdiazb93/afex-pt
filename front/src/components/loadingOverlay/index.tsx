import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingOverlayProps {
  show: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-xs"
        >
          <motion.div
            className="w-20 h-20 rounded-full border-8 border-solid border-transparent border-t-blue-500 border-b-white border-l-white border-r-white"
            animate={{
              rotate: 360,
              borderTopColor: [
                "#2b7fff",
                "#fb2c36",
                "#00c48c",
                "#fbbf24",
                "#2b7fff",
              ],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.25, 0.75, 0.5, 0.75],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
