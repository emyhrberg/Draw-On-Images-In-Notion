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
        openTextEditor(targetImg);
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

function openTextEditor(targetImg) {
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

    let ctx = drawingCanvas.getContext("2d");

    // Load the original image
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = targetImg.src;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height);
    };

    let textInputs = [];

    // Click event to add text at a clicked position
    drawingCanvas.addEventListener("click", (e) => {
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Type text here...";
        input.style.position = "absolute";
        input.style.left = `${e.clientX}px`;
        input.style.top = `${e.clientY}px`;
        input.style.zIndex = "10001";
        input.style.fontSize = "16px";
        input.style.border = "none";
        input.style.outline = "none";
        input.style.background = "transparent";
        input.style.color = "black";
        input.style.fontWeight = "bold";

        document.body.appendChild(input);
        input.focus();

        textInputs.push({ input, x: e.clientX, y: e.clientY });

        input.addEventListener("blur", () => {
            if (input.value.trim() !== "") {
                ctx.font = "20px Arial";
                ctx.fillStyle = "black";
                ctx.fillText(input.value, e.clientX - drawingCanvas.getBoundingClientRect().left, e.clientY - drawingCanvas.getBoundingClientRect().top);
            }
            input.remove();
        });
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
        textInputs.forEach(({ input, x, y }) => {
            if (input.value.trim() !== "") {
                ctx.font = "20px Arial";
                ctx.fillStyle = "black";
                ctx.fillText(input.value, x - drawingCanvas.getBoundingClientRect().left, y - drawingCanvas.getBoundingClientRect().top);
            }
            input.remove();
        });

        // Convert canvas to an image URL
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

        console.log("Image with text saved and replaced.");
    });

    console.log("Text editor opened for image:", targetImg.src);
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
