# 🏋️‍♂️ GymReservation System

[![Angular](https://img.shields.io/badge/Angular-20.1.0-dd0031.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-007acc.svg)](https://www.typescriptlang.org/)
[![Material UI](https://img.shields.io/badge/Material_UI-20.1.0-0081cb.svg)](https://material.angular.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📱 Overview

A comprehensive gym reservation and management system built with Angular. The application enables users to book gym sessions, manage profiles, and administrators to oversee schedules and user accounts.

## 🚀 Features

- User authentication and authorization
- Gym session reservation system
- Weight room management
- User profile management
- Administrative dashboard
- Password reset functionality
- Responsive Material Design UI
- Role-based access control
- Social login integration
- Real-time schedule management

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 20.1.0
- **UI Library**: Angular Material 20.1.0
- **State Management**: RxJS 7.8.1
- **Styling**: SCSS
- **Authentication**: Custom + Social Login
- **Testing**: Jasmine & Karma
- **Build Tools**: Angular CLI

## 📋 Prerequisites

- Node.js (Latest LTS version)
- npm/yarn package manager
- Angular CLI 20.1.0
- Modern web browser

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd Web-GymResevationSystem

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── admin/           # Admin module (lazy loaded)
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components
│   ├── customer/        # Customer features
│   ├── guards/          # Route guards
│   ├── model/           # Data models
│   ├── service/         # Services
│   └── utils/           # Utilities
├── assets/             # Static assets
└── environments/       # Environment configurations
```

## 🔧 Configuration

Environment configuration files are located in `src/environments/`:

- `environment.ts` - Development environment
- `environment.prod.ts` - Production environment
- `environment.variables.ts` - Environment variables

## 📱 Running the Application

Development mode:
```bash
ng serve
```

Production build:
```bash
ng build --configuration production
```

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e
```

## 📚 API Integration

The application integrates with backend services through:

- Local development: `http://localhost:8080/gymcachi`
- Production: Azure/Heroku deployment options available

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

**Note**: This is a production-ready Angular application following best practices including:
- Lazy loading modules
- Role-based authorization
- Component-based architecture
- Responsive design
- Service abstraction
- Environment configuration

For more information, please refer to the documentation or contact the development team.

[Add screenshots here]

