---
title: Launch Steam without Browser
permalink: /launch-steam-no-browser
tags:
  - steam
  - performance
  - gaming
---
If you want to launch Steam on your macOS system without loading the built-in browser to save resources and increase performance, you can use the following command:

/Applications/Steam.app/Contents/MacOS/steam_osx -no-browser +open steam://open/minigameslist

## Command Breakdown

1. `/Applications/Steam.app/Contents/MacOS/steam_osx`: This is the path to the Steam application executable file (steam_osx) on a macOS system. This part of the command tells the system to run the Steam application.

2. `-no-browser`: This flag disables the built-in web browser within the Steam client. By including this flag, you're telling Steam not to load the web browser component when it starts up. This helps save resources and improve performance.

3. `+open steam://open/minigameslist`: This part of the command instructs Steam to open a specific page within the client. In this case, it directs Steam to open the "minigames list" page, which likely displays a list of available minigames within the platform.

## Usage

To use this command, open Terminal on your macOS system and paste the command provided above. Press Enter to execute the command. This will launch Steam without the built-in browser, and it will open the minigames list page directly.
