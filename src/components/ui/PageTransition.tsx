import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
  routeKey: string;
  children: ReactNode;
}

function PageTransition({ routeKey, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
