# 🌍 World Timezone Converter

A modern, responsive web application for converting time between different timezones around the world. Built with React and Vite for fast performance and smooth user experience.

## ✨ Features

-   **Real-time Clock Display**: Live clocks showing current time in multiple timezones
-   **One-to-Many Conversion**: Convert from one source timezone to multiple target timezones simultaneously
-   **Dynamic UTC Offset**: Automatically calculates accurate UTC offsets including daylight saving time
-   **Smart Timezone Search**: Search and select timezones with autocomplete functionality
-   **Custom Format Support**: Supports both dropdown selection and manual input in `Region/Country/City(UTC±X)` format
-   **Date & Time Selection**: Convert specific dates and times, not just current time
-   **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
-   **Modern UI**: Clean, intuitive interface with color-coded sections

## 🚀 Quick Start

### Prerequisites

-   Node.js (version 14 or higher)
-   npm or yarn package manager

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd timezone-converter
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**

    ```bash
    npm run dev
    ```

4. **Open your browser**
    - Navigate to `http://localhost:5173/timezone-converter/`
    - If port 5173 is busy, Vite will automatically use the next available port (e.g., 5174)

## 🎯 How to Use

### Adding World Clocks

1. Use the search bar at the top to find timezones
2. Type a country, city, or timezone name (e.g., "Taiwan", "New York", "Tokyo")
3. Press Enter to add the timezone to your world clock display
4. Click the ✕ button on any clock to remove it

### Time Conversion

1. **Set Source Timezone**: In the blue "Source Timezone" section, enter or select your starting timezone
2. **Add Target Timezones**: In the green "Target Timezones" section:
    - Enter your first destination timezone
    - Click "+ Add Target Zone" to add more destinations (up to 5 total)
    - Use the "Remove" button to delete unwanted targets
3. **Select Date & Time**: Choose the specific date and time you want to convert
4. **Convert**: Click "Convert Time" to see results for all target timezones

### Timezone Input Formats

The app supports multiple input formats:

-   **Dropdown Selection**: Choose from the autocomplete suggestions
-   **Manual Input**: Type in the format `Region/Country/City(UTC±X)`
    -   Example: `Asia/Taiwan/Taipei(UTC+8)`
    -   Example: `America/United States/New York(UTC-5)`
-   **Search by Keywords**: Type partial names like "Taiwan", "New York", "London"

## 🛠️ Technical Details

### Built With

-   **React 18**: Modern React with hooks for state management
-   **Vite**: Fast build tool and development server
-   **Tailwind CSS**: Utility-first CSS framework for styling
-   **JavaScript Intl API**: Native browser API for accurate timezone calculations

### Key Features

-   **Dynamic UTC Offsets**: Uses `Intl.DateTimeFormat` API to get real-time, accurate UTC offsets
-   **Daylight Saving Time**: Automatically handles DST transitions
-   **Performance Optimized**: Efficient rendering with React hooks and minimal re-renders
-   **Cross-browser Compatible**: Works on all modern browsers

### Project Structure

```
timezone-converter/
├── src/
│   ├── TimezoneConverter.jsx    # Main component
│   ├── App.jsx                  # App wrapper
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 📱 Screenshots

### World Clock Display

Real-time clocks showing current time in different timezones with easy-to-read format.

### Time Conversion Tool

Convert from one source timezone to multiple destinations with clear, organized results.

## 🔧 Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build locally
-   `npm run lint` - Run ESLint for code quality

## 🌐 Supported Timezones

The application supports all standard IANA timezone identifiers, including:

-   **Asia**: Tokyo, Seoul, Shanghai, Hong Kong, Taipei, Singapore, Bangkok, Mumbai, Dubai, etc.
-   **Europe**: London, Paris, Berlin, Rome, Madrid, Amsterdam, Moscow, etc.
-   **Americas**: New York, Los Angeles, Chicago, Toronto, Mexico City, São Paulo, etc.
-   **Africa**: Cairo, Lagos, Johannesburg, Nairobi, Casablanca, etc.
-   **Oceania**: Sydney, Melbourne, Auckland, Fiji, etc.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

-   Warning about `postcss.config.js` module type (doesn't affect functionality)
-   To fix: Add `"type": "module"` to `package.json`

## 💡 Future Enhancements

-   [ ] Save favorite timezone combinations
-   [ ] Export conversion results
-   [ ] Meeting scheduler integration
-   [ ] Mobile app version
-   [ ] Offline support
-   [ ] Custom timezone aliases

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed description
3. Include browser version and error messages if applicable

---

**Happy timezone converting! 🌍⏰**
