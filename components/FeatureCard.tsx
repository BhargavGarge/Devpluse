"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    theme?: "primary" | "cyan";
    delay?: number;
}

export function FeatureCard({ icon, title, description, theme = "primary", delay = 0 }: FeatureCardProps) {
    const isCyan = theme === "cyan";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`glass-card p-8 rounded-2xl group transition-all duration-500 hover:-translate-y-2 ${isCyan ? 'hover:border-cyan-400/50' : 'hover:border-primary/50'}`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${isCyan ? 'bg-cyan-400/20 group-hover:bg-cyan-400 text-cyan-400 group-hover:text-white' : 'bg-primary/20 group-hover:bg-primary text-primary group-hover:text-white'}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
