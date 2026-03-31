import { useState, useRef } from "react";

export default function AprilFoolPage() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const [boom, setBoom] = useState(false);
  const [flash, setFlash] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const steps = [
    "Analyzing intent...",
    "Detecting prompt weaknesses...",
    "Enhancing clarity...",
    "Injecting GPT-5 secret sauce...",
    "Finalizing perfection...",
  ];

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const fakeOutput = `
    Optimized Prompt Analysis:

    Your original prompt lacks clarity and structured intent.

    Improvements applied:
    - Defined clear objective
    - Reduced ambiguity
    - Improved instruction flow

    Suggested Prompt:

    "Explain the concept clearly with examples and structured output."

    This version ensures better response quality and reduces ambiguity in generation.

    Additional Notes:
    - Consider specifying format (bullet points, steps)
    - Avoid vague wording
    - Keep prompts concise but complete
    `;
  const handleOptimize = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setResult(false);

    for (let step of steps) {
      setStatus(step);
      await sleep(500);
    }

    setLoading(false);
    setResult(true);

    let i = 0;
    const speed = 20;

    const interval = setInterval(() => {
    setGeneratedText((prev) => prev + fakeOutput[i]);
    i++;

    if (i >= fakeOutput.length) {
        clearInterval(interval);
    }
    }, speed);

    // 🎯 RANDOM DELAY (unpredictable)
    const delay = 2000 + Math.random() * 1200;

    setTimeout(() => {
      setGlitch(true);

      setTimeout(() => {
        setFlash(true);

        setTimeout(() => {
          setGlitch(false);
          setFlash(false);
          setBoom(true);

          document.body.style.overflow = "hidden";

          if (audioRef.current) {
            audioRef.current.volume = 1;
            audioRef.current.play().catch(() => {});
          }
        }, 120);
      }, 300);
    }, delay);
  };

  const exitBoom = () => {
    setBoom(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white relative">
      {/* AUDIO */}
      <audio ref={audioRef} src="/sounds/witch.mp3" preload="auto" />

      {/* ⚡ FLASH */}
      {flash && <div className="fixed inset-0 z-50 bg-white" />}

      {/* 😱 JUMPSCARE */}
      {boom && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">

          {/* scary image */}
          <img
            src="/images/jumpscare.jpg"
            alt="jumpscare"
            className="absolute w-full h-full object-cover animate-[shake_0.2s_infinite] scale-110"
          />

          {/* overlay */}
          <div className="relative z-10 text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-red-600 animate-pulse">
              🤡 APRIL FOOL!
            </h1>

            <p className="mt-4 text-gray-300">
              You really thought this was real? 😏
            </p>

            <button
              onClick={exitBoom}
              className="mt-8 px-4 py-2 bg-white text-black rounded"
            >
              Escape 😅
            </button>
          </div>
        </div>
      )}

      {/* NORMAL UI */}
      {!boom && (
        <>
          <h1 className="text-3xl font-bold mb-2">
            Prompt Perfection Engine
          </h1>

          <p className="text-sm text-gray-400 mb-4">
            Turn your average prompts into GPT-5 level masterpieces.
          </p>

          <textarea
            className="w-full p-4 rounded-lg bg-black border border-gray-700 mb-4"
            rows={5}
            placeholder="Paste your prompt here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={handleOptimize}
            disabled={loading}
            className="bg-emerald-500 px-5 py-2 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading ? "Optimizing..." : "Optimize Prompt"}
          </button>

          {loading && (
            <p className="mt-4 text-gray-400 animate-pulse">
              {status}
            </p>
          )}

          {result && (
            <div className="mt-6 p-4 bg-gray-900 rounded border border-gray-700">
                <div className="text-emerald-400 mb-2">
                ✅ Optimization Complete
                </div>

                <pre className="text-sm whitespace-pre-wrap text-gray-300">
                {generatedText}
                </pre>
            </div>
          )}

          {/* subtle after-message */}
          {!boom && result && (
            <p className="mt-4 text-xs text-gray-500">
              (We still optimized your prompt… kind of.)
            </p>
          )}
        </>
      )}
    </div>
  );
}