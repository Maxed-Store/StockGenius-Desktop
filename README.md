# Store Management

This is a local store stock management application built with Electron.js. It's designed to manage the stock of a local store. After a sale, the application automatically updates the stock.

## Getting Started

Follow these steps to get the application running on your local machine:

1. Clone this repository:

```bash
git clone git@github.com:umerfarok/store-management.git
```

2. Navigate into the project directory:

```bash
cd store-management
```

3. Install the dependencies:

```bash
npm install
```

4. Start the application:

```bash
npm start
```

# Running in Debug Mode

This document provides instructions on how to run the application in debug mode on both Unix-based systems (like Linux or macOS) and Windows.

## Unix-based Systems

To run the application in debug mode on Unix-based systems, use the `DEBUG` environment variable. Set it to `electron-forge:*` before running your command. Here's how you can do it:

```bash
DEBUG=electron-forge:* npm run start
```
## Windows
On Windows, you can set environment variables using the set command before running your command. Here's how you can do it:
```bash
set DEBUG=electron-forge:* && npm run start
```
After running `npm start`, a new window will open with the application running.