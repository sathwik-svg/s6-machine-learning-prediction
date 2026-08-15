# S6 Machine Learning Prediction Platform

> Production-oriented machine learning prediction platform built with React, Cloudflare Workers, and real-time ML inference.

🌐 **Live Application:** https://s6-machine-learning-prediction.ganjisathwik73.workers.dev/

📦 **Repository:** https://github.com/sathwik-svg/s6-machine-learning-prediction

---

## Overview

S6 Machine Learning Prediction is a cloud-native machine learning application designed to demonstrate how predictive intelligence can be exposed through a modern web platform.

The application provides an interactive employee profile interface and evaluates employee attrition risk through a machine-learning inference service.

The project focuses on practical software engineering principles including:

- Machine learning inference
- REST API design
- Cloud-native architecture
- Serverless deployment
- Modern frontend engineering
- Input validation
- Production deployment
- Git-based CI/CD
- Responsive user experience

---

## Live Demo

### 🚀 Production Application

https://s6-machine-learning-prediction.ganjisathwik73.workers.dev/

The application provides an interactive prediction dashboard where users can enter employee characteristics and receive an estimated attrition-risk prediction.

---

## Architecture

```text
                         GitHub
                           │
                           │
                           ▼
                  Cloudflare Workers
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       React Frontend              Prediction API
             │                           │
             │                           ▼
             │                    ML Inference Engine
             │                           │
             └───────────────┬───────────┘
                             │
                             ▼
                     Risk Prediction
