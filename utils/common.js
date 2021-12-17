import CID from 'cids'

export const toHumanReadable = (val) => {
	// known SI prefixes, multiple of 3
	var PREFIXES = {
		24: 'Y',
		21: 'Z',
		18: 'E',
		15: 'P',
		12: 'T',
		9: 'G',
		6: 'M',
		3: 'k',
		0: '',
		'-3': 'm',
		'-6': 'µ',
		'-9': 'n',
		'-12': 'p',
		'-15': 'f',
		'-18': 'a',
		'-21': 'z',
		'-24': 'y',
	}

	function getExponent(n) {
		if (n === 0) {
			return 0
		}
		return Math.floor(Math.log10(Math.abs(n)))
	}

	function precise(n) {
		return Number.parseFloat(n.toPrecision(3))
	}

	function toHumanString(sn) {
		var n = precise(Number.parseFloat(sn))
		var e = Math.max(Math.min(3 * Math.floor(getExponent(n) / 3), 24), -24)
		return precise(n / Math.pow(10, e)).toString() + PREFIXES[e]
	}

	return toHumanString(val)
}

export const prettyBalance = (balance, decimals = 18, len = 8) => {
	if (!balance) {
		return '0'
	}
	const diff = balance.toString().length - decimals
	const fixedPoint = Math.max(2, len - Math.max(diff, 0))
	const fixedBalance = (balance / 10 ** decimals).toFixed(fixedPoint)
	const finalBalance = parseFloat(fixedBalance).toString()
	const [head, tail] = finalBalance.split('.')
	if (head == 0) {
		if (tail) {
			return `${head}.${tail.substring(0, len - 1)}`
		}
		return `${head}`
	}
	const formattedHead = head.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return tail ? `${formattedHead}.${tail}` : formattedHead
}

export const parseImgUrl = (url, defaultValue = '', opts = {}) => {
	if (!url) {
		return defaultValue
	}
	if (url.includes('://')) {
		const [protocol, path] = url.split('://')
		if (protocol === 'ipfs') {
			const cid = new CID(path)
			if (opts.useOriginal || process.env.APP_ENV !== 'production') {
				if (cid.version === 0) {
					return `https://ipfs-gateway.paras.id/ipfs/${path}`
				} else {
					return `https://ipfs.fleek.co/ipfs/${path}`
				}
			}

			let transformationList = []
			if (opts.width) {
				transformationList.push(`w=${opts.width}`)
			} else {
				transformationList.push('w=800')
			}
			return `https://paras-cdn.imgix.net/${cid}?${transformationList.join('&')}`
		}
		return url
	} else {
		try {
			const cid = new CID(url)
			if (opts.useOriginal || process.env.APP_ENV !== 'production') {
				if (cid.version === 0) {
					return `https://ipfs-gateway.paras.id/ipfs/${cid}`
				} else if (cid.version === 1) {
					return `https://ipfs.fleek.co/ipfs/${cid}`
				}
			}

			let transformationList = []
			if (opts.width) {
				transformationList.push(`w=${opts.width}`)
			} else {
				transformationList.push('w=800')
			}
			return `https://paras-cdn.imgix.net/${cid}?${transformationList.join('&')}`
		} catch (err) {
			return url
		}
	}
}
