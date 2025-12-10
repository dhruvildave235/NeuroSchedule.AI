from crewai import Task, Crew
from agents import preprocessor, subject_agent, constraint_modeler, conflict_resolver, monitor, ingestor
import pandas as pd

import os
import random

task1 = Task(
    description="Read input CSVs",
    expected_output="Structured summary ready",
    agent=preprocessor
)
task2 = Task(
    description="Apply constraints",
    expected_output="Draft timetable assigned",
    agent=constraint_modeler
)
task3 = Task(
    description="Resolve conflicts",
    expected_output="Conflict-free timetable",
    agent=conflict_resolver
)
task4 = Task(
    description="Validate timetable",
    expected_output="Timetable validated",
    agent=monitor
)
task5 = Task(
    description="Export CSV",
    expected_output="Final timetable CSV created",
    agent=ingestor
)
task6 = Task(
    description="Assign subjects to periods",
    expected_output="Timetable with subjects/faculty/classroom",
    agent=subject_agent
)

crew = Crew(
    agents=[preprocessor, subject_agent, constraint_modeler, conflict_resolver, monitor, ingestor],
    tasks=[task1, task6, task2, task3, task4, task5], 
    verbose=True
)


crew_result = crew.kickoff()
print("\n✅ Crew Finished Execution\n")
csv_data = str(crew_result)
csv_data = csv_data.replace("```csv", "").replace("```", "").strip()
subjects_df = pd.read_csv(r"folder loc",usecols=["SubjectID", "Name", "Semester", "Classroom"])
faculty_df = pd.read_csv(r"folder loc", usecols=["FacultyID", "Name", "SubjectID"])

selected_sem = "sem1"  
selected_sem_num = int(selected_sem.replace("sem", ""))  
subjects_in_sem = subjects_df[subjects_df["Semester"] == selected_sem_num]

if subjects_in_sem.empty:
    print(f"❌ No subjects found for Semester {selected_sem_num}")
    exit()
subject_ids = subjects_in_sem["SubjectID"].tolist()
subject_names = subjects_in_sem.set_index('SubjectID')["Name"].to_dict()
classroom_map = subjects_in_sem.set_index('SubjectID')["Classroom"].to_dict()
faculty_map = faculty_df.set_index('SubjectID')["Name"].to_dict()


days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
periods = [
    "09:00-09:45","09:45-10:30","10:30-10:45",
    "10:45-11:30","11:30-12:15","12:15-12:45",
    "12:45-13:30","13:30-14:15"
]
recess_slots = ["10:30-10:45","12:15-12:45"]

final_rows = []



daily_subject_map = {}
for day in days:
    day_subjects = subject_ids.copy()
    random.shuffle(day_subjects)
    daily_subject_map[day] = day_subjects.copy()  

for slot in periods:
    row = {"Time": slot}
    if slot in recess_slots:
        for day in days:
            row[day] = "Recess"
    else:
        for day in days:
            
            if daily_subject_map[day]:
                sid = daily_subject_map[day].pop(0)
                row[day] = f"{subject_names[sid]} - {faculty_map[sid]} - Room {classroom_map[sid]}"
            else:
                row[day] = "Free"  
    final_rows.append(row)
df_final = pd.DataFrame(final_rows)
output_folder = r"folder loc"
os.makedirs(output_folder, exist_ok=True)
file_path = os.path.join(output_folder, f"ttb_{selected_sem}.csv") 

df_final.to_csv(file_path, index=False)

print(f"✅ Timetable generated for {selected_sem} → {output_folder}")




