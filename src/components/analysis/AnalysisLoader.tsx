'use client';

export default function AnalysisLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Animated circles */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent-pink animate-spin animation-delay-150"></div>
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-accent-purple animate-spin animation-delay-300"></div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Analyzing your chat...</p>
        <p className="text-sm text-gray-400">Generating the perfect responses</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce animation-delay-150"></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce animation-delay-300"></div>
      </div>
    </div>
  );
}
