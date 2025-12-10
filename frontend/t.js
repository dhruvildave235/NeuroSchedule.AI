 
    // Curriculum Data
    const curriculum = {
      bed: {
        years: {
          1: { 
            compulsory: {
              "Child Development and Learning": 4,
              "Contemporary India and Education": 3,
              "Language across the Curriculum": 3,
              "Foundations of Education (Philosophical, Sociological, Psychological)": 4,
              "Basic ICT Skills for Educators": 2,
              "Understanding the Self": 2
            }, 
            electives: {} 
          },
          2: { 
            compulsory: {
              "Assessment for Learning": 3,
              "Learning and Teaching": 4,
              "Inclusive Education": 3,
              "Gender, School and Society": 2
            },
            electives: {
              "Pedagogy of English": 3,
              "Pedagogy of Mathematics": 3,
              "Pedagogy of Science": 3,
              "Pedagogy of Social Science": 3,
              "Pedagogy of Regional Language": 3
            } 
          },
          3: { 
            compulsory: {
              "Curriculum and Knowledge": 3,
              "Educational Technology": 3,
              "Guidance and Counseling": 3,
              "Environmental Education": 2,
              "Peace Education": 2,
              "Vocational Education": 2,
              "Special Education (Introduction)": 3
            }, 
            electives: {} 
          },
          4: { 
            compulsory: {
              "Educational Administration and Management": 3,
              "Teacher Education": 3,
              "Research in Education": 4,
              "Current Trends in Education": 2,
              "Dissertation/Project Work": 6,
              "School Internship (Long Term)": 4
            }, 
            electives: {} 
          }
        }
      },
      med: {
        years: {
          1: { 
            compulsory: {
              "Philosophical Foundations of Education": 3,
              "Sociological Foundations of Education": 3,
              "Psychological Foundations of Education": 3,
              "Research Methodology in Education": 4,
              "Curriculum Studies": 3,
              "Educational Technology and ICT": 3,
              "Advanced Educational Psychology": 3
            },
            electives: {
              "Comparative Education": 3,
              "Educational Measurement and Evaluation": 3,
              "Teacher Education": 3,
              "Special Education": 3,
              "Environmental Education": 2,
              "Value Education": 2,
              "Educational Policy and Planning": 3
            } 
          },
          2: { 
            compulsory: {
              "Advanced Research Methods": 4,
              "Statistical Analysis in Education": 4,
              "Dissertation Work": 6,
              "Seminar Presentations": 2,
              "Field Work / Internship": 4
            },
            electives: {
              "Track A: Educational Technology": {
                "E-Learning and Digital Pedagogy": 3,
                "Instructional Design": 3,
                "Multimedia in Education": 3,
                "Technology Management in Education": 3
              },
              "Track B: Guidance & Counseling": {
                "Theories of Counseling": 3,
                "Career Guidance": 3,
                "Mental Health in Educational Settings": 3,
                "Crisis Intervention": 3
              },
              "Track C: Educational Leadership": {
                "Educational Administration": 3,
                "Human Resource Management in Education": 3,
                "Educational Finance": 3,
                "Quality Management in Education": 3
              },
              "Track D: Special Education": {
                "Assessment in Special Education": 3,
                "Curriculum Adaptation": 3,
                "Inclusive Teaching Strategies": 3,
                "Assistive Technologies": 3
              }
            } 
          }
        }
      }
    };

    // DOM Elements
    const programEl = document.getElementById('program');
    const yearEl = document.getElementById('year');
    const compulsoryListEl = document.getElementById('compulsoryList');
    const electiveOptionsEl = document.getElementById('electiveOptions');
    const creditDisplayEl = document.getElementById('creditDisplay');
    const form = document.getElementById('studentForm');

    // Program Change Handler
    programEl.addEventListener('change', () => {
      const prog = programEl.value;
      yearEl.innerHTML = '<option value="">--Select Year--</option>';
      compulsoryListEl.innerHTML = '';
      electiveOptionsEl.innerHTML = '';
      creditDisplayEl.value = '0';
      yearEl.disabled = !prog;
      
      if (!prog) return;
      
      Object.keys(curriculum[prog].years).forEach(y => {
        const opt = document.createElement('option'); 
        opt.value = y; 
        opt.textContent = 'Year ' + y;
        yearEl.appendChild(opt);
      });
      
      // Add subtle visual feedback
      programEl.style.borderBottomColor = '#5d4037';
      programEl.style.fontWeight = 'bold';
      setTimeout(() => {
        programEl.style.borderBottomColor = '#8b4513';
        programEl.style.fontWeight = 'normal';
      }, 800);
    });

    // Year Change Handler
    yearEl.addEventListener('change', () => { 
      renderSubjects(); 
      computeCredits(); 
      
      // Visual feedback
      yearEl.style.borderBottomColor = '#5d4037';
      yearEl.style.fontWeight = 'bold';
      setTimeout(() => {
        yearEl.style.borderBottomColor = '#8b4513';
        yearEl.style.fontWeight = 'normal';
      }, 800);
    });

    // Render Subjects
    function renderSubjects() {
      const prog = programEl.value; 
      const year = yearEl.value;
      
      if (!prog || !year) return;
      
      const data = curriculum[prog].years[year];
      compulsoryListEl.innerHTML = ''; 
      electiveOptionsEl.innerHTML = '';

      // Compulsory Subjects
      const ul = document.createElement('ul'); 
      ul.style.paddingLeft = '0';
      
      for (const [sub, cred] of Object.entries(data.compulsory)) {
        const li = document.createElement('li'); 
        li.style.display = 'flex'; 
        li.style.justifyContent = 'space-between';
        li.innerHTML = `<span>${sub}</span><span class="credit-badge">${cred} credits</span>`;
        ul.appendChild(li);
      }
      
      compulsoryListEl.appendChild(ul);

      // Elective Subjects
      const electives = data.electives;
      
      if (!electives || Object.keys(electives).length === 0) {
        electiveOptionsEl.innerHTML = '<p class="muted">No electives for this year</p>'; 
        return; 
      }

      if (Object.values(electives).every(v => typeof v === 'number')) {
        // Simple electives
        for (const [sub, cred] of Object.entries(electives)) {
          const div = document.createElement('div'); 
          div.className = 'checkbox-section';
          const id = 'el_' + sub.replace(/\s+/g, '_');
          div.innerHTML = `
            <input type="checkbox" id="${id}" data-credit="${cred}">
            <label for="${id}">${sub}</label>
            <span class="credit-badge" style="margin-left:auto">${cred}</span>
          `;
          electiveOptionsEl.appendChild(div);
          div.querySelector('input').addEventListener('change', computeCredits);
        }
      } else {
        // Track-based electives
        for (const [track, trackItems] of Object.entries(electives)) {
          const h = document.createElement('div'); 
          h.style.fontWeight = '700'; 
          h.style.marginTop = '1rem'; 
          h.style.marginBottom = '0.5rem';
          h.style.color = '#8b4513';
          h.style.fontSize = '20px';
          h.style.borderBottom = '2px solid #d4b896';
          h.style.paddingBottom = '5px';
          h.style.fontFamily = '"IM Fell English", serif';
          h.textContent = track; 
          electiveOptionsEl.appendChild(h);
          
          for (const [sub, cred] of Object.entries(trackItems)) {
            const div = document.createElement('div'); 
            div.className = 'checkbox-section';
            const id = 'el_' + track.replace(/\s+/g, '_') + '_' + sub.replace(/\s+/g, '_');
            div.innerHTML = `
              <input type="checkbox" id="${id}" data-credit="${cred}">
              <label for="${id}">${sub}</label>
              <span class="credit-badge" style="margin-left:auto">${cred}</span>
            `;
            electiveOptionsEl.appendChild(div);
            div.querySelector('input').addEventListener('change', computeCredits);
          }
        }
      }
    }

    // Compute Credits
    function computeCredits() {
      const prog = programEl.value; 
      const year = yearEl.value;
      
      if (!prog || !year) {
        creditDisplayEl.value = '0'; 
        return;
      }
      
      const data = curriculum[prog].years[year];
      let total = Object.values(data.compulsory).reduce((a, b) => a + b, 0);
      
      document.querySelectorAll('#electiveOptions input[type="checkbox"]:checked').forEach(chk => {
        total += Number(chk.dataset.credit || 0);
      });
      
      creditDisplayEl.value = total;
      
      // Visual feedback for credit change
      creditDisplayEl.style.color = '#8b4513';
      creditDisplayEl.style.fontWeight = 'bold';
      setTimeout(() => {
        creditDisplayEl.style.color = '#3c2f2f';
        creditDisplayEl.style.fontWeight = 'normal';
      }, 800);
    }

    // Form Submission
    form.addEventListener('submit', async ev => {
      ev.preventDefault(); 
      
      if (!form.reportValidity()) return;

      const prog = programEl.value; 
      const year = yearEl.value;
      
      const student = {
        studentID: document.getElementById('studentID').value.trim(),
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        program: prog, 
        year: year,
        compulsorySubjects: prog && year ? Object.keys(curriculum[prog].years[year].compulsory) : [],
        electivesSelected: Array.from(document.querySelectorAll('#electiveOptions input[type="checkbox"]:checked')).map(chk => chk.nextElementSibling.textContent),
        totalCredits: Number(creditDisplayEl.value),
        timestamp: new Date().toISOString()
      };

      // Show loading indicator
      document.getElementById("loadingScreen").classList.add("active");
      
      // In a real implementation, this would send data to a server
      // For demo purposes, we'll simulate an API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        // Success simulation
        console.log('Student data saved:', student);
        
        // Show vintage-style success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #f5e9d7;
          border: 3px solid #8b4513;
          padding: 2rem;
          z-index: 10000;
          box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
          max-width: 500px;
          width: 90%;
          text-align: center;
          font-family: 'IM Fell English', serif;
        `;
        
        successDiv.innerHTML = `
          <h2 style="color: #8b4513; margin-bottom: 1rem; border-bottom: 2px solid #d4b896; padding-bottom: 0.5rem;">Data Submitted</h2>
          <p style="margin: 1rem 0; font-size: 18px;">Student: <strong>${student.fullName}</strong></p>
          <p style="margin: 1rem 0; font-size: 18px;">Program: <strong>${prog === 'bed' ? 'B.Ed.' : 'M.Ed.'} Year ${year}</strong></p>
          <p style="margin: 1rem 0; font-size: 18px;">Total Credits: <strong>${student.totalCredits}</strong></p>
          <hr style="border-color: #d4b896; margin: 1.5rem 0;">
          <p style="font-style: italic; color: #5d4037;">Data has been recorded in the registry.</p>
          <button onclick="this.parentElement.remove()" style="margin-top: 1.5rem; padding: 0.8rem 2rem; background: #8b4513; color: #f5e9d7; border: 2px solid #5d4037; cursor: pointer; font-family: 'Cinzel', serif;">Close</button>
        `;
        
        document.body.appendChild(successDiv);
        
        // Reset loading screen
        setTimeout(() => {
          document.getElementById("loadingScreen").classList.remove("active");
        }, 500);
        
      } catch(err) {
        document.getElementById("loadingScreen").classList.remove("active");
        
        // Vintage-style error message
        alert('An error occurred while submitting data. Please check your entries and try again.');
        console.error('Submission error:', err);
      }
    });

    // Timetable Generation
    function generateTimetable() {
      const prog = programEl.value;
      const year = yearEl.value;
      
      if (!prog || !year) {
        // Vintage-style alert
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #f5e9d7;
          border: 3px solid #8b4513;
          padding: 2rem;
          z-index: 10000;
          box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
          max-width: 400px;
          width: 80%;
          text-align: center;
          font-family: 'IM Fell English', serif;
        `;
        
        alertDiv.innerHTML = `
          <h3 style="color: #8b4513; margin-bottom: 1rem;">Attention Required</h3>
          <p style="margin: 1rem 0; font-size: 18px;">Please select a program and year first.</p>
          <button onclick="this.parentElement.remove()" style="margin-top: 1.5rem; width:65%; padding: 0.4rem 1.5rem; background: #8b4513; color: #f5e9d7; border: 2px solid #5d4037; cursor: pointer; font-family: 'Cinzel', serif;">Acknowledge</button>
        `;
        
        document.body.appendChild(alertDiv);
        return;
      }
      
      // Show loading screen
      document.getElementById("loadingScreen").classList.add("active");
      
      // Simulate timetable generation process
      setTimeout(() => {
        // Create vintage-style timetable preview
        const studentName = document.getElementById('fullName').value || 'Student';
        const electiveCount = document.querySelectorAll('#electiveOptions input[type="checkbox"]:checked').length;
        
        const timetableHTML = `
          <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(60, 47, 47, 0.95); z-index:10000; display:flex; justify-content:center; align-items:center; padding: 1rem;">
            <div style="background:#f5e9d7; padding:2rem; border:4px double #8b4513; max-width:700px; width:90%; color:#3c2f2f; font-family: 'IM Fell English', serif; box-shadow: 5px 5px 20px rgba(0,0,0,0.4); position: relative;">
              <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #f5e9d7; padding: 0 15px; color: #8b4513; font-size: 24px;">✎</div>
              <h2 style="color:#8b4513; margin-bottom:1rem; text-align: center; border-bottom: 2px solid #d4b896; padding-bottom: 0.5rem;">Timetable Preview</h2>
              <div style="margin: 1.5rem 0;">
                <p style="margin: 0.8rem 0; font-size: 18px;">Generated for: <strong>${studentName}</strong></p>
                <p style="margin: 0.8rem 0; font-size: 18px;">Program: <strong>${prog === 'bed' ? 'B.Ed.' : 'M.Ed.'} Year ${year}</strong></p>
                <p style="margin: 0.8rem 0; font-size: 18px;">Total Credits: <strong>${creditDisplayEl.value}</strong></p>
                <p style="margin: 0.8rem 0; font-size: 18px;">Electives Selected: <strong>${electiveCount}</strong></p>
              </div>
              <div style="background: #e8d8c3; padding: 1.5rem; margin: 1.5rem 0; border: 1px solid #d4b896;">
                <h3 style="color: #5d4037; margin-bottom: 1rem; font-size: 20px;">Sample Schedule</h3>
                <p style="font-style: italic; color: #5d4037;">Monday: 9-10 AM | Foundations of Education</p>
                <p style="font-style: italic; color: #5d4037;">Tuesday: 10-12 PM | Research Methodology</p>
                <p style="font-style: italic; color: #5d4037;">Wednesday: 1-3 PM | Elective Session</p>
                <p style="font-style: italic; color: #5d4037;">Thursday: 9-11 AM | Educational Technology</p>
                <p style="font-style: italic; color: #5d4037;">Friday: 2-4 PM | Practical Session</p>
              </div>
              <p style="font-style: italic; color: #5d4037; text-align: center; margin-top: 1.5rem; padding: 1rem; background: #f0e6d6; border: 1px dashed #8b4513;">
                In the full version, this would display the complete weekly timetable with subjects, times, and classrooms.
              </p>
              <div style="text-align: center; margin-top: 2rem;">
                <button onclick="this.parentElement.parentElement.remove();" style="padding: 0.8rem 2rem; background: #8b4513; color: #f5e9d7; border: 2px solid #5d4037; cursor: pointer; font-family: 'Cinzel', serif; font-size: 16px; margin-right: 1rem;">Close Preview</button>
                <button onclick="window.print()" style="padding: 0.8rem 2rem; background: #5d4037; color: #f5e9d7; border: 2px solid #3c2f2f; cursor: pointer; font-family: 'Cinzel', serif; font-size: 16px;">Print Schedule</button>
              </div>
            </div>
          </div>
        `;
        
        // Add preview to page
        document.body.insertAdjacentHTML('beforeend', timetableHTML);
        
        // Hide loading screen
        document.getElementById("loadingScreen").classList.remove("active");
      }, 2500);
    }

    // Initialize form interactions
    document.addEventListener('DOMContentLoaded', () => {
      // Add visual feedback to form inputs on focus
      const inputs = document.querySelectorAll('.text, select');
      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          this.style.borderBottomColor = '#5d4037';
          this.style.backgroundColor = 'rgba(139, 69, 19, 0.05)';
          this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
          this.style.borderBottomColor = '#8b4513';
          this.style.backgroundColor = 'transparent';
          this.parentElement.style.transform = 'translateY(0)';
        });
      });
      
      // Add click handlers to header buttons
      document.getElementById('about').addEventListener('click', () => {
        const aboutDiv = document.createElement('div');
        aboutDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #f5e9d7;
          border: 4px double #8b4513;
          padding: 2rem;
          z-index: 10000;
          box-shadow: 5px 5px 20px rgba(0,0,0,0.4);
          max-width: 600px;
          width: 90%;
          font-family: 'IM Fell English', serif;
        `;
        
        aboutDiv.innerHTML = `
          <h2 style="color: #8b4513; margin-bottom: 1rem; text-align: center; border-bottom: 2px solid #d4b896; padding-bottom: 0.5rem;">The Chronology Gazette</h2>
          <p style="margin: 1rem 0; font-size: 18px; line-height: 1.6;">A sophisticated timetable generation system for educational institutions, designed with the aesthetic of antique academic journals and manuscripts.</p>
          <p style="margin: 1rem 0; font-size: 18px; line-height: 1.6;">This system allows students and administrators to create personalized academic schedules based on program, year, and elective selections.</p>
          <div style="background: #e8d8c3; padding: 1rem; margin: 1.5rem 0; border-left: 4px solid #8b4513;">
            <p style="margin: 0.5rem 0; font-style: italic; color: #5d4037;">"Organizing time, one schedule at a time."</p>
          </div>
          <p style="margin: 1rem 0; font-size: 18px; color: #5d4037;"><strong>Version 2.0 | Vintage Edition </strong></p>
          <p style="margin: 1rem 0; font-size: 18px; color: #5d4037;"><strong>Created By Dhruvil_Dave </strong></p>
          <div style="text-align: center; margin-top: 2rem;">
            <button onclick="this.parentElement.parentElement.remove()" style="padding: 0.8rem 2rem; background: #8b4513; color: #f5e9d7; border: 2px solid #5d4037; cursor: pointer; font-family: 'Cinzel', serif; font-size: 16px;">Close</button>
          </div>
        `;
        
        document.body.appendChild(aboutDiv);
      });
      
      document.getElementById('timetable').addEventListener('click', () => {
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #f5e9d7;
          border: 3px solid #8b4513;
          padding: 2rem;
          z-index: 10000;
          box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
          max-width: 500px;
          width: 90%;
          text-align: center;
          font-family: 'IM Fell English', serif;
        `;
        
        infoDiv.innerHTML = `
          <h3 style="color: #8b4513; margin-bottom: 1rem;">Timetable Generator</h3>
          <p style="margin: 1rem 0; font-size: 18px; line-height: 1.6;">Create personalized academic schedules based on program, year, and elective selections.</p>
          <p style="margin: 1rem 0; font-size: 18px; line-height: 1.6;">The system automatically calculates total credits and generates optimized timetables.</p>
          <div style="text-align: center; margin-top: 2rem;">
            <button onclick="this.parentElement.parentElement.remove()" style="padding: 0.8rem 2rem; background: #8b4513; color: #f5e9d7; border: 2px solid #5d4037; cursor: pointer; font-family: 'Cinzel', serif; font-size: 16px;">Close</button>
          </div>
        `;
        
        document.body.appendChild(infoDiv);
      });
      
      // Add some vintage randomness to the page
      setTimeout(() => {
        // Randomly add ink spots
        if (Math.random() > 0.5) {
          const randomInk = document.createElement('div');
          randomInk.className = 'ink-blot';
          randomInk.style.cssText = `
            position: fixed;
            top: ${20 + Math.random() * 60}%;
            left: ${10 + Math.random() * 80}%;
            width: ${50 + Math.random() * 100}px;
            height: ${50 + Math.random() * 100}px;
            background: radial-gradient(circle, #3c2f2f 0%, transparent 70%);
            border-radius: ${Math.random() * 50}%;
            opacity: 0.02;
            z-index: -1;
            filter: sepia(1);
          `;
          document.body.appendChild(randomInk);
        }
      }, 1000);
    });
  