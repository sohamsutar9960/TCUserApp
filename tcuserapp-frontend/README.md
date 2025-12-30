# TCUserApp Frontend

React TypeScript application for Teamcenter User Management with Material-UI components and Azure AD authentication.

## 🏗️ Architecture

```
src/
├── components/
│   ├── atoms/           # Reusable UI components
│   ├── molecules/       # Complex components
│   └── auth/           # Authentication components
├── models/             # TypeScript interfaces
├── services/           # API service layer
├── routes/             # Route configurations
└── api/               # API configurations
```

## 🚀 Features

### User Interface
- **Responsive Design** - Mobile-first approach with Material-UI
- **Role-Based Navigation** - Dynamic menus based on user roles
- **Data Tables** - Advanced tables with sorting, filtering, pagination
- **Modal Dialogs** - Interactive forms and confirmations
- **File Upload/Download** - Excel import/export functionality

### Authentication
- **Azure AD SSO** - Single sign-on integration
- **JWT Token Management** - Automatic token refresh
- **Protected Routes** - Role-based route protection
- **Session Management** - Secure session handling

### User Workflows
- **Dashboard** - Role-specific dashboards
- **Request Management** - Create, track, and manage requests
- **User Administration** - User management for admins
- **Approval Workflows** - Manager and role approver interfaces

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript 4.9** - Type-safe development
- **Material-UI 5** - Component library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **SCSS** - Styling with Sass
- **Styled Components** - CSS-in-JS styling

## 📋 Prerequisites

- **Node.js 16+**
- **npm 8+** or **yarn 1.22+**
- **Backend API** running on port 8080

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
cd tcuserapp-frontend
npm install
```

### 2. Environment Configuration
Create `.env` file in project root:
```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_AZURE_CLIENT_ID=your-azure-client-id
REACT_APP_AZURE_TENANT_ID=your-azure-tenant-id
REACT_APP_ENVIRONMENT=development
```

### 3. Development Server
```bash
# Start development server
npm start

# Start with specific environment
npm run start:development

# Build for production
npm run build

# Run tests
npm test
```

### 4. Access Application
- **Development**: http://localhost:3000
- **Production Build**: Served from `build/` directory

## 🎨 Component Structure

### Atomic Design Pattern
```
components/
├── atoms/              # Basic building blocks
│   ├── common/
│   │   ├── modals/     # Reusable modal components
│   │   └── tileComponent/ # Dashboard tiles
│   └── auth/           # Authentication components
└── molecules/          # Complex components
    └── dashboard/      # Dashboard-specific components
        ├── homePage/   # Home dashboard
        ├── createRequest/ # Request creation
        ├── myRequest/  # User requests
        └── userInventory/ # User management
```

### Key Components

#### Authentication
```typescript
// Login component with Azure AD
<LoginPanel />
<CreateUserPanel />
<SsoLoginHandler />
```

#### Dashboard Components
```typescript
// Role-specific dashboards
<AdminHomePage />
<ManagerHome />
<UserHome />
<RoleApproverHome />
```

#### Request Management
```typescript
// Request workflow components
<CreateRequest />
<MyRequest />
<RequestApproval />
<RequestHistory />
```

## 🔧 Configuration

### API Configuration
```typescript
// api/API.ts
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Route Configuration
```typescript
// routes/izUserRoutes.tsx
const userRoutes = [
  { path: '/dashboard', component: UserHome },
  { path: '/create-request', component: CreateRequest },
  { path: '/my-requests', component: MyRequest },
  { path: '/profile', component: ProfilePage },
];
```

