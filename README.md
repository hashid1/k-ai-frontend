# KoorioX - AI Chat Assistant MVP

A beautiful, modern web application that provides a seamless chat interface with OpenAI's GPT models. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🤖 **OpenAI Integration**: Direct integration with OpenAI's Chat API
- 🔐 **Secure Key Storage**: API keys stored locally in browser storage
- 💬 **Beautiful Chat Interface**: Modern, responsive chat UI with smooth animations
- ⚡ **Real-time Responses**: Instant AI responses with typing indicators
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🎨 **Modern Design**: Glassmorphism effects and smooth transitions
- 🔄 **Error Handling**: Comprehensive error handling and retry functionality
- 📝 **Message History**: Full conversation history within session
- 🎯 **Copy to Clipboard**: Easy copying of AI responses

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kooriox
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the generated key
5. Enter the key in KoorioX when prompted

## Usage

1. **First Time Setup**: When you first open KoorioX, you'll be prompted to enter your OpenAI API key
2. **Start Chatting**: Once your key is set, start typing messages in the chat input
3. **Manage API Key**: Click the settings icon to update or change your API key
4. **Clear Chat**: Use the trash icon to clear the current conversation
5. **Copy Responses**: Hover over AI messages to copy them to clipboard

## Features in Detail

### Chat Interface
- Clean, modern design with gradient backgrounds
- Smooth animations and micro-interactions
- Typing indicators during AI responses
- Message timestamps
- Responsive layout for mobile and desktop

### API Key Management
- Secure modal for API key entry
- Key validation and testing
- Local storage for persistence
- Easy key management and updates

### Error Handling
- Network error detection
- API rate limit handling
- Invalid key detection
- Retry functionality for failed requests

### Message Features
- User and AI message differentiation
- Copy to clipboard functionality
- Message formatting and line breaks
- Conversation history within session

## Technical Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API**: OpenAI Chat Completions API

## Project Structure

```
src/
├── components/
│   ├── ChatBox.jsx      # Main chat interface
│   ├── KeyModal.jsx     # API key management modal
│   └── Message.jsx      # Individual message component
├── hooks/
│   └── useLocalStorage.js # Local storage hook
├── utils/
│   └── openai.js        # OpenAI API utilities
├── App.jsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Environment Variables

No environment variables are required. The application uses the OpenAI API key provided by the user through the interface.

## Security Considerations

- API keys are stored locally in the browser
- Keys are never transmitted to any server except OpenAI
- All API calls are made directly from the browser to OpenAI
- No backend or server-side storage of sensitive data

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the OpenAI API status
2. Verify your API key is valid
3. Check browser console for errors
4. Ensure you have sufficient OpenAI credits

## Roadmap

- [ ] Conversation persistence across sessions
- [ ] Multiple conversation threads
- [ ] Dark mode support
- [ ] Export conversations
- [ ] Custom system prompts
- [ ] File upload support
- [ ] Voice input/output