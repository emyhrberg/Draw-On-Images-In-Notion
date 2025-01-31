console.log("Hello, World! You just entered Notion.");

let editButton = null;

// Function to create an "Edit" button
function createEditButton(targetImg) {
    if (editButton) editButton.remove(); // Remove old button if exists

    editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.position = "absolute";
    editButton.style.padding = "5px 10px";
    editButton.style.fontSize = "12px";
    editButton.style.cursor = "pointer";
    editButton.style.background = "rgba(0,0,0,0.7)";
    editButton.style.color = "white";
    editButton.style.border = "none";
    editButton.style.borderRadius = "5px";
    editButton.style.zIndex = "9999";
    editButton.style.transition = "opacity 0.2s ease-in-out";
    editButton.style.opacity = "0"; // Initially hidden

    document.body.appendChild(editButton);

    // Position the button near the image
    const rect = targetImg.getBoundingClientRect();
    editButton.style.left = `${rect.left + window.scrollX + 10}px`;
    editButton.style.top = `${rect.top + window.scrollY + 10}px`;
    editButton.style.opacity = "1"; // Fade in

    // Click event on the "Edit" button
    editButton.addEventListener("click", () => {
        console.log("Edit button clicked for image:", targetImg.src);
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

// Listen for hovering over an image
document.addEventListener("mouseover", (event) => {
    if (event.target.tagName === "IMG") {
        createEditButton(event.target);
    }
});

// Listen for right-clicking a button
document.addEventListener("contextmenu", (event) => {
    if (event.target.tagName === "BUTTON") {
        console.log("Right-clicked on a button!");
    }
});
