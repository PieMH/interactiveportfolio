// Global variables
let soundEnabled = true;
let easterEggsFound = 0;
let bossHealth = 100;

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    updateProgressBar();
    setupScrollAnimations();
});

// Create floating particles
function createParticles() {
    const bgAnimation = document.getElementById('bgAnimation');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        bgAnimation.appendChild(particle);
    }
}

// Progress bar update
function updateProgressBar() {
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollHeight) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
    });
}

// Scroll animations and navigation
function setupScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    });

    // Navigation click events
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const section = document.getElementById(dot.getAttribute('data-section'));
            section.scrollIntoView({ behavior: 'smooth' });
            playSound('click');
        });
    });
}

// Sound system
function playSound(type) {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch(type) {
        case 'click':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        break;
        case 'hover':
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        break;
        case 'levelup':
        oscillator.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        break;
        case 'easter':
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        break;
    }

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Sound toggle
document.getElementById('soundToggle').addEventListener('click', () => {
soundEnabled = !soundEnabled;
document.getElementById('soundToggle').textContent = soundEnabled ? '🔊' : '🔇';
playSound('click');
});

// Project modal system with media support
const projectData = {
    'labyrainth': {
        title: 'LABYRAINTH',
        description: `LABYRAINTH is a blend of new ideas and technologies put together with some imagination, using Unreal Engine 5 and C++, combining AI with VR, and arcade games with maze exploration.

            Features of the game:
            • FPS arcade roguelite scifi game set in a dark alien world made of labyrinths
            • Play solo but participate in online leaderboards thanks to an asynchronous multiplayer system
            • For both PC, VR decivices
            • Escape the mazes in the shortest time while fighting aliens, avoiding traps and activating powers
            • 5 main game modes: Story, Infinite, Ranked, Survival, Creative

            I am the lead developer of this project, responsible for the game design, the technical architecture, the game mechanics, and the VR integration.
            I developed this game while working at my current company on other projects as well.
            As the game leader I was responsible of managing the team ensuring the overall quality of the game was met.
            I have also overlooked the marketing and the community management aspects of the game, ensuring a successful launch and ongoing player engagement.
            We officially released the game on Steam the 31st of October 2025.`,
        media: [
            { type: 'youtube', url: 'XcqDjeTV7TE', title: 'Gameplay Trailer' },
            { type: 'youtube', url: 'yNO7C4TddEk', title: 'Cinematic Story trailer' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/Walk1.gif', title: 'Walk gif' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/Run_to_Portal.gif', title: 'Run to Portal gif' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/Boss.gif', title: 'Aliens gif' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/VR.gif', title: 'VR gif' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/Labyrinths.gif', title: 'Labyrinths gif' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/wep_cust_syst.gif', title: 'Weapon Inventory gif' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/mazes.png', title: 'Maze' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/portal.png', title: 'Portal' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/space.png', title: 'Space' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/enemy.png', title: 'Enemy' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/explosion.png', title: 'Explosion' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/damage.png', title: 'Damaged' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/weapon.png', title: 'Weapon' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/bomb.png', title: 'Bomb trap' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/whitehole.png', title: 'White Hole trap' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/laser.png', title: 'Laser trap' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/die.png', title: 'Death' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/powerup.png', title: 'Power Up' },
            { type: 'image', url: 'Assets/PortfolioProjects/LabyrAInth/planet.png', title: 'Planet' },
            { type: 'youtube', url: 'TF1v-1nuZSI', title: 'Teaser trailer' },
        ],
        tech: ['Unreal Engine 5', 'C++', 'Blueprint', 'Game Design', 'VR', 'AI', 'Steam', 'Video production', 'Team management', 'Community management', 'Marketing']
    },
    'metarace': {
        title: 'Metarace',
        description: `Worked on a horse racing betting game for web3 platforms.
        
                Features of the game:
                • Horse racing betting game in 3D within a metaverse environment
                • Oculus VR, OpenXR and Windows Mixed Reality integration
                • Real-time multiplayer betting system with support for cryptocurrencies
                • Customizable horses and tracks
                • Support for NFTs and in-game purchases
                • Stylized low poly art style with a focus on performance and accessibility

                This project was developed as a proof of concept for a potential client, showcasing my ability to create engaging and immersive experiences in the metaverse space.`,
        media: [
            { type: 'video', url: 'Assets/PortfolioProjects/Metarace/Horses race.mp4', title: 'Metarace Demo with Horses' },
            { type: 'video', url: 'Assets/PortfolioProjects/Metarace/Drakes Run.mp4', title: 'Metarace Demo with Drakes' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture1.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture2.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture3.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture4.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture5.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture6.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture7.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture8.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture9.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture10.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture11.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture12.png', title: 'Metarace Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metarace/Picture13.png', title: 'Metarace Screenshot' }
        ],
        tech: ['Unreal Engine 5', 'C++', 'OpenXR', 'OculusVR', 'WindowsMR', 'Betting games', 'Web3', 'Cryptocurrencies & NFTs']
    },
    'metaverse': {
        title: 'Metaverse Platform',
        description: `An ambitious project that aimed to create a unified metaverse platform integrating multiple 3D online games into a single ecosystem.

                Key Features:
                • Multi-game integration with shared user profiles
                • Advanced VR interaction systems
                • Real-time multiplayer capabilities
                • Cross-platform compatibility
                • Dynamic world generation
                • Web3 integration for in-game economies

                I contributed to the development of the VR features of the metaverse, focusing on user interaction and adapting UI interaction in VR.
                I also worked on one of the games integrated into the metaverse, a 3D chess games built in Unreal Engine with real time multiplayer matches and a custom chess engine with support for AI opponents.`,
        media: [
            { type: 'video', url: 'Assets/PortfolioProjects/Metaverse/mostraMetaverso.mp4', title: 'Metaverse Lobby Demo view' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metaverse/Screenshot.png', title: 'Lobby Screenshot' },
            { type: 'image', url: 'Assets/PortfolioProjects/Metaverse/Screenshot1.png', title: 'Architecture Overview' }
        ],
        tech: ['Unreal Engine 5', 'C++', 'VR', 'Multiplayer Networking', 'Metaverse', 'Web3', 'Chess 3D']
    },
    'complex-adaptive-system': {
        title: 'Complex Adaptive System and Computational Models',
        description: `Project for my thesis program at University "Sapienza" of Rome, awarded with top grades.

                Technical Implementation:
                • Java computational model simulating ant behaviors
                • genetic AI algorithms for ants reproductions
                • Data visualization and analysis of ant emergent behaviors
                • Intuitive and interactive user interface design

                This project was backed by intensive studies on complex adaptive systems and especially social complex adaptive systems, and how they can be modeled using computational models.
                The Java application simulates an ant nest where multiple simple AI agents that behave like ants interact with each other and with the environment, creating complex behaviors and emergent patterns not encoded in the system.`,
        media: [
            { type: 'video', url: 'Assets/PortfolioProjects/CAS/Registrazione.mp4', title: 'CAS live demo' },
            { type: 'image', url: 'Assets/PortfolioProjects/CAS/Screenshot1.png', title: 'CAS Schema' },
            { type: 'image', url: 'Assets/PortfolioProjects/CAS/Screenshot2.png', title: 'CAS properties' },
            { type: 'image', url: 'Assets/PortfolioProjects/CAS/Screenshot3.png', title: 'The computational model of an ant nest' }
        ],
        tech: ['Java', 'AI', 'UI', 'Emergence', 'Complex Adaptive Systems', 'Data analysis', 'Genetic Algorithms']
    },
    'ostomaze': {
        title: 'OstoMaze',
        description: `OstoMaze is a simple game I developed for a university project, with two other colleagues, where the goal is to navigate a dungeon while avoiding obstacles and collecting items, that help the character with ostomy to be stronger and gain confidence in itself.

                Features of the game:
                • A 2D dungeon crawler game with a top-down view
                • Minimalistic RPG mechanics with a focus on exploration and item collection
                • Educational elements about ostomy care and confidence building
                • Simple yet engaging gameplay mechanics
                • Pixelart graphics with a focus on accessibility and inclusivity

                This was my first ever experience in building and designing a video game. I came up with the idea of the game and designed the mechanics, while my colleagues worked on the graphics and animation.
                I was responsible for the sound design, the SFX and VFX of the game and for the level design of the dungeons.
                An italian hospital overlooked the competition between multiple teams and awarded us with a prize for the best game, as it was the most fun and easy to play game for little children with ostomy.`,
        media: [
            { type: 'video', url: 'Assets/PortfolioProjects/OstoMaze/Registrazione.mp4', title: 'OstoMaze demo gameplay' },
            { type: 'image', url: 'Assets/PortfolioProjects/OstoMaze/logo.png', title: 'OstoMaze logo' },
            { type: 'image', url: 'Assets/PortfolioProjects/OstoMaze/Picture1.png', title: 'OstoMaze lobby' },
            { type: 'image', url: 'Assets/PortfolioProjects/OstoMaze/Picture2.png', title: 'OstoMaze maze dungeon' }
        ],
        tech: ['Unity', 'C#', '2D Game Development', 'Pixelart', 'Sound Design', 'Level Design', 'Educational Games', 'Gamification']
    },
    'web-portfolio': {
        title: 'Interactive Web Portfolio',
        description: `This very portfolio you're currently viewing represents a gamified approach to web development, featuring interactive elements, animations, and responsive design.

                Technical Features:
                • Pure CSS animations and transitions
                • JavaScript-based particle systems
                • Responsiveness and device adaptability
                • Gamified user interactions with sound effects and visual feedback
                
                A fun little project I made to showcase also my web development skills I gained in my current work at Ringmaster.`,
        media: [
            { type: 'image', url: 'https://via.placeholder.com/800x450/8800ff/ffffff?text=Portfolio+Desktop', title: 'Desktop View' },
            { type: 'image', url: 'https://via.placeholder.com/800x450/ff0088/ffffff?text=Portfolio+Mobile', title: 'Mobile View' }
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Animations', 'Web APIs', 'Gamification', 'Web Development']
    }
};

function openModal(projectId) {
    const modal = document.getElementById('projectModal');
    const project = projectData[projectId];

    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').innerHTML = project.description.replace(/\n/g, '<br>');

    // Create media carousel
    const mediaContainer = document.getElementById('modalMedia');
    if (project.media && project.media.length > 0) {
        mediaContainer.innerHTML = `
            <div class="media-carousel">
                <button class="carousel-btn prev-btn" onclick="previousMedia()">&lt;</button>
                <div class="media-container" id="mediaContainer">
                    ${project.media.map((item, index) => createMediaElement(item, index)).join('')}
                </div>
                <button class="carousel-btn next-btn" onclick="nextMedia()">&gt;</button>
                <div class="media-indicators">
                    ${project.media.map((_, index) => `<span class="indicator ${index === 0 ? 'active' : ''}" onclick="goToMedia(${index})"></span>`).join('')}
                </div>
            </div>
        `;
        currentMediaIndex = 0;
        updateMediaDisplay();
    } else {
        mediaContainer.innerHTML = '<div class="no-media">📹 No media available for this project</div>';
    }

    const techContainer = document.getElementById('modalTech');
    techContainer.innerHTML = '';
    project.tech.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        techContainer.appendChild(tag);
    });

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    playSound('click');
}

function createMediaElement(item, index) {
    if (item.type === 'youtube') {
        return `
            <div class="media-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                <iframe 
                    src="https://www.youtube.com/embed/${item.url}" 
                    frameborder="0" 
                    allowfullscreen
                    title="${item.title}">
                </iframe>
                <p class="media-title">${item.title}</p>
            </div>
        `;
    } else if (item.type === 'image') {
        return `
            <div class="media-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${item.url}" alt="${item.title}" loading="lazy">
                <p class="media-title">${item.title}</p>
            </div>
        `;
    }
    else if (item.type === 'video') {
        return `
            <div class="media-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                <video controls>
                    <source src="${item.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <p class="media-title">${item.title}</p>
            </div>
        `;
    }
    return '';
}

let currentMediaIndex = 0;
let totalMediaItems = 0;

function updateMediaDisplay() {
    const mediaItems = document.querySelectorAll('.media-item');
    const indicators = document.querySelectorAll('.indicator');

    totalMediaItems = mediaItems.length;

    mediaItems.forEach((item, index) => {
        if (index === currentMediaIndex) {
            item.classList.add('active');
        } else {
            // Pause any video in the inactive item
            const video = item.querySelector('video');
            if (video) {
                video.pause();
            }
            item.classList.remove('active');
        }
    });

    indicators.forEach((indicator, index) => {
        if (index === currentMediaIndex) {
            indicator.classList.add('active');
        } else {
            // Pause any video in the inactive item
            const video = indicator.querySelector('video');
            if (video) {
                video.pause();
            }
            indicator.classList.remove('active');
        }
    });
}

function nextMedia() {
    currentMediaIndex = (currentMediaIndex + 1) % totalMediaItems;
    updateMediaDisplay();
    playSound('click');
}

function previousMedia() {
    currentMediaIndex = (currentMediaIndex - 1 + totalMediaItems) % totalMediaItems;
    updateMediaDisplay();
    playSound('click');
}

function goToMedia(index) {
    currentMediaIndex = index;
    updateMediaDisplay();
    playSound('click');
}

// Add keyboard navigation for media carousel
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('projectModal');
    if (modal.style.display === 'block') {
        switch(e.key) {
            case 'ArrowLeft':
                previousMedia();
                break;
            case 'ArrowRight':
                nextMedia();
                break;
        }
    }
});

