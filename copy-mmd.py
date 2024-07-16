import tkinter as tk
from tkinterdnd2 import DND_FILES, TkinterDnD
import os
import shutil

class FileCopyApp:
    def __init__(self, root):
        self.root = root
        self.root.title("File Copy Tool")
        
        # Initialize variables for file paths and base path
        self.base_path = tk.StringVar(value="E:\\Dropbox\\Public\\00_Html\\Examples\\3D_Model_render\\MMD\\SampleWebMMD-master")
        self.camera_path = ""
        self.vmd_path = ""
        self.audio_path = ""
        
        # Create GUI elements
        self.create_gui()
    
    def create_gui(self):
        # Create label and entry for base path
        base_path_label = tk.Label(self.root, text="Base Path:")
        base_path_label.grid(row=0, column=0, padx=10, pady=10, sticky="e")
        
        self.base_path_entry = tk.Entry(self.root, textvariable=self.base_path, width=50)
        self.base_path_entry.grid(row=0, column=1, padx=10, pady=10, sticky="ew")
        
        # Create labels for drop boxes
        tk.Label(self.root, text="Camera").grid(row=1, column=0, padx=10, pady=10)
        tk.Label(self.root, text="VMD").grid(row=1, column=1, padx=10, pady=10)
        tk.Label(self.root, text="Audio").grid(row=1, column=2, padx=10, pady=10)
        
        # Create drop boxes
        self.create_drop_box("camera", row=2, column=0)
        self.create_drop_box("vmd", row=2, column=1)
        self.create_drop_box("audio", row=2, column=2)
        
        # Entry for name
        name_label = tk.Label(self.root, text="Enter a name:")
        name_label.grid(row=3, column=0, columnspan=3, padx=10, pady=10)
        
        self.name_entry = tk.Entry(self.root)
        self.name_entry.grid(row=4, column=0, columnspan=3, padx=10, pady=10, sticky="ew")
        
        # Button to initiate copy process
        copy_button = tk.Button(self.root, text="Copy Files", command=self.copy_files)
        copy_button.grid(row=5, column=0, columnspan=3, padx=10, pady=10, sticky="ew")
        
        # Label for success message
        self.success_label = tk.Label(self.root, text="", fg="green")
        self.success_label.grid(row=6, column=0, columnspan=3, padx=10, pady=10)
        
        # Configure grid layout
        self.root.grid_rowconfigure(2, weight=1)
        self.root.grid_columnconfigure(0, weight=1)
        self.root.grid_columnconfigure(1, weight=1)
        self.root.grid_columnconfigure(2, weight=1)
    
    def create_drop_box(self, target_path, row, column):
        frame = tk.Frame(self.root, borderwidth=2, relief="groove")
        frame.grid(row=row, column=column, padx=10, pady=10, sticky="nsew")
        
        label = tk.Label(frame, text=target_path.capitalize(), anchor="w")
        label.pack(fill="x", padx=10, pady=(10, 5))
        
        drop_box = tk.Listbox(frame, relief="sunken", bd=2, height=5, width=40)
        drop_box.pack(fill="both", padx=10, pady=(0, 10))
        
        # Enable drag and drop handling using tkinterdnd2
        drop_box.drop_target_register(DND_FILES)
        drop_box.dnd_bind('<<Drop>>', lambda event, target=target_path: self.on_drop(event, target, drop_box))
        
    def on_drop(self, event, target_path, drop_box):
        # Handle dropped files
        file_paths = event.data.split()  # Split by spaces to get individual file paths
        if file_paths:
            print(f"Dropped file paths: {file_paths}")  # Debug print for dropped files
            for file_path in file_paths:
                self.on_file_drop(file_path, target_path, drop_box)
    
    def on_file_drop(self, file_path, target_path, drop_box):
        # Handle dropped file path
        print(f"Dropped file path: {file_path}")  # Debug print
        
        # Concatenate parts back into full path if necessary
        if not os.path.isabs(file_path):
            file_path = os.path.join(os.getcwd(), file_path)
        
        if target_path == "camera":
            self.camera_path = file_path
        elif target_path == "vmd":
            self.vmd_path = file_path
        elif target_path == "audio":
            self.audio_path = file_path
        
        # Update drop box display
        file_name = os.path.basename(file_path)
        drop_box.delete(0, tk.END)
        drop_box.insert(tk.END, f"Dropped: {file_name}")
    
    def copy_files(self):
        name = self.name_entry.get().strip()
        
        if name == "":
            self.success_label.config(text="Please enter a name.", fg="red")
            return
        
        self.base_path_value = self.base_path.get().strip()
        
        if not self.base_path_value:
            self.success_label.config(text="Please enter a base path.", fg="red")
            return
        
        if self.camera_path:
            camera_file_name = os.path.basename(self.camera_path)
            _, camera_file_ext = os.path.splitext(camera_file_name)
            new_camera_file_name = f"{name}{camera_file_ext}"
            shutil.copy(self.camera_path, os.path.join(self.base_path_value, "camera", new_camera_file_name))
            print(f"Copied '{camera_file_name}' to {os.path.join(self.base_path_value, 'camera')} as '{new_camera_file_name}'")
        
        if self.vmd_path:
            vmd_file_name = os.path.basename(self.vmd_path)
            _, vmd_file_ext = os.path.splitext(vmd_file_name)
            new_vmd_file_name = f"{name}{vmd_file_ext}"
            shutil.copy(self.vmd_path, os.path.join(self.base_path_value, "vmd", new_vmd_file_name))
            print(f"Copied '{vmd_file_name}' to {os.path.join(self.base_path_value, 'vmd')} as '{new_vmd_file_name}'")
        
        if self.audio_path:
            audio_file_name = os.path.basename(self.audio_path)
            _, audio_file_ext = os.path.splitext(audio_file_name)
            new_audio_file_name = f"{name}{audio_file_ext}"
            shutil.copy(self.audio_path, os.path.join(self.base_path_value, "audio", new_audio_file_name))
            print(f"Copied '{audio_file_name}' to {os.path.join(self.base_path_value, 'audio')} as '{new_audio_file_name}'")
        
        self.success_label.config(text="Files copied successfully.", fg="green")

if __name__ == "__main__":
    root = TkinterDnD.Tk()
    app = FileCopyApp(root)
    root.mainloop()
