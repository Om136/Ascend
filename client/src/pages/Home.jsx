import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
  Award,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="h-8 w-8 text-indigo-600" />,
      title: "Smart Habit Tracking",
      description:
        "Track daily, weekly, and monthly habits with intelligent streak counting and completion tracking.",
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      title: "Gamified Experience",
      description:
        "Earn points, unlock achievements, and level up as you build consistent habits.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
      title: "Progress Analytics",
      description:
        "Visualize your progress with detailed statistics and completion trends.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Category Organization",
      description:
        "Organize habits by categories like Health, Work, Learning, and more.",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  const stats = [
    { number: "10+", label: "Achievement Badges" },
    { number: "10", label: "Skill Levels" },
    { number: "∞", label: "Habit Categories" },
    { number: "24/7", label: "Progress Tracking" },
  ];

  const achievements = [
    {
      icon: "🎯",
      name: "First Steps",
      description: "Complete your first habit",
    },
    { icon: "🔥", name: "Week Warrior", description: "7-day streak master" },
    {
      icon: "⭐",
      name: "Monthly Master",
      description: "30-day consistency champion",
    },
    { icon: "🏆", name: "Point Master", description: "Earn 1000+ points" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ascend
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-semibold"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-40 h-40 bg-pink-300 opacity-15 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-blue-300 opacity-25 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative container mx-auto px-4 py-24 text-center text-white">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Build Life-Changing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400">
                Habits ✨
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your daily routines into powerful habits with our
              gamified tracking system. Earn points, unlock achievements, and
              level up your life one habit at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-10 py-4 font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey 🚀
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
                className="border-2 border-white text-indigo-600 hover:bg-white hover:text-indigo-600 text-lg px-10 py-4 font-semibold transition-all duration-300"
              >
                I Already Have an Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-xl bg-white/90 backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Why Choose Ascend?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our platform combines proven psychology with modern technology to
            help you build lasting habits that transform your life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 bg-white relative overflow-hidden group"
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              <CardHeader className="text-center relative z-10">
                <div
                  className={`mx-auto mb-4 p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl w-fit shadow-lg`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-3xl shadow-2xl p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-300 to-purple-400 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-300 to-orange-400 opacity-10 rounded-full blur-2xl"></div>

          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Unlock Amazing Achievements
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Stay motivated with our comprehensive achievement system that
              rewards consistency and progress with beautiful badges and
              rewards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 transform"
              >
                <CardHeader className="pb-3">
                  <div className="text-5xl mb-4 animate-bounce">
                    {achievement.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {achievement.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Get started in just three simple steps and begin your habit
            transformation journey today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-3xl w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Target className="h-16 w-16 text-white" />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                1. Create Your Habits
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Define your daily, weekly, or monthly habits and categorize them
                for better organization and tracking.
              </p>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                2. Track Your Progress
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Mark habits as complete and watch your streaks grow while
                earning valuable points and building momentum.
              </p>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-8 rounded-3xl w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Award className="h-16 w-16 text-white" />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                3. Earn Rewards
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Unlock achievements, level up, and celebrate your consistency
                milestones with our gamified system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background gradient and decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,105,180,0.2),transparent)]"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-20 blur-xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Transform{" "}
              </span>
              Your Life?
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
              Join thousands of users who have already started building better
              habits with Ascend.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="group relative px-12 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden border-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                  Start Building Habits Today
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="px-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300"
              >
                <LogIn className="mr-3 h-6 w-6" />
                Sign In
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-300">Active Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">1M+</div>
                <div className="text-gray-300">Habits Tracked</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-300">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white py-16 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Ascend
                </span>
                <p className="text-sm text-gray-400 -mt-1">
                  Build Better Habits
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-gray-300 mb-2 font-medium">
                © 2025 Ascend. Build better habits, build a better life.
              </div>
              <div className="flex justify-center md:justify-end space-x-6 text-sm text-gray-400">
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Privacy
                </span>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Terms
                </span>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Support
                </span>
              </div>
            </div>
          </div>

          {/* Additional footer content */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h4 className="font-semibold text-white mb-3">
                  Transform Your Life
                </h4>
                <p className="text-gray-400 text-sm">
                  Join thousands building lasting habits with our proven system.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">
                  Track Progress
                </h4>
                <p className="text-gray-400 text-sm">
                  Visualize your journey with detailed analytics and insights.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Earn Rewards</h4>
                <p className="text-gray-400 text-sm">
                  Level up and unlock achievements as you build consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
