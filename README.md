# EV Rental Platform - VoltRide

## 📌 Overview
This project is a secure and user-friendly **EV rental platform** designed to streamline vehicle booking, verification, and payments. Built during **Breach 2025 - Gujarat's Largest FinTech Hackathon**, our solution stands out with **QR-based automated workflows, AI chatbots, dual-layer KYC verification, and seamless payments**.

## 🔥 Key Features
- **QR-Based Station Master Workflow**
  - Auto-filled acceptance form via QR scan
  - Pickup & drop-off process automation
  - Damage assessment with proof upload
- **Smart AI Chatbot Assistance**
  - User: Helps with booking queries, payments, policies
  - Admin: Aids with QR issues, KYC verification
- **Dual-Layer KYC Verification**
  - Aadhaar authentication + Face verification
  - OCR-based cross-checking with ID documents
- **Secure Payment Handling**
  - PayPal integration for safe transactions
  - Auto-deductions for penalties via in-app wallet
- **Sleek, Minimal UI**
  - Mobile-friendly, fast, and responsive
- **OTP-Based Registration**
  - Email & phone OTP verification to prevent fake accounts

## 🚀 Future Enhancements
- **Blockchain-based Smart Contracts** for payment security
- **AI-powered Fraud Detection** using transaction patterns
- **Dynamic Pricing Mechanism** based on demand & usage
- **Integration with IoT Sensors** for real-time vehicle health monitoring

## 📸 Workflow Images

## Main Landing Page
![Screenshot 2025-03-26 161655](https://github.com/user-attachments/assets/7b597225-d487-4ba1-b5ef-ec03ea6f21ef)

## Register Page
![Screenshot 2025-03-26 161800](https://github.com/user-attachments/assets/4007cbe8-8691-4644-90eb-21ba29e28f30)

## Login Page
![Screenshot 2025-03-26 161830](https://github.com/user-attachments/assets/10ff7b64-cca0-4737-98bd-639f3d7a4b77)

## After Logging in, we get the KYC option
![Screenshot 2025-03-26 161858](https://github.com/user-attachments/assets/27e313fb-6664-4eaf-958e-d6bcb853ba4e)

## Verification step 1
![Screenshot 2025-03-26 161914](https://github.com/user-attachments/assets/fdb9789d-5653-4419-b60d-4fa928d9b3de)

## Search for Nearby Stations (You may need to add data in the database to find nearby stations along with the distance)
![Screenshot 2025-03-26 161952](https://github.com/user-attachments/assets/0d50cbd5-a721-40f4-abce-4392174e4028)
![WhatsApp Image 2025-03-22 at 23 53 47_00dd65c0](https://github.com/user-attachments/assets/81559065-7706-4bab-9942-3519ebb9ec48)

## After selecting the station and booking we get the QR code on user side
![WhatsApp Image 2025-03-22 at 23 54 50_823e79b6](https://github.com/user-attachments/assets/3377d5ec-00ed-41db-9770-72cc72aea807)
![WhatsApp Image 2025-03-22 at 23 56 40_db1c81f5](https://github.com/user-attachments/assets/d96db4fe-6a21-4fc4-897f-686b7c72260d)

## Admin Side:
![image](https://github.com/user-attachments/assets/6d9c572e-06ca-450b-b8f6-8141288d9513)
![image](https://github.com/user-attachments/assets/7be4f596-a378-47ee-9e41-ff9338a9582c)
![image](https://github.com/user-attachments/assets/1a5c5a92-497b-4fd1-9666-d75b1cf06c7b)

## The QR code will be scanned here at pickup time and the user details will be loaded
![image](https://github.com/user-attachments/assets/5757ba0b-3f39-4e4e-8704-80c3f9b6723b)
![image](https://github.com/user-attachments/assets/e9a6eb12-ea2a-4982-b849-f7071f7979b0)

## The QR code will be scanned here at pickup time and the user travel and vehicle details will be loaded along with a damage fill up form
![image](https://github.com/user-attachments/assets/4abd52d9-4b37-4191-a558-9941e57a6182)


## 🛠️ Getting Started
To set up the project, follow these steps:

### 1️⃣ Clone the Repository
```bash
 git clone https://github.com/Vedantt-Patel/VoltRide-Seamless-and-Secure-EV-Rentals.git
```

### 2️⃣ Backend Setup
```bash
 cd backend
 cd src
 npm install  # Install dependencies
 node app.js    # Start backend server
```

### 3️⃣ Frontend Setup
```bash
 cd frontend
 npm install  # Install dependencies
 npm run dev    # Start frontend server
```

### 4️⃣ Chatbot Service Setup
```bash
 cd chatbotmain
 python -m venv venv  # Create virtual environment
 source venv/bin/activate  # (Linux/macOS)
 venv\Scripts\activate  # (Windows)
 pip install -r requirements.txt  # Install dependencies
 python chatbot.py  # Start chatbot service
```

## 🤝 Hackathon Team
- **Vedant Patel**
- **Nikunj Mahida**
- **Luv Patel**
- **Mihir Jan**
- **Nand Koradiya**

**Email** : vedxnt2912@gmail.com 
**LinkeIn** : https://www.linkedin.com/in/vedant-patel-machine-learning

🚀 Built with passion & innovation at **Breach 2025 - PDEU, Gandhinagar**!
