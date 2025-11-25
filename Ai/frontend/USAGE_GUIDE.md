# Alice AI - Usage Guide 🎀

## Getting Started

### First Time Setup

1. **Open the App**
   - Navigate to the frontend URL
   - You'll see a welcome modal

2. **Enter Your Name**
   - Type your name in the modal
   - Click "Get Started"
   - Your name is saved locally

3. **Start Chatting**
   - You'll see the welcome screen with example prompts
   - Click any prompt or type your own message

## Interface Overview

### Main Components

```
┌─────────────────────────────────────────────────┐
│  [☰] Sidebar    [🎨] Themes  [💾] [⚙️]         │ Top Bar
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │         Welcome Screen / Messages         │ │ Main Area
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ [🎤] [Type message...] [↑]               │ │ Input Area
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Made with ❤️ by N A R 🎀                      │ Footer
└─────────────────────────────────────────────────┘
```

## Features Guide

### 1. Sending Messages

**Keyboard Method:**
- Type your message
- Press `Enter` to send
- Press `Shift + Enter` for new line

**Voice Method:**
- Click the 🎤 microphone button
- Speak your message
- It will be automatically added to the input

### 2. Changing Themes

1. Click the 🎨 button in top-right
2. Select from 5 themes:
   - 🌊 Ocean (Default)
   - 🌅 Sunset
   - 🌲 Forest
   - 🌙 Midnight
   - 🌹 Rose
3. Theme is saved automatically

### 3. Using Quick Actions

**Example Prompts** (Welcome Screen):
- Click any prompt to auto-fill input
- Prompts include:
  - 🔬 Explain quantum computing
  - 💻 Write Python code
  - ⚛️ React best practices
  - ✈️ Plan a trip
  - 🚀 Create REST API
  - 🤖 Machine learning basics

**Quick Actions** (Welcome Screen):
- 📝 Summarize this
- 👶 Explain like I'm 5
- 💡 Give me code examples
- ✂️ Make it shorter

### 4. Message Actions

**For AI Messages:**

**Copy Message** 📋
- Click the copy button
- Message is copied to clipboard
- Button shows ✓ for 2 seconds

**Regenerate Response** 🔄
- Click the regenerate button
- AI generates a new response
- Previous response is replaced

### 5. Exporting Chats

1. Click the 💾 button in top-right
2. Chat is downloaded as `.txt` file
3. Filename: `alice-chat-YYYY-MM-DD.txt`
4. Format: "You: message" and "Alice: response"

### 6. Sidebar Navigation

**Open/Close Sidebar:**
- Click the ← or → button
- Sidebar shows recent conversations
- Click "New Chat" to start fresh

**Mobile:**
- Sidebar overlays on mobile
- Swipe or click toggle to open/close

### 7. Scroll Navigation

**Auto-scroll:**
- New messages auto-scroll to bottom

**Manual Scroll:**
- Scroll up to read history
- Scroll to top button (↑) appears after scrolling 300px
- Click to smoothly scroll to top

### 8. Connection Status

**Normal Operation:**
- No indicator shown
- Messages send normally

**Connection Error:**
- ⚠️ "Connection error" appears
- Auto-dismisses after 3 seconds
- Check your internet connection

## Tips & Tricks

### 💡 Pro Tips

1. **Voice Input**
   - Works best in quiet environments
   - Speak clearly and at normal pace
   - Supported in Chrome, Edge, Safari

2. **Code Blocks**
   - AI responses with code are syntax-highlighted
   - Specify language for better highlighting
   - Example: "Write a Python function..."

3. **Long Conversations**
   - Use scroll to top button for quick navigation
   - Export chat to save important conversations
   - Start new chat for different topics

4. **Mobile Usage**
   - Use landscape mode for more space
   - Tap and hold to select text
   - Pinch to zoom on code blocks

5. **Keyboard Shortcuts**
   - `Enter`: Send message
   - `Shift + Enter`: New line
   - `Ctrl/Cmd + A`: Select all in input

