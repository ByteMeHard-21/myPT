# 🏋️ myPT -- AI Personal Fitness Coach

> **Your Personal AI Trainer**\
> An AI-powered mobile fitness application that delivers personalized
> workout plans, intelligent coaching, and progress tracking to help
> users train with confidence.

## Overview

myPT is an AI-powered fitness coaching application built to solve one of
the biggest challenges faced by beginner and intermediate gym-goers:

> **"I know I should work out, but I don't know what to do in the
> gym."**

Most people entering the gym struggle with questions like:

-   Which exercises should I perform?
-   How many sets and reps should I do?
-   Is my workout suitable for my goal?
-   What should I do after finishing today's workout?
-   How do I consistently make progress?

Existing fitness applications either overwhelm users with thousands of
exercises or require expensive personal trainers.

myPT bridges this gap by acting as a personalized AI fitness coach that
generates customized workout plans, guides users during workouts,
answers fitness-related questions, and tracks long-term progress.

## Problem Statement

Millions of people abandon their fitness journey because they lack
structured guidance.

Common problems include: - No personalized workout routine - Information
overload from YouTube and social media - Poor workout consistency -
Incorrect exercise selection - Difficulty tracking progress - Expensive
personal training services - Lack of motivation due to slow progress

## Solution

myPT generates personalized workout plans based on each user's profile
(goal, experience, workout frequency, preferred split, etc.), guides
them through every workout session, provides an AI coach for fitness
questions, and tracks long-term progress.

## Key Features

-   🤖 AI-powered personalized workout generation
-   💪 Guided workout sessions with sets, reps, rest timer, and exercise
    swapping
-   🧠 AI fitness coach for real-time assistance
-   📊 Workout history, analytics, and personal records
-   👤 Personalized onboarding and profile-based recommendations

## User Flow

``` text
Splash → Onboarding → Authentication → Profile Setup → AI Workout Generation → Home → Workout Session → Workout Summary → Progress Tracking
```

## Tech Stack

### Mobile

-   React Native
-   Expo
-   TypeScript

### Frontend

-   Expo Router
-   NativeWind
-   Tailwind CSS

### Backend

-   Node.js
-   Express.js

### Database

-   PostgreSQL (Supabase)
-   Prisma ORM

### State Management

-   Zustand
-   TanStack Query

### Authentication

-   Supabase Authentication

### AI

-   Google Gemini
-   OpenAI

## Engineering Highlights

-   Feature-first architecture
-   Type-safe APIs
-   Modular reusable components
-   Optimized relational database schema
-   Efficient state management
-   Persistent authentication
-   AI integration with minimized API usage

## Future Improvements

-   AI exercise form analysis
-   Nutrition planning
-   Wearable integration
-   Offline support
-   Push notifications
-   Voice AI coach
-   Advanced analytics

## Installation

``` bash
git clone https://github.com/yourusername/myPT.git
cd myPT
npm install
npx expo start
```

## Environment Variables

``` env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

## License

This project is intended for educational and portfolio purposes.

## Author

**Developed by:** Your Name

If you found this project interesting, please consider ⭐ starring the
repository.
