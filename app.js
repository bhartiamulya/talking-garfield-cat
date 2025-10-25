const state = {
    tapCount: 0,
    mood: 'lazy',
    currentPose: 'neutral',
    isRecording: false,
    audioContext: null,
    mediaRecorder: null,
    recordedChunks: [],
    currentAudio: null,
    isAnimating: false
};

const catPoses = {
    neutral: 'assets/images/cat-neutral.jpeg',
    happy: 'assets/images/cat-happy.jpeg',
    winking: 'assets/images/cat-winking.jpeg',
    jumping: 'assets/images/cat-jumping.jpeg',
    eating: 'assets/images/cat-eating.jpeg',
    sleeping: 'assets/images/cat-sleeping.jpeg'
};

const catSounds = {
    meow1: 'assets/sounds/meow1.mp3',
    meow2: 'assets/sounds/meow2.mp3',
    purr: 'assets/sounds/purr.mp3',
    surprised: 'assets/sounds/surprised.mp3',
    happy: 'assets/sounds/happy.mp3',
    eating: 'assets/sounds/eating.mp3',
    response1: 'assets/sounds/talkTomeSounds/response1.mp3',
    response2: 'assets/sounds/talkTomeSounds/response2.mp3',
    response3: 'assets/sounds/talkTomeSounds/response3.mp3',
    response4: 'assets/sounds/talkTomeSounds/response4.mp3',
    response5: 'assets/sounds/talkTomeSounds/response5.mp3'
};

const catMessages = [
    "I hate Mondays... 😴",
    "Where's my lasagna? 🍕",
    "I'm not lazy, I'm energy efficient! ⚡",
    "Meow means meow in cat 🐱",
    "I need more sleep... and food 😺",
    "Odie is annoying! 🐕",
    "Feed me, human! 🍝",
    "Naps are life 💤",
    "I'm purrfect just the way I am 😸",
    "Garfield is my spirit animal 🧡",
    "Too lazy to care 😎",
    "Lasagna > Everything 🍕",
    "Monday? No thanks! 🚫",
    "I do what I want 😼",
    "More food, less exercise 🍔"
];

const garfieldResponses = [
    { text: "I heard you, but I'm too lazy to care.", sound: 'response1', pose: 'neutral' },
    { text: "Did you say lasagna? I'm listening now!", sound: 'response2', pose: 'happy' },
    { text: "That's nice, but where's my food?", sound: 'response3', pose: 'winking' },
    { text: "Mondays are the worst, am I right?", sound: 'response4', pose: 'neutral' },
    { text: "You're interrupting my nap time.", sound: 'response5', pose: 'sleeping' }
];

const funMessages = [
    "Garfield's mood: Perpetually hungry",
    "Energy level: Conserving for lasagna",
    "Current activity: Professional napping",
    "Status: Avoiding Mondays successfully",
    "Mission: Find all the lasagna"
];

const catImage = document.getElementById('catImage');
const catWrapper = document.getElementById('catWrapper');
const speechBubble = document.getElementById('speechBubble');
const catMessage = document.getElementById('catMessage');
const tapCountDisplay = document.getElementById('tapCount');
const moodDisplay = document.getElementById('moodDisplay');
const feedBtn = document.getElementById('feedBtn');
const petBtn = document.getElementById('petBtn');
const recordBtn = document.getElementById('recordBtn');
const recordingStatus = document.getElementById('recordingStatus');
const funMessage = document.getElementById('funMessage');

function init() {
    console.log('🐱 Talking Garfield Cat initialized!');
    
    showRandomFunMessage();
    
    preloadSounds();
    
    catWrapper.addEventListener('click', handleCatTap);
    feedBtn.addEventListener('click', handleFeed);
    petBtn.addEventListener('click', handlePet);
    recordBtn.addEventListener('click', handleRecord);
    
    setInterval(randomCatAction, 10000);
    setInterval(showRandomFunMessage, 15000);
}

function handleCatTap() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    
    state.tapCount++;
    tapCountDisplay.textContent = state.tapCount;
    
    const soundOptions = ['meow1', 'meow2', 'surprised'];
    const randomSound = getRandomItem(soundOptions);
    
    const soundToPose = {
        'meow1': 'neutral',
        'meow2': 'winking',
        'surprised': 'jumping'
    };
    
    playSound(randomSound);
    changePose(soundToPose[randomSound]);
    

    showMessage(getRandomMessage());
    
    addAnimation('bounce');
    
    updateMood();
    
    setTimeout(() => {
        state.isAnimating = false;
    }, 800);
}

function handleFeed() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    
    playSound('eating');
    changePose('eating');
    showMessage("Mmm... lasagna! My favorite! 🍕😋");
    addAnimation('happy');
    
    setTimeout(() => {
        showMessage("That was delicious! More please! 😸");
        state.isAnimating = false;
    }, 3000);
    
    state.mood = 'happy';
    updateMoodDisplay();
}

function handlePet() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    
    playSound('purr');
    changePose('happy');
    showMessage("Purrrr... I'll allow this 😺");
    addAnimation('shake');
    
    setTimeout(() => {
        state.isAnimating = false;
    }, 3000);
    
    state.mood = 'content';
    updateMoodDisplay();
}

