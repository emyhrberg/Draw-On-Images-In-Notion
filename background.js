chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "drawOnImage",
    title: "Draw On Image",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "drawOnImage") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: startDrawingOnImage,
      args: [info.srcUrl]
    });
  }
});

function startDrawingOnImage(imageUrl) {
  alert(`Drawing on image: ${imageUrl}`);
  // TODO: Implement the drawing functionality here
}
