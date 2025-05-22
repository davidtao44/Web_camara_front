# camera_front

A front-end application for user and attendee management, role-based access control, and camera feed display.

## About the Project

`camera_front` is a web application designed to manage users, attendees, and their roles, particularly for systems or events that may involve camera surveillance or monitoring. Key functionalities include:

*   User authentication (Login/Register)
*   A dashboard for an overview of the system
*   User management (adding, listing, and assigning roles)
*   Attendee management (adding and listing attendees)
*   Role-based access control to different features
*   Display of camera feeds

## Built With

This project utilizes the following technologies and libraries:

*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [React Router](https://reactrouter.com/)
*   [Axios](https://axios-http.com/)
*   [Chart.js](https://www.chartjs.org/)
*   [HLS.js](https://hls-js.netlify.app/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed on your system.
*   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo:
    ```sh
    git clone https://example.com/camera_front.git
    ```
    *Note: Replace `your_username/camera_front.git` with the actual URL of the repository if available. If not, use a placeholder like `https://example.com/camera_front.git`.*
2.  Navigate to the project directory:
    ```sh
    cd camera_front
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

## Available Scripts

In the project directory, you can run the following scripts:

### `npm run dev`

Runs the app in development mode using Vite. Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser. The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Lints the project files using ESLint to check for code quality and style issues.

### `npm run preview`

Serves the production build locally to preview the app before deployment.

## Features

*   **Authentication:** Users can register and log in to the application.
*   **Dashboard:** Provides a central overview after login, potentially displaying key metrics or information (customizable based on user role).
*   **User Management:**
    *   Add new users to the system.
    *   View a list of existing users.
*   **Attendee Management:**
    *   Add new attendees.
    *   View a list of attendees.
*   **Role Management:**
    *   Assign and manage user roles, enabling role-based access control for different application features.
*   **Camera Feed Display:**
    *   Integrates camera feeds, possibly using HLS.js for streaming. *(Actual display might depend on backend and camera setup)*

## Project Structure (Overview)

The main application code is located within the `src` directory:

```
camera_front/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, icons, etc.
│   ├── components/     # React components (UI elements and features)
│   │   ├── AddAttendee.jsx
│   │   ├── AddUser.jsx
│   │   ├── AttendeeList.jsx
│   │   ├── CameraFeedPlayer.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── ManageRoles.jsx
│   │   ├── Register.jsx
│   │   ├── Sidebar.jsx
│   │   └── UserList.jsx
│   ├── utils/          # Utility functions, API configurations
│   │   ├── apiConfig.js
│   │   └── roles.js
│   ├── App.css         # Main app styles
│   ├── App.jsx         # Main application component, routing setup
│   ├── index.css       # Global styles
│   └── main.jsx        # Entry point of the React application
├── .gitignore
├── eslint.config.js  # ESLint configuration
├── index.html        # Main HTML page for Vite
├── package.json      # Project metadata and dependencies
├── README.md         # This file
└── vite.config.js    # Vite configuration
```

*   **`src/components`**: Contains all the React components that make up the application's user interface and features.
*   **`src/utils`**: Holds utility functions, such as API endpoint configurations (`apiConfig.js`) and role definitions (`roles.js`).
*   **`src/App.jsx`**: The root component that sets up routing and the main layout.
*   **`src/main.jsx`**: The entry point that renders the React application.
*   **`public`**: Contains static assets like images and logos.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

*Alternatively, if contributions are not desired at this time, this section can be omitted or state that the project is not currently accepting contributions.*

## License

Distributed under the MIT License. See `LICENSE` file for more information.

*(Note: If a `LICENSE` file does not exist or a different license is used, this should be updated accordingly. If no license is specified, it might be good to choose one or state that the project is unlicensed.)*
