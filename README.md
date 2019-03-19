# ChromeJupyterLauncher
 A Chrome extension used to quick start Jupyter Lab in chrome control bar.
 
 If you like it, please `star`

### Platform
Currently it supports Mac OS, Windows and Linux (Ubuntu tested).


### Install
1. Download and put whole directory into a folder.
2. In Chrome, go to `chrome://extensions` in address box
3. Turn on `Developer mode`
4. Drag `app` folder into Chrome window, to install the extension in Developer mode
5. Now you can see this extension appears on the window, copy the `ID` of this extension, edit `com.codpls.jupyter.chrome.starter.json` in `host` folder, replace `extensionidstring` with this ID
6. Using terminal to run `./install_host.sh`
7. Enjoy


### Notes
The host depends on the commands of Jupyter Lab. Make sure you can execute the following commands (add the path to Environment Variable).
If not working, please make a symbolic link of `jupyter` to `/usr/local/bin/jupyter`, i.e. `ln -s /path-to-your-jupyter/jupyter /usr/local/bin/jupyter`

* `jupyter lab ~/`
* `jupyter notebook stop [port]`
* `jupyter notebook list`












##### Acknowledgement
Some part of code are modified from Google Chrome Extension example.


