import { motion } from "framer-motion";
import React from "react";
import { useInView } from "react-intersection-observer";

/**
 * Floating Code Animation
 * Code lines animate in from left
 */
export function FloatingCode({ codeLines }: { codeLines: string[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <motion.div
      ref={ref}
      className="font-mono bg-gray-900 text-green-400 p-8 rounded-lg shadow-lg text-sm md:text-base"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {codeLines.map((line, i) => (
        <motion.div key={i} variants={lineVariants} className="h-6">
          {line}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Cost Reduction Visualization
 * Shows 360x cost improvement animation
 */
export function CostReduction() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
      {/* Starting cost */}
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-4xl md:text-5xl font-bold">$10,000</div>
        <div className="text-sm text-gray-600 mt-2">Per Feature (Before)</div>
      </motion.div>

      {/* Arrow down */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <svg className="w-12 h-12 text-green-500 md:w-16 md:h-16">
          <path
            d="M8 0v24m0 0l-4-4m4 4l4-4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Final cost */}
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-4xl md:text-5xl font-bold text-green-500">$0.59</div>
        <div className="text-sm text-gray-600 mt-2">Per Feature (After)</div>
        <div className="text-sm font-bold text-green-600 mt-2">360x Cheaper!</div>
      </motion.div>
    </div>
  );
}

/**
 * Velocity Comparison Bars
 * Shows 4x feature velocity improvement
 */
export function VelocityComparison() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} className="space-y-8">
      {/* Before */}
      <div>
        <div className="text-lg font-semibold mb-3">Before</div>
        <motion.div
          className="bg-red-200 h-12 rounded-lg flex items-center px-4 font-semibold text-red-900"
          initial={{ width: "0%" }}
          animate={inView ? { width: "25%" } : { width: "0%" }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          2-3 features/month
        </motion.div>
      </div>

      {/* After */}
      <div>
        <div className="text-lg font-semibold mb-3">After n3wth Orchestrator</div>
        <motion.div
          className="bg-green-200 h-12 rounded-lg flex items-center px-4 font-semibold text-green-900"
          initial={{ width: "0%" }}
          animate={inView ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        >
          8-12 features/month
        </motion.div>
      </div>

      {/* Multiplier */}
      <motion.div
        className="text-center text-3xl md:text-4xl font-bold text-green-600 pt-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        4x FASTER
      </motion.div>
    </div>
  );
}

/**
 * Orchestration Layers
 * Shows the four layers of the system
 */
export function OrchestratorLayers() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const layers = [
    "Grounding Framework",
    "Quality Gates",
    "State Management",
    "Feedback Loops",
  ];

  return (
    <div ref={ref} className="space-y-4">
      {layers.map((layer, i) => (
        <motion.div
          key={i}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg font-semibold text-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{
            delay: i * 0.3,
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <span className="inline-block w-8 h-8 bg-white text-blue-600 rounded-full text-center font-bold mr-3">
            {i + 1}
          </span>
          {layer}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Quality Gates Visualization
 * Shows code being validated
 */
export function QualityGatesViz() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} className="space-y-6">
      {/* Bad code rejected */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex-1 bg-red-100 border-2 border-red-300 p-4 rounded-lg"
          initial={{ x: 0 }}
          animate={inView ? { x: [0, 20, 0] } : { x: 0 }}
          transition={{ delay: 0.5, duration: 1.5, repeat: Infinity }}
        >
          <code className="text-red-900">faulty_code.py</code>
        </motion.div>
        <motion.div
          className="text-4xl"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          ❌
        </motion.div>
      </div>

      {/* Good code approved */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex-1 bg-green-100 border-2 border-green-300 p-4 rounded-lg"
          initial={{ x: 0 }}
          animate={inView ? { x: [0, -20, 0] } : { x: 0 }}
          transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
        >
          <code className="text-green-900">production_code.py</code>
        </motion.div>
        <motion.div
          className="text-4xl"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2.2, duration: 0.4 }}
        >
          ✅
        </motion.div>
      </div>
    </div>
  );
}
