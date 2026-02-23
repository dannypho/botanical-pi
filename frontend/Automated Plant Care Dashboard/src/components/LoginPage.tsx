import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Leaf, Droplets } from "lucide-react";
import { login } from "@/api/api";

interface LoginPageProps {
  onLogin: () => void; // no token needed
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await login(email, password);

      console.log("Login response:", data);

      // Check backend response
      if (!data.user_id) {
        throw new Error("Invalid credentials");
      }

      // Successful login
      onLogin();
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="relative">
              <Leaf className="size-10 text-green-600" />
              <Droplets className="size-5 text-blue-500 absolute -bottom-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-3xl">Botanical Pi</CardTitle>
          <CardDescription className="text-base">
            Automated plant monitoring and care system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@botanical.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="test123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Email: test@botanical.com</p>
            <p>Password: test123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}