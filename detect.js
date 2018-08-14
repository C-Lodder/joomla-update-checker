/**
 * Joomla Update Checker
 */

(() => {
	//const notify = 'joomla-notification';
	const http   = XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
	const msg    = {
		UP_TO_DATE : 'Your site is up to date',
		OUTDATED   : 'Your site out of date. Please update to the latest version of Joomla',
	};

	const getSiteVersion = (latest) => {
		http.open('GET', window.top.location.origin + '/administrator/manifests/files/joomla.xml', true);
		http.onreadystatechange = () => {
			if (http.readyState === 4) {
				if (http.status === 404) {
					return;
				}
				const parser = new DOMParser();
				const doc = parser.parseFromString(http.response, 'application/xml');
				const version = doc.childNodes[0].children[6].innerHTML;
				versionMatch(latest, version);
			}
		}
		http.send();
	}

	const getLatestJoomlaVersion = () => {
		http.open('GET', 'https://downloads.joomla.org/api/v1/releases/cms', true);
		http.onreadystatechange = () => {
			if (http.readyState === 4) {
				const response = JSON.parse(http.response);
				const latest = response.releases[0].version;
				getSiteVersion(latest);
			}
		}
		http.send();
	}

	// const spawnNotification = (body) => {
		// browser.notifications.create(notify, {
			// 'type'    : 'basic',
			// 'iconUrl' : browser.extension.getURL('icons/icon-96.png'),
			// 'title'   : 'Joomla Update Checker',
			// 'message' : body
		// });
	// }

	const versionMatch = (latestVersion, siteVersion) => {
		if (siteVersion < latestVersion) {
			console.log(msg.OUTDATED);
			//spawnNotification(msg.OUTDATED);
		}
		else if (siteVersion === latestVersion) {
			console.log(msg.UP_TO_DATE);
			//spawnNotification(msg.UP_TO_DATE);
		}
	}

	getLatestJoomlaVersion();
})();