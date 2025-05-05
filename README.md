# AwarePhoneInterface
Queen Mary University Final Year project 


## How to Run the Interface Locally

### Prerequisites
- Node.js installed  
- Expo CLI installed globally:  
  ```bash
  npm install -g expo-cli

### Installation
- git clone https://github.com/yourusername/aware-phone-interface.git
- cd aware-phone-interface
- npm install

### Optional: Environment Setup
Some features (like saving alerts, syncing restrictions, or viewing tracking history) use Supabase. To enable these, create a `.env` file in the root folder with:
- SUPABASE_URL=your_supabase_url
- SUPABASE_ANON_KEY=your_supabase_anon_key
Without this, the app will still run and show most of the interface, but dynamic syncing will be disabled.
