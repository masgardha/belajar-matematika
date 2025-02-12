import { useState } from "react"

export default function Acak(props) {
    const [jumlahSoal, setJumlahSoal] = useState(1)  // Mulai dengan 1 soal
    const [point, setPoint] = useState(0)
    const [soal, setSoal] = useState(generateSoal())  // Soal pertama
    const [jawaban, setJawaban] = useState(generateJawaban(soal))  // Jawaban pertama

    // Fungsi untuk generate soal acak (+, -, *, /)
    function generateSoal() {
        const num1 = Math.floor(Math.random() * 20) + 1  // Angka pertama (1-20)
        const num2 = Math.floor(Math.random() * 20) + 1  // Angka kedua (1-20)
        const operasi = ['+', '-', '*', '/']  // Pilihan operasi
        const randomOperasi = operasi[Math.floor(Math.random() * operasi.length)]  // Memilih operasi secara acak

        let hasil;

        // Menghitung hasil berdasarkan operasi
        switch (randomOperasi) {
            case '+':
                hasil = num1 + num2
                break;
            case '-':
                hasil = num1 - num2
                break;
            case '*':
                hasil = num1 * num2
                break;
            case '/':
                hasil = (num1 / num2).toFixed(2) // Membatasi hasil pembagian ke 2 angka desimal
                break;
            default:
                hasil = 0;
        }

        return {
            angka1: num1,
            angka2: num2,
            operasi: randomOperasi,
            hasil: parseFloat(hasil),  // Pastikan hasil adalah angka
        }
    }

    // Fungsi untuk generate pilihan jawaban acak
    function generateJawaban(soal) {
        const jawabanBenar = soal.hasil
        const jawabanSalah1 = jawabanBenar + Math.floor(Math.random() * 10) - 5  // Jawaban salah 1
        const jawabanSalah2 = jawabanBenar - Math.floor(Math.random() * 10) + 5  // Jawaban salah 2
        
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

    function exit () {
        props.setView('mainMenu')
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-danger" onClick={exit}>Exit</button>

                <div>
                    <span className="h5">Jumlah Soal: {jumlahSoal}</span> | 
                    <span className="h5">Point: {point}</span>
                </div>
            </div>

            {/* Soal */}
            <div className="text-center mb-4">
                <h3>Soal:</h3>
                <div className="h1">{soal.angka1} {soal.operasi} {soal.angka2} = ?</div>
            </div>

            {/* Pilihan Jawaban */}
            <div className="row">
                {jawaban.map((jawabanPilihan, index) => (
                    <div key={index} className="col-4">
                        <div className="card shadow-sm bg-primary text-white" onClick={() => handleJawaban(jawabanPilihan)}>
                            <div className="card-body text-center">
                                <h2 className="card-title fw-bold">{jawabanPilihan}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
