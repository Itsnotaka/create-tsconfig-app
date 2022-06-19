/* eslint-disable no-eq-null */
import { execSync } from 'child_process';
import dns from 'dns';
import url from 'url';

function getProxy(): string | undefined {
	if (process.env.https_proxy) {
		return process.env.https_proxy;
	}

	try {
		const httpsProxy = execSync('npm config get https-proxy').toString().trim();
		// eslint-disable-next-line no-negated-condition
		return httpsProxy !== 'null' ? httpsProxy : undefined;
		// eslint-disable-next-line no-unused-vars
	} catch (e) {
		// eslint-disable-next-line no-useless-return
		return;
	}
}

export function getOnline(): Promise<boolean> {
	return new Promise(resolve => {
		dns.lookup('registry.yarnpkg.com', registryErr => {
			if (!registryErr) {
				return resolve(true);
			}

			const proxy = getProxy();
			if (!proxy) {
				return resolve(false);
			}

			const { hostname } = url.parse(proxy);
			if (!hostname) {
				return resolve(false);
			}

			dns.lookup(hostname, proxyErr => {
				// eslint-disable-next-line eqeqeq
				resolve(proxyErr == null);
			});
		});
	});
}
