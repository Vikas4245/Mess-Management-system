# 🍽️ Mess Management System

A comprehensive full-stack web application for managing hostel/college mess operations with blockchain integration for transparency and security.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Multi-role authentication**: Students, Staff, and Admin
- JWT-based secure authentication
- Role-based access control

### 📊 Attendance Management
- QR code-based attendance tracking
- Real-time attendance monitoring
- Automated attendance reports

### 📝 Complaint Management
- Submit and track complaints
- Blockchain-powered transparency
- Admin complaint resolution system

### 🗳️ Voting System
- Democratic voting for mess-related decisions
- Blockchain-secured voting mechanism
- Real-time vote counting

### 💰 Token System
- Digital token management
- Reward system for students
- Token transaction history

### 📱 Additional Features
- Feedback collection system
- QR code generation and scanning
- File upload with Cloudinary integration
- AI-powered assistance with Google Gemini

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Blockchain
- **Ethereum** - Smart contract platform
- **Solidity** - Smart contract language
- **Hardhat** - Development framework
- **Ethers.js** - Ethereum library

### Third-party Services
- **Cloudinary** - Image and file management
- **Google Gemini AI** - AI integration
- **MongoDB Atlas** - Cloud database

## 📁 Project Structure

```
mess-management-system/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middlewares
│   │   └── utils/         # Utility functions
│   ├── contracts/         # Smart contracts
│   └── scripts/          # Deployment scripts
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── assets/       # Static assets
│   │   └── styles/       # CSS files
│   └── public/           # Public assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vikas4245/Mess-Management-system.git
   cd Mess-Management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=10d
   
   # Optional configurations
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

### 🏃‍♂️ Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:8000`

2. **Start the Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📱 Usage

1. **Access the application** at `http://localhost:5173`
2. **Register/Login** as Student, Staff, or Admin
3. **Explore features** based on your role:
   - Students: Mark attendance, submit complaints, participate in voting
   - Staff: Manage meals, view reports
   - Admin: Manage users, resolve complaints, oversee operations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Attendance
- `GET /api/attendance/` - Get attendance records
- `POST /api/attendance/mark` - Mark attendance

### Complaints
- `GET /api/complaints/` - Get complaints
- `POST /api/complaints/` - Submit complaint

### Voting
- `GET /api/voting/` - Get voting polls
- `POST /api/voting/vote` - Cast vote

## 🌐 Smart Contracts

The system includes three main smart contracts:

1. **MessAttendance.sol** - Handles attendance tracking
2. **ComplaintSystem.sol** - Manages complaint lifecycle
3. **VotingSystem.sol** - Powers the voting mechanism

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vikas**
- GitHub: [@Vikas4245](https://github.com/Vikas4245)

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this system
- Special thanks to the open-source community for the amazing tools and libraries

## 📞 Support

If you have any questions or issues, please feel free to:
- Open an issue on GitHub
- Contact the maintainer

---

⭐ **Star this repository if you found it helpful!**
