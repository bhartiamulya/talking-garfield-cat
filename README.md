#  Talking Garfield Cat

An interactive web application featuring a Garfield-style talking cat with voice responses, animations, and engaging interactions.

## Features

- **Interactive Cat Character**: Tap Garfield to see different reactions and hear sounds
- **Voice Responses**: Record your voice and hear Garfield respond with character-appropriate phrases
- **Multiple Interactions**: Feed lasagna, pet the cat, or talk to him
- **Dynamic Animations**: Smooth CSS animations for bouncing, shaking, and other movements
- **Mood System**: Track taps and watch Garfield's mood change
- **Responsive Design**: Works on desktop and mobile devices
- **AI-Generated Assets**: Character images and voice responses created using AI tools

## Tech Stack

- Pure HTML5, CSS3, and Vanilla JavaScript
- No external frameworks or libraries
- Web Audio API for sound management
- MediaRecorder API for voice recording
- CSS animations and gradients

## Project Structure

```
talking-cat-app/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── app.js              # Application logic
└── assets/
    ├── images/         # Garfield character poses (6 images)
    └── sounds/         # Cat sounds and voice responses (11 audio files)
```

## Setup

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Grant microphone permission when prompted (for "Talk to Me" feature)

No build process or dependencies required.

## Assets

All assets were generated using AI tools:
- **Images**: Created with DALL·E 3 / Bing Image Creator
- **Voice Responses**: Generated with ElevenLabs text-to-speech
- **Sound Effects**: Sourced from Freesound.org

## Features Breakdown

### Interactions
- **Tap Cat**: Random meows with pose changes
- **Feed Lasagna**: Watch Garfield eat and react happily
- **Pet Me**: Hear purring and see content reactions
- **Talk to Me**: Record voice and receive Garfield's sarcastic responses

### Technical Features
- Sound overlap prevention
- Animation locking to prevent spam clicks
- Fallback systems for missing assets
- Responsive layout (no scrolling needed)
- State management for tracking interactions

## Acknowledgments

- Garfield character inspired by Jim Davis's comic strip
- Voice responses capture Garfield's lazy, sarcastic personality
- Background and character design follow the classic Garfield aesthetic


