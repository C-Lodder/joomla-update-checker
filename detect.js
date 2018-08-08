

const http = XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());

http.open('GET', 'https://downloads.joomla.org/api/v1/releases/cms', true);
http.onreadystatechange = () => {
	if (http.readyState == 4) {
		const response = JSON.parse(http.response);
		const latest = response.releases[0].version;
		console.log(latest);
	}
}
http.send();
