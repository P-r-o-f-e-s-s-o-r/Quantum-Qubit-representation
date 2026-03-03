import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Zap, RotateCcw, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';
import BlochSphere from './components/BlochSphere';

export default function App() {
  const [prob0, setProb0] = useState(0.5); // Probability of |0>
  const [theta, setTheta] = useState(Math.PI / 2); // Current visualization angle
  const [phi, setPhi] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measuredState, setMeasuredState] = useState<number | null>(null);
  const [measuredProb, setMeasuredProb] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Update theta based on probability
  useEffect(() => {
    if (!isMeasuring) {
      // theta = 2 * acos(sqrt(p0))
      // When p0 = 1, theta = 0 (|0>)
      // When p0 = 0, theta = PI (|1>)
      // When p0 = 0.5, theta = PI/2 (Equator)
      const newTheta = 2 * Math.acos(Math.sqrt(prob0));
      setTheta(newTheta);
    }
  }, [prob0, isMeasuring]);

  const handleMeasure = useCallback(() => {
    setIsMeasuring(true);
    setPulse(true);
    setMeasuredProb(prob0);
    setTimeout(() => setPulse(false), 1000);
    
    // Simulate quantum measurement
    const random = Math.random();
    const result = random < prob0 ? 0 : 1;
    
    // Animate collapse
    setTimeout(() => {
      setMeasuredState(result);
      setTheta(result === 0 ? 0 : Math.PI);
    }, 100);
  }, [prob0]);

  const handleReset = useCallback(() => {
    setIsMeasuring(false);
    setMeasuredState(null);
    setMeasuredProb(null);
    const initialTheta = 2 * Math.acos(Math.sqrt(prob0));
    setTheta(initialTheta);
  }, [prob0]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Quantum Qubit Lab</h1>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Interactive Visualization</p>
          </div>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-full hover:bg-white/5 transition-colors border border-white/10"
          title="Learn More"
        >
          <HelpCircle className="w-5 h-5 text-slate-400" />
        </button>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        
        {/* Left Column: Visualization */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl group">
            {/* Overlay Info */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
              <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isMeasuring ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                  {isMeasuring ? 'Measured State' : 'Superposition Active'}
                </span>
              </div>
            </div>

            {/* Bloch Sphere Canvas */}
            <BlochSphere 
              theta={theta} 
              phi={phi} 
              isMeasuring={isMeasuring} 
              measuredState={measuredState} 
              pulse={pulse}
            />

            {/* Axis Labels Overlay */}
            <div className="absolute bottom-6 right-6 text-[10px] font-mono text-slate-500 flex flex-col items-end gap-1">
              <p>Z-Axis: Computational Basis</p>
              <p>X/Y-Axis: Phase Superposition</p>
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Probability Control Card */}
          <section className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">State Preparation</h2>
            </div>

            <div className="space-y-10">
              {/* Probability Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-slate-400">Probability of |0⟩</label>
                  <span className="text-2xl font-mono font-bold text-blue-400">{(prob0 * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={prob0} 
                  onChange={(e) => setProb0(parseFloat(e.target.value))}
                  disabled={isMeasuring}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                  <span>Pure |1⟩</span>
                  <span>Superposition</span>
                  <span>Pure |0⟩</span>
                </div>
              </div>

              {/* State Representation */}
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-sm">
                <p className="text-slate-500 mb-2 text-xs uppercase tracking-widest">State Vector |ψ⟩</p>
                <div className="flex items-center gap-2 text-blue-300">
                  <span>{Math.sqrt(prob0).toFixed(3)}|0⟩</span>
                  <span className="text-slate-600">+</span>
                  <span>{Math.sqrt(1 - prob0).toFixed(3)}|1⟩</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {!isMeasuring ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMeasure}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
                  >
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                    Measure Qubit
                  </motion.button>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset Qubit
                  </motion.button>
                )}
              </div>
            </div>
          </section>

          {/* Measurement Result Card */}
          <AnimatePresence>
            {measuredState !== null && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-20 h-20" />
                </div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-blue-400 mb-4">Measurement Result</h3>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-bold text-white">|{measuredState}⟩</span>
                    <div className="text-sm text-slate-300">
                      <p className="font-semibold text-white mb-1">Wavefunction Collapsed</p>
                      <p>The qubit is now in a definite state.</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                    <p>
                      Based on your superposition, there was a 
                      <span className="text-blue-400 font-mono mx-1">
                        {measuredState === 0 ? (measuredProb! * 100).toFixed(0) : ((1 - measuredProb!) * 100).toFixed(0)}%
                      </span> 
                      chance of observing |{measuredState}⟩. 
                      The act of measurement forced the quantum system to choose one of the possible states, 
                      destroying the superposition.
                    </p>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Educational Snippet */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Did you know?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In quantum mechanics, a qubit can exist in multiple states simultaneously. 
                  This is called <strong>superposition</strong>. Only when we observe (measure) it 
                  does it "choose" a single outcome.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Info Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#121214] border border-white/10 rounded-[2rem] max-w-2xl w-full max-h-[80vh] overflow-y-auto p-10 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-3xl font-bold text-white">Quantum Concepts</h2>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <RotateCcw className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-8 text-slate-300">
                <section>
                  <h3 className="text-blue-400 font-mono text-sm uppercase tracking-widest mb-3">01. Superposition</h3>
                  <p className="leading-relaxed">
                    Unlike a classical bit (0 or 1), a qubit can be in a combination of both states. 
                    On the Bloch Sphere, this is represented by any point that isn't exactly at the North or South pole.
                  </p>
                </section>

                <section>
                  <h3 className="text-purple-400 font-mono text-sm uppercase tracking-widest mb-3">02. The Bloch Sphere</h3>
                  <p className="leading-relaxed">
                    A geometric representation of the pure state space of a two-level quantum mechanical system. 
                    The North Pole is |0⟩, the South Pole is |1⟩, and the equator represents equal superpositions.
                  </p>
                </section>

                <section>
                  <h3 className="text-emerald-400 font-mono text-sm uppercase tracking-widest mb-3">03. Measurement Collapse</h3>
                  <p className="leading-relaxed">
                    When you measure a qubit, you force it to reveal itself as either |0⟩ or |1⟩. 
                    The probability of each outcome depends on where the qubit was on the sphere before measurement.
                  </p>
                </section>

                <button 
                  onClick={() => setShowInfo(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  Got it! <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-white/5 text-center">
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
          Built for Quantum Enthusiasts &bull; 2024
        </p>
      </footer>
    </div>
  );
}
