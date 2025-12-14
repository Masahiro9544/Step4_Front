from rembg import remove
from PIL import Image
import os
import io

target_dir = "./public/images/character"
files = [
    "character_normal.png",
    "character_blink.png",
    "character_happy.png",
    "character_surprised.png",
    "character_away.png"
]

for filename in files:
    path = os.path.join(target_dir, filename)
    if not os.path.exists(path):
        print(f"Skipping {filename}: Not found")
        continue
    
    print(f"Processing {filename}...")
    try:
        with open(path, 'rb') as i:
            input_data = i.read()
            output_data = remove(input_data)
            
            # 保存 (上書き)
            with open(path, 'wb') as o:
                o.write(output_data)
        print(f"Done: {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")
