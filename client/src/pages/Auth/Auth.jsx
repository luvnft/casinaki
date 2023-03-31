import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Context } from '../..'
import { login, registration } from '../../http/userAPI'
import styles from './Auth.module.css'
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from '../../utils/constants'

const Auth = observer(() => {
	const { user } = useContext(Context)
	const location = useLocation()
	const navigate = useNavigate()
	const isLogin = location.pathname === LOGIN_ROUTE
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')

	const submitHandler = async (e) => {
		e.preventDefault()
		try {
			let data
			if (isLogin) {
				data = await login(username, password)
			} else {
				if(!validateInputs())
					return
				data = await registration(username, password)
			}
			user.setUser(data)
			user.setIsAuth(true)
			navigate(MAIN_ROUTE)
		} catch (e) {
			alert(e.response.data.message)
		}
	}

	const validateInputs = () => {
		if (username.length < 5 || username.length > 20) {
			alert('Username length must be from 5 to 20')
			return false
		}
		if (password.length < 8) {
			alert('Password must be 8 or more characters')
			return false
		}
		if (password !== passwordConfirm) {
			alert('Passwords dont match')
			return false
		}
		return true
	}

	return (
		<div className={styles.container}>
			{isLogin ? <h2>authorization</h2> : <h2>registration</h2>}
			<form>
				<input type='text' placeholder='username' value={username} onChange={e => setUsername(e.target.value)} required />
				<input type='password' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} required />
				{isLogin ?
					<>
						<button onClick={e => submitHandler(e)}>login</button>
						<div style={{ textAlign: 'center' }}>
							Don't have an account? <NavLink to={REGISTER_ROUTE}>register</NavLink>
						</div>
					</>
					:
					<>
						<input type='password' placeholder='confirm' value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />
						<button onClick={e => submitHandler(e)}>register</button>
						<div style={{ textAlign: 'center' }}>
							Have an account? <NavLink to={LOGIN_ROUTE}>login</NavLink>
						</div>
					</>
				}
			</form>
		</div>
	)
})

export default Auth