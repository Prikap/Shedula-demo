SHEDULA

This project is a minimal frontend application built with **Next.js** and **Tailwind CSS** to simulate a login flow and an appointment booking system. It was created as part of an internship assignment at PearlThoughts.

## 🌐 Live Demo

[View the App](shedula-med.netlify.app)

## 📦 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React State Hooks
- **Mock API**: Static JSON data or JSON Server (for simulating appointments & doctors)

## ✨ Features

- ✅ Login Page UI (No authentication logic, just frontend)
- ✅ Doctor Selection UI
- ✅ Time Slot Picker
- ✅ Appointment Confirmation Screen
- ❌ Backend integration (uses mock API only)

## 🗂️ Project Structure

```

├── components/
│   └── DoctorCard.tsx
│   └── TimeSlotPicker.tsx
│
├── pages/
│   └── index.tsx          # Login Page
│   └── book.tsx           # Booking Flow
│
├── data/
│   └── doctors.json       # Mock doctor data
│
├── public/
├── styles/
├── README.md

````

## 🧪 Running Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-team/appointment-ui.git
   cd appointment-ui
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the dev server:**

   ```bash
   npm run dev
   ```

4. **(Optional) Start mock API using JSON Server**

   ```bash
   npm install -g json-server
   json-server --watch data/db.json --port 4000
   ```

## ✅ Team Workflow (GitHub)

* Clone the team repo
* Create a feature branch:

  ```bash
  git checkout -b feature/login-page
  ```
* Push and create a Pull Request by EOD

## 📮 Submission

Submit your GitHub Pull Request link on the internship portal or email as instructed.

---

```

If you provide the actual content or sections (e.g., login page, doctor selection), I can tailor this README more closely to your project.
```
