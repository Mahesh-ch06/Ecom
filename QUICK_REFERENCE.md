# 🚀 Quick Reference Guide - CRED Style Components

## 🎨 Essential Classes

### Glassmorphism
```tsx
<div className="glass-effect">
  // Frosted glass effect with blur
</div>
```

### Gradients
```tsx
// Background gradient
<div className="bg-gradient-to-r from-emerald-500 to-emerald-600">

// Text gradient
<h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">

// Border gradient (use gradient-border class)
<div className="gradient-border">
```

### Animations
```tsx
// Entrance animations
<div className="animate-fade-in">     // Fade + slide up
<div className="animate-slide-in">    // Slide from right
<div className="animate-scale-in">    // Scale + fade

// Continuous animations
<div className="animate-pulse">       // Pulsing effect
<div className="animate-spin">        // Spinning
<div className="shimmer">             // Shimmer sweep
```

### Effects
```tsx
// Glow on hover
<button className="glow-hover">

// Static glow
<div className="glow">

// Hover scale
<button className="hover:scale-105 transition-transform duration-300">
```

## 🎯 Common Patterns

### Button - Primary
```tsx
<button
  className={cn(
    "px-5 py-2.5 rounded-xl font-medium text-white",
    "bg-gradient-to-r from-emerald-500 to-emerald-600",
    "hover:from-emerald-600 hover:to-emerald-700",
    "transition-all duration-300 hover:scale-105",
    "shadow-lg shadow-emerald-500/30"
  )}
>
  Click Me
</button>
```

### Button - Secondary
```tsx
<button
  className={cn(
    "px-5 py-2.5 rounded-xl font-medium",
    "bg-white/5 hover:bg-white/10",
    "border border-white/10",
    "backdrop-blur-sm hover:scale-105",
    "transition-all duration-300"
  )}
>
  Secondary
</button>
```

### Card
```tsx
<div
  className={cn(
    "rounded-2xl p-6",
    "bg-gradient-to-br from-white/[0.07] to-white/[0.03]",
    "border border-white/10 backdrop-blur-sm",
    "hover:border-emerald-500/30",
    "transition-all duration-300 hover:scale-[1.02]"
  )}
>
  Content here
</div>
```

### Input Field
```tsx
<input
  className={cn(
    "w-full px-4 py-3 rounded-xl",
    "bg-white/5 border border-white/10",
    "text-white placeholder:text-gray-500",
    "focus:outline-none focus:ring-2",
    "focus:ring-emerald-500/50",
    "transition-all duration-300"
  )}
  placeholder="Enter text..."
/>
```

### Modal Backdrop
```tsx
<>
  {/* Backdrop */}
  <div 
    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
    onClick={onClose}
  />
  
  {/* Modal */}
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div className="glass-effect rounded-2xl p-6 border border-white/10 animate-scale-in">
      Modal content
    </div>
  </div>
</>
```

### Badge
```tsx
<span
  className={cn(
    "px-3 py-1.5 rounded-full text-sm font-medium",
    "bg-emerald-500/10 text-emerald-400",
    "border border-emerald-500/30"
  )}
>
  Active
</span>
```

### Loading Spinner
```tsx
<div className="relative">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
</div>
```

## 🎨 Color Reference

### Backgrounds
```tsx
// Main background
className="bg-[#0a0a0a]"

// Surface
className="bg-[#171717]"

// Card
className="bg-white/5"  // 5% white overlay
```

### Text
```tsx
// Primary text
className="text-white"

// Secondary text
className="text-gray-400"

// Muted text
className="text-gray-500"
```

### Borders
```tsx
// Subtle
className="border-white/10"

// Visible
className="border-white/20"

// Accent
className="border-emerald-500/30"
```

## 🔧 Utility Functions

### cn() - className merger
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  condition && "conditional-class",
  another && "another-class"
)}>
```

## 📐 Spacing Scale

```tsx
// Padding
p-4    // 1rem (16px)
p-5    // 1.25rem (20px)
p-6    // 1.5rem (24px)
p-8    // 2rem (32px)

// Gap
gap-2  // 0.5rem (8px)
gap-3  // 0.75rem (12px)
gap-4  // 1rem (16px)
gap-6  // 1.5rem (24px)
```

## 🎭 Border Radius

```tsx
rounded-lg    // 0.5rem (8px)
rounded-xl    // 0.75rem (12px)
rounded-2xl   // 1rem (16px)
rounded-full  // Full circle
```

## ⚡ Animation Timings

```tsx
// Fast (hover states)
duration-200  // 200ms

// Medium (default)
duration-300  // 300ms

// Slow (entrance)
duration-500  // 500ms
```

## 🎯 Hover Effects Combos

### Scale + Glow
```tsx
className="hover:scale-105 transition-all duration-300 glow-hover"
```

### Scale + Background
```tsx
className="hover:scale-105 hover:bg-white/10 transition-all duration-300"
```

### Color Shift
```tsx
className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
```

## 📱 Responsive Design

```tsx
// Mobile first
className="text-sm sm:text-base md:text-lg lg:text-xl"

// Columns
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Visibility
className="hidden sm:inline"  // Hide on mobile
```

## 🎨 Gradient Combinations

### Emerald to Blue
```tsx
className="bg-gradient-to-r from-emerald-500 to-blue-500"
```

### Radial gradient
```tsx
className="bg-gradient-radial from-emerald-500/20 to-transparent"
```

### Text gradient
```tsx
className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent"
```

## 💡 Pro Tips

1. **Always use `cn()` for conditional classes**
   ```tsx
   className={cn("base", isActive && "active")}
   ```

2. **Combine animations for smooth effects**
   ```tsx
   className="hover:scale-105 hover:shadow-emerald-500/50 transition-all duration-300"
   ```

3. **Use backdrop-blur with opacity**
   ```tsx
   className="bg-black/70 backdrop-blur-sm"
   ```

4. **Add delays for staggered animations**
   ```tsx
   style={{ animationDelay: `${index * 50}ms` }}
   ```

5. **Layer glows for depth**
   ```tsx
   <div className="relative">
     <div className="content" />
     <div className="absolute inset-0 bg-emerald-500/20 blur-xl" />
   </div>
   ```

## 🚀 Quick Component Templates

### Card with hover effect
```tsx
<div className={cn(
  "glass-effect rounded-2xl p-6",
  "border border-white/10",
  "hover:border-emerald-500/30",
  "transition-all duration-300",
  "hover:scale-[1.02] hover:shadow-emerald-500/10"
)}>
  {content}
</div>
```

### Action button
```tsx
<button className={cn(
  "px-5 py-2.5 rounded-xl font-medium",
  "bg-gradient-to-r from-emerald-500 to-emerald-600",
  "hover:from-emerald-600 hover:to-emerald-700",
  "transition-all duration-300 hover:scale-105",
  "shadow-lg shadow-emerald-500/30 text-white"
)}>
  {label}
</button>
```

### Status badge
```tsx
<span className={cn(
  "px-3 py-1.5 rounded-full text-sm font-medium",
  "bg-emerald-500/10 text-emerald-400",
  "border border-emerald-500/30"
)}>
  {status}
</span>
```

---

**Keep this guide handy for quick reference when building new components!** 🚀
