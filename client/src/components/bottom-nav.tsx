import { Link, useLocation } from "wouter";
import { Shirt, Palette, Settings, Sparkles } from "lucide-react";

const navItems = [
  { path: "/", icon: Shirt, label: "Templates", testId: "nav-templates" },
  { path: "/customize", icon: Sparkles, label: "Customize", testId: "nav-customize" },
  { path: "/palettes", icon: Palette, label: "Palettes", testId: "nav-palettes" },
  { path: "/settings", icon: Settings, label: "Settings", testId: "nav-settings" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <button
                data-testid={item.testId}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] gap-1 rounded-lg transition-colors hover-elevate ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon
                  className="w-6 h-6"
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 0 : 2}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
