import { useState, useEffect } from 'react';
import soundManager from '../../utils/sounds';
import './Pembagian.css';
import '../DonationButton.css';

function Pembagian(props) {
    const [currentQuestion, setCurrentQuestion] = useState({ dividend: 12, divisor: 3 });
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showVisual, setShowVisual] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameActive, setGameActive] = useState(true);
    const [hintUsed, setHintUsed] = useState(0);
    
    const generateQuestion = () => {
        // Generate division questions with whole number results
        const divisor = Math.floor(Math.random() * 5) + 2; // 2-6
        const quotient = Math.floor(Math.random() * 5) + 2; // 2-6
        const dividend = divisor * quotient;
        
        setCurrentQuestion({ dividend, divisor, quotient });
        setUserAnswer('');
        setIsCorrect(null);
        setTimeLeft(30);
    };
    
    useEffect(() => {
        generateQuestion();
    }, []);
    
    useEffect(() => {
        if (gameActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameActive(false);
        }
    }, [timeLeft, gameActive]);
    
    const checkAnswer = () => {
        if (!userAnswer || !gameActive) return;
        
        const userAnswerNum = parseInt(userAnswer);
        
        setTotalQuestions(totalQuestions + 1);
        
        if (userAnswerNum === currentQuestion.quotient) {
            setScore(score + 1);
            setIsCorrect(true);
            soundManager.playCorrect();
            
            // Bonus for quick answers
            if (timeLeft > 20) {
                setScore(score + 2);
            }
        } else {
            setIsCorrect(false);
            soundManager.playWrong();
        }
        
        // Show result for 2 seconds then generate new question
        setTimeout(() => {
            generateQuestion();
        }, 2000);
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    };
    
    const resetGame = () => {
        soundManager.playClick();
        setScore(0);
        setTotalQuestions(0);
        setGameActive(true);
        setHintUsed(0);
        generateQuestion();
    };
    
    const useHint = () => {
        if (hintUsed < 3) {
            setHintUsed(hintUsed + 1);
            // Show the answer for 3 seconds
            const originalAnswer = userAnswer;
            setUserAnswer(currentQuestion.quotient.toString());
            setTimeout(() => {
                setUserAnswer(originalAnswer);
            }, 3000);
        }
    };
    
    return (
        <div className="pembagian-container min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <button 
                        onClick={() => props.setView('mainMenu')}
                        className="px-4 py-2 bg-white hover:bg-gray-100 rounded-xl font-semibold transition-colors shadow-lg flex items-center gap-2"
                    >
                        <span>←</span> Kembali ke Menu
                    </button>
                    
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-purple-800">
                            🎯 Belajar Pembagian
                        </h1>
                        <p className="text-gray-600 mt-2">Bagi sama rata dan dapatkan jawaban!</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="score-card bg-white p-4 rounded-xl shadow-lg">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Skor</p>
                                <p className="text-2xl font-bold text-green-600">{score}</p>
                            </div>
                        </div>
                        
                        <div className="timer-card bg-white p-4 rounded-xl shadow-lg">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Waktu</p>
                                <p className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-blue-600'}`}>
                                    {timeLeft}s
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Game Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Question and Visual */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-700">Berapa Hasilnya?</h2>
                            <p className="text-gray-500">Bagi {currentQuestion.dividend} dengan {currentQuestion.divisor}</p>
                        </div>
                        
                        {/* Visual Division */}
                        <div className="division-visual mb-8">
                            <div className="flex flex-col items-center">
                                {/* Total items */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        Total: {currentQuestion.dividend} item
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {Array.from({ length: currentQuestion.dividend }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-8 h-8 rounded-full shadow-sm ${
                                                    i < currentQuestion.divisor ? 'bg-purple-400' :
                                                    i < currentQuestion.divisor * 2 ? 'bg-pink-400' :
                                                    i < currentQuestion.divisor * 3 ? 'bg-blue-400' :
                                                    'bg-green-400'
                                                }`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Division symbol */}
                                <div className="my-4">
                                    <div className="text-6xl font-bold text-purple-500">÷</div>
                                </div>
                                
                                {/* Groups */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        Dibagi menjadi {currentQuestion.divisor} kelompok
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {Array.from({ length: currentQuestion.divisor }).map((_, groupIndex) => (
                                            <div key={groupIndex} className="group-container">
                                                <div className="text-sm text-gray-500 mb-1">Kelompok {groupIndex + 1}</div>
                                                <div className="flex gap-1">
                                                    {Array.from({ length: currentQuestion.quotient }).map((_, itemIndex) => (
                                                        <div 
                                                            key={itemIndex}
                                                            className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 shadow-sm"
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Equals and question */}
                                <div className="my-6">
                                    <div className="text-4xl font-bold text-gray-700">=</div>
                                </div>
                                
                                {/* Answer display */}
                                <div className="mt-4">
                                    <div className="text-5xl font-bold text-pink-600">
                                        {isCorrect !== null ? currentQuestion.quotient : '?'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Visual Toggle */}
                        <div className="text-center mb-6">
                            <button
                                onClick={() => setShowVisual(!showVisual)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            >
                                {showVisual ? 'Sembunyikan Gambar' : 'Tampilkan Gambar'}
                            </button>
                        </div>
                        
                        {/* Answer Input */}
                        <div className="answer-input-section">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                <div className="text-xl font-semibold text-gray-700">
                                    {currentQuestion.dividend} ÷ {currentQuestion.divisor} =
                                </div>
                                
                                <input
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={!gameActive || isCorrect !== null}
                                    className="answer-input w-32 h-16 text-3xl text-center font-bold border-4 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200"
                                    placeholder="?"
                                    autoFocus
                                />
                                
                                <button
                                    onClick={checkAnswer}
                                    disabled={!userAnswer || !gameActive || isCorrect !== null}
                                    className="check-button px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors shadow-lg"
                                >
                                    Cek Jawaban
                                </button>
                            </div>
                            
                            {/* Hint button */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={useHint}
                                    disabled={hintUsed >= 3 || !gameActive || isCorrect !== null}
                                    className="hint-button px-4 py-2 bg-yellow-100 hover:bg-yellow-200 disabled:bg-gray-100 text-yellow-800 font-medium rounded-lg transition-colors"
                                >
                                    💡 Petunjuk ({3 - hintUsed} tersisa)
                                </button>
                            </div>
                        </div>
                        
                        {/* Feedback */}
                        {isCorrect !== null && (
                            <div className={`feedback mt-6 p-4 rounded-xl text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <p className="text-2xl font-bold mb-2">
                                    {isCorrect ? '🎉 Hore! Benar!' : '❌ Coba lagi!'}
                                </p>
                                <p>
                                    {isCorrect 
                                        ? `Kamu mendapatkan ${timeLeft > 20 ? '2' : '1'} poin!`
                                        : `Jawaban yang benar adalah ${currentQuestion.quotient}`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                    
                    {/* Right Side - Info and Controls */}
                    <div className="space-y-6">
                        {/* Game Status */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Status Permainan</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Soal Dijawab</span>
                                    <span className="font-bold text-blue-600">{totalQuestions}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Akurasi</span>
                                    <span className="font-bold text-green-600">
                                        {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Petunjuk Digunakan</span>
                                    <span className="font-bold text-yellow-600">{hintUsed}/3</span>
                                </div>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">Progress Belajar</span>
                                    <span className="text-purple-600 font-bold">
                                        {Math.round((score / Math.max(totalQuestions, 1)) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${(score / Math.max(totalQuestions, 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Controls */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Kontrol Permainan</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={generateQuestion}
                                    disabled={!gameActive}
                                    className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Soal Baru
                                </button>
                                <button
                                    onClick={resetGame}
                                    className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Ulang Permainan
                                </button>
                            </div>
                            
                            {/* Division Tips */}
                            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                                <p className="text-purple-800 font-semibold mb-2">💡 Tips Pembagian:</p>
                                <ul className="text-purple-700 text-sm space-y-1">
                                    <li>• Pembagian adalah kebalikan dari perkalian</li>
                                    <li>• {currentQuestion.dividend} ÷ {currentQuestion.divisor} artinya</li>
                                    <li>• "Berapa banyak {currentQuestion.divisor} dalam {currentQuestion.dividend}?"</li>
                                    <li>• Atau "Bagikan {currentQuestion.dividend} ke {currentQuestion.divisor} kelompok sama rata"</li>
                                </ul>
                            </div>
                            
                            {/* Donation Section */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-lg font-bold text-yellow-800">💝 Sukai Game Ini?</h3>
                                        <p className="text-yellow-700 text-sm mt-1">
                                            Dukung pengembangan aplikasi edukasi gratis
                                        </p>
                                    </div>
                                    <a 
                                        href="https://teer.id/masgardha" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={() => soundManager.playClick()}
                                        className="donation-button px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg text-sm"
                                    >
                                        💖 Donasi
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Division Table */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Tabel Pembagian Dasar</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="font-bold text-purple-600">12 ÷ 3 = 4</div>
                                    <div className="text-xs text-gray-500">3 kelompok × 4 = 12</div>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="font-bold text-purple-600">15 ÷ 5 = 3</div>
                                    <div className="text-xs text-gray-500">5 kelompok × 3 = 15</div>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="font-bold text-purple-600">18 ÷ 6 = 3</div>
                                    <div className="text-xs text-gray-500">6 kelompok × 3 = 18</div>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="font-bold text-purple-600">20 ÷ 4 = 5</div>
                                    <div className="text-xs text-gray-500">4 kelompok × 5 = 20</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Game Over Modal */}
                {!gameActive && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                            <div className="text-center">
                                <div className="text-6xl mb-4">⏰</div>
                                <h3 className="text-2xl font-bold text-red-600 mb-2">Waktu Habis!</h3>
                                <p className="text-gray-600 mb-6">
                                    Permainan selesai. Kamu menjawab {totalQuestions} soal dengan skor {score}.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={resetGame}
                                        className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Main Lagi
                                    </button>
                                    <button
                                        onClick={() => props.setView('mainMenu')}
                                        className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                                    >
                                        Kembali ke Menu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pembagian;