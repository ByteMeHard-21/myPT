# 🏋️ myPT – AI Personal Fitness Coach

> **Your Personal AI Trainer**
> An AI-powered mobile fitness application that delivers personalized workout plans, intelligent coaching, and progress tracking to help users train with confidence.

---

# Overview

myPT is an AI-powered fitness coaching application built to solve one of the biggest challenges faced by beginner and intermediate gym-goers:

> **"I know I should work out, but I don't know what to do in the gym."**

Most people entering the gym struggle with questions like:

* Which exercises should I perform?
* How many sets and reps should I do?
* Is my workout suitable for my goal?
* What should I do after finishing today's workout?
* How do I consistently make progress?

Existing fitness applications either overwhelm users with thousands of exercises or require expensive personal trainers.

myPT bridges this gap by acting as a personalized AI fitness coach that generates customized workout plans, guides users during workouts, answers fitness-related questions, and tracks long-term progress.

---

# Problem Statement

Millions of people abandon their fitness journey because they lack structured guidance.

Common problems include:

* No personalized workout routine
* Information overload from YouTube and social media
* Poor workout consistency
* Incorrect exercise selection
* Difficulty tracking progress
* Expensive personal training services
* Lack of motivation due to slow progress

The result is confusion, inconsistency, and eventually quitting.

---

# Solution

myPT provides an intelligent AI-powered fitness companion that simplifies the entire workout experience.

Instead of manually creating workout plans, users simply complete their profile, and the application generates a personalized routine based on:

* Fitness Goal
* Experience Level
* Workout Frequency
* Preferred Workout Split
* Available Equipment

The application then guides the user throughout the workout while continuously tracking their progress.

---

# Key Features

## 🤖 AI Workout Generation

* Personalized workout plans
* Goal-specific exercise selection
* Beginner and intermediate friendly
* Dynamic workout scheduling
* Progressive training structure

---

## 💪 Guided Workout Experience

Users receive a complete workout session including:

* Exercise demonstrations
* Sets & reps
* Rest timer
* Exercise instructions
* Exercise swapping
* Workout completion tracking

The application acts like a virtual personal trainer throughout the workout.

---

## 🧠 AI Fitness Coach

An integrated AI assistant allows users to ask fitness-related questions such as:

* How do I perform this exercise?
* Which muscles does this target?
* Can I replace this exercise?
* Why am I doing this movement?
* How can I improve my performance?

This provides real-time guidance without leaving the application.

---

## 📊 Progress Analytics

Users can monitor their fitness journey through:

* Workout history
* Training consistency
* Workout statistics
* Personal records
* Performance insights

---

## 👤 Personalized Experience

Each workout plan is customized using:

* Age
* Height
* Weight
* Gender
* Fitness Goal
* Experience Level
* Weekly Workout Days
* Preferred Workout Split

No two users receive identical workout plans.

---

# User Flow

```text
Splash Screen
      │
      ▼
Onboarding
      │
      ▼
Authentication
      │
      ▼
Profile Completion
      │
      ▼
AI Workout Generation
      │
      ▼
Home Dashboard
      │
      ▼
Workout Session
      │
      ▼
Workout Summary
      │
      ▼
Progress Tracking
```

---

# Technical Architecture

```text
                React Native (Expo)
                       │
                       │
                Expo Router
                       │
      ┌────────────────┴────────────────┐
      │                                 │
 Zustand State                 TanStack Query
      │                                 │
      └────────────────┬────────────────┘
                       │
                Express.js API
                       │
                Prisma ORM
                       │
                PostgreSQL
                  (Supabase)
                       │
        Authentication + Database
                       │
              AI Integration Layer
         (Google Gemini / OpenAI)
```

---

# Technology Stack

## Mobile

* React Native
* Expo
* TypeScript

## Frontend

* NativeWind
* Tailwind CSS
* Expo Router

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL
* Supabase

## ORM

* Prisma

## State Management

* Zustand
* TanStack Query

## Authentication

* Supabase Authentication

## AI

* Google Gemini
* OpenAI APIs

## Other Tools

* Firebase
* Postman
* Git
* GitHub

---

# Database Design

The application follows a normalized relational database design.

Major entities include:

* Users
* Profiles
* Exercises
* Workout Templates
* User Workout Plans
* Workout Sessions
* Exercise Logs
* Personal Records
* Weekly Reports
* AI Chat History

The schema supports scalable workout generation, session tracking, analytics, and AI interactions while maintaining data consistency through foreign key relationships.

---

# Engineering Highlights

The project focuses on building a production-ready application rather than just a prototype.

Key engineering decisions include:

* Feature-first project architecture
* Clean separation of frontend and backend
* Type-safe APIs
* Modular component design
* Efficient state management
* Optimized database schema
* Reusable UI components
* AI integration with minimal API usage
* Persistent authentication
* Scalable backend architecture
* Responsive mobile-first design

---

# Challenges Solved

During development, several real-world engineering challenges were addressed:

* Designing a scalable relational database schema
* Building dynamic workout generation logic
* Managing workout session persistence
* Maintaining referential integrity across workout data
* Reducing unnecessary AI API calls
* Optimizing Supabase queries
* Implementing secure authentication
* Creating reusable UI components
* Handling complex workout state transitions

---

# Future Improvements

Planned enhancements include:

* AI-powered exercise form analysis
* Nutrition recommendation engine
* Wearable device integration
* Smart workout adaptations
* Offline workout support
* Push notifications
* Social workout sharing
* Advanced analytics dashboard
* Voice-based AI coaching
* Premium subscription features

---

# Project Goals

The primary goal of myPT is to make professional fitness guidance accessible to everyone.

Rather than replacing personal trainers, myPT serves as an intelligent training companion that helps users:

* Train with confidence
* Stay consistent
* Learn proper exercise techniques
* Build sustainable fitness habits
* Achieve long-term fitness goals

---