function closeModal() {
    document.body.style.overflow = 'auto';
    playSound('click');

    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';

    // Stop all playing videos
    const videos = modal.querySelectorAll('video');
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Skill level up system
function levelUpSkill(skillNode, currentLevel) {
    const progressBar = skillNode.querySelector('.skill-progress');
    const newLevel = Math.min(currentLevel + 10, 100);

    progressBar.style.width = newLevel + '%';

    // Visual feedback
    skillNode.style.transform = 'scale(1.1)';
    setTimeout(() => {
        skillNode.style.transform = 'scale(1)';
    }, 200);

    playSound('levelup');

    // Particle burst effect
    createSkillParticles(skillNode);
}

function createSkillParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#00ff88';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 10;
        const velocity = 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let startTime = null;

        function animate(time) {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const progress = elapsed / 1000;

            if (progress < 1) {
                const x = centerX + vx * progress;
                const y = centerY + vy * progress + 0.5 * 500 * progress * progress;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = 1 - progress;
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        }
            requestAnimationFrame(animate);
    }
}

// Easter egg system
function triggerEasterEgg(eggId) {
    easterEggsFound++;
    playSound('easter');

    const messages = [
    "🎮 You found a secret! Keep exploring!",
    "🚀 Easter egg #" + easterEggsFound + " discovered!",
    "🎉 You're a true explorer! There might be more...",
    "🌟 Achievement unlocked: Curiosity!",
    "🔍 Detective skills: Level " + easterEggsFound
    ];

    const message = messages[Math.min(easterEggsFound - 1, messages.length - 1)];
    showNotification(message);

    // Hide the found easter egg
    event.target.style.display = 'none';

    // Special reward for finding all easter eggs
    if (easterEggsFound >= 5) {
        setTimeout(() => {
            showNotification("🏆 Master Explorer! You found all easter eggs! Here's a bonus animation!");
            triggerBonusAnimation();
        }, 1000);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'linear-gradient(45deg, #00ffff, #ff00ff)';
    notification.style.color = '#000';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.fontFamily = 'Orbitron, monospace';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideIn 0.5s ease';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Bonus animation for easter egg completion
function triggerBonusAnimation() {
    const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ffff00', '#ff8800'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.position = 'fixed';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * window.innerHeight + 'px';
            firework.style.width = '6px';
            firework.style.height = '6px';
            firework.style.background = colors[Math.floor(Math.random() * colors.length)];
            firework.style.borderRadius = '50%';
            firework.style.pointerEvents = 'none';
            firework.style.zIndex = '9999';
            firework.style.boxShadow = '0 0 20px currentColor';

            document.body.appendChild(firework);

            setTimeout(() => {
                firework.style.animation = 'fireworkExplode 1s ease-out forwards';
                setTimeout(() => {
                    if (document.body.contains(firework)) {
                        document.body.removeChild(firework);
                    }
                }, 1000);
            }, 100);
        }, i * 50);
    }
}

