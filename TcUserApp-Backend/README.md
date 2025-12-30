# TCUserApp Backend

Spring Boot REST API for Teamcenter User Management Application with Azure AD authentication and Teamcenter ITK integration.

## 🏗️ Architecture

```
src/main/java/intelizign/tcuserapp/backend/
├── config/           # Security, JWT, Azure AD configuration
├── controller/       # REST API endpoints
├── dto/             # Data Transfer Objects
├── enums/           # Application enums
├── exception/       # Custom exceptions
├── itk/             # Teamcenter ITK integration
├── model/           # JPA entities
├── repository/      # Data access layer
└── service/         # Business logic layer
```

## 🚀 Features

### Authentication & Security
- **Azure AD OAuth2** integration with SSO
- **JWT token** based authentication
- **Role-based access control** (RBAC)
- **CORS** configuration for frontend integration

### Core Modules
- **User Management** - Registration, profile, role assignment
- **Request Workflow** - Create, approve, track user requests
- **Admin Panel** - System configuration and user management
- **ITK Integration** - Direct Teamcenter communication
- **Email Service** - Automated notifications

### Database Integration
- **MySQL** with JPA/Hibernate
- **Entity relationships** with proper foreign keys
- **Audit trails** for all user actions
- **Data validation** and constraints

## 🛠️ Technology Stack

- **Spring Boot 3.2.2** - Main framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **Azure Spring Cloud** - Azure AD integration
- **MySQL Connector** - Database connectivity
- **JWT (jjwt)** - Token management
- **Apache POI** - Excel file processing
- **Lombok** - Code generation
- **ModelMapper** - Object mapping

## 📋 Prerequisites

- **Java 17 or higher**
- **Maven 3.6+**
- **MySQL 8.0+**
- **Teamcenter 13.2** (for ITK)
- **Azure AD tenant** (for authentication)

## 🚀 Setup & Installation

### 1. Database Setup
```sql
CREATE DATABASE TCUserAppDB;
CREATE USER 'tcuser'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON TCUserAppDB.* TO 'tcuser'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Environment Configuration
Create `.env` file in project root:
```env
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/TCUserAppDB
DB_USERNAME=root
DB_PASSWORD=your-db-password

# Azure AD Configuration
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id

# API Configuration
API_ENDPOINT=https://your-api-endpoint.com/rest/scdservice/v1/scd_user/
API_USERNAME=your-api-username
API_PASSWORD=your-api-password

# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-email-password
```

### 3. Build & Run
```bash
# Install dependencies
./mvnw clean install

# Run application
./mvnw spring-boot:run

# Or run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### 4. Verify Installation
- Application starts on: `http://localhost:8080`
- Health check: `http://localhost:8080/actuator/health`
- API documentation: `http://localhost:8080/swagger-ui.html`

## 🔧 Configuration

### Application Properties
Key configurations in `application.yml`:

```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  
  cloud:
    azure:
      active-directory:
        credential:
          client-id: ${AZURE_CLIENT_ID}
          client-secret: ${AZURE_CLIENT_SECRET}
        profile:
          tenant-id: ${AZURE_TENANT_ID}

jwt:
  token:
    validity: 7200000    # 2 hours
    refresh: 172800000   # 48 hours
```

### Security Configuration
- **JWT Authentication** for API endpoints
- **Azure AD OAuth2** for user authentication
- **Role-based authorization** with method-level security
- **CORS** enabled for frontend integration

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login          # User login
POST /api/auth/refresh        # Refresh JWT token
POST /api/auth/logout         # User logout
```

### User Management
```
GET    /api/users             # Get all users
POST   /api/users             # Create user
PUT    /api/users/{id}        # Update user
DELETE /api/users/{id}        # Delete user
GET    /api/users/profile     # Get user profile
```

### Request Management
```
GET    /api/requests          # Get user requests
POST   /api/requests          # Create new request
PUT    /api/requests/{id}     # Update request
GET    /api/requests/{id}     # Get request details
```

### Admin Endpoints
```
GET    /api/admin/countries   # Manage countries
GET    /api/admin/groups      # Manage groups
GET    /api/admin/roles       # Manage roles
GET    /api/admin/systems     # Manage systems
```

### ITK Integration
```
POST   /api/itk/login         # Teamcenter login
GET    /api/itk/users         # Get TC users
POST   /api/itk/create-user   # Create TC user
PUT    /api/itk/update-user   # Update TC user
```

## 🗄️ Database Schema

### Core Entities
- **User** - Application users
- **UserRequest** - User access requests
- **Role** - System roles
- **Group** - User groups
- **Country** - Geographic locations
- **System** - Teamcenter systems
- **UserHistory** - Audit trail

### Relationships
- User → UserRequest (One-to-Many)
- User → Role (Many-to-Many)
- UserRequest → AssignedRole (One-to-Many)
- Group → Role (Many-to-Many)

## 🔌 ITK Integration

### Teamcenter Connection
```java
@Service
public class ITKService {
    public ITKResponse login(String username, String password) {
        // Teamcenter authentication
    }
    
    public List<TeamcenterUser> getAllUsers() {
        // Fetch all TC users
    }
    
    public void createUser(TeamcenterUserCreationModel user) {
        // Create user in Teamcenter
    }
}
```

### ITK Configuration
- **TC Version**: 13.2
- **Connection**: HTTP/HTTPS
- **Authentication**: Username/Password
- **Services**: Administration, Core, Query

## 📧 Email Service

### Configuration
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

### Email Templates
- **Request Created** - Notification to managers
- **Request Approved** - Confirmation to user
- **Request Rejected** - Rejection notification
- **User Created** - Welcome email

## 🧪 Testing

### Run Tests
```bash
# Unit tests
./mvnw test

# Integration tests
./mvnw test -Dtest=**/*IntegrationTest

# Test coverage
./mvnw jacoco:report
```

### Test Configuration
- **H2 Database** for testing
- **TestContainers** for integration tests
- **MockMvc** for API testing
- **JUnit 5** test framework

## 📊 Monitoring & Logging

### Actuator Endpoints
```
/actuator/health          # Application health
/actuator/metrics         # Application metrics
/actuator/info           # Application info
/actuator/loggers        # Log level management
```

### Logging Configuration
```yaml
logging:
  level:
    intelizign.tcuserapp: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
```

## 🚀 Deployment

### Production Build
```bash
./mvnw clean package -Pprod
```

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/TcUserApp-Backend-0.0.1-SNAPSHOT.war app.war
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.war"]
```

### Environment-Specific Profiles
- **dev** - Development environment
- **test** - Testing environment
- **prod** - Production environment

## 🔒 Security Best Practices

- **Environment variables** for sensitive data
- **JWT token expiration** configured
- **Password encryption** with BCrypt
- **SQL injection prevention** with JPA
- **CORS** properly configured
- **HTTPS** enforced in production

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection** - Check MySQL service and credentials
2. **Azure AD Authentication** - Verify client ID and secret
3. **ITK Connection** - Ensure Teamcenter server accessibility
4. **Port Conflicts** - Default port 8080, change if needed

### Debug Mode
```bash
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Azure AD Integration](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Teamcenter ITK Guide](https://docs.sw.siemens.com/documentation/external/PL20200715145208/en-US/itk_user_guide/itk_user_guide.html)

---

**For frontend integration, see [Frontend README](../tcuserapp-frontend/README.md)**