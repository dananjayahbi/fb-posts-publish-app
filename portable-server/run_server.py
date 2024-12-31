import os
import subprocess
import threading
import psutil
from pystray import Icon, Menu, MenuItem
from PIL import Image

# Path to the .bat file
BAT_FILE_PATH = os.path.join(os.getcwd(), "start.bat")

# Global variable to store the server process
server_process = None

# Function to run the .bat file silently
def run_bat_file():
    global server_process
    server_process = subprocess.Popen(
        BAT_FILE_PATH,
        shell=True,
        creationflags=subprocess.CREATE_NO_WINDOW
    )

# Function to stop the server and close the tray icon
def stop_server(icon):
    global server_process

    # Stop the server process and its children
    if server_process:
        try:
            # Get the process and terminate it along with its children
            parent = psutil.Process(server_process.pid)
            for child in parent.children(recursive=True):  # Terminate child processes
                child.terminate()
            parent.terminate()  # Terminate parent process
        except psutil.NoSuchProcess:
            pass

        server_process = None

    # Stop the tray icon
    icon.stop()

# Function to create the tray icon menu
def create_menu():
    return Menu(
        MenuItem("Stop Server", stop_server)
    )

# Function to display the tray icon
def start_tray_icon():
    # Dynamically find the bundled icon file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    icon_path = os.path.join(current_dir, "icon.ico")
    icon_image = Image.open(icon_path)

    # Create the system tray icon
    icon = Icon("Server Status", icon_image, "Server Running", create_menu())
    icon.run()

# Run the server in a separate thread
server_thread = threading.Thread(target=run_bat_file)
server_thread.daemon = True
server_thread.start()

# Start the tray icon
start_tray_icon()
