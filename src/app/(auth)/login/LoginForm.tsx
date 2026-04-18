'use client'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

type Tab = 'signin' | 'signup'

export default function LoginForm() {
  const [tab, setTab] = useState<Tab>('signin')

  // Sign-in state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signInLoading, setSignInLoading] = useState(false)

  // Sign-up state
  const [suName, setSuName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [signUpLoading, setSignUpLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setSignInError(null)
    setSignInLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSignInLoading(false)
    if (error) {
      setSignInError(error.message)
    } else {
      // Hard navigation ensures the browser commits the session cookie
      // before the next request hits the middleware. router.push fires
      // before @supabase/ssr finishes writing cookies, causing a redirect loop.
      window.location.href = '/dashboard'
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setSignUpError(null)
    if (suPassword !== suConfirm) {
      setSignUpError('Passwords do not match')
      return
    }
    if (suPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters')
      return
    }
    setSignUpLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: suEmail,
      password: suPassword,
      options: {
        data: { full_name: suName.trim() },
      },
    })
    setSignUpLoading(false)
    if (error) {
      setSignUpError(error.message)
    } else {
      setSignUpSuccess(true)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ExpenseTracker</CardTitle>
        <CardDescription>
          {tab === 'signin' ? 'Sign in to your account' : 'Create your account'}
        </CardDescription>
      </CardHeader>

      {/* Tab switcher */}
      <div className="flex border-b mx-6">
        <button
          onClick={() => setTab('signin')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'signin'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab('signup')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'signup'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign Up
        </button>
      </div>

      <CardContent className="pt-5">
        {tab === 'signin' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {signInError && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{signInError}</p>
            )}
            <Button type="submit" className="w-full" disabled={signInLoading}>
              {signInLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        ) : signUpSuccess ? (
          <div className="text-center space-y-3 py-4">
            <div className="text-green-600 text-4xl">✓</div>
            <p className="font-medium">Account created!</p>
            <p className="text-sm text-muted-foreground">
              Check your email to confirm your address, then sign in.
            </p>
            <Button variant="outline" className="w-full mt-2" onClick={() => { setTab('signin'); setSignUpSuccess(false) }}>
              Go to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="su-name">Full Name</Label>
              <Input
                id="su-name"
                type="text"
                placeholder="Your name"
                required
                value={suName}
                onChange={e => setSuName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="su-email">Email</Label>
              <Input
                id="su-email"
                type="email"
                placeholder="you@example.com"
                required
                value={suEmail}
                onChange={e => setSuEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="su-password">Password</Label>
              <Input
                id="su-password"
                type="password"
                required
                value={suPassword}
                onChange={e => setSuPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="su-confirm">Confirm Password</Label>
              <Input
                id="su-confirm"
                type="password"
                required
                value={suConfirm}
                onChange={e => setSuConfirm(e.target.value)}
              />
            </div>
            {signUpError && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{signUpError}</p>
            )}
            <Button type="submit" className="w-full" disabled={signUpLoading}>
              {signUpLoading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              New accounts start as Staff. Ask your admin to grant additional access.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
