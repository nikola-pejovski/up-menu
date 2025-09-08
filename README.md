# 🍔 Up Menu - Scalable Frontend Template

A **production-ready template** for building scalable, robust web applications with modern frontend technologies. This template demonstrates best practices for Next.js applications with authentication, admin panels, and comprehensive state management.

## 🚀 **Template Features**

### **Architecture & Structure**
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety and better DX
- **Modular Architecture** following enterprise patterns
- **Clean Separation** of concerns (views, API, queries, types)
- **Scalable Project Structure** ready for large applications

### **Frontend Excellence**
- **Tailwind CSS 3.4** for modern, responsive design
- **React Query** for efficient server state management
- **React Hook Form + Zod** for robust form validation
- **Radix UI** for accessible component primitives
- **Custom Components** with fallback handling

### **Authentication & Security**
- **Token-based Authentication** with Axios interceptors
- **Protected Routes** with automatic redirects
- **Secure Login Flow** with proper error handling
- **Session Management** with localStorage integration

### **Admin Panel System**
- **Complete CRUD Operations** for all entities
- **Real-time Updates** with optimistic UI
- **Form Validation** with comprehensive error handling
- **User Management** with role-based access
- **Responsive Dashboard** with tabbed interface

## 🏗️ **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin routes
│   │   ├── login/         # Login page
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # Mock API endpoints
│   └── page.tsx           # Public menu page
├── sections/              # Page views (following dealio-client pattern)
│   ├── admin/             # Admin panel sections
│   │   ├── components/    # Admin-specific components
│   │   ├── admin-view.tsx # Main admin view
│   │   └── login-view.tsx # Login form view
│   └── menu/              # Menu page sections
│       ├── components/    # Menu-specific components
│       └── menu-view.tsx  # Main menu view
├── api/                   # API client functions
│   ├── admin.ts          # Admin API calls
│   └── menu.ts           # Menu API calls
├── use-queries/           # React Query hooks
│   ├── admin.ts          # Admin queries & mutations
│   └── menu.ts           # Menu queries & mutations
├── types/                 # TypeScript definitions
│   └── api.ts            # API types & DTOs
├── utils/                 # Utility functions
│   └── axios.ts          # Axios configuration
└── components/            # Reusable components
    └── fallback-image.tsx # Image fallback component
```

## 🛠️ **Tech Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.2 | React framework with App Router |
| **TypeScript** | Latest | Type safety and developer experience |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework |
| **React Query** | Latest | Server state management |
| **React Hook Form** | Latest | Form handling and validation |
| **Zod** | Latest | Schema validation |
| **Radix UI** | Latest | Accessible UI primitives |
| **Axios** | Latest | HTTP client with interceptors |
| **Lucide React** | Latest | Icon library |

## 🚀 **Quick Start**

### **1. Clone & Install**
```bash
git clone <your-repo-url>
cd up-menu
npm install
```

### **2. Start Development**
```bash
npm run dev
```

### **3. Access the Application**
- **Public Menu**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

### **4. Demo Credentials**
- **Email**: admin@burgerhouse.com
- **Password**: admin123

## 📋 **Template Use Cases**

### **Perfect For:**
- **Restaurant/Cafe Menus** with admin management
- **E-commerce Catalogs** with product management
- **Content Management Systems** with user roles
- **Dashboard Applications** with data visualization
- **Admin Panels** for any business application

### **Easy Customization:**
- **Replace menu items** with your products/services
- **Update branding** and color scheme
- **Add new entities** following the established patterns
- **Extend authentication** with your backend
- **Add new features** using the component structure

## 🎯 **Key Patterns Demonstrated**

### **1. Scalable Architecture**
- **Section-based Views** instead of page components
- **Centralized API Layer** with typed endpoints
- **Query-based State Management** with React Query
- **Type-safe Development** with comprehensive TypeScript

### **2. Authentication Flow**
- **Protected Routes** with automatic redirects
- **Token Management** with Axios interceptors
- **Session Persistence** with localStorage
- **Error Handling** for auth failures

### **3. Form Management**
- **Validation Schemas** with Zod
- **Error Handling** with user-friendly messages
- **Loading States** for better UX
- **Optimistic Updates** for instant feedback

### **4. Component Design**
- **Reusable Components** with proper props
- **Fallback Handling** for images and errors
- **Responsive Design** with mobile-first approach
- **Accessibility** with proper ARIA labels

## 🔧 **Development Commands**

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

## 📚 **Learning Resources**

This template demonstrates:
- **Next.js 15** App Router patterns
- **React Query** for server state
- **TypeScript** best practices
- **Tailwind CSS** responsive design
- **Form validation** with Zod
- **Authentication** patterns
- **Component architecture**

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎉 **Ready to Build?**

This template provides everything you need to build a production-ready web application. Simply clone, customize, and deploy!

**Happy Coding!** 🚀