async function handleRecord() {
    if (!state.isRecording) {
        await startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.mediaRecorder = new MediaRecorder(stream);
        state.recordedChunks = [];
        
        state.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                state.recordedChunks.push(event.data);
            }
        };
        
        state.mediaRecorder.onstop = () => {
            processRecording();
        };
        
        state.mediaRecorder.start();
        state.isRecording = true;
        
        recordingStatus.classList.add('active');
        recordBtn.innerHTML = '<span class="btn-icon">⏹️</span> Stop Recording';
        showMessage("I'm listening... 👂");
        changePose('winking');
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        showMessage("Oops! Can't access microphone 😿");
    }
}

function stopRecording() {
    if (state.mediaRecorder && state.isRecording) {
        state.mediaRecorder.stop();
        state.isRecording = false;
        
        recordingStatus.classList.remove('active');
        recordBtn.innerHTML = '<span class="btn-icon">🎤</span> Talk to Me';
        
        state.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
}

function processRecording() {
    if (state.recordedChunks.length === 0) return;
    
    const blob = new Blob(state.recordedChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(blob);
    URL.revokeObjectURL(audioUrl);
    
    const response = getRandomItem(garfieldResponses);
    
    // Change pose and show message
    changePose(response.pose);
    showMessage(response.text);
    addAnimation('bounce');
    
    playSound(response.sound);
    
    setTimeout(() => {
        changePose('neutral');
    }, 4000);
}

// Change Cat Pose
function changePose(pose) {
    if (catPoses[pose]) {
        state.currentPose = pose;
        catImage.src = catPoses[pose];
        
        catImage.onerror = () => {
            catImage.src = createPlaceholderImage(pose);
        };
    }
}

function createPlaceholderImage(pose) {
    const colors = {
        neutral: '#FF6B35',
        happy: '#FFD700',
        winking: '#FF69B4',
        jumping: '#00CED1',
        eating: '#FF8C00',
        sleeping: '#9370DB'
    };
    
    const color = colors[pose] || '#FF6B35';
    
    const svg = `
        <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg">
            <circle cx="140" cy="140" r="100" fill="${color}"/>
            <circle cx="110" cy="120" r="15" fill="white"/>
            <circle cx="170" cy="120" r="15" fill="white"/>
            <circle cx="115" cy="120" r="8" fill="black"/>
            <circle cx="175" cy="120" r="8" fill="black"/>
            <path d="M 110 160 Q 140 180 170 160" stroke="black" stroke-width="3" fill="none"/>
            <text x="140" y="260" text-anchor="middle" font-size="20" fill="#333">${pose.toUpperCase()}</text>
        </svg>
    `;
    
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

function addAnimation(animationClass) {
    catImage.classList.add(animationClass);
    setTimeout(() => {
        catImage.classList.remove(animationClass);
    }, 600);
}

function showMessage(message) {
    catMessage.textContent = message;
    speechBubble.classList.add('show');
    
    setTimeout(() => {
        speechBubble.classList.remove('show');
    }, 3000);
}


function playSound(soundKey) {
    
    if (state.currentAudio) {
        state.currentAudio.pause();
        state.currentAudio.currentTime = 0;
    }
    
    const soundPath = catSounds[soundKey];
    if (soundPath) {
        const audio = new Audio(soundPath);
        audio.volume = 0.5;
        state.currentAudio = audio;
        
        
        audio.onerror = () => {
            createBeepSound();
        };
        
        audio.play().catch(err => {
            console.log('Audio play failed:', err);
            createBeepSound();
        });
        
        
        audio.onended = () => {
            if (state.currentAudio === audio) {
                state.currentAudio = null;
            }
        };
    }
}


function createBeepSound() {
    if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = state.audioContext.createOscillator();
    const gainNode = state.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(state.audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, state.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, state.audioContext.currentTime + 0.3);
    
    oscillator.start(state.audioContext.currentTime);
    oscillator.stop(state.audioContext.currentTime + 0.3);
}


function preloadSounds() {
    Object.values(catSounds).forEach(soundPath => {
        const audio = new Audio(soundPath);
        audio.preload = 'auto';
    });
}

function updateMood() {
    if (state.tapCount > 20) {
        state.mood = 'annoyed';
    } else if (state.tapCount > 10) {
        state.mood = 'playful';
    } else if (state.tapCount > 5) {
        state.mood = 'happy';
    } else {
        state.mood = 'lazy';
    }
    
    updateMoodDisplay();
}

function updateMoodDisplay() {
    const moodEmojis = {
        lazy: '😴 Lazy',
        happy: '😸 Happy',
        playful: '😺 Playful',
        annoyed: '😾 Annoyed',
        content: '😌 Content'
    };
    
    moodDisplay.textContent = moodEmojis[state.mood] || '😺 Happy';
}

function randomCatAction() {
    const actions = [
        () => {
            changePose('sleeping');
            showMessage("Zzz... 💤");
        },
        () => {
            changePose('winking');
            showMessage("😉");
            addAnimation('shake');
        },
        () => {
            changePose('jumping');
            showMessage("Stretch time! 🤸");
            addAnimation('bounce');
        }
    ];
    
    const randomAction = getRandomItem(actions);
    randomAction();
    
    setTimeout(() => {
        changePose('neutral');
    }, 3000);
}

function showRandomFunMessage() {
    funMessage.textContent = getRandomItem(funMessages);
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomMessage() {
    return getRandomItem(catMessages);
}

function getRandomSound(soundKeys) {
    return getRandomItem(soundKeys);
}

function getRandomPose() {
    const poses = ['neutral', 'happy', 'winking', 'jumping'];
    return getRandomItem(poses);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { state, changePose, playSound, showMessage };
}
