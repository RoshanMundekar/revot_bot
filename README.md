# 🚀 Revot Bot - Enhanced Multi-Modal Chatbot Widget

A complete, production-ready chatbot widget system with voice and text chat capabilities. Features a modern dark UI with glassmorphism, fullscreen mode, and user authentication.

![Revot Bot](https://img.shields.io/badge/status-ready-success) ![Version](https://img.shields.io/badge/version-2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Capabilities
- **Dual Mode Chat** - Switch between voice and text communication
- **Voice Recognition** - Real-time speech-to-text using Web Speech API
- **Text Messaging** - Traditional chat with rich formatting
- **AI-Powered** - Integrates with OpenAI GPT models
- **Fullscreen Mode** - Expandable interface for immersive experience
- **Authentication** - Mobile number login or guest mode access

### 🎨 Design
- **Modern Dark Theme** - Professional glassmorphism UI
- **Smooth Animations** - Polished transitions and micro-interactions
- **Responsive Layout** - Perfect on desktop, tablet, and mobile
- **Customizable Branding** - Configure colors, bot name, and more
- **Accessibility** - WCAG compliant with keyboard navigation

### 🔧 Technical
- **Zero Dependencies** - Pure vanilla JavaScript
- **One-Line Integration** - Single `<script>` tag deployment
- **CORS Protected** - Secure API with origin validation
- **Conversation Memory** - Maintains context across messages
- **Error Handling** - Graceful degradation and user feedback

---

## 📦 What's Included

```
revot_bot/
├── chatbot/
│   ├── widget.js              # Original simple widget
│   └── antigravity-widget.js  # ⭐ Enhanced multi-modal widget
├── assets/                     # Generated design assets
├── main.py                     # FastAPI backend
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
├── demo.html                  # Original demo
├── demo-enhanced.html         # ⭐ Enhanced demo showcase
├── DESIGN_PROMPTS.md          # AI design tool prompts
├── README.md                  # This file
└── start.bat / start.sh       # Startup scripts
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start server
python main.py
# or
uvicorn main:app --reload --port 8000
```

### 2. Frontend Integration

**Basic (Enhanced Widget):**
```html
<script src="https://YOUR-DOMAIN.com/chatbot/antigravity-widget.js"></script>
```

**With Configuration:**
```html
<script>
  window.antigravityConfig = {
    apiEndpoint: 'https://YOUR-DOMAIN.com/api/chat',
    botName: 'Anti',
    fullBotName: 'Antigravity',
    primaryColor: '#06d6a0',
    secondaryColor: '#118ab2',
    accentColor: '#ef476f',
    position: 'right'
  };
</script>
<script src="https://YOUR-DOMAIN.com/chatbot/antigravity-widget.js"></script>
```

### 3. View Demo

Open `demo-enhanced.html` in your browser or serve it:

```bash
python -m http.server 5500
# Visit: http://localhost:5500/demo-enhanced.html
```

---

## 🎨 UI Flow

```
┌─────────────────────────────────────────┐
│  1. Floating Bot Button (always visible) │
│           ↓ (hover)                      │
│  2. Tooltip Preview                      │
│           ↓ (click)                      │
│  3. Connection Modal                     │
│      ├─→ Voice Chat ─→ Voice Screen     │
│      └─→ Text Chat  ─→ Auth Screen      │
│                           ↓              │
│                   Chat Interface         │
│                           ↓              │
│                  Fullscreen Mode ⛶       │
└─────────────────────────────────────────┘
```

---

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiEndpoint` | string | `http://localhost:8000/api/chat` | Your backend API URL |
| `botName` | string | `Anti` | Short name for the bot |
| `fullBotName` | string | `Antigravity` | Full brand name |
| `primaryColor` | string | `#06d6a0` | Primary brand color (teal) |
| `secondaryColor` | string | `#118ab2` | Secondary brand color (blue) |
| `accentColor` | string | `#ef476f` | Accent color (pink/red) |
| `position` | string | `right` | Widget position (`right` or `left`) |

---

## � API Documentation

### POST /api/chat

Send a message to the chatbot.

**Request:**
```json
{
  "message": "What are your services?",
  "conversation_history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

**Response:**
```json
{
  "reply": "We offer services including...",
  "success": true,
  "error": null
}
```

### GET /

Health check endpoint.

**Response:**
```json
{
  "status": "online",
  "message": "Chatbot API is running",
  "version": "1.0.0"
}
```

---

## 🎭 Widget Features Breakdown

### 1. Connection Modal
- Choose between voice and text modes
- Beautiful card-based selection UI
- Smooth modal animations

### 2. Voice Chat Screen
- Large, animated bot avatar
- Microphone recording with visual feedback
- Control buttons: Record, Reset, Send
- Real-time status updates

### 3. Text Chat Screen
- Welcome message with feature bullets
- Guest mode option (limited features)
- Mobile number authentication
- Secure OTP flow (backend integration ready)

### 4. Chat Interface
- Message bubbles (user & bot differentiated)
- Auto-scrolling
- Typing indicators
- Conversation history
- Input with send button

### 5. Fullscreen Mode
- Toggle between popup and fullscreen
- Keyboard shortcut support
- Maintains state across transitions

---

## 🎨 Design Assets

### Generated Assets
- **Bot Mascot**: Cute futuristic robot icon (teal/blue gradient)
- **Company Logo**: Modern "Antigravity" brand logo

### Generate More Assets
See [DESIGN_PROMPTS.md](file:///d:/VIDEO/revot_bot/DESIGN_PROMPTS.md) for AI tool prompts to create:
- Custom bot avatars
- UI component designs
- Background patterns
- Animated effects
- Marketing materials

Compatible with: DALL·E, Midjourney, Figma AI, Framer AI, Uizard

---

## � Deployment

### Backend Options

**Cloud Platforms:**
- Render
- Railway
- Heroku
- AWS / Google Cloud / Azure

**VPS:**
- DigitalOcean
- Linode  
- Vultr

**Deployment Steps:**
1. Push code to GitHub
2. Connect repo to platform
3. Set environment variables
4. Deploy!

### Widget Hosting

**Option 1: Serve from Backend**
```python
# Add to main.py
from fastapi.staticfiles import StaticFiles
app.mount("/chatbot", StaticFiles(directory="chatbot"), name="chatbot")
```

**Option 2: Use CDN**
- Upload to Cloudflare, AWS S3, or GitHub Pages
- Update `src` path in integration code

### Production Checklist
- [ ] Set `OPENAI_API_KEY` in environment
- [ ] Configure `CORS_ORIGINS` to specific domains
- [ ] Use HTTPS for all endpoints
- [ ] Set up monitoring and logging
- [ ] Consider rate limiting
- [ ] Test on multiple devices
- [ ] Enable analytics (optional)

---

##  🐛 Troubleshooting

**Widget not appearing?**
- Check console for JavaScript errors
- Verify script path is correct
- Ensure no CSS conflicts

**Voice not working?**
- Check browser microphone permissions
- Use HTTPS (required for Web Speech API)
- Test in Chrome/Edge (best support)

**Chat not responding?**
- Verify backend is running
- Check `apiEndpoint` configuration
- Look for CORS errors in console
- Validate `OPENAI_API_KEY` is set

**Authentication failing?**
- Implement `/api/auth/send-otp` endpoint
- Configure SMS provider
- Check phone number format

---

## 🔒 Security

- **API Keys**: Never expose OpenAI key to frontend
- **CORS**: Restrict to specific domains in production
- **Input Validation**: Backend validates all inputs
- **Rate Limiting**: Implement to prevent abuse
- **HTTPS**: Required for voice features and security

---

## 🎯 Roadmap

### Coming Soon
- [ ] Voice synthesis (Text-to-Speech)
- [ ] Advanced authentication (OTP, OAuth)
- [ ] Chat history persistence
- [ ] File upload support
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Analytics and insights

---

## 📝 License

MIT License - feel free to use in your projects!

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

## 📧 Support

For questions or issues:
- Open a GitHub issue
- Contact: support@antigravity.example

---

## 🙏 Credits

Built with:
- **FastAPI** - Modern Python web framework
- **OpenAI** - GPT models for AI conversations
- **Web Speech API** - Voice recognition
- **Vanilla JavaScript** - No frameworks needed!

---

**Made with ❤️ for the modern web**

🚀 **Try the demo now!** Open `demo-enhanced.html` and click the bot button in the bottom-right corner!
