import os
import pandas as pd
from io import StringIO
from crewai import Agent, Task, Crew
from crewai.llm import LLM


os.environ["GEMINI_API_KEY"] = ".....gemini api key..."
days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
periods = [
    "09:00-09:45","09:45-10:30","10:30-10:45",
    "10:45-11:30","11:30-12:15","12:15-12:45",
    "12:45-13:30","13:30-14:15"
]
recess_slots = ["10:30-10:45","12:15-12:45"]

faculty_df = pd.read_csv("folder loc")
subject_df = pd.read_csv("folder loc")

selected_sem = "Sem1"
output_folder = r" folder loc "
os.makedirs(output_folder, exist_ok=True)
file_path = os.path.join(output_folder, f"ttb_{selected_sem}.csv")


gemini_llm = LLM(
    model="gemini/gemini-2.0-flash",
    api_key=os.getenv("GEMINI_API_KEY"),
    provider="gemini"
)


ingestor_agent = Agent(name="IngestorAgent", role="Data Ingestor", goal="Load faculty and subject CSVs", backstory="Responsible for reading CSV data.", llm=gemini_llm)
preprocessor_agent = Agent(name="PreprocessorAgent", role="Data Cleaner", goal="Validate faculty and subject mappings", backstory="Ensures no missing or invalid data exists.", llm=gemini_llm)
subject_assignment_agent = Agent(name="SubjectAssignmentAgent", role="Scheduler", goal="Assign subjects to periods respecting constraints", backstory="Creates a draft timetable without clashes.", llm=gemini_llm)
constraint_conflict_agent = Agent(name="ConstraintConflictAgent", role="Conflict Resolver", goal="Resolve faculty/classroom clashes", backstory="Ensures no overlapping assignments.", llm=gemini_llm)
monitor_agent = Agent(name="MonitorAgent", role="Final Verifier", goal="Verify timetable correctness", backstory="Ensures all slots, recesses, and constraints are valid.", llm=gemini_llm)
formatter_agent = Agent(name="FormatterAgent", role="Output Formatter", goal="Convert timetable into Time × Days table format", backstory="Prepares the final CSV exactly in your desired format.", llm=gemini_llm)


task_ingest = Task(description=f"Load CSV data. Faculty: {faculty_df.to_dict(orient='records')}, Subjects: {subject_df.to_dict(orient='records')}, Days: {days}, Periods: {periods}, Recess Slots: {recess_slots}", expected_output="Structured dataset for timetable generation", agent=ingestor_agent)
task_preprocess = Task(description="Clean and validate data. Ensure every subject has faculty and classroom.", expected_output="Validated data ready for scheduling", agent=preprocessor_agent)
task_assign = Task(description=f"Assign subjects into timetable slots. Recess slots: {recess_slots}. Avoid faculty/classroom clashes. Output draft CSV text.", expected_output="Draft timetable CSV", agent=subject_assignment_agent)
task_conflict = Task(description="Resolve any faculty/classroom conflicts from draft timetable.", expected_output="Conflict-free timetable CSV", agent=constraint_conflict_agent)
task_monitor = Task(description="Verify final timetable for recess slots, faculty overlaps, classroom double-bookings.", expected_output="Verified timetable CSV", agent=monitor_agent)

task_formatter = Task(
    description="""
Convert the timetable CSV into Time × Days table format. 
Requirements:
- Columns: Time, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
- Rows: 09:00-09:45, 09:45-10:30, 10:30-10:45, 10:45-11:30, 11:30-12:15, 12:15-12:45, 12:45-13:30, 13:30-14:15
- Each cell: <Subject Name> - <Faculty Name> - Room <Classroom No>
- If it is recess: write 'Recess'
- **Do not repeat the same subject in the same period across a row**
- Ensure the timetable is clean and readable
Output: final CSV text ready for saving
""",
    expected_output="Formatted, non-repetitive timetable CSV text ready for saving",
    agent=formatter_agent
)


crew = Crew(
    agents=[ingestor_agent, preprocessor_agent, subject_assignment_agent, constraint_conflict_agent, monitor_agent, formatter_agent],
    tasks=[task_ingest, task_preprocess, task_assign, task_conflict, task_monitor, task_formatter],
    verbose=True
)


timetable_prompt = """
Generate a timetable in CSV format with the following exact structure:

Columns:
Time,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday

Rows (must be exactly these time slots):
09:00-09:45
09:45-10:30
10:30-10:45
10:45-11:30
11:30-12:15
12:15-12:45
12:45-13:30
13:30-14:15

Each cell value format:
<Subject Name> - <Faculty Name> - Room <Classroom No>
Or 'Recess' if it is break time.
⚡ IMPORTANT: Shuffle the subjects and rooms across the days and periods to avoid repetition patterns, but keep 'Recess' in its original slots.
"""



result = crew.kickoff(inputs={"instruction": timetable_prompt})


if hasattr(result, "tasks_output") and len(result.tasks_output) > 0:
    csv_text = result.tasks_output[-1].raw
    
    csv_text = csv_text.replace("```csv", "").replace("```", "").strip()
else:
    csv_text = str(result)


df_final = pd.read_csv(StringIO(csv_text))


os.makedirs(output_folder, exist_ok=True)


df_final.to_csv(file_path, index=False)

print(f"✅ Timetable saved for {selected_sem} → {file_path}")