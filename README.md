# Movies-And-TV-Shows-Recaps-Maker-Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)

> **[See it live on GitHub](https://github.com/yaskovbs/Movies-And-TV-Shows-Recaps-Maker-Hub)**

An AI-powered web application for creating video recaps, summaries, and voice-over scripts from movies and TV shows using Google Gemini AI and FFmpeg.wasm.

## Features

- 🎬 **Intelligent Video Processing**: Automatically cuts videos into 2-second segments every 8 seconds, then adds AI-generated voice-over
- 🤖 **Gemini AI Integration**: Generates compelling scripts based on video descriptions
- 🎯 **Customizable Recap Length**: Set duration from 1 second to 300 seconds
- 📁 **File Size Support**: Up to 2GB free processing, larger files via external servers
- 🎤 **Text-to-Speech**: Browser-based voice synthesis with multiple voice options
- 📁 **File Upload Support**: Supports MP4, MOV, AVI and other video formats
- 🔐 **API Key Management**: Users can add their own Gemini API keys
- 🎨 **Modern UI**: Dark theme with responsive design using Tailwind CSS

## Run Locally

### Prerequisites
- Node.js (v18+ recommended)

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key for Gemini AI

3. **Configure API Key:**
   - In the web app, use the API key input in the top-right corner of the header

4. **Run the application:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - The app will be available at `http://localhost:5175`

## How to Use

1. **Enter Your API Key**: Input your Gemini API key in the header field
2. **Upload Video**: Drag & drop a video file or click to browse
3. **Add Description**: Provide a description of the video content
4. **Set Duration**: Adjust the desired recap length (1-300 seconds)
5. **Generate Recap**: Click "Create Recap Video & Script"
6. **Listen to Script**: Use the play controls to hear the generated voice-over

## Future Features (Planned)

- 🎬 YouTube URL support
- 🎭 Professional voice synthesis
- ✂️ Video editing timeline
- 🎨 Custom templates for social media
- 🌐 Hebrew language support

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Video Processing**: FFmpeg.wasm
- **AI**: Google Gemini AI
- **Speech Synthesis**: Web Speech API
- **Build Tool**: Vite

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**yaskovbs**
- GitHub: [@yaskovbs](https://github.com/yaskovbs)
- Repository: [Movies-And-TV-Shows-Recaps-Maker-Hub](https://github.com/yaskovbs/Movies-And-TV-Shows-Recaps-Maker-Hub)
