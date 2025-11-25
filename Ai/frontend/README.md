# Alice AI - Enhanced Chat Interface 🎀

A beautiful, feature-rich AI chat interface with multiple themes, voice input, and modern UI components.

## ✨ Key Features

### 🎨 Visual Features
- **5 Beautiful Themes**: Ocean, Sunset, Forest, Midnight, Rose
- **Smooth Animations**: Message transitions, floating elements, hover effects
- **Syntax Highlighting**: Beautiful code blocks with proper formatting
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🚀 Interactive Features
- **Voice Input** 🎤: Speak your messages (browser-dependent)
- **Copy Messages** 📋: One-click copy with visual feedback
- **Regenerate Responses** 🔄: Get alternative AI responses
- **Export Chat** 💾: Download conversations as text files
- **Scroll to Top** ↑: Quick navigation for long conversations

### 💬 Message Features
- **Markdown Support**: Rich text formatting
- **Code Highlighting**: Syntax highlighting for 100+ languages
- **Timestamps**: Track when messages were sent
- **Word Count**: See response length at a glance
- **Message Actions**: Copy and regenerate options

### 🎯 User Experience
- **Quick Actions**: Pre-built prompts for common tasks
- **Example Prompts**: Get started quickly with suggestions
- **Connection Status**: Visual feedback for network issues
- **Loading States**: Beautiful typing indicators
- **Auto-scroll**: Smooth scrolling to new messages

## 🛠️ Tech Stack

- **React 18.2**: Modern React with hooks
- **Vite 5.0**: Lightning-fast build tool
- **Axios**: HTTP client for API calls
- **React Markdown**: Markdown rendering
- **React Syntax Highlighter**: Code syntax highlighting
- **Remark GFM**: GitHub Flavored Markdown support

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Available Themes

1. **🌊 Ocean** (Default)
   - Dark blue gradient
   - Green accent (#19c37d)

2. **🌅 Sunset**
   - Purple-pink gradient
   - Pink accent (#ff6b9d)

3. **🌲 Forest**
   - Dark teal gradient
   - Light green accent (#4ade80)

4. **🌙 Midnight**
   - Deep black-blue gradient
   - Purple accent (#a78bfa)

5. **🌹 Rose**
   - Dark rose gradient
   - Light pink accent (#fda4af)

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px - Full-featured layout
- **Tablet**: 769px - 1024px - Optimized sidebar
- **Mobile Landscape**: 481px - 768px - Touch-optimized
- **Mobile Portrait**: 320px - 480px - Compact design
- **Extra Small**: < 360px - Minimal layout

## ⌨️ Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Esc**: Close modals (future feature)

## 🎯 Quick Actions

- **Summarize this**: Get quick summaries
- **Explain like I'm 5**: Simple explanations
- **Give me code examples**: Practical code snippets
- **Make it shorter**: Concise responses

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

### API Endpoints

The app connects to these endpoints:

- `POST /api/chat`: Send messages
- `POST /api/user/create`: Create new user

## 📚 Documentation

- **[FEATURES.md](./FEATURES.md)**: Detailed feature list
- **[COMPONENTS.md](./COMPONENTS.md)**: Component documentation
- **[CHANGELOG.md](./CHANGELOG.md)**: Version history

## 🎨 Customization

### Adding New Themes

Edit `App.jsx` and add to the `themes` object:

```javascript
const themes = {
  yourTheme: {
    name: '🎨 Your Theme',
    gradient: 'linear-gradient(135deg, #color1 0%, #color2 100%)',
    accent: '#accentColor'
  }
}
```

### Modifying Colors

All colors are defined in `App.css` using CSS variables and can be easily customized.

## 🚀 Performance

- **Hardware Acceleration**: Smooth 60fps animations
- **Optimized Rendering**: Efficient React re-renders
- **Lazy Loading**: Components load on demand
- **Code Splitting**: Smaller bundle sizes
- **Touch Optimized**: 44px minimum touch targets

## 🌐 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile Browsers (iOS Safari, Chrome Mobile)

**Note**: Voice input requires browser support for Web Speech API.

## 📱 Mobile Features

- Touch-friendly buttons (44px minimum)
- Swipe gestures support
- Optimized keyboard handling
- Landscape mode support
- Pull-to-refresh (future feature)

## 🐛 Known Issues

- Voice input may not work in all browsers
- Large code blocks may affect performance
- Theme switching animation may lag on older devices

## 🔮 Roadmap

### Coming Soon
- [ ] Image upload support
- [ ] File attachments
- [ ] Voice output (TTS)
- [ ] Multi-language support
- [ ] Search in conversations

### Future Plans
- [ ] Custom theme creator
- [ ] Message editing
- [ ] Conversation folders
- [ ] Collaborative chats
- [ ] Plugin system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the Alice AI chat application.

## 💖 Credits

**Made with ❤️ by N A R 🎀**

Special thanks to:
- React team for the amazing framework
- Vite team for the blazing-fast build tool
- All open-source contributors

---

## 🎯 Quick Start Guide

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

5. **Start chatting!** 🎉

---

**Last Updated**: November 15, 2025
**Version**: 2.0.0
