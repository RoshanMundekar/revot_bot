# Antigravity Bot - Design Prompts for AI Tools

Complete collection of prompts to generate all UI assets and designs for the Antigravity Bot chatbot widget.

---

## 🎨 For Image Generation Tools (DALL·E / Midjourney / Stable Diffusion)

### 1. Bot Mascot Icon

**Prompt:**
```
Create a cute futuristic AI robot mascot icon for "Antigravity", cyberpunk style, glowing teal and blue gradients, rounded head with small antenna, friendly smiling face, minimal shading, high contrast, centered on clean transparent background, modern app icon style, 3D cartoon look with smooth edges and sharp details, professional tech brand mascot, 1024x1024px
```

### 2. Company Logo

**Prompt:**  
```
Modern tech company logo for "ANTIGRAVITY" with sleek futuristic typography, teal and blue gradient color scheme (#06d6a0 to #118ab2), minimal geometric symbol of upward floating elements or gravity waves, clean professional design, dark background, premium SaaS brand style, high contrast
```

### 3. Chat Bubble Background Patterns

**Prompt:**
```
Abstract geometric background pattern for chat interface, dark theme (#0f172a), subtle teal and blue gradient waves, minimal noise texture, modern tech aesthetic, seamless tileable pattern, soft glow effects
```

---

## 🖼️ For UI Design Tools (Figma AI / Framer AI / Uizard)

### 1. Floating Chat Launcher Button

**Component Spec:**
```
Design floating chatbot launcher button:
- Size: 64x64px circle
- Position: Bottom-right, 24px from edges
- Background: Linear gradient (#06d6a0 to #118ab2)
- Icon: Robot mascot (centered, 40px)
- Shadow: 0 4px 20px rgba(6, 214, 160, 0.4)
- Hover: Scale 1.1, shadow 0 6px 28px rgba(6, 214, 160, 0.5)
- Animation: Subtle float effect
```

### 2. Hover Tooltip Card

**Component Spec:**
```
Tooltip card appearing left of launcher button:
- Width: 280px max
- Background: rgba(17, 24, 39, 0.95) with blur(12px)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Padding: 16px 20px
- Border-radius: 12px
- Title: "Antigravity Bot" (#06d6a0, 15px, semibold)
- Text: "Ask about services, bookings, delivery..." (white 85%, 13px)
- Shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
```

### 3. Connection Modal (Screen 1)

**Screen Design:**
```
Modal window - Connection choice screen:
- Size: 400px width × 500px height
- Background: #111827
- Border-radius: 20px
- Header:
  - Bot avatar (40px circle, gradient background)
  - Title "Antigravity" (white, 16px, semibold)
  - Fullscreen & close icons (32px, rgba(255,255,255,0.1))
  
- Body:
  - Title: "How would you like to connect?" (center, white, 20px)
  - Two stacked buttons:
    
    Button 1 - Voice:
    - Icon: 🎤 (48px, gradient #ef476f to #ff6b9d)
    - Text: "Voice chat" (18px, semibold)
    - Subtext: "Talk to Anti using your microphone" (13px, 70% opacity)
    
    Button 2 - Text:
    - Icon: 💬 (48px, gradient #06d6a0 to #118ab2)
    - Text: "Text chat" (18px, semibold)
    - Subtext: "Type your messages to Anti" (13px, 70% opacity)
```

### 4. Voice Chat Screen (Fullscreen)

**Screen Design:**
```
Full screen voice interface:
- Background: #0f172a
- Header: Logo "ANTIGRAVITY" (top-left, teal gradient)

- Center Content:
  - Bot avatar: 120px circle with pulse animation
  - Title: "Talk to Anti" (28px, white, semibold)
  - Status text: "Click the microphone to start" (14px, 50% opacity)

- Bottom Controls (centered):
  - Reset button: ↻ (60px circle, rgba(255,255,255,0.1))
  - Mic button: 🎤 (72px circle, gradient #ef476f to #ff6b9d)
  - Send button: ▶ (60px circle, rgba(255,255,255,0.1))
  - Gap: 20px between buttons
```

### 5. Text Chat Screen with Authentication

