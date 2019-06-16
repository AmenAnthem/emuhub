# Emuhub
## About
Emuhub is a little project of mine to replace the program Emulationstation. The old version was done with JavaFX, this new version with Electron.

As I use different emulators depending on what or how I want to play I wanted a simple frontend which enabled me to choose which kind of emulator I want to use.

## Setup
If you are using Windows as your operating system you can use the archive on the releases page. Unzip it into a new folder called 'emuhub' in your homepath/userdir.

### Configuring systems
systems.json is used to to get the informations on which systems are supposed to be displayed, and which commands are supported for each system.
This file needs to be in a subfolder called systems.

The release archive contains a systems.json with some example systems configured.

The contents:
- systems: is an array that contains all the systems you want Emuhub to display.
- systems - id: is the system id.
- systems - name: is the humanly readable name of the system.  This is being displayed in Emuhub.
- systems - commands: is an array which contains your commands to start your emulators.
- systems - commands - name: is the humanly readable name of the command. It should contain the emulator name. This is displayed in Emuhub.
- systems - commands - command: is the command line command with its arguments.

### Configuring games:
games.json contains your listed games.
This file needs to be in the correspondig system subfolder in a subfolder called games.

The release archive contains a games.json with some example games configured.

The contents:
- games: is an array which contains the information of your games.
- games - name: is the humanly readable name of the game. This is being displayed in Emuhub.
- games - gameName: is the name of your game file (as contained in you correspondiing games folder).

### Adding images
When you first run Emuhub images are being created in the folder 'images'.

The release archive contains some example images.

Recommended resolutions:
- system selection images: 500x500
- header images: 1920x200
- game images: 500x500
- command images 500x500

### Using Emuhub
The first screen is the systems screen. Your configured systems are displayed here. Select a system to go to the games screen.

Gamepad controls:
- left: go to previous system
- up: skip 3 systems to the left
- right: go to next system
- down: skip 3 systems to the right
- A: select system
- B: close Emuhub

Next is the games screen. Your games are displayed here. Select a game to go to the commands screen.

Gamepad controls:
- left: go to previous game
- up: skip 5 games to the left
- right: go to next game
- down: skip 5 games to the right
- A: select game
- B: go back to the systems screen

Next is the commands screen. Your commands are displayed here. Select a command to run it.

Gamepad controls:
- left: go to previous command
- up: skip 3 command to the left
- right: go to next command
- down: skip 3 command to the right
- A: run command
- B: go back to the games screen
