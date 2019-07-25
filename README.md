# node-gpsd-viewer
Proof-of-concept Map UI for gpsd

---

## Overview
This consists of two peices:
  - A NodeJS GPSD -> Websocket Proxy
  - React Viewer (Viewer w/ OpenStreetMap)
  
## Running
Since there's no cool integration between the two Node components, it's probably easiest to use two terminal windows (`tmux` ftw).
- First, start the GPSD/Websocket Proxy (from the project root)
```bash
$ node index.js`
```
- Second, from the second terminal, start the viewer/React UI
```bash
$ cd viewer
$ yarn start
```
- Third, enjoy (hopefully)

## Questions/Contributions
Please :) just open an issue
