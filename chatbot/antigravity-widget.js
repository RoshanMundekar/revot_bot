/**
 * Antigravity Bot - Enhanced Multi-Modal Chatbot Widget
 * 
 * Features:
 * - Floating bot icon with hover tooltip
 * - Connection modal (Voice/Text choice)
 * - Voice chat screen with controls
 * - Text chat screen with authentication
 * - Fullscreen mode support
 * - Smooth animations and transitions
 * 
 * Usage:
 * <script src="antigravity-widget.js"></script>
 */

(function () {
    'use strict';

    // Configuration
    const config = {
        apiEndpoint: window.antigravityConfig?.apiEndpoint || 'http://localhost:8000/api/chat',
        botName: window.antigravityConfig?.botName || 'Anti',
        fullBotName: window.antigravityConfig?.fullBotName || 'Antigravity',
        primaryColor: window.antigravityConfig?.primaryColor || '#06d6a0',
        secondaryColor: window.antigravityConfig?.secondaryColor || '#118ab2',
        accentColor: window.antigravityConfig?.accentColor || '#ef476f',
        position: window.antigravityConfig?.position || 'right'
    };

    // State
    let isOpen = false;
    let isFullscreen = false;
    let currentScreen = 'connect'; // 'connect', 'voice', 'text', 'chat'
    let conversationHistory = [];
    let isTyping = false;
    let isAuthenticated = false;
    let userPhone = '';

    // Voice state
    let isRecording = false;
    let mediaRecorder = null;
    let audioChunks = [];

    // CSS Styles
    const styles = `
        .antigravity-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }
        
        /* Floating Button */
        .antigravity-button {
            position: fixed;
            bottom: 24px;
            ${config.position}: 24px;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(6, 214, 160, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .antigravity-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 28px rgba(6, 214, 160, 0.5);
        }
        
        .antigravity-button img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        
        /* Hover Tooltip */
        .antigravity-tooltip {
            position: fixed;
            bottom: 32px;
            ${config.position}: 90px;
            background: rgba(17, 24, 39, 0.95);
            backdrop-filter: blur(12px);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 999998;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            max-width: 280px;
        }
        
        .antigravity-tooltip.show {
            opacity: 1;
        }
        
        .antigravity-tooltip h4 {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 6px;
            color: ${config.primaryColor};
        }
        
        .antigravity-tooltip p {
            font-size: 13px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.85);
        }
        
        /* Modal Container */
        .antigravity-modal {
            position: fixed;
            bottom: 100px;
            ${config.position}: 24px;
            width: 400px;
            background: #111827;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            z-index: 999997;
            display: none;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .antigravity-modal.open {
            display: flex;
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        
        .antigravity-modal.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
            max-width: 100%;
            max-height: 100%;
        }
        
        /* Modal Header */
        .antigravity-header {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .antigravity-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .antigravity-header-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        
        .antigravity-header-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
        
        .antigravity-header-text h3 {
            font-size: 16px;
            font-weight: 600;
            color: white;
            margin-bottom: 2px;
        }
        
        .antigravity-header-text p {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .antigravity-header-controls {
            display: flex;
            gap: 8px;
        }
        
        .antigravity-icon-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .antigravity-icon-btn:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        /* Modal Content */
        .antigravity-content {
            flex: 1;
            overflow-y: auto;
            background: #0f172a;
            position: relative;
        }
        
        .antigravity-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .antigravity-content::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .antigravity-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }
        
        /* Connect Screen */
        .antigravity-screen {
            display: none;
            padding: 40px 30px;
            min-height: 400px;
        }
        
        .antigravity-screen.active {
            display: block;
        }
        
        .screen-title {
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            color: white;
            margin-bottom: 32px;
        }
        
        .connect-options {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .connect-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 2px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 24px 28px;
            border-radius: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 20px;
            transition: all 0.3s;
            font-size: 16px;
        }
        
        .connect-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: ${config.primaryColor};
            transform: translateY(-2px);
        }
        
        .connect-btn-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .connect-btn-icon.voice {
            background: linear-gradient(135deg, ${config.accentColor} 0%, #ff6b9d 100%);
        }
        
        .connect-btn-icon.text {
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
        }
        
        .connect-btn-text h4 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .connect-btn-text p {
            font-size: 13px;
            opacity: 0.7;
        }
        
        /* Voice Screen */
        .voice-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 40px;
        }
        
        .voice-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
            position: relative;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .voice-avatar.recording {
            animation: pulse 1s ease-in-out infinite;
            box-shadow: 0 0 0 0 rgba(6, 214, 160, 0.7);
        }
        
        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(6, 214, 160, 0.7);
            }
            50% {
                box-shadow: 0 0 0 20px rgba(6, 214, 160, 0);
            }
        }
        
        .voice-avatar img {
            width: 80%;
            height: 80%;
            border-radius: 50%;
        }
        
        .voice-title {
            font-size: 28px;
            font-weight: 600;
            color: white;
            margin-bottom: 12px;
        }
        
        .voice-subtitle {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 48px;
        }
        
        .voice-controls {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .voice-control-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s;
        }
        
        .voice-control-btn.mic {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, ${config.accentColor} 0%, #ff6b9d 100%);
            box-shadow: 0 4px 20px rgba(239, 71, 111, 0.4);
        }
        
        .voice-control-btn.mic:hover {
            transform: scale(1.1);
        }
        
        .voice-control-btn.mic.recording {
            animation: mic-pulse 1s ease-in-out infinite;
        }
        
        @keyframes mic-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .voice-control-btn.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }
        
        .voice-control-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        /* Text Screen */
        .text-screen {
            padding: 40px 30px;
            display: flex;
            flex-direction: column;
            min-height: 500px;
        }
        
        .welcome-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
        }
        
        .welcome-card h3 {
            font-size: 18px;
            font-weight: 600;
            color: white;
            margin-bottom: 16px;
        }
        
        .welcome-card ul {
            list-style: none;
            margin-bottom: 20px;
        }
        
        .welcome-card li {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 10px;
            padding-left: 24px;
            position: relative;
        }
        
        .welcome-card li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: ${config.primaryColor};
            font-weight: bold;
        }
        
        .guest-btn {
            background: white;
            color: #111827;
            border: none;
            padding: 14px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
        }
        
        .guest-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }
        
        .divider {
            text-align: center;
            color: rgba(255, 255, 255, 0.4);
            font-size: 13px;
            margin: 24px 0;
            position: relative;
        }
        
        .divider:before,
        .divider:after {
            content: "";
            position: absolute;
            top: 50%;
            width: 40%;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
        }
        
        .divider:before {
            left: 0;
        }
        
        .divider:after {
            right: 0;
        }
        
        .phone-input-container {
            margin-top: auto;
        }
        
        .phone-input-label {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 12px;
            display: block;
        }
        
        .phone-input-wrapper {
            display: flex;
            gap: 12px;
        }
        
        .phone-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 14px 16px;
            border-radius: 12px;
            font-size: 15px;
            outline: none;
            transition: all 0.3s;
        }
        
        .phone-input:focus {
            border-color: ${config.primaryColor};
            background: rgba(255, 255, 255, 0.1);
        }
        
        .phone-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }
        
        .send-btn {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            border: none;
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s;
        }
        
        .send-btn:hover {
            transform: scale(1.05);
        }
        
        /* Chat Messages Screen */
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .chat-message {
            display: flex;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .chat-message.user {
            flex-direction: row-reverse;
        }
        
        .chat-message-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        
        .chat-message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .chat-message.bot .chat-message-content {
            background: rgba(255, 255, 255, 0.08);
            color: white;
        }
        
        .chat-message.user .chat-message-content {
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
            color: white;
        }
        
        .chat-input-area {
            padding: 16px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: #111827;
            display: flex;
            gap: 12px;
        }
        
        .chat-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 12px 16px;
            border-radius: 24px;
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
        }
        
        .chat-input:focus {
            border-color: ${config.primaryColor};
        }
        
        .chat-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .antigravity-modal:not(.fullscreen) {
                width: calc(100vw - 32px);
                max-width: 400px;
            }
            
            .antigravity-tooltip {
                max-width: 220px;
                ${config.position}: 86px;
            }
        }
    `;

    // Create widget HTML
    function createWidget() {
        // Add styles
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        // Create widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'antigravity-widget';
        widgetContainer.innerHTML = `
            <!-- Floating Button -->
            <button class="antigravity-button" id="antigravity-toggle">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23fff'/%3E%3Ctext x='50' y='65' font-size='50' text-anchor='middle' fill='%23111827'%3E🤖%3C/text%3E%3C/svg%3E" alt="Bot">
            </button>
            
            <!-- Hover Tooltip -->
            <div class="antigravity-tooltip" id="antigravity-tooltip">
                <h4>${config.fullBotName} Bot</h4>
                <p>Ask about services, bookings, delivery status, support.</p>
            </div>
            
            <!-- Modal -->
            <div class="antigravity-modal" id="antigravity-modal">
                <!-- Header -->
                <div class="antigravity-header">
                    <div class="antigravity-header-left">
                        <div class="antigravity-header-avatar">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='65' font-size='50' text-anchor='middle' fill='%23fff'%3E🤖%3C/text%3E%3C/svg%3E" alt="Bot">
                        </div>
                        <div class="antigravity-header-text">
                            <h3>${config.fullBotName}</h3>
                            <p>Online • Ready to help</p>
                        </div>
                    </div>
                    <div class="antigravity-header-controls">
                        <button class="antigravity-icon-btn" id="fullscreen-toggle" title="Toggle Fullscreen">
                            <span id="fullscreen-icon">⛶</span>
                        </button>
                        <button class="antigravity-icon-btn" id="close-modal" title="Close">✕</button>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="antigravity-content" id="antigravity-content">
                    <!-- Connect Screen -->
                    <div class="antigravity-screen active" id="screen-connect">
                        <h2 class="screen-title">How would you like to connect?</h2>
                        <div class="connect-options">
                            <button class="connect-btn" id="btn-voice">
                                <div class="connect-btn-icon voice">🎤</div>
                                <div class="connect-btn-text">
                                    <h4>Voice chat</h4>
                                    <p>Talk to ${config.botName} using your microphone</p>
                                </div>
                            </button>
                            <button class="connect-btn" id="btn-text">
                                <div class="connect-btn-icon text">💬</div>
                                <div class="connect-btn-text">
                                    <h4>Text chat</h4>
                                    <p>Type your messages to ${config.botName}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Voice Screen -->
                    <div class="antigravity-screen voice-screen" id="screen-voice">
                        <div class="voice-avatar" id="voice-avatar">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='65' font-size='50' text-anchor='middle' fill='%23fff'%3E🤖%3C/text%3E%3C/svg%3E" alt="Bot">
                        </div>
                        <h2 class="voice-title">Talk to ${config.botName}</h2>
                        <p class="voice-subtitle" id="voice-status">Click the microphone to start</p>
                        <div class="voice-controls">
                            <button class="voice-control-btn secondary" id="voice-reset" title="Reset">↻</button>
                            <button class="voice-control-btn mic" id="voice-mic" title="Start Recording">🎤</button>
                            <button class="voice-control-btn secondary" id="voice-send" title="Send">▶</button>
                        </div>
                    </div>
                    
                    <!-- Text Screen -->
                    <div class="antigravity-screen text-screen" id="screen-text">
                        <div class="welcome-card">
                            <h3>Hi! I am ${config.botName}, your guide to all things ${config.fullBotName}!</h3>
                            <ul>
                                <li>Book services and appointments</li>
                                <li>Track delivery status</li>
                                <li>Get 24/7 support</li>
                                <li>Access your account</li>
                            </ul>
                            <button class="guest-btn" id="guest-mode-btn">
                                Enter Guest Mode (limited features)
                            </button>
                        </div>
                        <div class="divider">OR</div>
                        <div class="phone-input-container">
                            <label class="phone-input-label">Sign in for full access (free)</label>
                            <div class="phone-input-wrapper">
                                <input 
                                    type="tel" 
                                    class="phone-input" 
                                    id="phone-input" 
                                    placeholder="Enter your mobile number"
                                    maxlength="10"
                                />
                                <button class="send-btn" id="phone-send-btn">→</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Chat Screen -->
                    <div class="antigravity-screen" id="screen-chat">
                        <div class="chat-messages" id="chat-messages"></div>
                        <div class="chat-input-area">
                            <input 
                                type="text" 
                                class="chat-input" 
                                id="chat-input" 
                                placeholder="Type your message..."
                                autocomplete="off"
                            />
                            <button class="send-btn" id="chat-send-btn">→</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(widgetContainer);

        // Add event listeners
        initEventListeners();
    }

    // Initialize event listeners
    function initEventListeners() {
        // Toggle button
        document.getElementById('antigravity-toggle').addEventListener('click', toggleModal);

        // Tooltip hover
        const toggleBtn = document.getElementById('antigravity-toggle');
        const tooltip = document.getElementById('antigravity-tooltip');

        toggleBtn.addEventListener('mouseenter', () => {
            if (!isOpen) tooltip.classList.add('show');
        });

        toggleBtn.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });

        // Modal controls
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('fullscreen-toggle').addEventListener('click', toggleFullscreen);

        // Connect screen
        document.getElementById('btn-voice').addEventListener('click', () => showScreen('voice'));
        document.getElementById('btn-text').addEventListener('click', () => showScreen('text'));

        // Voice controls
        document.getElementById('voice-mic').addEventListener('click', toggleRecording);
        document.getElementById('voice-reset').addEventListener('click', resetVoice);
        document.getElementById('voice-send').addEventListener('click', sendVoiceMessage);

        // Text screen
        document.getElementById('guest-mode-btn').addEventListener('click', enterGuestMode);
        document.getElementById('phone-send-btn').addEventListener('click', sendPhoneNumber);
        document.getElementById('phone-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendPhoneNumber();
        });

        // Chat screen
        document.getElementById('chat-send-btn').addEventListener('click', sendChatMessage);
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    // Toggle modal
    function toggleModal() {
        isOpen = !isOpen;
        const modal = document.getElementById('antigravity-modal');
        const tooltip = document.getElementById('antigravity-tooltip');

        if (isOpen) {
            modal.classList.add('open');
            tooltip.classList.remove('show');
        } else {
            modal.classList.remove('open');
            if (isFullscreen) toggleFullscreen();
        }
    }

    // Close modal
    function closeModal() {
        isOpen = false;
        document.getElementById('antigravity-modal').classList.remove('open');
        if (isFullscreen) toggleFullscreen();
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        const modal = document.getElementById('antigravity-modal');
        const icon = document.getElementById('fullscreen-icon');

        if (isFullscreen) {
            modal.classList.add('fullscreen');
            icon.textContent = '🗗';
        } else {
            modal.classList.remove('fullscreen');
            icon.textContent = '⛶';
        }
    }

    // Show specific screen
    function showScreen(screen) {
        currentScreen = screen;
        document.querySelectorAll('.antigravity-screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`screen-${screen}`).classList.add('active');
    }

    // Voice recording
    async function toggleRecording() {
        if (!isRecording) {
            await startRecording();
        } else {
            stopRecording();
        }
    }

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.addEventListener('dataavailable', (event) => {
                audioChunks.push(event.data);
            });

            mediaRecorder.start();
            isRecording = true;

            document.getElementById('voice-mic').classList.add('recording');
            document.getElementById('voice-avatar').classList.add('recording');
            document.getElementById('voice-status').textContent = 'Listening...';

        } catch (error) {
            console.error('Error accessing microphone:', error);
            document.getElementById('voice-status').textContent = 'Microphone access denied';
        }
    }

    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;

            mediaRecorder.stream.getTracks().forEach(track => track.stop());

            document.getElementById('voice-mic').classList.remove('recording');
            document.getElementById('voice-avatar').classList.remove('recording');
            document.getElementById('voice-status').textContent = 'Recording stopped. Click send to process.';
        }
    }

    function resetVoice() {
        if (isRecording) stopRecording();
        audioChunks = [];
        document.getElementById('voice-status').textContent = 'Click the microphone to start';
    }

    async function sendVoiceMessage() {
        if (audioChunks.length === 0) {
            document.getElementById('voice-status').textContent = 'Please record audio first';
            return;
        }

        document.getElementById('voice-status').textContent = 'Processing your message...';

        // Here you would send to your API
        // For now, just simulate
        setTimeout(() => {
            document.getElementById('voice-status').textContent = 'Message sent! Recording new message...';
            audioChunks = [];
        }, 1000);
    }

    // Text/Auth functions
    function enterGuestMode() {
        isAuthenticated = false;
        showScreen('chat');
        addBotMessage(`Welcome! You're in guest mode. Some features may be limited. How can I help you today?`);
    }

    function sendPhoneNumber() {
        const phoneInput = document.getElementById('phone-input');
        const phone = phoneInput.value.trim();

        if (!phone || phone.length < 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        userPhone = phone;
        isAuthenticated = true;

        // Here you would call your OTP API
        // For now, simulate success
        showScreen('chat');
        addBotMessage(`Welcome! A verification code has been sent to ${phone}. You now have full access! How can I assist you?`);
        phoneInput.value = '';
    }

    // Chat functions
    function addBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message bot';

        messageElement.innerHTML = `
            <img class="chat-message-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2306d6a0'/%3E%3Ctext x='50' y='70' font-size='50' text-anchor='middle' fill='white'%3E🤖%3C/text%3E%3C/svg%3E" alt="Bot">
            <div class="chat-message-content">${escapeHtml(message)}</div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message user';

        messageElement.innerHTML = `
            <img class="chat-message-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23118ab2'/%3E%3Ctext x='50' y='70' font-size='50' text-anchor='middle' fill='white'%3E👤%3C/text%3E%3C/svg%3E" alt="User">
            <div class="chat-message-content">${escapeHtml(message)}</div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message || isTyping) return;

        addUserMessage(message);
        input.value = '';
        isTyping = true;

        // Add to conversation history
        conversationHistory.push({ role: 'user', content: message });

        try {
            // Call your API
            const response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    conversation_history: conversationHistory
                })
            });

            if (!response.ok) throw new Error('API error');

            const data = await response.json();

            if (data.success && data.reply) {
                addBotMessage(data.reply);
                conversationHistory.push({ role: 'assistant', content: data.reply });
            }
        } catch (error) {
            console.error('Chat error:', error);
            addBotMessage('Sorry, I\'m having trouble connecting. Please try again.');
        } finally {
            isTyping = false;
        }
    }

    // Utility
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();