// Boss battle system
function damageBoss() {
    bossHealth -= 20;
    if (bossHealth < 0) bossHealth = 0;

    const healthBar = document.getElementById('bossHealth');
    healthBar.style.width = bossHealth + '%';

    if (bossHealth <= 0) {
        setTimeout(() => {
            showNotification("🏆 Boss Defeated! Thanks for reaching out!");
            // Reset boss health after victory
            setTimeout(() => {
                bossHealth = 100;
                healthBar.style.width = '100%';
            }, 3000);
        }, 500);
    }
    else {
        showNotification("💥 Boss damaged! Health: " + bossHealth + "%");
    }

    playSound('click');
}

// Add hover effects to interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover sound to project cards
    document.querySelectorAll('.main-project-card').forEach(card => {
        card.addEventListener('mouseenter', () => playSound('hover'));
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => playSound('hover'));
    });

    // Add hover sound to skill nodes
    document.querySelectorAll('.skill-node').forEach(node => {
        node.addEventListener('mouseenter', () => playSound('hover'));
    });

    // Add hover sound to buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => playSound('hover'));
        btn.addEventListener('click', damageBoss);
    });

    // Profile photo click effect
    document.getElementById('profilePhoto').addEventListener('click', () => {
        const photo = document.getElementById('profilePhoto');
        photo.style.animation = 'spin 1s ease-in-out';
        setTimeout(() => {
            photo.style.animation = '';
        }, 1000);
            playSound('click');
    });
});

// Add CSS animations for notifications and effects
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fireworkExplode {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
    }
    
    @keyframes spin {
    from { transform: rotate(0deg) scale(1.1); }
    to { transform: rotate(360deg) scale(1.1); }
    }
    `;
    document.head.appendChild(style);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'Escape':
            closeModal();
            break;
            case 's':
            case 'S':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                document.getElementById('soundToggle').click();
            }
            break;
        }
    });

    // Initialize particle mouse trail
    let mouseTrail = [];
    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });

        // Remove old trail points
        mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 500);

        // Create trail particle occasionally
        if (Math.random() < 0.3) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.background = '#00ffff';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9998';
            particle.style.opacity = '0.7';
            particle.style.transition = 'all 0.5s ease';

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0)';
                setTimeout(() => {
                    if (document.body.contains(particle)) {
                        document.body.removeChild(particle);
                    }
                }, 500);
        }, 100);
    }
});

console.log('🎮 Pietro\'s Portfolio Loaded Successfully!');
console.log('🎯 Try clicking on easter eggs, profile photo, and skills!');
console.log('🔊 Press Ctrl+S to toggle sound effects');
console.log('⌨️ Press Escape to close modals');