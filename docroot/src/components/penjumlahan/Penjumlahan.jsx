import { useState, useEffect } from "react"

export default function Penjumlahan(props) {
    const [jumlahSoal, setJumlahSoal] = useState(1)  // Mulai dengan 1 soal
    const [point, setPoint] = useState(0)
    const [soal, setSoal] = useState(generateSoal())  // Soal pertama
    const [jawaban, setJawaban] = useState(generateJawaban(soal))  // Jawaban pertama
    const [timeLeft, setTimeLeft] = useState(5 * 60)  // Timer 20 menit dalam detik
    const [isTimeUp, setIsTimeUp] = useState(false)  // Untuk mengecek apakah waktu sudah habis

    // Fungsi untuk generate soal penjumlahan acak
    function generateSoal() {
        const num1 = Math.floor(Math.random() * 20) + 1  // Angka pertama (1-100)
        const num2 = Math.floor(Math.random() * 20) + 1  // Angka kedua (1-100)
        return {
            angka1: num1,
            angka2: num2,
            hasil: num1 + num2,
        }
    }

    // Fungsi untuk generate pilihan jawaban acak
    function generateJawaban(soal) {
        const jawabanBenar = soal.hasil
        const jawabanSalah1 = jawabanBenar + Math.floor(Math.random() * 20) + 1  // Jawaban salah 1
        const jawabanSalah2 = jawabanBenar - Math.floor(Math.random() * 20) - 1  // Jawaban salah 2
        
        // Mengacak pilihan jawaban
        const jawabanArr = [jawabanBenar, jawabanSalah1, jawabanSalah2]
        return jawabanArr.sort(() => Math.random() - 0.5)  // Mengacak urutan
    }

    // Fungsi untuk menangani pilihan jawaban
    function handleJawaban(pilihan) {
        if (pilihan === soal.hasil) {
            setPoint(point + 10)  // Tambah point jika benar
        }
        // Jika semua soal sudah dijawab, lanjutkan ke soal berikutnya (misalnya jumlahSoal bisa bertambah)
        setJumlahSoal(jumlahSoal + 1)
        const newSoal = generateSoal()
        setSoal(newSoal)
        setJawaban(generateJawaban(newSoal))
    }

    // Timer countdown effect
    useEffect(() => {
        if (isTimeUp) return; // Jika waktu sudah habis, stop timer
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    setIsTimeUp(true)  // Set waktu habis
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isTimeUp])  // Timer effect hanya dijalankan jika isTimeUp belum true

    function exit () {
        props.setView('mainMenu')
    }

    // Fungsi untuk format waktu (menit:detik)
    function formatTime(time) {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
    }

    // Menghitung persentase waktu yang tersisa
    const progress = (timeLeft / (5 * 60)) * 100;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-danger" onClick={exit}>Exit</button>

                <div>
                    <span className="h5">Soal ke: {jumlahSoal}</span> | 
                    <span className="h5">Point: {point}</span>
                </div>
            </div>

            {/* Progress Bar Timer */}
            {!isTimeUp && (
                <div className="mb-4">
                    <div className="d-flex gap-2 align-items-center">
                    <span>Timer</span>
                    <progress
                        className="w-100"
                        value={progress}
                        max="100"
                        style={{ height: "10px" }}
                    ></progress>
                    </div>
                   
                </div>
            )}

            {/* Waktu dalam format menit:detik */}
            <div className="text-center mb-4 d-none">
                <h3>Waktu: {formatTime(timeLeft)}</h3>
            </div>

            {/* Soal */}
            {!isTimeUp ? (
                <>
                    <div className="text-center pb-4">
                        <div className="h1 fw-bold soal mb-0">{soal.angka1} + {soal.angka2} = ?</div>
                    </div>

                    {/* Pilihan Jawaban */}
                    <div className="row pt-4">
                        {jawaban.map((jawabanPilihan, index) => (
                            <div key={index} className="col-4">
                                <div className="card shadow-sm bg-primary text-white" onClick={() => handleJawaban(jawabanPilihan)}>
                                    <div className="card-body text-center">
                                        <h2 className="card-title fw-bold mb-0">{jawabanPilihan}</h2>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                // Tampilkan skor jika waktu habis
                <div className="text-center">
                    <h2>Waktu Habis!</h2>
                    <h3>Skor Anda: {point}</h3>
                </div>
            )}
        </div>
    )
}
