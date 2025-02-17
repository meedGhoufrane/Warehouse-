# My Project Warehouse
 
Welcome to My New Project Warehouse! This is an Expo application designed for product management, including features for adding, editing, and viewing products.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Features

- Manage products (add, edit, delete)
- Search and filter products
- Sort products by name, price, and stock status
- QR code scanning for product addition
- View product statistics

## Technologies Used

- React Native
- Expo
- Axios for API requests
- React Navigation for navigation
- JSON Server for mock API

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (version 14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/my-new-project.git
   cd my-new-project
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the JSON server:

   - Create a `database.json` file in the root directory with the initial data structure.
   - You can use the provided `database.json` in the project for initial data.

## Running the Application

1. Start the JSON server:

   ```bash
   npm run start:db
   ```

2. Start the Expo application:

   ```bash
   npm start
   ```

3. Follow the instructions in the terminal to open the app in an Android emulator, iOS simulator, or on your physical device using the Expo Go app.

## API

The application uses a JSON server running on `http://192.168.1.109:3001/products`. Make sure to adjust the IP address if necessary, depending on your network configuration.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
