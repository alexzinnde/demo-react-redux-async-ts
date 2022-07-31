import React from 'react'
import {useAppDispatch, useAppSelector} from './app/hooks'
import {getUsers, clearUsers} from './redux'

import Button from './components/Button'

function App() {
	const dispatch = useAppDispatch()
	const users = useAppSelector(state => state.users.users)

	const getButtonText = () => {
		console.log('in getButtonText, users.length', users.length)
		return users.length > 1 ? 'Clear Users' : 'Get Users'
	}

	const handleClick = async () => {
		if (users.length === 0) {
			const res = await dispatch(getUsers()).unwrap()
			console.log('res.data', res.data)
		} else {
			dispatch(clearUsers())
		}
	}
	return (
		<div style={{height: '95vh', width: '98vw', display: 'flex', margin: 'auto', justifyContent: 'center', alignItems: 'center'}}>
			<Button text={getButtonText()} handleClick={handleClick} />
			<div>{users.length > 1 && users.map(user => <p key={user.id}>{user.name}</p>)}</div>
		</div>
	)
}

export default App
