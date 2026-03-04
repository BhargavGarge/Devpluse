"use client";

import { motion, useInView, Variants } from "framer-motion";
import React from "react";

interface TimelineContentProps {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    animationNum: number;
    customVariants?: any;
    timelineRef?: React.RefObject<HTMLDivElement | null>;
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
    children,
    as: Component = "div",
    className = "",
    animationNum,
    customVariants,
    timelineRef,
}) => {
    const fallbackRef = React.useRef(null);
    const ref = timelineRef || fallbackRef;
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <Component className={className} ref={fallbackRef}>
            <motion.div
                variants={customVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={animationNum}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </Component>
    );
};
