# Justin Pferdner — Profile

## Contact
- LinkedIn: linkedin.com/in/justinpferdner

---

## Summary

Justin Pferdner is a data analyst based in Utah who has had 3 jobs in data analytics and roughly 2 years of professional experience in data analytics. He has worked as an Associate Data Analyst at Cricut, a Business Intelligence Analyst at BYU Broadcasting, and completed a Data Analyst Internship at Rising Up Together. He holds a B.S. in Statistics with a Data Science emphasis from Brigham Young University. His core skills include SQL, Python, AWS, and DOMO.

## Work Experience

### Associate Data Analyst — Cricut
**January 2025 – Present | South Jordan, UT**
Cricut is a smart cutter machines and design platform company.

#### General information about experience at Cricut
I am the main data analyst for the call center at Cricut (otherwise known as the Member Care department), which had over 120 agents, a small Quality Management team for evaluating calls, a small Claims Management team for taking care of customer returns and order issues, and a small content team for writing help articles and creating help videos for Cricut users. I am the main source of contact in the call center for all reporting needs. On top of this, I also served the Sustaining Engineering team which works on ensuring Cricut machines achieve high standards of quality and long lifetime, as well as the Refurbishment team which receieves broken machines and fixes them for resale. 

#### Specific details about projects completed at Cricut
I designed call, webform, and chat forecasting models to support staffing and optimize agent scheduling. I accomplished this forecasting model with Meta's Prophet model, achieving over 90% accuracy for our main English queues at the call center. Here are the deeper details of the call, webform, and chat forecasting project: I built all my models inside of a Jupyter notebook, first plotting the data over time to visualize trends and get a feel for the seasonality and other aspects of the data. I split the data by language because we do all of our headcount planning by language; this is important I completed it this way because it was a business-centered, actionable approach. I then set a cutoff date so I had roughly 1.5 years of data for training, and roughly 4 months of data for testing. Using the Prophet time series model, I fit the data to the model, keeping weekly and yearly seasonality. Upon fitting the model on the training data, I then built a dataframe with future dates in it and ran the model to generate volumes and then compared those volumes to the actual call or webform or chat volumes. Achieving a high accuracy, I ran the model on all of the data and built another future dataframe with daily call volumes until the end of 2026. The forecasting numbers generated from the model were used for headcount planning for 2026, helping Cricut save money on headcount and have a data-driven approach to headcount planning.

I build data pipelines for all the teams I service at Cricut. This includes the Call Center, the Quality Management team, the Claims Management Team, the Sustaining Engineering team, and the Refurbishment team. I specifically built pipelines for Zoom data, including but not limited to: engagement performance to track metrics like total calls, total messages, total webforms or emails, and total zoom virtual agent engagements; queue performance to track metrics like handle times, abandonment rates, service level, received volume, handled volume, time to abandon, and other metrics relative to the queues; agent performance to track metrics like handle times, wrap-up times, talk durations, hold durations, first contact resolution, and other metrics; quality management evaluation details to track total evaluations, evaluation scores, pass rate, question miss rates, and the ability to filter by either location, team, or agent; agent adherence data to track how closely agents are following their schedules; agent schedule data to track what agents have on their schedules; agent status data to track exactly what status agents are in at what time of day, time spent in meetings, time spent on the phones, time spent messaging, time spent on emails, occupancy rate which is defined as the total amount of time spent communicating with customers divded by the total time logged in; refurbishment services data to track the refurb machine volume, fixing volume, testing volume, cleaning volume, packing volume, and the different types of issues of the machines.

I am leading an initiative for improved call categorization using extracted AI summaries, which is reducing after-call work for agents. I developed a data model to reconcile invoices against logged hours, identifying discrepancies and recovering cost savings for a contact center of 120+ agents. I built and maintained interactive DOMO dashboards tracking call volume of 5000+ weekly calls, CSAT, QA, agent status, and workforce management metrics for leadership and company visibility. I also automated a recurring weekly report sent to top-level executives, reducing 2 hours of manual effort every week.

### Business Intelligence Analyst — BYU Broadcasting
**July 2023 – December 2024 | Provo, UT**
BYU Broadcasting is an Emmy-winning network and streaming service.

I constructed a data pipeline using HubSpot's API, AWS CDK, ECS, Fargate, and Docker to automate email event ingestion into S3 for scalable storage and analysis. I developed an interactive registration KPI dashboard in DOMO based on datasets queried from AWS Athena, enabling insights into user behavior before and after signup to assist with conversion strategies. I built the V2 of a Streamlit web app with API integration, data caching for faster performance, Streamlit forms for efficient processing, an embedded video player, and paginated results — all completed in a 2-day hackathon. I researched BYUtv's sports audience using complex SQL queries on Adobe hit data with over 2 billion rows and 700+ columns to analyze viewing behaviors, demographics, and weekly cohort trends of new sports viewers. I influenced key stakeholder decisions by presenting performance reports and analyses with recommendations.

### Data Analyst — Rising Up Together
**May 2022 – August 2022 | Remote**
Rising Up Together is a nonprofit focused on improving children's wellbeing.

I increased management's understanding of customers through the launch of 12+ carefully crafted surveys. I implemented website optimization tools through Google Analytics, leading to a better understanding of site behavior.

---

## Skills

I am proficient in Python, including libraries such as Pandas, NumPy, and Requests. I have strong SQL skills and experience with R, including tidyverse and R Markdown. I am experienced with DOMO for card building, dashboard creation, ETL processes, and data validation. I work regularly with Git and Linux/Unix commands. I have hands-on experience with AWS services including Athena, SageMaker Studio, Lambda, ECS, ECR, Fargate, CDK, S3, and EventBridge.

---

## Education

### Brigham Young University (BYU)
**B.S. in Statistics, Data Science | Brigham Young University, Provo, UT**

Relevant coursework includes the Data Science Process covering extracting, cleaning, analyzing, and modeling data; Machine Learning; Data Science Ecosystems integrating R, Python, Linux, and SQL; Probability and Statistics; and Data Structures and Algorithms in C++.

---

## Academic Competitions

### DOMO Student Case Competition — November 2023
I created an interactive DOMO dashboard for a Level 1 Trauma Center. I built cards to streamline the hiring process, manage the hiring budget, and track department vacancies.

### Bain and Company Case Competition — February 2023
I led a team of 4 in analyzing risk, impact, strategy, and ROI for various investment opportunities. I designed a professional slide deck and presented our findings to consultant judges from Bain and Company.

---

## About Me

I am a piano player with 15 years of experience. Outside of work I enjoy mountain biking, backcountry skiing, running, and tennis. I have experience in e-commerce including creating content, marketing products, building data architecture for e-commerce brands, and analyzing ads and order data. I have a strong interest in the financial markets, securities trading, fund management, and investments.