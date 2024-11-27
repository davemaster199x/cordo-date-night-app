# Date Night App

A cross-platform mobile application built with Apache Cordova to help couples plan, organize, and discover exciting date night activities.

## Features

- **Date Night Ideas**: Curated list of date activities categorized by:
  - Indoor/Outdoor
  - Budget-friendly/Luxury
  - Active/Relaxing
  - Seasonal activities

- **Planning Tools**:
  - Calendar integration for scheduling dates
  - Reminder notifications
  - Weather forecast integration
  - Budget tracking for date expenses

- **Couple's Profile**:
  - Shared preferences
  - Activity wishlist
  - Date history
  - Favorite spots and venues

## Technical Stack

- Apache Cordova
- HTML5, CSS3, JavaScript
- Local Storage for offline functionality
- Integration with device features:
  - Calendar
  - Camera
  - Geolocation
  - Push notifications

## Installation

### Prerequisites

```bash
# Install Node.js and npm
# Install Cordova CLI
npm install -g cordova

# Install platform dependencies
# For iOS development:
xcode-select --install

# For Android development:
# Install Android Studio and Android SDK
```

### Project Setup

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Add platforms
cordova platform add ios
cordova platform add android

# Install required plugins
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-geolocation
cordova plugin add cordova-plugin-local-notification
cordova plugin add cordova-plugin-calendar
```

## Project Structure

```
datenight/
├── www/                 # Web assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   ├── img/            # Images and icons
│   └── index.html      # Main HTML file
├── config.xml          # Cordova configuration
├── hooks/              # Cordova hooks
├── platforms/          # Platform-specific builds
├── plugins/            # Cordova plugins
└── res/                # Resources (icons, splash screens)
```

## Development

### Build and Run

```bash
# Build the application
cordova build

# Run on iOS simulator
cordova emulate ios

# Run on Android device
cordova run android
```

### Testing

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run e2e
```

## Features Implementation

### Local Storage
The app uses local storage for:
- User preferences
- Saved date ideas
- Activity history
- Offline access to basic features

### API Integrations
- Weather API for date planning
- Maps API for location services
- Calendar API for scheduling
- Local business API for venue suggestions

### Push Notifications
- Date reminders
- Weather alerts
- Special occasion reminders
- Partner activity notifications

## Deployment

### iOS
1. Open the Xcode project in `platforms/ios`
2. Configure signing certificates
3. Build and archive for App Store submission

### Android
1. Configure signing keys in `build.gradle`
2. Generate signed APK
3. Submit to Google Play Store

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Authors

- Dave Malhin - *Initial work*
