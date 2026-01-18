/**
 * Embeddable Chatbot Widget
 * Self-contained chat interface that can be embedded on any website
 * 
 * Usage:
 * <script src="https://YOUR-DOMAIN.com/chatbot/widget.js"></script>
 * 
 * Optional configuration:
 * <script>
 *   window.chatbotConfig = {
 *     apiEndpoint: 'https://YOUR-DOMAIN.com/api/chat',
 *     botName: 'AI Assistant',
 *     primaryColor: '#6366f1',
 *     position: 'right' // 'right' or 'left'
 *   };
 * </script>
 */

(function () {
    'use strict';

    // Configuration
    const config = {
        apiEndpoint: window.chatbotConfig?.apiEndpoint || 'http://localhost:8000/api/chat',
        botName: window.chatbotConfig?.botName || 'AI Assistant',
        primaryColor: window.chatbotConfig?.primaryColor || '#6366f1',
        position: window.chatbotConfig?.position || 'right',
        welcomeMessage: window.chatbotConfig?.welcomeMessage || 'Hello! How can I help you today?'
    };

    // State
    let isOpen = false;
    let conversationHistory = [];
    let isTyping = false;

    // CSS Styles
    const styles = `
        .chatbot-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        .chatbot-button {
            position: fixed;
            bottom: 20px;
            ${config.position}: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${adjustColor(config.primaryColor, -20)} 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .chatbot-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        
        .chatbot-button svg {
            width: 28px;
            height: 28px;
            fill: white;
            transition: transform 0.3s;
        }
        
        .chatbot-button.open svg {
            transform: rotate(90deg);
        }
        
        .chatbot-window {
            position: fixed;
            bottom: 90px;
            ${config.position}: 20px;
            width: 380px;
            height: 600px;
            max-height: calc(100vh - 120px);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 999998;
            display: none;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .chatbot-window.open {
            display: flex;
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        
        .chatbot-header {
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${adjustColor(config.primaryColor, -20)} 100%);
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-radius: 16px 16px 0 0;
        }
        
        .chatbot-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        
        .chatbot-header-text h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 2px;
        }
        
        .chatbot-header-text p {
            font-size: 12px;
            opacity: 0.9;
        }
        
        .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
        }
        
        .chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .chatbot-messages::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
        }
        
        .chatbot-message {
            display: flex;
            gap: 8px;
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
        
        .chatbot-message.user {
            flex-direction: row-reverse;
        }
        
        .chatbot-message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${config.primaryColor};
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            flex-shrink: 0;
        }
        
        .chatbot-message.user .chatbot-message-avatar {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        }
        
        .chatbot-message-content {
            max-width: 75%;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }
        
        .chatbot-message.bot .chatbot-message-content {
            background: white;
            color: #1f2937;
            border: 1px solid #e5e7eb;
        }
        
        .chatbot-message.user .chatbot-message-content {
            background: ${config.primaryColor};
            color: white;
        }
        
        .chatbot-typing {
            display: flex;
            gap: 4px;
            padding: 8px;
        }
        
        .chatbot-typing span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #9ca3af;
            animation: typing 1.4s infinite;
        }
        
        .chatbot-typing span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .chatbot-typing span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }
        
        .chatbot-input-area {
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background: white;
            display: flex;
            gap: 8px;
        }
        
        .chatbot-input {
            flex: 1;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            padding: 12px 16px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
            font-family: inherit;
        }
        
        .chatbot-input:focus {
            border-color: ${config.primaryColor};
        }
        
        .chatbot-send-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${config.primaryColor};
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        
        .chatbot-send-button:hover {
            background: ${adjustColor(config.primaryColor, -10)};
            transform: scale(1.05);
        }
        
        .chatbot-send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: scale(1);
        }
        
        .chatbot-send-button svg {
            width: 18px;
            height: 18px;
            fill: white;
        }
        
        .chatbot-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px;
            border-radius: 8px;
            font-size: 13px;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .chatbot-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 120px);
                bottom: 90px;
                ${config.position}: 20px;
            }
        }
    `;

    // Helper function to adjust color brightness
    function adjustColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    // Create widget HTML
    function createWidget() {
        // Add styles
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        // Create widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'chatbot-widget';
        widgetContainer.innerHTML = `
            <button class="chatbot-button" id="chatbot-toggle">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </button>
            
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">🤖</div>
                    <div class="chatbot-header-text">
                        <h3>${config.botName}</h3>
                        <p>Online • Ready to help</p>
                    </div>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages"></div>
                
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbot-input" 
                        placeholder="Type your message..."
                        autocomplete="off"
                    />
                    <button class="chatbot-send-button" id="chatbot-send">
                        <svg viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(widgetContainer);

        // Add event listeners
        document.getElementById('chatbot-toggle').addEventListener('click', toggleChat);
        document.getElementById('chatbot-send').addEventListener('click', sendMessage);
        document.getElementById('chatbot-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Add welcome message
        addBotMessage(config.welcomeMessage);
    }

    // Toggle chat window
    function toggleChat() {
        isOpen = !isOpen;
        const button = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');

        if (isOpen) {
            button.classList.add('open');
            window.classList.add('open');
            document.getElementById('chatbot-input').focus();
        } else {
            button.classList.remove('open');
            window.classList.remove('open');
        }
    }

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;

        messageElement.innerHTML = `
            <div class="chatbot-message-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="chatbot-message-content">${escapeHtml(message)}</div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addBotMessage(message) {
        addMessage(message, false);
    }

    function addUserMessage(message) {
        addMessage(message, true);
    }

    // Show typing indicator
    function showTyping() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'chatbot-message bot';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="chatbot-message-avatar">🤖</div>
            <div class="chatbot-message-content">
                <div class="chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        isTyping = true;
    }

    function hideTyping() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
        isTyping = false;
    }

    // Show error message
    function showError(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const errorElement = document.createElement('div');
        errorElement.className = 'chatbot-error';
        errorElement.textContent = message;
        messagesContainer.appendChild(errorElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send message to API
    async function sendMessage() {
        const input = document.getElementById('chatbot-input');
        const sendButton = document.getElementById('chatbot-send');
        const message = input.value.trim();

        if (!message || isTyping) return;

        // Add user message
        addUserMessage(message);
        input.value = '';
        sendButton.disabled = true;

        // Add to conversation history
        conversationHistory.push({ role: 'user', content: message });

        // Show typing indicator
        showTyping();

        try {
            const response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversation_history: conversationHistory
                })
            });

            hideTyping();

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.reply) {
                addBotMessage(data.reply);
                conversationHistory.push({ role: 'assistant', content: data.reply });
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            hideTyping();
            console.error('Chat error:', error);
            showError('Sorry, I\'m having trouble connecting. Please try again.');
        } finally {
            sendButton.disabled = false;
            input.focus();
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize widget when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();
