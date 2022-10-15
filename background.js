
// when extention or browser is installed/updated:
chrome.runtime.onInstalled.addListener(() => {
  // set badge text to "off"
  chrome.action.setBadgeText({
    text: "OFF",
  });
});


// When the user clicks on the extension action:
chrome.action.onClicked.addListener( async (tab) => {

  // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });


  // Perform actions for each state --

  // CLICK ON:
  if (nextState === "ON") {
    // Insert the CSS file when the user turns the extension on
    await chrome.scripting.insertCSS({
      files: ["retro-mode.css"],
      target: { tabId: tab.id },
    });

    // https://developer.chrome.com/docs/extensions/mv3/content_scripts/
    // function to get random color:
    function injectRnd() {
      let rndcolor1 = '#' + Math.floor(Math.random() * 16777215).toString(16);
      document.documentElement.setAttribute("style", `--rndcolor1: ${rndcolor1};`);
      let rndcolor2 = '#' + Math.floor(Math.random() * 16777215).toString(16);
      document.documentElement.setAttribute("style", `--rndcolor2: ${rndcolor2};`);


    }
    // add random color
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectRnd
    });


  // CLICK OFF:
  } else if (nextState === "OFF") {
    // Remove the CSS file when the user turns the extension off
    await chrome.scripting.removeCSS({
      files: ["retro-mode.css"],
      target: { tabId: tab.id },
    });
  }

});
