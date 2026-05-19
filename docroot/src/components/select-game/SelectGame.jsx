import { useState, useEffect } from 'react';
import soundManager from '../../utils/sounds';
import './SelectGame.css';
import '../DonationButton.css';

function SelectGame(props) {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [floatingElements, setFloatingElements] = useState([]);
    
    // Create floating elements for background animation
    useEffect(() => {
        const elements = [];
        for (let i = 0; i < 15; i++) {
            elements.push({
                id: i,
                type: Math.random() > 0.5 ? 'number' : 'symbol',
                value: Math.floor(Math.random() * 10) + 1,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1
            });
        }
        setFloatingElements(elements);
    }, []);
    
    const gameCards = [
        {
            id: 'angka',
            title: 'Angka 1-10',
            subtitle: 'Belajar Angka',
            icon: '🔢',
            color: 'from-pink-400 to-pink-600',
            hoverColor: 'from-pink-500 to-pink-700',
            description: 'Kenali angka 1 sampai 10 dengan gambar yang lucu',
            view: 'pengenalan-angka'
        },
        {
            id: 'penjumlahan',
            title: 'Penjumlahan',
            subtitle: 'Tambah-tambahan',
            icon: '➕',
            color: 'from-green-400 to-green-600',
            hoverColor: 'from-green-500 to-green-700',
            description: 'Belajar menjumlahkan angka dengan cara yang menyenangkan',
            view: 'penjumlahan'
        },
        {
            id: 'pengurangan',
            title: 'Pengurangan',
            subtitle: 'Kurang-kurangan',
            icon: '➖',
            color: 'from-blue-400 to-blue-600',
            hoverColor: 'from-blue-500 to-blue-700',
            description: 'Belajar mengurangi angka dengan permainan seru',
            view: 'pengurangan'
        },
        {
            id: 'perkalian',
            title: 'Perkalian',
            subtitle: 'Kali-kalian',
            icon: '✖️',
            color: 'from-yellow-400 to-yellow-600',
            hoverColor: 'from-yellow-500 to-yellow-700',
            description: 'Belajar perkalian dasar dengan bantuan visual',
            view: 'perkalian'
        },
        {
            id: 'pembagian',
            title: 'Pembagian',
            subtitle: 'Bagi-bagian',
            icon: '➗',
            color: 'from-purple-400 to-purple-600',
            hoverColor: 'from-purple-500 to-purple-700',
            description: 'Belajar pembagian dengan cara yang mudah dipahami',
            view: 'pembagian'
        },
        {
            id: 'acak',
            title: 'Campuran',
            subtitle: 'Semua Soal',
            icon: '🎲',
            color: 'from-orange-400 to-orange-600',
            hoverColor: 'from-orange-500 to-orange-700',
            description: 'Latihan semua jenis soal matematika secara acak',
            view: 'acak'
        }
    ];
    
    const handleCardClick = (view) => {
        soundManager.playClick();
        // Add click animation
        const button = document.activeElement;
        if (button) {
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
                props.setView(view);
            }, 300);
        } else {
            props.setView(view);
        }
    };
    
    return (
        <div className="select-game-container min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {floatingElements.map((element) => (
                    <div
                        key={element.id}
                        className={`absolute floating-element ${element.type}`}
                        style={{
                            left: `${element.left}%`,
                            top: `${element.top}%`,
                            fontSize: `${element.size}px`,
                            animationDuration: `${element.speed}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        {element.type === 'number' ? element.value : ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)]}
                    </div>
                ))}
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
                {/* Header with character */}
                <div className="header-section pt-8 pb-6 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">
                                    🎮 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Petualangan Matematika</span>
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Pilih permainan matematika yang seru untuk belajar!
                                </p>
                            </div>
                            
                            <div className="character-container">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
                                        <span className="text-4xl">🧮</span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                                        <span className="text-white text-sm font-bold">!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Game cards grid */}
                <div className="game-cards-section px-4 pb-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gameCards.map((card) => (
                                <button
                                    key={card.id}
                                    onClick={() => handleCardClick(card.view)}
                                    onMouseEnter={() => setHoveredCard(card.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className={`game-card relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                                        hoveredCard === card.id ? 'scale-105' : ''
                                    }`}
                                >
                                    {/* Card background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`}></div>
                                    
                                    {/* Hover effect overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.hoverColor} opacity-0 transition-opacity duration-300 ${
                                        hoveredCard === card.id ? 'opacity-100' : ''
                                    }`}></div>
                                    
                                    {/* Card content */}
                                    <div className="relative z-10 p-6 h-full flex flex-col">
                                        {/* Icon */}
                                        <div className="mb-4">
                                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
                                                <span className="text-4xl">{card.icon}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Title and subtitle */}
                                        <div className="text-center mb-4">
                                            <h3 className="text-2xl font-bold text-white mb-1">{card.title}</h3>
                                            <p className="text-white/80 font-medium">{card.subtitle}</p>
                                        </div>
                                        
                                        {/* Description */}
                                        <p className="text-white/90 text-center text-sm mb-6 flex-grow">
                                            {card.description}
                                        </p>
                                        
                                        {/* Play button */}
                                        <div className="mt-auto">
                                            <div className="play-button bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-center">
                                                <span className="text-white font-bold flex items-center justify-center gap-2">
                                                    <span>Mainkan</span>
                                                    <span className="text-lg">▶️</span>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Decorative elements */}
                                        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
                                        <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full"></div>
                                    </div>
                                    
                                    {/* Glow effect */}
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${card.color} rounded-3xl blur opacity-0 transition-opacity duration-500 ${
                                        hoveredCard === card.id ? 'opacity-30' : ''
                                    }`}></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Footer with stats and donation */}
                <div className="footer-section px-4 pb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">6</div>
                                    <p className="text-gray-600">Jenis Permainan</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">∞</div>
                                    <p className="text-gray-600">Soal Tak Terbatas</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">🎯</div>
                                    <p className="text-gray-600">Belajar Seru</p>
                                </div>
                            </div>
                            
                            {/* Donation Section */}
                            <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-lg font-bold text-yellow-800">💝 Dukung Pengembangan</h3>
                                        <p className="text-yellow-700 text-sm mt-1">
                                            Bantu kami terus mengembangkan aplikasi edukasi gratis ini
                                        </p>
                                    </div>
                                    <a 
                                        href="https://teer.id/masgardha" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={() => soundManager.playClick()}
                                        className="donation-button px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        💖 Donasi Sekarang
                                    </a>
                                </div>
                                <p className="text-yellow-600 text-xs text-center mt-3">
                                    Setiap donasi membantu kami menambah fitur baru dan memperbaiki aplikasi
                                </p>
                            </div>
                            
                            <div className="mt-6 text-center">
                                <p className="text-gray-500 text-sm">
                                    Cocok untuk anak usia 4-8 tahun • Belajar sambil bermain • Tanpa iklan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectGame;