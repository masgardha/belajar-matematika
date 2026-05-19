// Utility untuk memutar suara feedback
class SoundManager {
    constructor() {
        this.sounds = {
            correct: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'),
            wrong: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),
            click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'),
            success: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'),
            gameOver: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-over-tetris-2047.mp3')
        };
        
        // Set volume
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });
        
        // Inisialisasi SpeechSynthesis untuk TTS
        this.speechSynth = window.speechSynthesis;
        this.voices = [];
        this.isTTSReady = false;
        
        // Load voices
        this.loadVoices();
    }
    
    loadVoices() {
        // Get available voices
        this.voices = this.speechSynth.getVoices();
        
        if (this.voices.length > 0) {
            this.isTTSReady = true;
        } else {
            // Retry after voices are loaded
            this.speechSynth.onvoiceschanged = () => {
                this.voices = this.speechSynth.getVoices();
                this.isTTSReady = this.voices.length > 0;
            };
        }
    }
    
    play(soundName) {
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => console.log('Audio play failed:', e));
            }
        } catch (error) {
            console.log('Sound error:', error);
        }
    }
    
    speak(text, lang = 'id-ID') {
        if (!this.isTTSReady || !this.speechSynth) {
            console.log('TTS not available');
            return;
        }
        
        // Cancel any ongoing speech
        this.speechSynth.cancel();
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.volume = 0.8;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        // Try to find Indonesian voice
        const indonesianVoice = this.voices.find(voice => 
            voice.lang.includes('id') || voice.lang.includes('ID')
        );
        
        if (indonesianVoice) {
            utterance.voice = indonesianVoice;
        }
        
        // Speak
        this.speechSynth.speak(utterance);
    }
    
    playCorrect() {
        this.play('correct');
        this.speak('Kamu benar!');
    }
    
    playWrong() {
        this.play('wrong');
        this.speak('Oops, salah!');
    }
    
    playClick() {
        this.play('click');
    }
    
    playSuccess() {
        this.play('success');
    }
    
    playGameOver() {
        this.play('gameOver');
    }
    
    // Method khusus untuk feedback (opsional, sudah ada di playCorrect/playWrong)
    speakCorrect() {
        this.speak('Kamu benar!');
    }
    
    speakWrong() {
        this.speak('Oops, salah!');
    }
    
    // Method untuk speakNumber dan speakOperation dihapus karena tidak diinginkan
    // speakNumber(number) {
    //     this.speak(`Angka ${number}`);
    // }
    
    // speakOperation(operation, num1, num2) {
    //     const operations = {
    //         '+': 'ditambah',
    //         '-': 'dikurangi',
    //         '*': 'dikali',
    //         '/': 'dibagi'
    //     };
    //     this.speak(`${num1} ${operations[operation] || operation} ${num2}`);
    // }
}

// Buat instance global
const soundManager = new SoundManager();

export default soundManager;