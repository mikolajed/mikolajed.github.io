import cv2
import numpy as np
import sys
import os

def generate_svg(input_path, output_path):
    print(f"Processing {input_path}...")
    
    # Read image
    img = cv2.imread(input_path)
    if img is None:
        print(f"Error: Could not read image {input_path}")
        sys.exit(1)
        
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Blur slightly to reduce noise
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    
    # Canny edge detection
    # Adjust thresholds for more detail
    edges = cv2.Canny(blurred, 50, 125)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter short contours to reduce noise
    min_length = 18
    long_contours = [c for c in contours if cv2.arcLength(c, False) > min_length]
    
    print(f"Found {len(long_contours)} contours.")
    
    # Create SVG
    height, width = img.shape[:2]
    
    # Sort contours by distance from center
    center_x, center_y = width / 2, height / 2
    
    def get_contour_center(c):
        M = cv2.moments(c)
        if M["m00"] != 0:
            cX = int(M["m10"] / M["m00"])
            cY = int(M["m01"] / M["m00"])
        else:
            # Fallback to first point if moment is 0
            cX, cY = c[0][0]
        return cX, cY

    long_contours.sort(key=lambda c: max(abs(get_contour_center(c)[0] - center_x) / width, abs(get_contour_center(c)[1] - center_y) / height))

    with open(output_path, 'w') as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" class="w-full h-full">\n')
        
        for i, contour in enumerate(long_contours):
            # Simplify contour slightly
            epsilon = 0.002 * cv2.arcLength(contour, False)
            approx = cv2.approxPolyDP(contour, epsilon, False)
            
            points = approx.reshape(-1, 2)
            if len(points) < 2:
                continue
                
            path_d = f"M {points[0][0]} {points[0][1]}"
            for p in points[1:]:
                path_d += f" L {p[0]} {p[1]}"
            
            # Add animation delay based on index for sequential drawing
            delay = i * 0.000375
            f.write(f'  <path d="{path_d}" class="draw-path" style="animation-delay: {delay:.3f}s" />\n')
            
        f.write('</svg>')
        
    print(f"Saved SVG to {output_path}")

if __name__ == "__main__":
    INPUT = "public/assets/3.png"
    OUTPUT = "public/assets/portrait.svg"
    
    # Ensure output dir exists
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    
    generate_svg(INPUT, OUTPUT)
