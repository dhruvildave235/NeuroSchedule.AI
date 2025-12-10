# NeuroSchedule AI

![NeuroSchedule Hero](https://picsum.photos/1200/400)

> **NeuroSchedule AI** — a futuristic, agent-driven timetable generator built with **Crew AI**.  
> No database required. Pure agent orchestration powering smart schedule creation, validation, balancing, and notifications.

---

## 🚀 Project Summary

NeuroSchedule AI is an intelligent timetable generation system that uses **5 specialized agents** (no DB) to produce conflict-free, optimized timetables for colleges or training programs. It focuses on fast generation, human-friendly output, and extensibility — all coordinated by **Crew AI**.

**Why this repo?**
- Zero-database architecture (store ephemeral state in Crew workflows)
- Agent-based modular design for easy testing & replacement
- Designed for classroom constraints (teachers, rooms, subjects, time slots)
- Beautiful export-ready output (PDF / CSV) and notification hooks

---

## ✨ Features

- Agent architecture (5 dedicated agents)
- Constraint-aware scheduling (no clashes for teacher, room, class)
- Load-balancing across weeks/days/periods
- Conflict resolution with human-friendly suggestions
- Export to CSV / PDF, and send-ready notification payloads
- Extensible: add/remove agents or rules easily

---

## 🧠 The 5 Agents (what they do)

1. **Planner Agent**
   - Input: course list, faculty, rooms, time slots (provided as JSON / in-memory)
   - Output: initial draft schedule using greedy + heuristic rules
   - Role: create an initial workable timetable

2. **Conflict Resolver Agent**
   - Input: draft schedule
   - Output: fixed schedule with resolved teacher/room clashes
   - Role: detect clashes and reassign slots using local search/backtracking

3. **Load Balancer Agent**
   - Input: conflict-free schedule
   - Output: balanced timetable ensuring fair distribution of lectures and breaks
   - Role: minimize back-to-back overloads and ensure fair teacher distribution

4. **Validator Agent**
   - Input: balanced timetable
   - Output: final validated timetable + human-readable report of applied changes and edge-cases
   - Role: enforce hard constraints and produce a summary for review

5. **Exporter & Notifier Agent**
   - Input: validated timetable
   - Output: CSV/PDF exports and notification payload (e.g., webhook or email-ready JSON)
   - Role: produce deliverables and notify downstream systems

---

## 🧩 Architecture (high-level)

User Input (JSON) --> Crew AI Workflow ---> [Planner] -> [Conflict Resolver] -> [Load Balancer] -> [Validator] -> [Exporter & Notifier]

- All state is passed through Crew AI tasks (no DB).
- Agents are modular microservices (or functions) that Crew orchestrates.

---

## 🛠️ Quick Start (copy & run)

> These commands assume you have `python` and `crew` (Crew AI CLI/runtime) installed. Replace with your exact crew commands if different.

1. Clone repo
```bash
git clone https://github.com/<your-username>/NeuroScheduleAI.git
cd NeuroScheduleAI
``` 
2.Create virtualenv & install (example)
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
3.Sample input file (samples/input.json)
```bash
{
  "classes": [
    {"id": "CSE-1", "subjects": ["Math", "DSA", "OS"]},
    {"id": "CSE-2", "subjects": ["Math", "DBMS", "AI"]}
  ],
  "teachers": [
    {"id": "T1", "name": "Dr. A", "canTeach": ["Math"]},
    {"id": "T2", "name": "Prof. B", "canTeach": ["DSA", "AI"]}
  ],
  "rooms": ["R1", "R2"],
  "timeSlots": ["Mon-9", "Mon-11", "Mon-2", "Tue-9", "Tue-11"]
}
```
4.Run Crew workflow (example)
```bash
 start crew runtime / orchestrator
crew start workflow  --input samples/input.json
```
🔧 Implementation notes

No database — all intermediate state lives inside Crew AI task contexts

Rules engine — a small rule engine (YAML-driven) defines hard constraints (teacher clashes, unavailable slots) and soft constraints (balanced load)

Extensible agents — each agent is isolated; swap Planner with a genetic-algorithm-based planner if desired

Testing — include unit tests for each agent (sample input → expected outputs)

# ✍️ Created By

Created by Dhruvil Dave
Built with ❤️, logic, and neural precision.  
