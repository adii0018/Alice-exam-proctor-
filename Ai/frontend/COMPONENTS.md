# Alice AI - Component Documentation 🎀

## Core Components

### 1. **App Component** (`App.jsx`)
Main application component with all features integrated.

#### State Management
```javascript
- messages: Array of chat messages
- input: Current input text
- conversationId: Active conversation ID
- loading: Loading state
- conversations: List of conversations
- sidebarOpen: Sidebar visibility
- userName: User's name
- userId: User's ID
- showNameModal: Name modal visibility
- theme: Current theme
- themeMenuOpen: Theme menu visibility
- settingsOpen: Settings panel visibility
- isRecording: Voice recording state
- copySuccess: Copy feedback state
- showScrollTop: Scroll button visibility
- connectionStatus: Connection status
```

#### Key Features

**Theme System**
- 5 pre-built themes with gradients
- Dynamic theme switching
- Persistent theme storage
- Theme-specific accent colors

**Message System**
- Real-time message display
- Markdown rendering with syntax highlighting
- Message timestamps
- Word count for AI responses
- Copy and regenerate actions

**Voice Input**
- Browser speech recognition
- Visual recording indicator
- Automatic text insertion

**Export Functionality**
- Export chat to .txt file
- Formatted with timestamps
- One-click download

**Scroll Management**
- Auto-scroll to bottom on new messages
- Scroll to top button (appears after 300px)
- Smooth scrolling animations

## UI Components

### 2. **Welcome Screen**
Displayed when no messages exist.

**Features:**
- Animated logo
- Tagline
- Example prompts with icons
- Quick action buttons

### 3. **Message Wrapper**
Individual message container.

**Features:**
- User/Assistant differentiation
- Avatar with icon
- Timestamp display
- Message content with markdown
- Action buttons (Copy, Regenerate)
- Word count for AI messages

### 4. **Input Container**
Message input area.

**Features:**
- Auto-expanding textarea
- Voice input button
- Send button with loading state
- Character count
- Keyboard shortcuts (Enter/Shift+Enter)

### 5. **Sidebar**
Navigation and conversation history.

**Features:**
- Collapsible design
- New chat button
- Conversation list
- Smooth animations

### 6. **Theme Switcher**
Theme selection panel.

**Features:**
- Expandable menu
- 5 theme options
- Active theme indicator
- Smooth transitions

### 7. **Top Controls**
Action buttons in top-right.

**Features:**
- Export chat button
- Settings button
- Responsive layout

### 8. **Connection Status**
Network status indicator.

**Features:**
- Error notifications
- Auto-dismiss after 3s
- Animated entrance

## Styling System

### Color Themes

**Ocean (Default)**
```css
gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
accent: #19c37d
```

**Sunset**
```css
gradient: linear-gradient(135deg, #2d1b4e 0%, #4a1942 50%, #6b1839 100%)
accent: #ff6b9d
```

**Forest**
```css
gradient: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)
accent: #4ade80
```

**Midnight**
```css
gradient: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)
accent: #a78bfa
```

**Rose**
```css
gradient: linear-gradient(135deg, #3d1635 0%, #5c2a4a 50%, #7b3f5f 100%)
accent: #fda4af
```

### Animation System

**Message Animations**
- `messageSlideIn`: Fade and slide up
- `float`: Gentle floating motion
- `glow`: Pulsing glow effect
- `typing`: Typing indicator dots

**UI Animations**
- `fadeIn`: Fade in effect
- `slideIn`: Slide from right
- `fadeInUp`: Fade and slide up
- `heartbeat`: Pulsing heart
- `shimmer`: Gradient shimmer
- `rotate`: Continuous rotation

### Responsive Breakpoints

```css
Desktop: > 1024px
Tablet: 769px - 1024px
Mobile Landscape: 481px - 768px
Mobile Portrait: 320px - 480px
Extra Small: < 360px
```

## API Integration

### Endpoints Used

**POST /api/chat**
```javascript
{
  message: string,
  conversation_id: string | null,
  user_id: string
}
```

**POST /api/user/create**
```javascript
{
  name: string
}
```

### Response Format

```javascript
{
  response: string,
  conversation_id: string
}
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (voice input may vary)
- Mobile browsers: Optimized

## Performance Optimizations

1. **CSS Optimizations**
   - Hardware acceleration with `translateZ(0)`
   - `will-change` for animated elements
   - Efficient selectors

2. **React Optimizations**
   - Proper key usage in lists
   - Ref usage for DOM manipulation
   - Controlled component patterns

3. **Smooth Scrolling**
   - Native smooth scroll
   - Touch-optimized scrolling
   - Efficient scroll event handling

## Accessibility Features

- Semantic HTML
- ARIA labels on buttons
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Future Enhancement Ideas

1. **Advanced Features**
   - Image upload support
   - File attachment
   - Voice output (TTS)
   - Multi-language support
   - Search in conversations

2. **UI Improvements**
   - Custom theme creator
   - Font size adjustment
   - Compact/comfortable view modes
   - Message reactions

3. **Functionality**
   - Message editing
   - Conversation folders
   - Favorite messages
   - Share conversations
   - Collaborative chats

## Dependencies

```json
{
  "axios": "^1.6.2",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-markdown": "^10.1.0",
  "react-syntax-highlighter": "^16.1.0",
  "remark-gfm": "^4.0.1"
}
```

## Development Commands

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

---

**Made with ❤️ by N A R 🎀**
