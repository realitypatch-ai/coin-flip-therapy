import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [gutFeeling, setGutFeeling] = useState('');
  const [finalChoice, setFinalChoice] = useState('');
  const [flipHistory, setFlipHistory] = useState([]);
  const [showReflection, setShowReflection] = useState(false);

  const flipCoin = () => {
    if (!optionA || !optionB) return;
    
    setIsFlipping(true);
    setResult(null);
    setGutFeeling('');
    setFinalChoice('');
    setShowReflection(false);
    
    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? 'A' : 'B';
      setResult(outcome);
      setIsFlipping(false);
      setShowReflection(true);
    }, 1500);
  };

  const recordDecision = (choice, satisfied) => {
    const decision = {
      id: Date.now(),
      options: [optionA, optionB],
      coinResult: result === 'A' ? optionA : optionB,
      actualChoice: choice,
      followedCoin: choice === (result === 'A' ? optionA : optionB),
      gutFeeling,
      satisfied,
      timestamp: new Date().toLocaleString(),
      date: new Date().toDateString()
    };
    
    setFlipHistory([decision, ...flipHistory]);
    resetFlip();
  };

  const resetFlip = () => {
    setOptionA('');
    setOptionB('');
    setResult(null);
    setGutFeeling('');
    setFinalChoice('');
    setShowReflection(false);
  };

  const getRecentPatterns = () => {
    if (flipHistory.length < 3) return null;
    const recent = flipHistory.slice(0, 5);
    const followedCoin = recent.filter(d => d.followedCoin).length;
    const satisfied = recent.filter(d => d.satisfied).length;
    
    return {
      followRate: Math.round((followedCoin / recent.length) * 100),
      satisfactionRate: Math.round((satisfied / recent.length) * 100),
      total: recent.length
    };
  };

  const patterns = getRecentPatterns();

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900 font-mono">
      <div className="max-w-2xl mx-auto p-6">
        
        {/* Simple header */}
        <div className="text-center mb-12 border-b-2 border-gray-200 pb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            coin flip therapy
          </h1>
          <p className="text-gray-600 italic">
            sometimes you know what you want when you see what you don't want
          </p>
        </div>

        {/* Main interface */}
        <div className="space-y-8">
          
          {!result && !isFlipping && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Option A</label>
                  <input
                    type="text"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-none focus:border-gray-500 focus:outline-none bg-white text-lg"
                    placeholder="what you're considering..."
                  />
                </div>
                
                <div className="text-center py-2">
                  <span className="text-gray-400 text-sm">or</span>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Option B</label>
                  <input
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-none focus:border-gray-500 focus:outline-none bg-white text-lg"
                    placeholder="the alternative..."
                  />
                </div>
              </div>

              <button
                onClick={flipCoin}
                disabled={!optionA || !optionB}
                className="w-full p-6 bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500 font-bold text-xl transition-colors duration-200 border-2 border-gray-800 hover:border-gray-700"
              >
                flip the damn coin
              </button>
            </div>
          )}

          {isFlipping && (
            <div className="text-center py-16">
              <div className="text-6xl mb-8 animate-spin">●</div>
              <p className="text-xl text-gray-600">
                thinking...
              </p>
            </div>
          )}

          {result && (
            <div className="border-2 border-gray-800 bg-white p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">●</div>
                <h2 className="text-3xl font-bold mb-2">
                  {result === 'A' ? optionA : optionB}
                </h2>
                <p className="text-gray-600 italic">
                  the coin says: go with this one
                </p>
              </div>

              {showReflection && (
                <div className="space-y-6 border-t-2 border-gray-200 pt-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      how do you feel about this result? (be honest)
                    </label>
                    <textarea
                      value={gutFeeling}
                      onChange={(e) => setGutFeeling(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:border-gray-500 focus:outline-none bg-gray-50 text-sm"
                      rows="3"
                      placeholder="relieved? disappointed? indifferent? write it down..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => recordDecision(result === 'A' ? optionA : optionB, true)}
                      className="p-4 bg-green-100 border-2 border-green-300 text-green-800 hover:bg-green-200 transition-colors"
                    >
                      going with it
                    </button>
                    
                    <button
                      onClick={() => recordDecision(result === 'A' ? optionB : optionA, false)}
                      className="p-4 bg-red-100 border-2 border-red-300 text-red-800 hover:bg-red-200 transition-colors"
                    >
                      nah, doing the opposite
                    </button>
                  </div>

                  <button
                    onClick={resetFlip}
                    className="w-full p-2 text-gray-500 hover:text-gray-700 underline text-sm"
                  >
                    start over
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Insights section - only after some history */}
        {flipHistory.length > 0 && (
          <div className="mt-16 space-y-8">
            
            {/* Quick patterns */}
            {patterns && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="font-bold text-gray-800 mb-3">your recent patterns</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>you follow the coin {patterns.followRate}% of the time</p>
                  <p>you're satisfied with decisions {patterns.satisfactionRate}% of the time</p>
                  <p className="text-xs text-gray-500 mt-2">based on last {patterns.total} decisions</p>
                </div>
              </div>
            )}

            {/* Decision log */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                decision log
              </h3>
              
              <div className="space-y-4">
                {flipHistory.map((decision) => (
                  <div key={decision.id} className="bg-white border border-gray-200 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">{decision.timestamp}</div>
                        <div className="font-medium">chose: {decision.actualChoice}</div>
                        <div className="text-sm text-gray-600">
                          coin said: {decision.coinResult}
                          {decision.followedCoin ? ' (followed)' : ' (ignored)'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${decision.satisfied ? 'text-green-600' : 'text-red-600'}`}>
                          {decision.satisfied ? 'satisfied' : 'regretful'}
                        </div>
                      </div>
                    </div>
                    
                    {decision.gutFeeling && (
                      <div className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3 bg-gray-50 p-2">
                        "{decision.gutFeeling}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Clear history */}
            {flipHistory.length > 5 && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setFlipHistory([])}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  clear history
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-gray-400 border-t border-gray-200 pt-8">
          <p>the coin doesn't make decisions. you do.</p>
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default App;