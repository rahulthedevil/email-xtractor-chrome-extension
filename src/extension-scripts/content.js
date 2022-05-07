var observeDOM = (function () {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function (obj, callback) {
    if (!obj || obj.nodeType !== 1) return;

    if (MutationObserver) {
      // define a new observer
      var mutationObserver = new MutationObserver(callback)

      // have the observer observe foo for changes in children
      mutationObserver.observe(obj, { childList: true, subtree: true })
      return mutationObserver
    }

    // browser support fallback
    else if (window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})()

const extractEmails = (text) => {
  // eslint-disable-next-line no-control-regex
  return text.match(/(?:[a-z0-9+!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gmi);
}

let origin = document.location.origin;

/**
 * Email Extract
 */
let emailToStore = {};
setTimeout(() => {
  var allElems = document.body.querySelectorAll('*');
  allElems.forEach(function (e) {
    let firstEmails = extractEmails(e.innerHTML.toString());
    if (firstEmails && firstEmails.length) {
      firstEmails.forEach(d => {
        if (!d.includes(".google.com") && !d.includes("@yourdomain.com") && !d.includes("@company.com") && !d.includes("@example.com")) {
          Object.assign(emailToStore, { [d]: { email: d, origin: origin } });
        }
      });

      // eslint-disable-next-line no-undef
      chrome.storage.local.get(["emailData"], (data) => {
        // eslint-disable-next-line no-undef
        chrome.storage.local.set({ emailData: { ...data.emailData, ...emailToStore } });
      });
    }
  });
}, 5000);

observeDOM(document.querySelector("body"), function (m) {
  var addedNodes = [], removedNodes = [];

  m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes))

  m.forEach(record => record.removedNodes.length & removedNodes.push(...record.removedNodes))

  addedNodes.forEach((e) => {
    if (e.innerHTML) {
      let emails = extractEmails(e.innerHTML.toString());
      if (emails && emails.length) {
        emails.forEach(d => {
          if (!d.includes(".google.com") && !d.includes("@yourdomain.com") && !d.includes("@company.com") && !d.includes("@example.com")) {
            Object.assign(emailToStore, { [d]: { email: d, origin: origin } });
          }
        });
        // eslint-disable-next-line no-undef
        chrome.storage.local.get(["emailData"], (data) => {
          // eslint-disable-next-line no-undef
          chrome.storage.local.set({ emailData: { ...data.emailData, ...emailToStore } });
        });
      }
    }
  });
});
console.log("Loaded Xtractor")