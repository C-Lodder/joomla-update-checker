'use strict';

const msg = {
  UP_TO_DATE: 'Your site is up to date.',
  OUTDATED: 'Your site out of date. Please update to the latest version of Joomla.',
  NO_MANIFEST: 'Can\'t fetch manifest file.',
  ERROR: 'An error occured.',
};

function renderMessage(error, latestVersion, siteVersion) {
  const results = document.getElementById('results');
  results.classList.add('alert');

  if (error) {
    results.classList.add('alert-danger');
    results.innerHTML = `<div class="heading"><strong>${error}</strong></div>`;
  } else if (siteVersion < latestVersion) {
    results.classList.add('alert-danger');
    results.innerHTML = `<div class="heading"><strong>${msg.OUTDATED}</strong></div><div>Your version: <strong>${siteVersion}</strong></div><div>Latest version: <strong>${latestVersion}</strong></div>`;
  } else if (siteVersion === latestVersion) {
    results.classList.add('alert-success');
    results.innerHTML = `<div class="heading"><strong>${msg.UP_TO_DATE}</strong></div><div>Your version: <strong>${siteVersion}</strong></div><div>Latest version: <strong>${latestVersion}</strong></div>`;
  }
}

function getSiteVersion(latest) {
  browser.tabs.query({
      currentWindow: true,
      active: true
    })
    .then(tabs => {
      const url = (new URL(tabs[0].url));
      return url.origin;
    })
    .then(url => {
      return fetch(`${url}/administrator/manifests/files/joomla.xml`)
        .then(response => {
          if (!response.ok) {
            renderMessage(msg.NO_MANIFEST);
            throw Error(msg.NO_MANIFEST);
          }
          return response.text();
        })
        .then(response => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response, 'text/xml');
          const version = doc.childNodes[0].children[6].innerHTML;

          return renderMessage(false, latest, version);
        }).catch(error => {
          renderMessage(msg.ERROR);
          throw Error(msg.ERROR);
        });
    });
}

function getLatestJoomlaVersion() {
  return fetch('https://downloads.joomla.org/api/v1/releases/cms')
    .then(response => {
      return response.json();
    })
    .then(data => {
      return getSiteVersion(data.releases[0].version);
    });
}

document.getElementById('detect').addEventListener('click', getLatestJoomlaVersion);