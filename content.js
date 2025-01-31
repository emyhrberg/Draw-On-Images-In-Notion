console.log("Hello, World! You just entered Notion.");

let editButton = null;
let drawingCanvas = null;
let ctx = null;

// Function to create the "Edit" button at the center of the image
function createEditButton(targetImg) {
    if (editButton) editButton.remove(); // Remove old button if exists

    editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.position = "absolute";
    editButton.style.padding = "8px 12px";
    editButton.style.fontSize = "14px";
    editButton.style.cursor = "pointer";
    editButton.style.background = "rgba(0, 0, 0, 0.7)";
    editButton.style.color = "white";
    editButton.style.border = "none";
    editButton.style.borderRadius = "5px";
    editButton.style.zIndex = "9999";
    editButton.style.transition = "opacity 0.2s ease-in-out";
    editButton.style.opacity = "0"; // Initially hidden

    document.body.appendChild(editButton);

    // Position the button at the center of the image
    const rect = targetImg.getBoundingClientRect();
    editButton.style.left = `${rect.left + window.scrollX + rect.width / 2 - editButton.offsetWidth / 2}px`;
    editButton.style.top = `${rect.top + window.scrollY + rect.height / 2 - editButton.offsetHeight / 2}px`;
    editButton.style.opacity = "1"; // Fade in

    // Click event on the "Edit" button
    editButton.addEventListener("click", () => {
        openDrawingCanvas(targetImg);
    });

    // Remove button when mouse leaves the image
    targetImg.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (editButton) {
                editButton.style.opacity = "0"; // Fade out
                setTimeout(() => editButton.remove(), 200); // Remove after fade
            }
        }, 200);
    });
}

// Function to open a canvas overlay on the image
function openDrawingCanvas(targetImg) {
    if (drawingCanvas) drawingCanvas.remove(); // Remove existing canvas

    drawingCanvas = document.createElement("canvas");
    drawingCanvas.width = targetImg.width;
    drawingCanvas.height = targetImg.height;
    drawingCanvas.style.position = "absolute";
    drawingCanvas.style.left = `${targetImg.getBoundingClientRect().left + window.scrollX}px`;
    drawingCanvas.style.top = `${targetImg.getBoundingClientRect().top + window.scrollY}px`;
    drawingCanvas.style.zIndex = "10000";
    drawingCanvas.style.border = "2px solid black";
    document.body.appendChild(drawingCanvas);

    ctx = drawingCanvas.getContext("2d");

    // Load image safely using fetch to avoid CORS issues
    fetch(targetImg.src, { mode: "cors" })
        .then(response => response.blob())
        .then(blob => {
            let img = new Image();
            img.crossOrigin = "anonymous"; // Prevent CORS issue
            img.src = URL.createObjectURL(blob);
            img.onload = () => {
                ctx.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height);
            };
        })
        .catch(error => console.error("Failed to load image for editing:", error));

    let isDrawing = false;

    // Drawing logic
    drawingCanvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    drawingCanvas.addEventListener("mousemove", (e) => {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    drawingCanvas.addEventListener("mouseup", () => {
        isDrawing = false;
    });

    drawingCanvas.addEventListener("mouseleave", () => {
        isDrawing = false;
    });

    // Create a "Save" button
    let saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.position = "absolute";
    saveButton.style.left = `${targetImg.getBoundingClientRect().left + window.scrollX + drawingCanvas.width / 2 - 30}px`;
    saveButton.style.top = `${targetImg.getBoundingClientRect().top + window.scrollY + drawingCanvas.height + 10}px`;
    saveButton.style.padding = "8px 12px";
    saveButton.style.fontSize = "14px";
    saveButton.style.cursor = "pointer";
    saveButton.style.background = "green";
    saveButton.style.color = "white";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "5px";
    saveButton.style.zIndex = "10001";

    document.body.appendChild(saveButton);

    // Save functionality: Replace the image element
    saveButton.addEventListener("click", () => {
        try {
            // Convert canvas to an image URL safely
            const imageDataURL = drawingCanvas.toDataURL("image/png");

            // Create a new image element to replace the original
            let newImg = document.createElement("img");
            newImg.src = imageDataURL;
            newImg.width = targetImg.width;
            newImg.height = targetImg.height;
            newImg.style = targetImg.style.cssText; // Preserve the original styles
            newImg.className = targetImg.className; // Preserve original classes

            // Replace the original image in the DOM
            targetImg.parentNode.replaceChild(newImg, targetImg);

            // Store in localStorage for persistence
            localStorage.setItem(targetImg.dataset.originalSrc || targetImg.src, imageDataURL);

            // Cleanup
            drawingCanvas.remove();
            saveButton.remove();

            console.log("Image content fully replaced.");
        } catch (error) {
            console.error("Error saving image:", error);
        }
    });

    console.log("Canvas opened for drawing on image:", targetImg.src);
}

// Function to restore edited images from localStorage after page refresh
function restoreImages() {
    document.querySelectorAll("img").forEach((img) => {
        const savedImage = localStorage.getItem(img.src);
        if (savedImage) {
            let newImg = document.createElement("img");
            newImg.src = savedImage;
            newImg.width = img.width;
            newImg.height = img.height;
            newImg.style = img.style.cssText; // Preserve the original styles
            newImg.className = img.className; // Preserve original classes
            img.parentNode.replaceChild(newImg, img);
        }
    });
}

// Listen for hovering over an image
document.addEventListener("mouseover", (event) => {
    if (event.target.tagName === "IMG") {
        createEditButton(event.target);
    }
});
