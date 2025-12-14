# Backend Setup Instructions
# Charles Pogi
## Prerequisites
1. **Node.js** (v18 or higher recommended)  
   [Download Node.js](https://nodejs.org/en/download)

2. **npm** (package manager)  
   Install or update npm globally:
   ```bash
   npm install -g npm
   ```

3. **MongoDB** (local or remote instance)  
   [Download MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Steps
1. **Navigate to the backend folder:**
	```bash
	cd backend
	```

2. **Install dependencies:**
	```bash
	npm install
	```

3. **Configure environment variables:**
	 - Create a `.env` file in the `backend` directory.
	 - Add the following variables:
		 ```env
		 # Server
		 PORT=3000
		 HOST=localhost
		 CLIENT_URL=http://localhost:5173

		 SESSION_SECRET=your_session_secret

		 # Database
		 MONGO_URI=mongodb://localhost:27017/medisync
		 OPTIONS_DB_MINIMUMPOOLSIZE=5
		 OPTIONS_DB_MAXIMUMPOOLSIZE=30
		 OPTIONS_DB_SERVERSELECTIONTIMEOUTMILLISECONDS=30000
		 OPTIONS_DB_SOCKETTIMEOUTMILLISECONDS=45000

		 # Cloudinary
		 CLOUDINARY_CLOUD_NAME=your_cloud_name
		 CLOUDINARY_API_KEY=your_api_key
		 CLOUDINARY_API_SECRET=your_api_secret

		 # Email
		 EMAIL_SERVICE=your_email_service
		 EMAIL_PASS=your_email_password
		 EMAIL_USER=your_email_user
		 ```

4. **Start the backend server:**
	```bash
	pnpm start
	```

5. **API will be available at:**
	- `http://localhost:3000` 
  

## Useful Scripts
- **Backup MongoDB:**
  Run `mongo_backup.sh` from the project root to backup your database.

---
