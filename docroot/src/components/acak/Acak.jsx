import { useState, useEffect } from "react"
import soundManager from "../../utils/sounds"
import './Acak.css'
import '../DonationButton.css'

export default function Acak(props) {
    const [jumlahSoal, setJumlahSoal] = useState(1)
    const [point, setPoint] = useState(0)
    const [soal, setSoal] = useState(generateSoal())
    const [jawaban, setJawaban] = useState(generateJawaban(soal))
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [isCorrect, setIsCorrect] = useState(null)
    const [streak, setStreak] = useState(0)
    const [timeLeft, setTimeLeft] = useState(30)
    const [gameActive, setGameActive] = useState(true)
    const [operationColors] = useState({
        '+': 'from-green-400 to-green-600',
        '-': 'from-blue-400 to-blue-600',
        '*': 'from-yellow-400 to-yellow-600',
        '/': 'from-purple-400 to-purple-600'
    })

    function generateSoal() {
        const num1 = Math.floor(Math.random() * 20) + 1
        const num2 = Math.floor(Math.random() * 20) + 1
        const operasi = ['+', '-', '*', '/']
        const randomOperasi = operasi[Math.floor(Math.random() * operasi.length)]

        let hasil

        switch (randomOperasi) {
            case '+':
                hasil = num1 + num2
                break
            case '-':
                hasil = num1 - num2
                break
            case '*':
                hasil = num1 * num2
                break
            case '/':
                // Ensure division results in whole numbers
                hasil = Math.round((num1 / num2) * 10) / 10
                break
            default:
                hasil = 0
        }

        return {
            angka1: num1,
            angka2: num2,
            operasi: randomOperasi,
            hasil: parseFloat(hasil),
        }
    }

    function generateJawaban(soal) {
        const jawabanBenar = soal.hasil
        const jawabanSalah1 = jawabanBenar + Math.floor(Math.random() * 10) - 5
        const jawabanSalah2 = jawabanBenar - Math.floor(Math.random() * 10) + 5
        
        const jawabanArr = [jawabanBenar, jawabanSalah1, jawabanSalah2]
        return jawabanArr.sort(() => Math.random() - 0.5)
    }

    useEffect(() => {
        if (gameActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0) {
            setGameActive(false)
        }
    }, [timeLeft, gameActive])

    function handleJawaban(pilihan, index) {
        if (showFeedback || !gameActive) return
        
        setSelectedAnswer(index)
        setShowFeedback(true)
        
        const correct = Math.abs(pilihan - soal.hasil) < 0.01 // Allow small floating point differences
        setIsCorrect(correct)
        
        if (correct) {
            const basePoints = 10
            const streakBonus = Math.min(streak * 2, 20)
            const timeBonus = Math.floor(timeLeft / 10)
            const totalPoints = basePoints + streakBonus + timeBonus
            
            setPoint(point + totalPoints)
            setStreak(streak + 1)
            soundManager.playCorrect()
        } else {
            setStreak(0)
            soundManager.playWrong()
        }
        
        setTimeout(() => {
            setJumlahSoal(jumlahSoal + 1)
            const newSoal = generateSoal()
            setSoal(newSoal)
            setJawaban(generateJawaban(newSoal))
            setSelectedAnswer(null)
            setShowFeedback(false)
            setIsCorrect(null)
            setTimeLeft(30)
        }, 1500)
    }

    function exit() {
        soundManager.playClick()
        props.setView('mainMenu')
    }

    function resetGame() {
        soundManager.playClick()
        setJumlahSoal(1)
        setPoint(0)
        setSoal(generateSoal())
        setJawaban(generateJawaban(soal))
        setTimeLeft(30)
        setGameActive(true)
        setStreak(0)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setIsCorrect(null)
    }

    const operationSymbols = {
        '+': '➕',
        '-': '➖',
        '*': '✖️',
        '/': '➗'
    }

    return (
        <div className="acak-container min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <button 
                        onClick={exit}
                        className="px-4 py-2 bg-white hover:bg-gray-100 rounded-xl font-semibold transition-colors shadow-lg flex items-center gap-2"
                    >
                        <span>←</span> Kembali
                    </button>
                    
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-indigo-800">
                            🎲 Soal Campuran
                        </h1>
                        <p className="text-gray-600">Semua jenis operasi matematika!</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="score-card bg-white p-3 rounded-xl shadow-lg">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Poin</p>
                                <p className="text-2xl font-bold text-green-600">{point}</p>
                            </div>
                        </div>
                        
                        <div className="timer-card bg-white p-3 rounded-xl shadow-lg">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Waktu</p>
                                <p className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-blue-600'}`}>
                                    {timeLeft}s
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="stat-card bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p className="text-sm text-gray-500">Soal ke</p>
                        <p className="text-2xl font-bold text-blue-600">{jumlahSoal}</p>
                    </div>
                    
                    <div className="stat-card bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p className="text-sm text-gray-500">Streak</p>
                        <p className="text-2xl font-bold text-orange-600">{streak} 🔥</p>
                    </div>
                    
                    <div className="stat-card bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p className="text-sm text-gray-500">Operasi</p>
                        <p className="text-2xl font-bold text-purple-600">{operationSymbols[soal.operasi]}</p>
                    </div>
                    
                    <div className="stat-card bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p className="text-sm text-gray-500">Level</p>
                        <p className="text-2xl font-bold text-indigo-600">
                            {point < 100 ? 'Pemula' : point < 300 ? 'Menengah' : 'Master'}
                        </p>
                    </div>
                </div>

                {/* Main Game Area */}
                {gameActive ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Question Area */}
                        <div className={`question-area bg-gradient-to-br ${operationColors[soal.operasi]} rounded-2xl shadow-xl p-6`}>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-semibold text-white">Soal Campuran</h2>
                                <p className="text-white/80">Operasi: {soal.operasi === '*' ? 'Perkalian' : 
                                                                      soal.operasi === '/' ? 'Pembagian' : 
                                                                      soal.operasi === '+' ? 'Penjumlahan' : 'Pengurangan'}</p>
                            </div>
                            
                            {/* Question Display */}
                            <div className="text-center my-8">
                                <div className="question-text text-6xl font-bold text-white">
                                    {soal.angka1} {soal.operasi} {soal.angka2} = ?
                                </div>
                            </div>
                            
                            {/* Operation Info */}
                            <div className="operation-info bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-6">
                                <p className="text-white font-semibold text-center">
                                    {soal.operasi === '+' && `Jumlahkan ${soal.angka1} dan ${soal.angka2}`}
                                    {soal.operasi === '-' && `Kurangi ${soal.angka1} dengan ${soal.angka2}`}
                                    {soal.operasi === '*' && `Kalikan ${soal.angka1} dengan ${soal.angka2}`}
                                    {soal.operasi === '/' && `Bagi ${soal.angka1} dengan ${soal.angka2}`}
                                </p>
                            </div>
                            
                            {/* Current Answer Display */}
                            <div className="text-center mt-6">
                                <div className="current-answer text-4xl font-bold text-white">
                                    {showFeedback ? soal.hasil : '?'}
                                </div>
                            </div>
                        </div>
                        
                        {/* Answer Options */}
                        <div className="answers-area bg-white rounded-2xl shadow-xl p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-700">Pilih Jawaban</h2>
                                <p className="text-gray-500">Semua operasi matematika!</p>
                            </div>
                            
                            <div className="space-y-4">
                                {jawaban.map((jawabanPilihan, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleJawaban(jawabanPilihan, index)}
                                        disabled={showFeedback}
                                        className={`answer-option w-full p-4 rounded-xl transition-all duration-300 ${
                                            selectedAnswer === index
                                                ? isCorrect
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-red-500 text-white'
                                                : 'bg-gradient-to-r from-gray-50 to-indigo-50 hover:from-gray-100 hover:to-indigo-100'
                                        } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-left">
                                                <div className="text-sm text-gray-500">Pilihan {index + 1}</div>
                                                <div className="text-3xl font-bold">{jawabanPilihan}</div>
                                            </div>
                                            <div className="text-2xl">
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
                                    <p className="text-xl font-bold mb-2">
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
                            
                            {/* Operation Guide */}
                            <div className="operation-guide mt-6 p-4 bg-indigo-50 rounded-xl">
                                <p className="text-indigo-800 font-semibold mb-2">📚 Panduan Operasi:</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-center p-2 bg-white rounded">
                                        <div className="font-bold text-green-600">+ Penjumlahan</div>
                                        <div className="text-gray-500">Tambahkan kedua angka</div>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded">
                                        <div className="font-bold text-blue-600">- Pengurangan</div>
                                        <div className="text-gray-500">Kurangi angka pertama dengan kedua</div>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded">
                                        <div className="font-bold text-yellow-600">× Perkalian</div>
                                        <div className="text-gray-500">Kalikan kedua angka</div>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded">
                                        <div className="font-bold text-purple-600">÷ Pembagian</div>
                                        <div className="text-gray-500">Bagi angka pertama dengan kedua</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Game Over */
                    <div className="game-over bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-6">⏰</div>
                        <h2 className="text-3xl font-bold text-red-600 mb-4">Waktu Habis!</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Permainan selesai. Kamu menjawab {jumlahSoal - 1} soal campuran dengan {point} poin.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={resetGame}
                                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
                            >
                                🎮 Main Lagi
                            </button>
                            <button
                                onClick={exit}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
                            >
                                ← Kembali ke Menu
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Controls */}
                {gameActive && (
                    <div className="controls mt-6">
                        <div className="flex justify-center gap-4 mb-4">
                            <button
                                onClick={resetGame}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
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
                                    setTimeLeft(30)
                                }}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                ⏭️ Soal Baru
                            </button>
                        </div>
                        
                        {/* Donation Section */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-center md:text-left">
                                    <h3 className="text-lg font-bold text-yellow-800">💝 Dukung Pengembangan</h3>
                                    <p className="text-yellow-700 text-sm mt-1">
                                        Bantu kami terus menambah fitur dan game baru
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
                )}
            </div>
        </div>
    )
}