### Theme Configuration
```typescript
// Material-UI theme customization
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

## 🔐 Authentication Flow

### Azure AD Integration
```typescript
// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Azure AD authentication logic
  const login = async (credentials) => {
    // Handle Azure AD login
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Protected Routes
```typescript
// ProtectedRoute component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

## 📊 State Management

### Context API
```typescript
// User context for global state
interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
```

### Local State Management
- **useState** for component state
- **useEffect** for side effects
- **useContext** for global state
- **Custom hooks** for reusable logic

## 🎯 User Roles & Interfaces

### Admin Interface
- **User Management** - Create, update, delete users
- **System Configuration** - Manage countries, groups, roles
- **User Inventory** - Activate/deactivate users
- **Reports & Analytics** - User statistics and reports

### Manager Interface
- **Team Overview** - View team members and requests
- **Request Approval** - Approve/reject user requests
- **Team Reports** - Team-specific analytics

### User Interface
- **Dashboard** - Personal dashboard with quick actions
- **Create Request** - Submit new access requests
- **My Requests** - Track request status
- **Profile** - Manage personal information

### Role Approver Interface
- **Pending Approvals** - Role-specific request approvals
- **Approval History** - Track approval decisions
- **Role Management** - Manage assigned roles

## 📱 Responsive Design

### Breakpoints
```scss
// Responsive breakpoints
$mobile: 768px;
$tablet: 1024px;
$desktop: 1200px;

@media (max-width: $mobile) {
  // Mobile styles
}

@media (min-width: $tablet) {
  // Tablet styles
}

@media (min-width: $desktop) {
  // Desktop styles
}
```

### Mobile-First Approach
- **Flexible Grid System** - CSS Grid and Flexbox
- **Touch-Friendly UI** - Larger touch targets
- **Optimized Performance** - Lazy loading and code splitting

## 🔄 API Integration

### Service Layer
```typescript
// services/userService.ts
export class UserService {
  static async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/api/users');
    return response.data;
  }
  
  static async createUser(user: User): Promise<User> {
    const response = await apiClient.post('/api/users', user);
    return response.data;
  }
}
```

### Error Handling
```typescript
// Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      logout();
    }
    return Promise.reject(error);
  }
);
```

## 📋 Data Models

### TypeScript Interfaces
```typescript
// models/userModel.ts
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  isActive: boolean;
  createdDate: Date;
}

export interface UserRequest {
  id: number;
  userId: number;
  requestType: RequestType;
  status: RequestStatus;
  requestedRoles: Role[];
  justification: string;
  createdDate: Date;
  approvedDate?: Date;
}
```

## 🧪 Testing

### Test Setup
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Testing Libraries
- **Jest** - Test runner
- **React Testing Library** - Component testing
- **MSW** - API mocking
- **User Event** - User interaction testing

### Example Test
```typescript
// __tests__/LoginPanel.test.tsx
describe('LoginPanel', () => {
  test('renders login form', () => {
    render(<LoginPanel />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
```

## 🎨 Styling

### SCSS Structure
```scss
// App.scss
@import 'variables';
@import 'mixins';
@import 'components';

// Component-specific styles
.dashboard {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  
  &__sidebar {
    background: $sidebar-bg;
    padding: 1rem;
  }
  
  &__content {
    padding: 2rem;
  }
}
```

### Material-UI Customization
```typescript
// Custom theme
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});
```

## 🚀 Build & Deployment

### Production Build
```bash
# Create optimized build
npm run build

# Analyze bundle size
npm run build -- --analyze
```

### Environment-Specific Builds
```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

### Docker Deployment
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Development Tools

### Code Quality
```bash
# ESLint
npm run lint

# Prettier
npm run lint:prettier

# Fix issues
npm run fix
```

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **Material Icon Theme**

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors** - Check backend CORS configuration
2. **Authentication Issues** - Verify Azure AD configuration
3. **Build Failures** - Clear node_modules and reinstall
4. **API Connection** - Ensure backend is running on correct port

### Debug Mode
```bash
# Enable debug logging
REACT_APP_DEBUG=true npm start

# Verbose logging
npm start -- --verbose
```

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)

---

**For backend integration, see [Backend README](../TcUserApp-Backend/README.md)**