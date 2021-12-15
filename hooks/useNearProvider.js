import React, { createContext, useContext, useEffect, useState } from 'react'
import near from 'services/near'
import Loading from 'components/Loading'

const defaultValue = {
	isInit: false,
}

export const NearContext = createContext(defaultValue)
export const useNearProvider = () => useContext(NearContext)

export const NearProvider = (props) => {
	const [isInit, setIsInit] = useState(false)

	useEffect(() => {
		near.init(() => setIsInit(true))
	}, [])

	const value = {
		isInit,
	}

	return (
		<NearContext.Provider value={value}>
			<Loading isLoading={!isInit} />
			{props.children}
		</NearContext.Provider>
	)
}
