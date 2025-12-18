# FlowBuilder Project

Hey! This is a project I built to visualize service architectures using graphs. It's basically a dashboard where you can see how different microservices (servers, databases, etc.) connect to each other.

## How to Run It

It's pretty standard stuff. First, make sure you have Node installed.

1.  Clone the repo (if you haven't already).
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the dev server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

> Note: I'm using Mock Service Worker (MSW) to fake the backend, so you don't need to run a separate server API. The data is all mocked in the browser.

## Key Decisions

-   **React Flow:** I picked this library because it handles all the heavy lifting for the graph interaction (dragging nodes, zooming, connecting edges). Writing that from scratch would have been a nightmare.
-   **Shadcn/UI & Tailwind:** Used these for the UI components. I really wanted it to look premium and "clean" without writing a ton of custom CSS. Plus, it has dark mode support out of the box!
-   **Zustand:** For state management (like tracking the selected node or if the inspector is open). It's way simpler than Redux and gets the job done.
-   **React Query:** Even though it's mocked data right now, I set it up with React Query so that later if we add a real backend, the caching and loading states are already handled.
-   **Mock Persistence Architecture:** I didn't just read mock data; I implemented a **writable mock backend** using MSW. I added `PUT` handlers to intercept updates, allowing the app to actually "save" your changes to the in-memory database. This mimics a real full-stack environment.
-   **Custom Hooks:** Built several custom hooks to keep the components clean:
    -   `useAutoSave`: Handles the logic for debouncing graph changes and triggering background saves.
    -   `useDebounce`: For performance optimization on input fields.
    -   `useIsMobile`: To handle responsive logic for the inspector panel.

## Known Limitations

-   **In-Memory Persistence:** The data is saved to a mock backend (MSW). It persists while you navigate the app, but since there's no real database text file, a **page refresh** will reset everything to default.

-   **Mobile Layout:** It works *okay* on mobile (I hid the big inspector panel, it shows as pop up sidebar in mobile), but it's really meant to be used on a desktop. The graph gets a bit cramped on small screens.
-   **Random Positioning:** When you add a new node, it just pops up in a random spot. You have to drag it where you want it manually.


## Features I Added
-   You can add new Service or Database nodes.
-   Keyboard shortcuts! `Shift + F` to fit the view, and `Ctrl +/-` to zoom.
-   There's a cool "Simulate Error" switch to see how the app handles network failures.
-   There's a cool "Simulate Error" switch to see how the app handles network failures.
-   **Auto-Save & Persistence:** I implemented a robust auto-save system. When you move nodes or edit details, it waits for a second (debounced) and then syncs to the backend. You can switch between apps (e.g., from E-Commerce to Payment Gateway) and your layout is preserved perfectly!
-   **Context-Aware Nav:** The top bar now shows exactly which application you are editing.

Let me know if you find any bugs!