**Screen Design:**
```
Text screen with login:
- Background: #0f172a
- Padding: 40px 30px

- Welcome Card:
  - Background: rgba(255,255,255,0.05)
  - Border: 1px solid rgba(255,255,255,0.1)
  - Border-radius: 16px
  - Padding: 24px
  - Title: "Hi! I am Anti..." (18px, white, semibold)
  - Bullet list (14px, checkmarks in #06d6a0):
    ✓ Book services and appointments
    ✓ Track delivery status
    ✓ Get 24/7 support
    ✓ Access your account
  - Button: "Enter Guest Mode" (white bg, full width)

- Divider: "OR" centered with lines

- Phone Input Section:
  - Label: "Sign in for full access (free)" (13px, 60% opacity)
  - Input field: Mobile number (dark, rounded)
  - Send button: → arrow (gradient, 48px)
```

### 6. Chat Messages Interface

**Component Spec:**
```
Scrollable chat area:
- Bot message bubble:
  - Avatar: 36px circle (#06d6a0 gradient)
  - Content: rgba(255,255,255,0.08) background
  - Border-radius: 16px
  - Padding: 12px 16px
  - Text: White, 14px

- User message bubble:
  - Avatar: 36px circle (#118ab2 gradient)
  - Content: Linear gradient (#06d6a0 to #118ab2)
  - Border-radius: 16px
  - Padding: 12px 16px
  - Text: White, 14px
  - Align: Right

- Input Bar:
  - Background: #111827
  - Border-top: 1px rgba(255,255,255,0.1)
  - Input: Dark with rounded corners (24px radius)
  - Send button: Gradient circle
```

---

## 📱 For Prototyping Tools (Galileo AI / Uizard)

### Complete Flow Prompt

**Prompt:**
```
Design a complete chatbot UI kit for "Antigravity" with dark theme (#0f172a):

1. Floating launcher (64px, bottom-right, teal gradient)
2. Hover tooltip (280px card, dark glass)
3. Connection popup (400px modal, "Voice" and "Text" options)
4. Voice screen (fullscreen, centered avatar, mic controls)
5. Text screen (welcome card + mobile login + guest mode)
6. Chat interface (message bubbles, input bar)
7. Fullscreen mode (expandable from popup)

Style: Modern SaaS, glassmorphism, teal/blue gradients (#06d6a0, #118ab2), smooth animations, premium dark mode, rounded corners (12-24px), soft shadows
```

---

## 🎯 For Animation Tools (Principle / ProtoPie / After Effects)

### 1. Modal Open Animation

**Prompt:**
```
Animate chatbot modal opening:
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- From: scale(0.9), translateY(20px), opacity(0)
- To: scale(1), translateY(0), opacity(1)
```

### 2. Voice Recording Pulse

**Prompt:**
```
Create pulse animation for voice recording:
- Element: 120px circle
- Effect: Expanding ring from 0px to 20px
- Color: rgba(6, 214, 160, 0.7) to transparent
- Duration: 1s infinite
- Easing: ease-in-out
```

### 3. Button Hover Effect

**Prompt:**
```
Hover interaction for connect buttons:
- Transform: translateY(-2px)
- Border color: #06d6a0
- Background: Lighten 5%
- Duration: 300ms
- Shadow: Increase blur by 8px
```

---

## Tool-Specific Optimizations

### For Midjourney:
Add these parameters to any prompt: `--v 6 --style raw --ar 1:1`

### For DALL·E 3:
Keep prompts under 400 characters, focus on visual details

### For Figma AI:
Use technical specifications (px, rgba, exact gradients)

### For Framer AI:
Include interaction states (hover, active, disabled)

---

## Color Palette Reference

```css
Primary: #06d6a0
Secondary: #118ab2  
Accent: #ef476f
Dark BG: #0f172a
Card BG: #111827
Border: rgba(255, 255, 255, 0.1)
Text: rgba(255, 255, 255, 0.85)
```

---

## Typography Reference

```css
Font Family: Inter, -apple-system, sans-serif
Headings: 600-800 weight
Body: 400 weight
Sizes: 13px, 14px, 16px, 18px, 20px, 28px
```

---

Use these prompts in your preferred AI design tool to generate professional-quality assets for the Antigravity Bot chatbot widget!
