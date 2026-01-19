# TV Talking Hack

This is a fun tool to control an LG TV (WebOS) from your command line. You can make the TV "speak" messages using its text-to-speech feature, or turn it on/off!

## Prerequisites

You need **Node.js** installed on your computer.
- **Mac/Windows**: Download and install from [nodejs.org](https://nodejs.org/).
- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```

## How to Install

1.  **Clone the repository** (download the code):
    ```bash
    git clone https://github.com/chessnerd435/tv_talking_hack.git
    cd tv_talking_hack
    ```

2.  **Install dependencies** (this downloads the "batteries"):
    ```bash
    npm install
    ```

## How to Use

Run the script with Node:

```bash
node tv_say.js
```

The script is interactive. It will ask you for:
1.  **IP Address**: The IP address of the TV on your network.
2.  **Command**: What you want to do (e.g., `speak`, `off`, `on`).
    - If you choose `speak`, it will ask you what you want the TV to say.

### Examples

- **Make the TV say specific words**:
  Select `speak` and type: "Hello dad why are you watching this"

- **Turn the TV Off**:
  Select `off`
