
//Test
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    fetch(request.greeting).then(res => res.text()).then(html => {
      sendResponse({farewell: html})
    })
    return true;
  }
);


// chrome.runtime.onMessage.addListener(
//   function (request, sender, sendResponse) {
//     console.log("background working");

//     const page = await fetch(request.url)


//     sendResponse({ response: "test" });
//   }
// );