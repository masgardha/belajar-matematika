import { useState, useEffect } from 'react';
import soundManager from '../../utils/sounds';
import './Angka.css';
import '../DonationButton.css';

function Angka(props) {
    const [currentNumber, setCurrentNumber] = useState(1);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const handleNumberClick = (number) => {
        soundManager.playClick();
        setCurrentNumber(number);
        setShowAnswer(false);
        setIsCorrect(null);
    };
    
    const checkAnswer = (selectedNumber) => {
        setTotalQuestions(totalQuestions + 1);
        if (selectedNumber === currentNumber) {
            setScore(score + 1);
            setIsCorrect(true);
            soundManager.playCorrect();
            
            // Auto move to next number after delay
            setTimeout(() => {
                nextNumber();
            }, 1000);
        } else {
            setIsCorrect(false);
            soundManager.playWrong();
        }
        setShowAnswer(true);
    };
    
    const nextNumber = () => {
        soundManager.playClick();
        const randomIndex = Math.floor(Math.random() * numbers.length);
        setCurrentNumber(numbers[randomIndex]);
        setShowAnswer(false);
        setIsCorrect(null);
    };
    
    const resetGame = () => {
        soundManager.playClick();
        setScore(0);
        setTotalQuestions(0);
        setCurrentNumber(1);
        setShowAnswer(false);
        setIsCorrect(null);
    };
    
    return (
        <div className="angka-container min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => props.setView('mainMenu')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                    >
                        ← Kembali
                    </button>
                    
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Belajar Angka 1-10</h1>
                        <p className="text-gray-600 mt-2">Klik angka yang sesuai dengan gambar</p>
                    </div>
                    
                    <div className="score-card bg-white p-4 rounded-xl shadow-lg">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Skor</p>
                            <p className="text-2xl font-bold text-blue-600">{score}/{totalQuestions}</p>
                        </div>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Number Display */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-700">Angka Berapa Ini?</h2>
                        </div>
                        
                        <div className="number-display flex justify-center items-center mb-8">
                            <div className="relative">
                                {/* Visual representation of the number */}
                                <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                                    <div className="flex flex-wrap justify-center items-center gap-2 p-4">
                                        {Array.from({ length: currentNumber }).map((_, index) => (
                                            <div 
                                                key={index} 
                                                className="w-8 h-8 md:w-10 md:h-10 bg-yellow-300 rounded-full shadow-md"
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Number badge */}
                                <div className="absolute -top-4 -right-4 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-2xl font-bold">?</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Feedback */}
                        {showAnswer && (
                            <div className={`feedback p-4 rounded-lg mb-6 text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <p className="text-lg font-semibold">
                                    {isCorrect ? '🎉 Benar!' : '❌ Salah!'}
                                </p>
                                <p className="mt-2">
                                    {isCorrect 
                                        ? `Tepat! Itu adalah angka ${currentNumber}`
                                        : `Itu adalah angka ${currentNumber}`
                                    }
                                </p>
                            </div>
                        )}
                        
                        {/* Controls */}
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={nextNumber}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Angka Selanjutnya
                            </button>
                            <button 
                                onClick={resetGame}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                            >
                                Ulang Permainan
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Side - Number Buttons */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-700">Pilih Jawaban</h2>
                            <p className="text-gray-500">Klik angka yang sesuai dengan jumlah lingkaran di sebelah kiri</p>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4">
                            {numbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => checkAnswer(number)}
                                    disabled={showAnswer}
                                    className={`number-button h-24 flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                                        showAnswer && number === currentNumber
                                            ? 'bg-green-500 text-white scale-105'
                                            : 'bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200'
                                    } ${showAnswer ? 'cursor-not-allowed' : 'hover:shadow-lg'}`}
                                >
                                    <span className="text-3xl font-bold text-gray-800">{number}</span>
                                    <div className="flex mt-2">
                                        {Array.from({ length: Math.min(number, 3) }).map((_, i) => (
                                            <div key={i} className="w-2 h-2 bg-gray-600 rounded-full mx-0.5"></div>
                                        ))}
                                        {number > 3 && <span className="text-xs ml-1">+{number-3}</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* Number Chart */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Tabel Angka 1-10</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {numbers.map((number) => (
                                    <div 
                                        key={number}
                                        className="p-3 bg-gray-50 rounded-lg text-center"
                                    >
                                        <div className="text-lg font-bold text-blue-600">{number}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {number === 1 ? 'satu' : 
                                             number === 2 ? 'dua' :
                                             number === 3 ? 'tiga' :
                                             number === 4 ? 'empat' :
                                             number === 5 ? 'lima' :
                                             number === 6 ? 'enam' :
                                             number === 7 ? 'tujuh' :
                                             number === 8 ? 'delapan' :
                                             number === 9 ? 'sembilan' : 'sepuluh'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Progress Belajar</span>
                        <span className="text-blue-600 font-bold">{Math.round((score / Math.max(totalQuestions, 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${(score / Math.max(totalQuestions, 1)) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        {score} jawaban benar dari {totalQuestions} pertanyaan
                    </p>
                </div>
                
                {/* Donation Section */}
                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border border-yellow-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-bold text-yellow-800">💝 Sukai Aplikasi Ini?</h3>
                            <p className="text-yellow-700 text-sm mt-1">
                                Bantu kami terus mengembangkan konten edukasi gratis untuk anak-anak
                            </p>
                        </div>
                        <a 
                            href="https://teer.id/masgardha" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => soundManager.playClick()}
                            className="donation-button px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            💖 Donasi
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Angka;