### 🎨 Theme Selection Guide

**Choose Your Theme Based On:**

- **Ocean** 🌊: Professional, calm, default
- **Sunset** 🌅: Warm, creative, evening work
- **Forest** 🌲: Natural, focused, coding
- **Midnight** 🌙: Dark, minimal, late night
- **Rose** 🌹: Elegant, soft, comfortable

### 📱 Mobile Best Practices

1. **Portrait Mode**
   - Best for reading messages
   - Easier typing
   - Compact layout

2. **Landscape Mode**
   - More screen space
   - Better for code
   - Side-by-side view

3. **Touch Gestures**
   - Tap buttons (44px minimum)
   - Scroll smoothly
   - Pinch to zoom

## Common Use Cases

### 1. Coding Help

```
You: "Write a Python function to sort a list"
Alice: [Provides code with syntax highlighting]
Actions: Copy code, regenerate for alternatives
```

### 2. Learning

```
You: "Explain quantum computing in simple terms"
Alice: [Provides explanation]
Actions: Ask follow-up questions, save chat
```

### 3. Planning

```
You: "Help me plan a trip to Japan"
Alice: [Provides itinerary]
Actions: Export chat for reference
```

### 4. Quick Answers

```
You: "What are React best practices?"
Alice: [Lists best practices]
Actions: Copy for notes, regenerate for more
```

## Troubleshooting

### Voice Input Not Working

**Solutions:**
1. Check browser support (Chrome/Edge recommended)
2. Allow microphone permissions
3. Check microphone is working
4. Try in incognito mode

### Messages Not Sending

**Solutions:**
1. Check internet connection
2. Look for connection error indicator
3. Refresh the page
4. Check API server is running

### Theme Not Saving

**Solutions:**
1. Check browser allows localStorage
2. Clear browser cache
3. Try different browser
4. Check browser privacy settings

### Slow Performance

**Solutions:**
1. Close other tabs
2. Clear browser cache
3. Use lighter theme (Midnight)
4. Reduce animation (future feature)

### Mobile Issues

**Solutions:**
1. Update browser to latest version
2. Clear app cache
3. Try landscape mode
4. Reduce zoom level

## Keyboard Shortcuts Reference

| Action | Shortcut |
|--------|----------|
| Send message | `Enter` |
| New line | `Shift + Enter` |
| Select all | `Ctrl/Cmd + A` |
| Copy text | `Ctrl/Cmd + C` |
| Paste text | `Ctrl/Cmd + V` |

## Accessibility Features

### Screen Readers
- All buttons have ARIA labels
- Semantic HTML structure
- Proper heading hierarchy

### Keyboard Navigation
- Tab through interactive elements
- Enter to activate buttons
- Escape to close modals

### Visual
- High contrast themes available
- Large touch targets (44px)
- Clear focus indicators

## Privacy & Data

### What's Stored Locally
- Your name
- User ID
- Selected theme
- No message history stored locally

### What's Sent to Server
- Messages you send
- Conversation ID
- User ID

### What's NOT Stored
- Personal information
- Payment details
- Location data

## Best Practices

### For Best Experience

1. **Use Latest Browser**
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

2. **Stable Internet**
   - Minimum 1 Mbps
   - Stable connection
   - Low latency

3. **Regular Updates**
   - Clear cache monthly
   - Update browser
   - Check for app updates

4. **Organize Chats**
   - Export important conversations
   - Start new chat for new topics
   - Use descriptive first messages

## Getting Help

### Resources
- **FEATURES.md**: Complete feature list
- **COMPONENTS.md**: Technical documentation
- **CHANGELOG.md**: Version history
- **README.md**: Setup guide

### Support
- Check documentation first
- Review troubleshooting section
- Contact support if needed

---

**Made with ❤️ by N A R 🎀**

**Last Updated**: November 15, 2025
**Version**: 2.0.0

Happy Chatting! 🎉
