# TCUserApp - Teamcenter User Management Application

A comprehensive user management system for Siemens Teamcenter PLM, built with Spring Boot backend and React TypeScript frontend.

## 🏗️ Architecture Overview

```
TCUserApp/
├── TcUserApp-Backend/     # Spring Boot REST API
├── tcuserapp-frontend/    # React TypeScript UI
└── ITK-Code/             # Teamcenter ITK integration
```

## 🚀 Features

### User Management
- **User Registration & Authentication** - Azure AD integration with SSO
- **Role-Based Access Control** - Admin, Manager, User, and Role Approver roles
- **User Request Workflow** - Create, approve, and manage user access requests
- **User Inventory** - Activate/deactivate users, view user history

### Teamcenter Integration
- **ITK (Integration Toolkit)** - Direct integration with Teamcenter PLM
- **User Synchronization** - Sync users between application and Teamcenter
- **Group & Role Management** - Manage Teamcenter groups and roles
- **License Management** - Track and manage Teamcenter licenses

### Administrative Features
- **System Configuration** - Manage countries, services, volumes, and systems
- **Approval Workflows** - Multi-level approval process for user requests
- **Audit & History** - Complete audit trail of user actions
- **Email Notifications** - Automated email notifications for requests

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.2
- **Security**: Spring Security + Azure AD OAuth2
- **Database**: MySQL with JPA/Hibernate
- **Integration**: Teamcenter ITK, REST APIs
- **Authentication**: JWT tokens
- **Email**: Spring Mail

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: SCSS + Styled Components

## 📋 Prerequisites

- **Java 17+**
- **Node.js 16+**
- **MySQL 8.0+**
- **Teamcenter 13.2** (for ITK integration)
- **Azure AD** (for authentication)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/sohamsutar9960/TCUserApp.git
cd TCUserApp
```

### 2. Backend Setup
```bash
cd TcUserApp-Backend
# Configure environment variables (see Backend README)
./mvnw spring-boot:run
```

### 3. Frontend Setup
```bash
cd tcuserapp-frontend
npm install
npm start
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## 🔧 Configuration

### Environment Variables
Create `.env` file in `TcUserApp-Backend/`:
```env
# Database
DB_URL=jdbc:mysql://localhost:3306/TCUserAppDB
DB_USERNAME=root
DB_PASSWORD=your-password

# Azure AD
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id

# API & Email configurations...
```

## 📚 Documentation

- [Backend Documentation](./TcUserApp-Backend/README.md)
- [Frontend Documentation](./tcuserapp-frontend/README.md)

## 🏢 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, system configuration |
| **Manager** | Approve user requests, view team members |
| **Role Approver** | Approve role-specific requests |
| **User** | Create requests, view own requests |

## 🔄 Workflow

1. **User Registration** → Azure AD authentication
2. **Request Creation** → User creates access request
3. **Manager Approval** → Manager reviews and approves
4. **Role Approval** → Role approver validates permissions
5. **Teamcenter Sync** → User created in Teamcenter
6. **Notification** → Email confirmation sent

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary software developed for Siemens Teamcenter integration.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ by Intelizign for Siemens Teamcenter**