import { useState, useEffect } from "react"
import soundManager from "../../utils/sounds"
import './Penjumlahan.css'
import '../DonationButton.css'

export default function Penjumlahan(props) {
    const [jumlahSoal, setJumlahSoal] = useState(1)
    const [point, setPoint] = useState(0)
    const [soal, setSoal] = useState(generateSoal())
    const [jawaban, setJawaban] = useState(generateJawaban(soal))
    const [timeLeft, setTimeLeft] = useState(3 * 60) // 3 menit
    const [isTimeUp, setIsTimeUp] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [isCorrect, setIsCorrect] = useState(null)
    const [streak, setStreak] = useState(0)
    const [floatingNumbers, setFloatingNumbers] = useState([])

    // Generate floating numbers for background
    useEffect(() => {
        const numbers = []
        for (let i = 0; i < 20; i++) {
            numbers.push({
                id: i,
                value: Math.floor(Math.random() * 20) + 1,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 20 + 15,
                speed: Math.random() * 3 + 1
            })
        }
        setFloatingNumbers(numbers)
    }, [])

    function generateSoal() {
        const num1 = Math.floor(Math.random() * 20) + 1
        const num2 = Math.floor(Math.random() * 20) + 1
        return {
            angka1: num1,
            angka2: num2,
            hasil: num1 + num2,
        }
    }

    function generateJawaban(soal) {
        const jawabanBenar = soal.hasil
        const jawabanSalah1 = jawabanBenar + Math.floor(Math.random() * 10) + 1
        const jawabanSalah2 = jawabanBenar - Math.floor(Math.random() * 10) - 1
        
        const jawabanArr = [jawabanBenar, jawabanSalah1, jawabanSalah2]
        return jawabanArr.sort(() => Math.random() - 0.5)
    }

    function handleJawaban(pilihan, index) {
        if (showFeedback) return
        
        setSelectedAnswer(index)
        setShowFeedback(true)
        
        const correct = pilihan === soal.hasil
        setIsCorrect(correct)
        
        if (correct) {
            // Calculate points based on streak and time left
            const basePoints = 10
            const streakBonus = Math.min(streak * 2, 20) // Max 20 bonus points
            const timeBonus = Math.floor(timeLeft / 10) // Bonus based on remaining time
            const totalPoints = basePoints + streakBonus + timeBonus
            
            setPoint(point + totalPoints)
            setStreak(streak + 1)
            
            // Play correct sound
            soundManager.playCorrect()
        } else {
            setStreak(0)
            // Play wrong sound
            soundManager.playWrong()
        }
        
        // Move to next question after delay
        setTimeout(() => {
            setJumlahSoal(jumlahSoal + 1)
            const newSoal = generateSoal()
            setSoal(newSoal)
            setJawaban(generateJawaban(newSoal))
            setSelectedAnswer(null)
            setShowFeedback(false)
            setIsCorrect(null)
        }, 1500)
    }

    useEffect(() => {
        if (isTimeUp) return
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    setIsTimeUp(true)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isTimeUp])

    function exit() {
        soundManager.playClick()
        props.setView('mainMenu')
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
    }

    function resetGame() {
        soundManager.playClick()
        setJumlahSoal(1)
        setPoint(0)
        setSoal(generateSoal())
        setJawaban(generateJawaban(soal))
        setTimeLeft(3 * 60)
        setIsTimeUp(false)
        setStreak(0)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setIsCorrect(null)
    }

    const progress = (timeLeft / (3 * 60)) * 100

    return (
        <div className="penjumlahan-container min-h-screen bg-gradient-to-br from-green-50 to-teal-100 overflow-hidden relative">
            {/* Background floating numbers */}
            <div className="absolute inset-0 overflow-hidden">
                {floatingNumbers.map((num) => (
                    <div
                        key={num.id}
                        className="absolute floating-number"
                        style={{
                            left: `${num.left}%`,
                            top: `${num.top}%`,
                            fontSize: `${num.size}px`,
                            animationDuration: `${num.speed}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        {num.value}
                    </div>
                ))}
            </div>
            


            <div className="relative z-10">
                {/* Header */}
                <div className="header-section p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <button 
                                onClick={exit}
                                className="exit-button px-5 py-3 bg-white hover:bg-gray-100 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                            >
                                <span className="text-xl">←</span> Kembali
                            </button>
                            
                            <div className="text-center">
                                <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">
                                    🎯 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">Petualangan Penjumlahan</span>
                                </h1>
                                <p className="text-lg text-gray-600">Jumlahkan dengan cepat dan dapatkan poin!</p>
                            </div>
                            
                            <div className="character">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
                                        <span className="text-4xl">➕</span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                        <span className="text-white text-xs font-bold">{streak}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="stats-section px-6 mb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="stat-card bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Soal ke</p>
                                    <p className="text-3xl font-bold text-blue-600">{jumlahSoal}</p>
                                </div>
                            </div>
                            
                            <div className="stat-card bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Total Poin</p>
                                    <p className="text-3xl font-bold text-green-600">{point}</p>
                                </div>
                            </div>
                            
                            <div className="stat-card bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Streak</p>
                                    <p className="text-3xl font-bold text-orange-600">{streak} 🔥</p>
                                </div>
                            </div>
                            
                            <div className="stat-card bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Waktu</p>
                                    <p className={`text-3xl font-bold ${timeLeft < 30 ? 'text-red-600' : 'text-purple-600'}`}>
                                        {formatTime(timeLeft)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timer Progress */}
                {!isTimeUp && (
                    <div className="timer-section px-6 mb-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-700 font-semibold">⏰ Waktu Tersisa</span>
                                    <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div 
                                        className="timer-progress h-4 rounded-full transition-all duration-1000"
                                        style={{ 
                                            width: `${progress}%`,
                                            background: `linear-gradient(90deg, ${timeLeft < 30 ? '#ef4444' : '#10b981'}, ${timeLeft < 30 ? '#f97316' : '#3b82f6'})`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Game Area */}
                {!isTimeUp ? (
                    <div className="game-section px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Question Display */}
                                <div className="question-card bg-white rounded-3xl shadow-2xl p-8">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-700">Berapa Hasilnya?</h2>
                                        <p className="text-gray-500">Pilih jawaban yang benar</p>
                                    </div>
                                    
                                    {/* Visual Addition */}
                                    <div className="addition-visual mb-8">
                                        <div className="flex flex-col items-center">
                                            {/* First number */}
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Kelompok Pertama: {soal.angka1}</h3>
                                                <div className="flex flex-wrap justify-center gap-3">
                                                    {Array.from({ length: soal.angka1 }).map((_, i) => (
                                                        <div key={i} className="w-10 h-10 bg-blue-400 rounded-full shadow-md"></div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Plus symbol */}
                                            <div className="my-4">
                                                <div className="text-6xl font-bold text-green-500">+</div>
                                            </div>
                                            
                                            {/* Second number */}
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Kelompok Kedua: {soal.angka2}</h3>
                                                <div className="flex flex-wrap justify-center gap-3">
                                                    {Array.from({ length: soal.angka2 }).map((_, i) => (
                                                        <div key={i} className="w-10 h-10 bg-green-400 rounded-full shadow-md"></div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Equals */}
                                            <div className="my-6">
                                                <div className="text-4xl font-bold text-gray-700">=</div>
                                            </div>
                                            
                                            {/* Question mark */}
                                            <div className="mt-4">
                                                <div className="text-5xl font-bold text-purple-600">?</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Question text */}
                                    <div className="text-center mt-8">
                                        <div className="question-text text-6xl font-bold text-gray-800">
                                            {soal.angka1} + {soal.angka2} = ?
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Answer Options */}
                                <div className="answers-card bg-white rounded-3xl shadow-2xl p-8">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-700">Pilih Jawaban</h2>
                                        <p className="text-gray-500">Klik salah satu kotak di bawah</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {jawaban.map((jawabanPilihan, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleJawaban(jawabanPilihan, index)}
                                                disabled={showFeedback}
                                                className={`answer-option p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                                                    selectedAnswer === index
                                                        ? isCorrect
                                                            ? 'bg-green-500 text-white scale-105'
                                                            : 'bg-red-500 text-white scale-105'
                                                        : 'bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100'
                                                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="text-left">
                                                        <div className="text-sm text-gray-500">Pilihan {index + 1}</div>
                                                        <div className="text-4xl font-bold">{jawabanPilihan}</div>
                                                    </div>
                                                    <div className="text-3xl">
                                                        {selectedAnswer === index && isCorrect && '✅'}
                                                        {selectedAnswer === index && !isCorrect && '❌'}
                                                        {!selectedAnswer && '🔢'}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Feedback */}
                                    {showFeedback && (
                                        <div className={`feedback mt-6 p-4 rounded-xl text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            <p className="text-2xl font-bold mb-2">
                                                {isCorrect ? '🎉 Hore! Benar!' : '❌ Coba lagi!'}
                                            </p>
                                            <p>
                                                {isCorrect 
                                                    ? `Kamu mendapatkan poin! Streak: ${streak}`
                                                    : `Jawaban yang benar adalah ${soal.hasil}`
                                                }
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Tips */}
                                    <div className="tips-section mt-8 p-4 bg-yellow-50 rounded-xl">
                                        <p className="text-yellow-800 font-semibold mb-2">💡 Tips Penjumlahan:</p>
                                        <ul className="text-yellow-700 text-sm space-y-1">
                                            <li>• Hitung semua lingkaran biru dan hijau</li>
                                            <li>• Jawab cepat dapat bonus poin</li>
                                            <li>• Streak yang panjang memberikan bonus lebih besar</li>
                                            <li>• Waktu tersisa juga memberikan bonus poin</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Game Over Screen */
                    <div className="game-over-section px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                                <div className="text-8xl mb-6">⏰</div>
                                <h2 className="text-4xl font-bold text-red-600 mb-4">Waktu Habis!</h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    Petualangan penjumlahan selesai. Kamu hebat!
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="result-card bg-blue-50 p-6 rounded-2xl">
                                        <p className="text-gray-500">Total Soal</p>
                                        <p className="text-3xl font-bold text-blue-600">{jumlahSoal - 1}</p>
                                    </div>
                                    <div className="result-card bg-green-50 p-6 rounded-2xl">
                                        <p className="text-gray-500">Total Poin</p>
                                        <p className="text-3xl font-bold text-green-600">{point}</p>
                                    </div>
                                    <div className="result-card bg-orange-50 p-6 rounded-2xl">
                                        <p className="text-gray-500">Streak Tertinggi</p>
                                        <p className="text-3xl font-bold text-orange-600">{streak} 🔥</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={resetGame}
                                        className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg"
                                    >
                                        🎮 Main Lagi
                                    </button>
                                    <button
                                        onClick={exit}
                                        className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors shadow-lg"
                                    >
                                        ← Kembali ke Menu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Controls */}
                {!isTimeUp && (
                    <div className="controls-section px-6 mt-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={resetGame}
                                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        🔄 Ulang Permainan
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newSoal = generateSoal()
                                            setSoal(newSoal)
                                            setJawaban(generateJawaban(newSoal))
                                            setSelectedAnswer(null)
                                            setShowFeedback(false)
                                        }}
                                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        ⏭️ Lewat Soal
                                    </button>
                                </div>
                                
                                {/* Donation Section */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="text-center md:text-left">
                                            <h3 className="text-lg font-bold text-yellow-800">💝 Dukung Kami</h3>
                                            <p className="text-yellow-700 text-sm mt-1">
                                                Bantu kami terus membuat konten edukasi yang menyenangkan
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
                    </div>
                )}
            </div>
        </div>
    )
}
