import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

interface DemoTourBannerProps {
  currentStep: number | null; // 1, 2, 3 or null
  onStartDemo: () => void;
  onTriggerStep: (stepNumber: number) => void;
  onResetDemo: () => void;
  isSpeaking: boolean;
}

export const DemoTourBanner: React.FC<DemoTourBannerProps> = ({
  currentStep,
  onStartDemo,
  onTriggerStep,
  onResetDemo,
  isSpeaking
}) => {
  const steps = [
    {
      step: 1,
      title: 'Step 1: Discover',
      query: 'Tell me about this place'
    },
    {
      step: 2,
      title: 'Step 2: Context',
      query: 'Why was it built?'
    },
    {
      step: 3,
      title: 'Step 3: Nearby',
      query: 'What can I see nearby?'
    }
  ];

  if (currentStep === null) {
    return (
      <div className="w-full max-w-md px-4 mb-2">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#0B132B] to-[#172033] text-white shadow-md border border-[#00BFA6]/30"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00BFA6]/20 flex items-center justify-center text-[#00BFA6] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Hackathon Demo Tour</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#00BFA6] text-[#0B132B] text-[9px] font-extrabold">
                  3-STEP FLOW
                </span>
              </p>
              <p className="text-[11px] text-white/70">
                1-tap presentation sequence for India Gate
              </p>
            </div>
          </div>

          <button
            id="start-demo-tour-button"
            onClick={onStartDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00BFA6] hover:bg-[#00A892] text-[#0B132B] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-[#0B132B]" />
            <span>Start Demo</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-4 mb-2">
      <div className="p-3.5 rounded-2xl bg-[#0B132B] text-white shadow-lg border border-[#00BFA6]/40">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00BFA6]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo: Step {currentStep} of 3</span>
          </div>

          <button
            id="reset-demo-tour-button"
            onClick={onResetDemo}
            className="flex items-center gap-1 text-[11px] text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Exit Demo</span>
          </button>
        </div>

        {/* 3 Steps Pills */}
        <div className="grid grid-cols-3 gap-1.5">
          {steps.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <button
                key={`demo-step-${s.step}`}
                id={`demo-step-button-${s.step}`}
                onClick={() => onTriggerStep(s.step)}
                disabled={isSpeaking}
                className={`p-2 rounded-xl text-left transition-all cursor-pointer disabled:opacity-50 ${
                  isCurrent
                    ? 'bg-[#00BFA6] text-[#0B132B] font-bold shadow-md'
                    : isCompleted
                    ? 'bg-white/15 text-white/90'
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span>Step {s.step}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-[#00BFA6]" />}
                </div>
                <p className="text-[11px] font-semibold truncate mt-0.5">
                  "{s.query}"
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
