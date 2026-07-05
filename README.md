# 🥜 AllerScan – AI-Powered Allergy Detection & Food Safety Assistant

AllerScan is an AI-powered web application that helps users make safer food choices by identifying potential allergens from product ingredient labels. Users can upload an image of a food product, and the application extracts the ingredient list using OCR, analyzes it against the user's allergy profile, and provides a clear safety assessment. The platform also features an AI chatbot for ingredient explanations, scan history, and personalized allergy management.

---

## 🚀 Features

- 🔐 Secure user authentication using bcrypt
- 👤 Personalized allergy profile management
- 📸 Upload food label images for analysis
- 🔍 OCR-based ingredient extraction
- ⚠️ Automatic allergen detection based on user allergies
- 🤖 AI-powered chatbot for ingredient explanations and food-related queries
- 📝 Scan history with previous analyses
- 📱 Responsive and user-friendly interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- FastAPI

### Database
- MongoDB Atlas

### AI & APIs
- Tesseract OCR
- Groq LLM API

### Authentication
- bcrypt password hashing

---

## 📂 Project Structure

```
AllerScan/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

---

## 📖 How It Works

1. User registers and logs into the application.
2. The user creates a personalized allergy profile.
3. A food label image is uploaded.
4. OCR extracts the ingredient list from the image.
5. The extracted ingredients are compared against the user's allergy profile.
6. The application highlights detected allergens and provides a safety assessment.
7. Users can consult the AI chatbot for ingredient explanations or additional food-related queries.
8. All scans are saved in the user's scan history for future reference.

---

## 📸 Screenshots

<img width="371" height="313" alt="Screenshot 2026-07-05 122655" src="https://github.com/user-attachments/assets/93169099-0e5b-4a5d-bbe0-1d7eb2c36b52" />

<img width="727" height="624" alt="image" src="https://github.com/user-attachments/assets/684c00c4-9b51-4c89-bde0-9ee7c7889090" />

<img width="736" height="625" alt="image" src="https://github.com/user-attachments/assets/4a99b777-b2f0-4428-9a5f-bad5b6ce80be" />

<img width="730" height="631" alt="image" src="https://github.com/user-attachments/assets/6139affe-fa13-4f56-89d7-845e4c36006f" />

<img width="742" height="627" alt="image" src="https://github.com/user-attachments/assets/3f0ff84d-a0fe-4cea-abbc-08f71d0b954e" />

<img width="736" height="598" alt="image" src="https://github.com/user-attachments/assets/0ad20933-2305-4f1a-9cff-7463df5720a7" />


---

## 🔒 Security

- Passwords are securely hashed using bcrypt.
- User-specific allergy profiles ensure personalized analysis.
- MongoDB Atlas provides secure cloud-based data storage.
- Environment variables are used to protect sensitive credentials.

---

## 🌟 Future Enhancements

- Barcode scanning support
- Multi-language OCR
- Nutrition analysis
- Offline scanning capability
- Personalized dietary recommendations
- Mobile application (Android/iOS)
- Voice-based interaction
- Real-time product database integration

---

## 👩‍💻 Author

**Sneha Kuriyal**

B.Tech Computer Science Engineering  
Graphic Era University

---

## 📄 License

This project is intended for educational and learning purposes.
