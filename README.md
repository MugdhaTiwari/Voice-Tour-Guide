# NEARO — Know What's Near

> Your Voice. Your Journey. Your Guide.

A voice-first AI tour companion for context-aware exploration.

NEARO helps visitors explore unfamiliar places through natural voice conversations instead of constantly stopping to search, browse maps, read results, and switch between applications.

---

## 🚀 Overview

Exploring an unfamiliar destination often requires a fragmented workflow:

**Search → Browse → Read → Continue**

The traveler has to repeatedly stop what they are doing, type queries, compare results, read information, and switch between applications.

NEARO changes this interaction into:

**Ask → Understand → Listen → Explore**

The user can speak naturally, receive a spoken response, ask follow-up questions, and continue exploring without constantly interacting with a screen.

NEARO is designed as a voice-first experience rather than a traditional text chatbot with a microphone attached.

---

## 🎯 Problem

### How can we make exploring an unfamiliar destination as easy as having a smart local guide by your side?

Travelers frequently need answers to questions such as:

- What can I explore nearby?
- Which place should I visit?
- What is suitable if I only have one hour?
- Is there somewhere quieter?
- What else can I see nearby?
- Can you recommend something based on my preferences?

Traditional search interfaces require users to stop, type, browse, read, and repeat.

NEARO aims to make these interactions conversational.

---

# 💡 Solution

NEARO is a voice-first AI tour companion that allows visitors to:

- Ask questions naturally using voice
- Discover nearby places
- Receive spoken answers
- Ask contextual follow-up questions
- Explore recommendations conversationally
- Use relevant context when generating subsequent recommendations
- Interact without continuously switching between applications

The goal is to keep the traveler immersed in the environment rather than forcing them to focus on a screen.

---

# 🎤 Why Voice?

Voice is not an optional interface layer in NEARO.

It is central to the product experience.

A traveler exploring a destination may not want to:

1. Stop walking
2. Unlock their phone
3. Open a map
4. Type a query
5. Read several results
6. Return to the activity

Instead, they can simply ask NEARO.

For example:

> "What are some interesting places near me?"

Then:

> "Which one would be better if I only have an hour?"

Then:

> "Actually, I'd prefer somewhere quieter."

This creates a continuous conversational experience.

---

# 🧠 Context-Aware Exploration

NEARO is designed to maintain relevant conversational context.

For example:

**User:**
> "I want somewhere quiet."

**NEARO:**
> Recommends a suitable location.

**User:**
> "What else is nearby?"

NEARO can use the relevant previous context when determining what recommendation should be retrieved.

This allows follow-up questions to feel like part of the same conversation rather than independent searches.

---

# 🔎 Qdrant

Qdrant is used as part of NEARO's meaningful retrieval and context-processing pipeline.

Rather than treating every request as an isolated keyword search, the retrieval layer can use semantic similarity and relevant contextual information to identify useful results.

Qdrant can support information such as:

- Place descriptions
- Categories
- Location information
- Relevant contextual information
- User preferences where appropriate
- Retrieval metadata

The retrieval process can combine semantic relevance with available metadata and location constraints.

### Example

User:

> "I want somewhere peaceful to visit."

A purely keyword-based system may depend on the exact word "peaceful".

A semantic retrieval system can instead identify locations whose descriptions and characteristics are conceptually relevant to the request.

Qdrant therefore has a functional role in NEARO's recommendation and contextual retrieval pipeline rather than being included only as a technology requirement.

---

# 🔊 Rime

Rime is used for voice generation.

Rime is an essential part of NEARO's core interaction because the application is designed around spoken responses.

The general flow is:

```text
User speaks
     ↓
Speech recognition
     ↓
Intent + context processing
     ↓
Relevant retrieval
     ↓
AI response generation
     ↓
Rime voice generation
     ↓
Spoken response
