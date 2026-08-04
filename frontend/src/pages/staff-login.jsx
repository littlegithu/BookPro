import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import AuthForm from '../components/auth/auth-form'
import Navbar from '../components/layout/navbar'
import { loginUser, loginStaff, loginHospital } from '../services/api'

export default function StaffLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isStaff, setIsStaff] = useState(false)
  const [isHospital, setIsHospital] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    try {
      let result
      let userData
      if (isHospital) {
        result = await loginHospital({ email, password })
        const hospital = result.hospital
        userData = {
          id: hospital.id,
          name: hospital.name,
          email: hospital.email,
          role: 'hospital_admin',
          profile_image: null,
        }
        login(userData, result.token)
        navigate('/hospital/dashboard', { replace: true })
      } else if (isStaff) {
        result = await loginStaff({ email, password })
        if (result.user && result.user.staff) {
          const staffData = result.user.staff
          userData = {
            id: result.user.id,
            name: `${staffData.first_name || result.user.first_name} ${staffData.last_name || result.user.last_name}`,
            email: result.user.email,
            first_name: staffData.first_name || result.user.first_name,
            last_name: staffData.last_name || result.user.last_name,
            role: 'staff',
            profile_image: result.user.profile_image,
            staff: staffData,
          }
          login(userData, result.token)
          navigate('/staff/dashboard', { replace: true })
        }
      } else {
        result = await loginUser({ email, password })
        const user = result.user
        userData = {
          id: user?.id,
          name: user?.name || user?.first_name + ' ' + user?.last_name,
          email: user?.email,
          first_name: user?.first_name,
          last_name: user?.last_name,
          role: user?.role || 'user',
          profile_image: user?.profile_image,
          staff: user?.staff,
          doctor: user?.doctor,
          patient: user?.patient,
        }
        login(userData, result.token)
        if (userData.role === 'doctor') {
          navigate('/dashboard', { replace: true })
        } else if (userData.role === 'staff') {
          navigate('/staff/dashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-16">
      <Navbar />
      <div className="flex items-center justify-center">
        <AuthForm
          title={isHospital ? "Hospital Login" : isStaff ? "Staff Login" : "User Login"}
          subtitle={isHospital ? "Log in to your hospital account" : isStaff ? "Log in to your staff account" : "Log in to your account"}
          fields={[
            { name:'email', label:'Email address', type:'email', placeholder:'you@hospital.com', value:email, onChange:setEmail },
            { name:'password', label:'Password', type:'password', placeholder:'Enter password', value:password, onChange:setPassword },
          ]}
          submitLabel={isHospital ? "Login as Hospital" : isStaff ? "Login as Staff" : "Continue"}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
          footer={
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isStaff} onChange={(e) => { setIsStaff(e.target.checked); setIsHospital(false) }} className="w-4 h-4" />
                <span className="text-sm text-slate-light">Staff login</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={isHospital} onChange={(e) => { setIsHospital(e.target.checked); setIsStaff(false) }} className="w-4 h-4" />
                <span className="text-sm text-slate-light">Hospital login</span>
              </label>
              <div className="mt-2">
                <Link to="/register" className="text-teal hover:underline text-sm">Need an account?</Link>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}