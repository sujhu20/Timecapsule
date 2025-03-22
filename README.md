# TimeCapsule 🕰️

TimeCapsule is a secure application that allows users to create encrypted time capsules with messages, photos, videos, and files that can be opened at specific times or under certain conditions.

## Features

- Create time capsules with multiple content types (text, images, videos, files)
- End-to-end encryption for maximum privacy
- Flexible delivery conditions (date-based, password-protected, location-based)
- Support for self-destructing capsules
- Public and private capsule options
- PWA support for mobile installation
- Android app version available

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/timecapsule.git
   cd timecapsule
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your own values.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Web Deployment

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy to your hosting service:
   ```bash
   # For Vercel
   vercel --prod
   
   # For Netlify
   netlify deploy --prod
   ```

See the `DEPLOYMENT.md` file for detailed hosting instructions.

### Android App Deployment

See the `ANDROID_APP.md` file for instructions on building and deploying the Android app.

## Security

TimeCapsule uses modern encryption standards:

- AES-256 for content encryption
- RSA-2048 for key exchange
- PBKDF2 for password hashing

All encryption happens in the browser, ensuring your content remains private.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
