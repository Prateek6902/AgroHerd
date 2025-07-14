#**🌿 AgroHerd**
#***📌 Overview***
AgroHerd is a full-stack web application designed to help farmers and livestock managers digitally manage and monitor animals, sheds, feed schedules, and farm products. The platform combines modern UI/UX with real-time functionality and database-driven analytics, providing a seamless experience for rural and commercial livestock operations.

This system aims to digitalize livestock farming, reduce manual work, and offer intelligent analytics — all through a clean and intuitive dashboard.

#***💡 Key Functional Modules***
🐮 Animal Management
Add, view, edit, and reduce animal counts
Types supported: Cow, Pig, Sheep, Hen, Buffalo, Goat
Categorization by age group and breed
Shed-based animal storage with capacity validation

🏠 Shed Management
Assign sheds to specific animal types
Define and enforce capacity constraints
Real-time validation when adding animals

📦 Product Management
Track farm outputs like Milk, Meat, Eggs, Dung, Wool
Add/edit/delete products with icons
Unit management and source tracking

🥗 Feeding Schedule
Create and view feeding plans by animal type
Includes time, feed type, and optional deletion

📊 Analytics (Admin Dashboard)
Age & breed distribution charts
Total animal counts
Egg & milk production trends
Visual dashboards with breakdowns

🔐 Authentication & Roles
JWT-based login and registration
Secure API access with bearer token
Modular role system (Farmer/Admin)

🧰 Tech Stack
Layer	Tools & Frameworks
Frontend	React.js (with Vite), Tailwind CSS, Axios
Backend	Node.js, Express.js, JWT, Bcrypt, Dotenv
Database	MongoDB with Mongoose ODM
Dev Tools	Git, GitHub, VS Code, Postman
Hosting	(Optional: Vercel for frontend, Render for backend)
Icons & Assets	Custom SVGs and PNGs from Icon8, Flaticon, and custom illustrations

🧠 Architecture & Techniques
MERN Stack Architecture: Combines React frontend with Node.js/Express backend and MongoDB database for seamless communication via RESTful APIs.
Modular Folder Structure: Separates routes, controllers, models, utils, and middleware to ensure scalability and maintainability.
JWT Auth System: Secures routes using requireAuth middleware that validates tokens sent from frontend.
Form Validation: Input validation on both client and server (e.g., shed capacity checks).
Reusable UI Components: Built React components such as AnimalCard, Sidebar, Header, AddAnimalModal, and ProductPage using Tailwind.
Responsive Design: Mobile-friendly design with Flexbox/Grid using Tailwind utility classes.
Real-time Analytics Calculations: Aggregations like total animals per breed/age group using MongoDB’s $group pipeline.

#***🎨 Frontend Highlights***
Modern UI with animations (scale on hover, blur modals, shadows)
Fully responsive with light/dark-friendly color palette
Dashboard illustration banners and animated buttons
Font integration using Google Fonts: Love Ya Like A Sister, Londrina Shadow, etc.
Split-colored glowing AgroHerd logo with capsule border

#***📂 Backend Highlights***
RESTful API design (/api/animals, /api/sheds, /api/products, /api/feedings)
Express routers & controllers for each resource
MongoDB relations via ObjectId for user and shed fields
Validation logic: animal cannot be added to incompatible or full shed
CRUD support with pagination-ready structure (if needed in future)

#***🛡️ Security & Best Practices***
All protected routes require JWT via Authorization headers
Passwords hashed using bcrypt
.env support for secrets, tokens, ports, and DB URIs
Input validation on both frontend & backend
Token storage handled via localStorage

#***📦 Potential Use Cases***
Smart dairy farms
Rural livestock tracking systems
AgriTech solutions targeting farmers in developing regions
Educational simulation for agriculture institutes
Data management for veterinary services

#***📈 Future Enhancements***
PDF report exports (feeding logs, animal count)
Role-based dashboards (vets, admins, farmers)
Mobile app (React Native)
GraphQL support for more flexible querying
Notifications and feeding reminders

---

#*** 📂 Project Structure***
```
AgroHerd/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── server.js
├── frontend/
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ └── utils/
```
#***🧪 Sample Login Credentials***
You can create users or use seeded ones:
Email: admin@example.com
Password: admin123

#***📝 License***
This project is licensed under the MIT License.

#***🤝 Contributing***
Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

#***📬 Contact***
Built with ❤️ by @Prateek6902
Feedback, bugs or suggestions? Open an issue


