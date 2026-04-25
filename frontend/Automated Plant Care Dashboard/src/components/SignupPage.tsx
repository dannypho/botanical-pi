import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Leaf, Droplets } from "lucide-react";
import { signup } from "@/api/api";

interface SignupPageProps {
  onSignup: () => void;
  goToLogin: () => void;
}

export function Signup({ onSignup, goToLogin }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await signup(email, password);
      console.log("Signup response:", data);

      if (!data.user_id) {
        throw new Error("Signup failed");
      }

      // ✅ Success
      onSignup();
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || "Signup failed");
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
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription className="text-base">
            Start monitoring your plants 🌱
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="test@botanical.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-sm">
            <p>
              Already have an account?{" "}
              <button
                onClick={goToLogin}
                className="text-green-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}