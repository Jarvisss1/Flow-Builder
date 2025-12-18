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

## Known Limitations

-   **No Persistence:** Since there's no real database, if you refresh the page, any new nodes you added will disappear. It resets to the default mock data.
-   **Mobile Layout:** It works *okay* on mobile (I hid the big inspector panel), but it's really meant to be used on a desktop. The graph gets a bit cramped on small screens.
-   **Random Positioning:** When you add a new node, it just pops up in a random spot. You have to drag it where you want it manually.
-   **Mock Data:** Accessing `app-3` (Payment Gateway) relies on hardcoded data in the handler file.

## Features I Added
-   You can add new Service or Database nodes.
-   Keyboard shortcuts! `Shift + F` to fit the view, and `Ctrl +/-` to zoom.
-   There's a cool "Simulate Error" switch to see how the app handles network failures.
-   You can edit the service name and description in the side panel, and it saves automatically (with a little debounce delay so it doesn't lag).

Let me know if you find any bugs!
