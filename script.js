/**
 * National Jobs Alert — script.js
 * 
 * Google Sheets Integration — columns in Row 1:
 * id | title | organization | category | city | education | deadline | vacancies
 * | description | applyLink | isNew | isScheme | schemeDesc
 * | gender | ageLimit | applyProcedure | domicile | jobType | howToApply | importantPoints | adImage
 */

// Your Google Sheet — update jobs here: https://docs.google.com/spreadsheets/d/1o7r2FVF5pvXFKKXa82yJKPZ7KyxcMCgMMtm86RR70hA/edit
const SHEET_ID = '1o7r2FVF5pvXFKKXa82yJKPZ7KyxcMCgMMtm86RR70hA';
const SHEET_GID = '0';
// Standard published CSV format endpoint
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

// ============================================================
// BUILT-IN JOBS DATA (100 current jobs — June 2026)
// When Google Sheet is connected, this data will be REPLACED
// ============================================================
const BUILT_IN_JOBS = [
  { id:1,  title:"Pakistan Aeronautical Complex (PAC) – Multiple Posts", org:"PAC", category:"Government", city:"Kamra", edu:"Matric / DAE", deadline:"June 25, 2026", vacancies:"200+", desc:"Pakistan Aeronautical Complex (PAC) Kamra invites applications for various technical and non-technical posts. Posts include Apprentices, Technicians, Clerks, and Assistants. Candidates with Matric/DAE qualifications are encouraged to apply.", applyLink:"https://expertjobs24.com/", isNew:true },
  { id:2,  title:"Military Engineering Services (MES) – Technical & Admin Posts", org:"MES", category:"Government", city:"All Over Pakistan", edu:"Matric / Graduation", deadline:"June 22, 2026", vacancies:"150+", desc:"Military Engineering Services (MES) requires Junior Engineers, Draftsmen, Clerks, Supervisors and other staff across Pakistan. Apply through official NTS portal.", applyLink:"https://jobsalert.pk/", isNew:true },
  { id:3,  title:"PSCA – Punjab Safe City Authority Jobs", org:"PSCA", category:"Government", city:"Lahore", edu:"Graduation / Masters", deadline:"June 30, 2026", vacancies:"80", desc:"Punjab Safe City Authority is hiring IT Specialists, Data Analysts, Control Room Operators and Support Staff for its operations in Lahore.", applyLink:"https://expertjobs24.com/", isNew:true },
  { id:4,  title:"Health Department Punjab – Through NTS", org:"Health Dept", category:"Government", city:"Punjab", edu:"MBBS / Nursing / Intermediate", deadline:"July 5, 2026", vacancies:"300+", desc:"Health Department Punjab is hiring Doctors, Nurses, Pharmacists, Lab Technicians and Dispenser staff for District Health Authorities across Punjab.", applyLink:"https://expertjobs24.com/", isNew:true },
  { id:5,  title:"Pakistan Rangers Sindh – Various Posts", org:"Pakistan Rangers Sindh", category:"Army", city:"Karachi / Sindh", edu:"Matric / Intermediate", deadline:"June 28, 2026", vacancies:"500+", desc:"Pakistan Rangers Sindh is recruiting eligible candidates for Rifleman, Cook, Sweeper, Clerk, and other posts. Age 17–25 years. Physical test required.", applyLink:"https://expertjobs24.com/", isNew:true },
  { id:6,  title:"Jinnah Institute of Cardiology – Medical Staff", org:"JIC Lahore", category:"Government", city:"Lahore", edu:"MBBS / Nursing", deadline:"June 20, 2026", vacancies:"40", desc:"Jinnah Institute of Cardiology Lahore requires Cardiologists, Nurses, ECG Technicians, and Ward Boys/Girls for its cardiac care unit.", applyLink:"https://expertjobs24.com/", isNew:false },
  { id:7,  title:"Ministry of Industries – Engineering Development Board", org:"EDB", category:"Government", city:"Islamabad", edu:"BE / Masters", deadline:"June 25, 2026", vacancies:"25", desc:"Ministry of Industries and Production's Engineering Development Board requires Economic Officers, IT Officers, Assistant Directors and Research Analysts.", applyLink:"https://expertjobs24.com/", isNew:true },
  { id:8,  title:"FPSC – Federal Public Service Commission Jobs 2026", org:"FPSC", category:"FPSC", city:"All Over Pakistan", edu:"Graduation / Masters", deadline:"July 10, 2026", vacancies:"200+", desc:"FPSC announces vacancies for CSS, Inspector FIA, Inspector Customs, and various BS-16 to BS-18 posts. Competitive exam will be held across Pakistan.", applyLink:"https://www.fpsc.gov.pk/", isNew:true },
  { id:9,  title:"PPSC – Punjab Public Service Commission 2026", org:"PPSC", category:"PPSC", city:"Punjab", edu:"Graduation / Masters", deadline:"July 15, 2026", vacancies:"500+", desc:"PPSC announces multiple vacancies including Subject Specialists, Lecturers, Assistant Directors, and Sub-Inspectors. Online applications at ppsc.gop.pk.", applyLink:"https://ppsc.gop.pk/", isNew:true },
  { id:10, title:"Pakistan Navy – Sailor Recruitment 2026", org:"Pakistan Navy", category:"Navy", city:"Karachi / All Pakistan", edu:"Matric / Intermediate", deadline:"July 1, 2026", vacancies:"1000+", desc:"Pakistan Navy is recruiting Sailors in Technical (Marine Engineering, Electrical, IT) and non-technical branches. Age 16–22 years. Medical/Physical test required.", applyLink:"https://joinpaknavy.gov.pk/", isNew:true },
  { id:11, title:"Pak Army – Regular Commission 2026", org:"Pakistan Army", category:"Army", city:"All Over Pakistan", edu:"Graduation", deadline:"July 20, 2026", vacancies:"250+", desc:"Join Pak Army through Regular Commission. Male/Female graduates can apply for 149th PMA Long Course. Age 17–23. Tests at ISSB Kohat/Gujranwala.", applyLink:"https://joinpakarmy.gov.pk/", isNew:true },
  { id:12, title:"Pakistan Air Force – Airmen 2026", org:"PAF", category:"PAF", city:"All Over Pakistan", edu:"Matric / Intermediate", deadline:"June 30, 2026", vacancies:"800+", desc:"Pakistan Air Force invites applications for Airmen batch in Ground Support, Engineering, IT, Admin, and Medical branches. Age 16–22 years.", applyLink:"https://www.pafaa.com.pk/", isNew:true },
  { id:13, title:"NTS – National Testing Service Staff Jobs", org:"NTS", category:"NTS", city:"Islamabad", edu:"Graduation / Masters", deadline:"July 5, 2026", vacancies:"50", desc:"NTS is hiring Test Development Officers, Data Entry Operators, IT Officers and Administrative Staff. Apply online at nts.org.pk.", applyLink:"https://nts.org.pk/", isNew:false },
  { id:14, title:"State Bank of Pakistan – Officers 2026", org:"SBP", category:"Government", city:"Karachi / Islamabad", edu:"Masters / MBA", deadline:"July 12, 2026", vacancies:"60", desc:"State Bank of Pakistan requires OG-2 Officers in Finance, Economics, IT, Law and HR departments. Candidates must have 16 years education.", applyLink:"https://www.sbp.org.pk/", isNew:true },
  { id:15, title:"WAPDA – Water & Power Development Authority", org:"WAPDA", category:"Government", city:"All Over Pakistan", edu:"DAE / BE", deadline:"July 8, 2026", vacancies:"400+", desc:"WAPDA announces vacancies for Sub-Engineers, Junior Engineers, Meter Readers, Line Men, and Clerks. Apply through NTS.", applyLink:"https://wapda.gov.pk/", isNew:true },
  { id:16, title:"FIA – Federal Investigation Agency", org:"FIA", category:"Government", city:"All Over Pakistan", edu:"Graduation", deadline:"June 28, 2026", vacancies:"100+", desc:"Federal Investigation Agency requires Sub-Inspectors, Constables, Steno-Typists, and Assistants. Age 18–25 years. Fitness test mandatory.", applyLink:"https://www.fia.gov.pk/", isNew:true },
  { id:17, title:"NADRA – National Database & Registration Authority", org:"NADRA", category:"Government", city:"All Over Pakistan", edu:"Matric / Graduation", deadline:"July 10, 2026", vacancies:"300+", desc:"NADRA invites applications for Registration Officers, IT Executives, Data Entry Operators, and Field Officers across Pakistan.", applyLink:"https://www.nadra.gov.pk/", isNew:false },
  { id:18, title:"Pakistan Post – Postal Service Jobs", org:"Pakistan Post", category:"Government", city:"All Over Pakistan", edu:"Matric / Intermediate", deadline:"June 25, 2026", vacancies:"200", desc:"Pakistan Post requires Postmen, Mail Sorters, Counter Assistants and Mail Carriers across all provinces. Age 18–30 years.", applyLink:"https://www.pakpost.gov.pk/", isNew:false },
  { id:19, title:"Customs Intelligence – ASO Posts", org:"Customs FBR", category:"Government", city:"Karachi / Lahore", edu:"Graduation", deadline:"July 3, 2026", vacancies:"80", desc:"Directorate of Customs Intelligence & Investigation requires Assistant Superintendent Officers (ASO). CSS qualification preferred.", applyLink:"https://fbr.gov.pk/", isNew:true },
  { id:20, title:"Punjab Police – Constable Recruitment 2026", org:"Punjab Police", category:"Government", city:"Punjab", edu:"Matric / Intermediate", deadline:"July 15, 2026", vacancies:"2000+", desc:"Punjab Police is hiring Male/Female Constables for various districts. Age 18–25 years. Physical standard and medical test required. Apply online.", applyLink:"https://punjabpolice.gov.pk/", isNew:true },
  { id:21, title:"Sindh Police – ASI / Head Constable Posts", org:"Sindh Police", category:"Government", city:"Karachi / Sindh", edu:"Intermediate / Graduation", deadline:"July 1, 2026", vacancies:"500", desc:"Sindh Police invites applications for ASI, Head Constable, Lady Constable. Written test followed by physical and medical evaluation.", applyLink:"https://sindhpolice.gov.pk/", isNew:false },
  { id:22, title:"KPK Police – Constable / Sub Inspector", org:"KPK Police", category:"Government", city:"Peshawar / KPK", edu:"Matric / Graduation", deadline:"June 30, 2026", vacancies:"400", desc:"KPK Police requires Constables and Sub-Inspectors for various districts. ETEA test required. Preference to domicile holders.", applyLink:"https://kpkpolice.gov.pk/", isNew:false },
  { id:23, title:"Pakistan Railways – Drivers & Technicians", org:"Pakistan Railway", category:"Government", city:"All Over Pakistan", edu:"Matric / DAE", deadline:"July 5, 2026", vacancies:"350", desc:"Pakistan Railways is recruiting Train Drivers, Junior Engineers, Mechanical Fitters, and Station Masters. Age up to 35 years.", applyLink:"https://pakrail.gov.pk/", isNew:true },
  { id:24, title:"CDA – Capital Development Authority Jobs", org:"CDA", category:"Government", city:"Islamabad", edu:"Graduation / Masters", deadline:"July 12, 2026", vacancies:"120", desc:"Capital Development Authority requires Town Planners, Civil Engineers, Accounts Officers, and Computer Operators. Apply online.", applyLink:"https://cda.gov.pk/", isNew:false },
  { id:25, title:"OGDCL – Oil & Gas Exploration Jobs 2026", org:"OGDCL", category:"Government", city:"All Over Pakistan", edu:"BE / Masters", deadline:"July 18, 2026", vacancies:"90", desc:"Oil and Gas Development Company Limited requires Petroleum Engineers, Geologists, Finance Officers, and IT Professionals.", applyLink:"https://www.ogdcl.com/", isNew:true },
  { id:26, title:"PSO – Pakistan State Oil Job Openings", org:"PSO", category:"Government", city:"Karachi", edu:"BE / MBA / BBA", deadline:"July 8, 2026", vacancies:"40", desc:"Pakistan State Oil requires Management Trainees, Engineers, Finance Analysts, and HR Officers. Fresh graduates are encouraged to apply.", applyLink:"https://www.pso.com.pk/", isNew:false },
  { id:27, title:"PTCL – Telecom Jobs 2026", org:"PTCL", category:"Private", city:"All Over Pakistan", edu:"BE / BSc / Graduation", deadline:"June 28, 2026", vacancies:"200", desc:"Pakistan Telecommunication Company Ltd (PTCL) requires Network Engineers, Field Technicians, Customer Service Officers and IT Specialists.", applyLink:"https://www.ptcl.com.pk/", isNew:true },
  { id:28, title:"Telenor Pakistan – Multiple Openings", org:"Telenor", category:"Private", city:"Islamabad / Lahore / Karachi", edu:"Graduation / Masters", deadline:"July 5, 2026", vacancies:"80", desc:"Telenor Pakistan has openings in Sales, Marketing, Network Planning, IT, Finance and Customer Support. Competitive packages offered.", applyLink:"https://telenor.com.pk/", isNew:false },
  { id:29, title:"Jazz – Sales & Technical Officers", org:"Jazz", category:"Private", city:"All Over Pakistan", edu:"Graduation", deadline:"July 10, 2026", vacancies:"150", desc:"Jazz Pakistan is hiring Territory Sales Officers, Network Optimisation Engineers, and Digital Marketing Executives across all regions.", applyLink:"https://jazz.com.pk/", isNew:true },
  { id:30, title:"Zong – 4G Network Engineers", org:"Zong", category:"Private", city:"Islamabad / Lahore", edu:"BE Telecom / Computer", deadline:"June 30, 2026", vacancies:"60", desc:"Zong (China Mobile Pakistan) requires RF Engineers, Core Network Engineers, and IT Support Specialists. 2+ years experience preferred.", applyLink:"https://www.zong.com.pk/", isNew:false },
  { id:31, title:"HBL – Habib Bank Limited Jobs", org:"HBL", category:"Private", city:"All Over Pakistan", edu:"Graduation / MBA", deadline:"July 15, 2026", vacancies:"300", desc:"HBL invites applications for Management Trainees, Branch Operations Officers, Tellers, Credit Analysts, and IT Officers. Apply at hbl.com.", applyLink:"https://www.hbl.com/", isNew:true },
  { id:32, title:"MCB Bank – Branch Banking Officers", org:"MCB Bank", category:"Private", city:"Punjab / Sindh", edu:"Graduation / Masters", deadline:"July 5, 2026", vacancies:"120", desc:"MCB Bank is hiring Branch Banking Officers (BBO), Credit Officers, and IT Support staff at various branches. Fresh graduates welcome.", applyLink:"https://www.mcb.com.pk/", isNew:false },
  { id:33, title:"UBL – United Bank Limited Trainee Program", org:"UBL", category:"Private", city:"All Over Pakistan", edu:"Masters / MBA", deadline:"July 20, 2026", vacancies:"100", desc:"UBL Management Trainee Officer program for fresh graduates. Competitive salary + training + career growth. Apply online at ubl.com.pk.", applyLink:"https://www.ubl.com.pk/", isNew:true },
  { id:34, title:"Allied Bank – Risk & Compliance Officers", org:"Allied Bank", category:"Private", city:"Lahore / Islamabad", edu:"Masters in Finance / Law", deadline:"June 25, 2026", vacancies:"30", desc:"Allied Bank requires Risk Officers, Compliance Officers, and Internal Auditors. 3+ years banking experience. Apply via email.", applyLink:"https://www.abl.com/", isNew:false },
  { id:35, title:"Faysal Bank – Relationship Managers", org:"Faysal Bank", category:"Private", city:"Lahore / Karachi", edu:"Graduation / MBA", deadline:"July 8, 2026", vacancies:"50", desc:"Faysal Bank requires Relationship Managers for Corporate, SME, and Retail Banking divisions. Strong communication skills required.", applyLink:"https://www.faysalbank.com/", isNew:false },
  { id:36, title:"Systems Limited – Software Engineers", org:"Systems Ltd", category:"Private", city:"Lahore / Karachi", edu:"BS Computer Science", deadline:"July 18, 2026", vacancies:"100", desc:"Systems Limited is hiring .NET, Java, Python, React and Mobile App developers. Also seeking Business Analysts and Project Managers.", applyLink:"https://www.systemsltd.com/", isNew:true },
  { id:37, title:"NetSol Technologies – IT & Finance Jobs", org:"NetSol", category:"Private", city:"Lahore", edu:"BS / MS Computer Science", deadline:"July 10, 2026", vacancies:"60", desc:"NetSol Technologies requires Java/.NET developers, QA Engineers, Business Analysts, and Functional Consultants for fintech solutions.", applyLink:"https://www.netsol.com/", isNew:false },
  { id:38, title:"TRG Pakistan – Business Process Outsourcing", org:"TRG", category:"Private", city:"Karachi / Lahore", edu:"Graduation", deadline:"July 5, 2026", vacancies:"200", desc:"TRG Pakistan is hiring Customer Service Representatives, Team Leads, Quality Analysts, and IT Support for BPO operations.", applyLink:"https://www.trg.com.pk/", isNew:false },
  { id:39, title:"Packages Limited – Management Trainees", org:"Packages Ltd", category:"Private", city:"Lahore", edu:"BE / MBA", deadline:"June 30, 2026", vacancies:"25", desc:"Packages Limited offers Management Trainee positions in Supply Chain, Engineering, Finance, and HR for fresh graduates.", applyLink:"https://www.packages.com.pk/", isNew:false },
  { id:40, title:"Engro Corporation – Engineering & Business", org:"Engro", category:"Private", city:"Karachi / Islamabad", edu:"BE / Masters", deadline:"July 15, 2026", vacancies:"70", desc:"Engro Corporation and its subsidiaries (Engro Fertilizers, Enfrashare, Elengy Terminal) have openings across multiple functions.", applyLink:"https://www.engro.com/", isNew:true },
  { id:41, title:"Fauji Fertilizer Company – Trainees", org:"FFC", category:"Private", city:"Rawalpindi", edu:"BE Chemical / Masters", deadline:"July 1, 2026", vacancies:"30", desc:"Fauji Fertilizer Company requires Management Trainees, Chemical Engineers, Quality Analysts, and IT Officers.", applyLink:"https://www.ffc.com.pk/", isNew:false },
  { id:42, title:"Bestway Cement – Production Engineers", org:"Bestway Cement", category:"Private", city:"Chakwal / Hattar", edu:"BE Mechanical / Electrical", deadline:"June 28, 2026", vacancies:"20", desc:"Bestway Cement requires Production Engineers, Maintenance Supervisors, and Quality Control Analysts at its Chakwal and Hattar plants.", applyLink:"https://www.bestwaycement.com/", isNew:false },
  { id:43, title:"Allied School – Teachers Recruitment 2026", org:"Allied Schools", category:"Private", city:"Punjab", edu:"Graduation / Masters", deadline:"July 20, 2026", vacancies:"500+", desc:"Allied Schools network is hiring English, Mathematics, Science, Social Studies, and Urdu Teachers for Primary, Middle, and Higher Secondary levels.", applyLink:"https://www.alliedschools.edu.pk/", isNew:true },
  { id:44, title:"The City School – Subject Teachers", org:"The City School", category:"Private", city:"Karachi / Lahore / Islamabad", edu:"Graduation / Masters B.Ed", deadline:"July 10, 2026", vacancies:"200", desc:"The City School requires qualified teachers for O/A Level subjects including English, Physics, Chemistry, Biology, Economics, and Mathematics.", applyLink:"https://www.thecityschool.edu.pk/", isNew:false },
  { id:45, title:"LUMS – Lahore University of Management Sciences", org:"LUMS", category:"Private", city:"Lahore", edu:"Masters / PhD", deadline:"July 25, 2026", vacancies:"30", desc:"LUMS invites applications for faculty, lecturers, research officers, and administrative staff positions across its departments.", applyLink:"https://www.lums.edu.pk/", isNew:true },
  { id:46, title:"FAST NUCES – Teaching Faculty", org:"FAST NUCES", category:"Government", city:"All Over Pakistan", edu:"Masters / PhD", deadline:"July 18, 2026", vacancies:"80", desc:"FAST National University requires Visiting Lecturers and Permanent Faculty for CS, Electrical, Civil, and Business departments.", applyLink:"https://www.nu.edu.pk/", isNew:false },
  { id:47, title:"COMSATS University – Faculty & Staff", org:"COMSATS", category:"Government", city:"All Over Pakistan", edu:"Masters / PhD", deadline:"July 30, 2026", vacancies:"100", desc:"COMSATS University Islamabad announces vacancies for Assistant Professors, Lab Engineers, Research Associates and Admin staff.", applyLink:"https://www.comsats.edu.pk/", isNew:true },
  { id:48, title:"University of Punjab – Non-Teaching Staff", org:"University of Punjab", category:"Government", city:"Lahore", edu:"Matric / Graduation", deadline:"June 30, 2026", vacancies:"150", desc:"University of the Punjab requires Security Guards, Clerks, Lab Attendants, Electricians, and Computer Operators. NTS test required.", applyLink:"https://www.pu.edu.pk/", isNew:false },
  { id:49, title:"KMU – Khyber Medical University Jobs", org:"KMU", category:"Government", city:"Peshawar", edu:"MBBS / Masters", deadline:"July 5, 2026", vacancies:"50", desc:"Khyber Medical University requires Demonstrators, Lecturers, Lab Technicians, and Administrative Officers for multiple campuses.", applyLink:"https://www.kmu.edu.pk/", isNew:false },
  { id:50, title:"PIMS – Pakistan Institute of Medical Sciences", org:"PIMS", category:"Government", city:"Islamabad", edu:"MBBS / Nursing", deadline:"July 8, 2026", vacancies:"80", desc:"Pakistan Institute of Medical Sciences invites applications for Doctors (House Officers, Medical Officers), Nurses and Paramedical Staff.", applyLink:"https://pims.gov.pk/", isNew:true },
  { id:51, title:"SNGPL – Sui Northern Gas Jobs", org:"SNGPL", category:"Government", city:"Punjab / KPK", edu:"DAE / BE", deadline:"July 10, 2026", vacancies:"200", desc:"Sui Northern Gas Pipelines Limited requires Gas Technicians, Junior Engineers, Meter Readers, and Customer Relations Officers.", applyLink:"https://www.sngpl.com.pk/", isNew:true },
  { id:52, title:"SSGC – Sui Southern Gas Company Jobs", org:"SSGC", category:"Government", city:"Karachi / Sindh", edu:"DAE / BE / Graduation", deadline:"July 5, 2026", vacancies:"150", desc:"SSGC requires Trainee Engineers, Finance Officers, HR Executives, and Field Supervisors for Sindh and Balochistan operations.", applyLink:"https://www.ssgc.com.pk/", isNew:false },
  { id:53, title:"GEPCO – Gujranwala Electric Power Company", org:"GEPCO", category:"Government", city:"Gujranwala", edu:"DAE / BE", deadline:"June 28, 2026", vacancies:"100", desc:"GEPCO invites applications for SDOs (Sub-Divisional Officers), Junior Engineers, Line Men, and Meter Readers. Apply via NTS.", applyLink:"https://www.gepco.com.pk/", isNew:false },
  { id:54, title:"LESCO – Lahore Electric Supply Company", org:"LESCO", category:"Government", city:"Lahore", edu:"Matric / DAE", deadline:"July 3, 2026", vacancies:"120", desc:"LESCO requires Meter Readers, Security Guards, Electricians, and Clerical Staff. Age 18–30 years. Domicile of Lahore Division required.", applyLink:"https://www.lesco.gov.pk/", isNew:true },
  { id:55, title:"NTDC – National Transmission & Dispatch Company", org:"NTDC", category:"Government", city:"Islamabad / Punjab", edu:"BE Electrical / Electronics", deadline:"July 15, 2026", vacancies:"60", desc:"NTDC requires Electrical Engineers, Control & Relay Protection Engineers, and IT Officers for grid stations and dispatch centers.", applyLink:"ntdc.com.pk", isNew:false },
  { id:56, title:"Port Qasim Authority – Marine & Admin Jobs", org:"PQA", category:"Government", city:"Karachi", edu:"Matric / Graduation", deadline:"June 25, 2026", vacancies:"70", desc:"Port Qasim Authority requires Port Officers, Crane Operators, Security Personnel, and Administrative Assistants.", applyLink:"https://pqa.gov.pk/", isNew:false },
  { id:57, title:"Civil Aviation Authority – ATC & Engineering", org:"CAA", category:"Government", city:"Karachi / Islamabad / Lahore", edu:"BE / BSc Aviation", deadline:"July 12, 2026", vacancies:"90", desc:"Civil Aviation Authority is hiring Air Traffic Controllers (ATC), Electrical Engineers, and Ground Safety Officers. Age 18–28 years.", applyLink:"https://www.caapakistan.com.pk/", isNew:true },
  { id:58, title:"ASF – Airport Security Force Jobs", org:"ASF", category:"Government", city:"All Over Pakistan", edu:"Intermediate / Graduation", deadline:"June 30, 2026", vacancies:"300", desc:"Airport Security Force requires Constables, ASIs, Head Constables and Technical Staff. Age 18–25. Physical/Medical test mandatory.", applyLink:"https://www.asf.gov.pk/", isNew:true },
  { id:59, title:"ANF – Anti Narcotics Force Pakistan", org:"ANF", category:"Government", city:"All Over Pakistan", edu:"Matric / Intermediate / Graduation", deadline:"July 8, 2026", vacancies:"200", desc:"Anti Narcotics Force is recruiting Sub-Inspectors, Constables, Clerks and Lab Analysts. Intelligence/security clearance required.", applyLink:"https://anf.gov.pk/", isNew:false },
  { id:60, title:"BISP – Benazir Income Support Programme Staff", org:"BISP", category:"Government", city:"All Over Pakistan", edu:"Graduation / Masters", deadline:"July 5, 2026", vacancies:"100", desc:"Benazir Income Support Programme requires Programme Officers, Data Entry Operators, Field Officers and IT Staff.", applyLink:"https://www.bisp.gov.pk/", isNew:false },
  { id:61, title:"PSDP – Planning Commission Jobs", org:"Planning Commission", category:"Government", city:"Islamabad", edu:"Masters in Economics / MBA", deadline:"July 10, 2026", vacancies:"30", desc:"Planning Commission of Pakistan requires Economic Policy Analysts, Development Planning Officers, and Research Associates.", applyLink:"https://www.pc.gov.pk/", isNew:false },
  { id:62, title:"PEMRA – Media Regulatory Authority Jobs", org:"PEMRA", category:"Government", city:"Islamabad", edu:"LLB / Masters Media", deadline:"June 28, 2026", vacancies:"25", desc:"Pakistan Electronic Media Regulatory Authority requires Monitoring Officers, Legal Officers, and Technical Coordinators.", applyLink:"https://www.pemra.gov.pk/", isNew:false },
  { id:63, title:"PIA – Pakistan International Airlines Staff", org:"PIA", category:"Government", city:"Karachi / Islamabad", edu:"Graduation / BE", deadline:"July 15, 2026", vacancies:"150", desc:"PIA requires Ground Staff, Cabin Crew (Female), Aircraft Mechanics, IT Officers, and Finance Officers. Age limit varies by post.", applyLink:"https://www.pia.com.pk/", isNew:true },
  { id:64, title:"PASSCO – Agriculture Storage Jobs", org:"PASSCO", category:"Government", city:"All Over Pakistan", edu:"BSc Agriculture / Graduation", deadline:"June 30, 2026", vacancies:"80", desc:"Pakistan Agricultural Storage and Services Corporation requires Godown Keepers, Procurement Officers, and Field Supervisors.", applyLink:"https://www.passco.gov.pk/", isNew:false },
  { id:65, title:"SUPARCO – Space & Upper Atmosphere Research", org:"SUPARCO", category:"Government", city:"Karachi / Islamabad", edu:"BE / MS Engineering", deadline:"July 18, 2026", vacancies:"40", desc:"SUPARCO invites applications for Satellite Engineers, Aerospace Scientists, Electronics Engineers, and IT Professionals.", applyLink:"https://www.suparco.gov.pk/", isNew:true },
  { id:66, title:"PMD – Pakistan Meteorological Department", org:"PMD", category:"Government", city:"All Over Pakistan", edu:"BSc Physics / Meteorology", deadline:"July 5, 2026", vacancies:"60", desc:"Pakistan Meteorological Department requires Junior Meteorologists, Observers, and Technical Assistants at weather stations.", applyLink:"https://www.pmd.gov.pk/", isNew:false },
  { id:67, title:"Survey of Pakistan – Surveyors & Draftsmen", org:"Survey of Pakistan", category:"Government", city:"Rawalpindi / All Pakistan", edu:"Matric / DAE Civil", deadline:"June 28, 2026", vacancies:"100", desc:"Survey of Pakistan requires Field Surveyors, Draftsmen, Photogrammetrists, and GIS Specialists. NTS test required.", applyLink:"#", isNew:false },
  { id:68, title:"NIH – National Institute of Health Jobs", org:"NIH", category:"Government", city:"Islamabad", edu:"MBBS / M.Phil / PhD", deadline:"July 12, 2026", vacancies:"45", desc:"National Institute of Health requires Research Officers, Laboratory Technologists, Epidemiologists and Microbiologists.", applyLink:"https://www.nih.org.pk/", isNew:false },
  { id:69, title:"PCSIR – Scientific Research Jobs", org:"PCSIR", category:"Government", city:"Lahore / Karachi / Peshawar", edu:"BS / MS Science", deadline:"July 8, 2026", vacancies:"55", desc:"Pakistan Council of Scientific and Industrial Research requires Research Officers, Lab Technicians and Scientists in various disciplines.", applyLink:"https://www.pcsir.gov.pk/", isNew:false },
  { id:70, title:"Rescue 1122 – Emergency Rescue Staff", org:"Rescue 1122", category:"Government", city:"Punjab", edu:"Matric / Intermediate", deadline:"July 15, 2026", vacancies:"400", desc:"Rescue 1122 Punjab is hiring Rescue Officers (male/female), Drivers, and Communication Operators. Physical fitness test required.", applyLink:"https://rescue.gov.pk/", isNew:true },
  { id:71, title:"Punjab Food Authority – Food Safety Inspectors", org:"PFA", category:"Government", city:"Punjab", edu:"BSc Food Science / Chemistry", deadline:"June 28, 2026", vacancies:"80", desc:"Punjab Food Authority requires Food Safety Officers, Lab Technicians, Compliance Officers and Mobile Lab Staff.", applyLink:"https://www.pfa.gop.pk/", isNew:false },
  { id:72, title:"LDA – Lahore Development Authority Jobs", org:"LDA", category:"Government", city:"Lahore", edu:"BE Civil / Architecture", deadline:"July 5, 2026", vacancies:"60", desc:"LDA requires Town Planners, Urban Designers, Building Control Officers, Architects and Civil Engineers.", applyLink:"https://lda.gop.pk/", isNew:false },
  { id:73, title:"PDMA – Disaster Management Authority Jobs", org:"PDMA Punjab", category:"Government", city:"Lahore", edu:"Masters / BE", deadline:"July 3, 2026", vacancies:"30", desc:"Punjab Disaster Management Authority requires Disaster Risk Reduction Officers, GIS Specialists, and Emergency Response Coordinators.", applyLink:"https://pdma.punjab.gov.pk/", isNew:false },
  { id:74, title:"TEVTA – Technical Education Jobs Punjab", org:"TEVTA", category:"Government", city:"Punjab", edu:"DAE / BE / Graduation", deadline:"July 20, 2026", vacancies:"300", desc:"TEVTA Punjab requires Vocational Instructors in Auto, Electrical, Welding, Electronics, Garments, and Computer trades.", applyLink:"https://tevta.gop.pk/", isNew:true },
  { id:75, title:"KPESB – KPK Education & Services Board", org:"KPESB", category:"Government", city:"KPK", edu:"Masters / B.Ed", deadline:"July 18, 2026", vacancies:"500", desc:"KPESB is hiring Subject Specialists, ESEs, JSTs and Primary School Teachers for Khyber Pakhtunkhwa government schools.", applyLink:"https://kpese.gov.pk/", isNew:true },
  { id:76, title:"Shaheed Zulfikar Ali Bhutto Institute of Technology", org:"SZABIST", category:"Private", city:"Karachi / Islamabad", edu:"Masters / PhD", deadline:"July 15, 2026", vacancies:"25", desc:"SZABIST requires Visiting and Permanent Faculty in Computer Science, Business, Media Studies, and Social Sciences.", applyLink:"https://www.szabist.edu.pk/", isNew:false },
  { id:77, title:"IBA Karachi – Research & Teaching Positions", org:"IBA Karachi", category:"Government", city:"Karachi", edu:"PhD / Masters", deadline:"July 25, 2026", vacancies:"15", desc:"Institute of Business Administration Karachi invites applications for Assistant Professor and Research Fellow positions.", applyLink:"https://www.iba.edu.pk/", isNew:false },
  { id:78, title:"IGI Life Insurance – Sales Force", org:"IGI Life", category:"Private", city:"All Over Pakistan", edu:"Matric / Graduation", deadline:"July 1, 2026", vacancies:"200", desc:"IGI Life Insurance requires Unit Managers, Senior Agents, and Field Officers. Commission + salary structure. Training provided.", applyLink:"https://www.igiinsurance.com.pk/", isNew:false },
  { id:79, title:"Adamjee Insurance – Underwriting Officers", org:"Adamjee Insurance", category:"Private", city:"Karachi / Lahore", edu:"MBA / BBA Finance", deadline:"July 8, 2026", vacancies:"20", desc:"Adamjee Insurance requires Underwriting Officers, Claims Surveyors, and Finance Officers. Insurance sector experience preferred.", applyLink:"https://www.adamjeeinsurance.com/", isNew:false },
  { id:80, title:"Noon Pakistan – E-Commerce Jobs", org:"Noon.com", category:"Private", city:"Karachi", edu:"Graduation / Masters", deadline:"June 30, 2026", vacancies:"100", desc:"Noon Pakistan is hiring Category Managers, Warehouse Supervisors, Supply Chain Officers, Marketing Executives and Customer Support staff.", applyLink:"https://www.noon.com/", isNew:true },
  { id:81, title:"Foodpanda Pakistan – Operations & Riders", org:"Foodpanda", category:"Private", city:"Lahore / Karachi / Islamabad", edu:"Matric / Graduation", deadline:"July 10, 2026", vacancies:"500", desc:"Foodpanda is hiring Delivery Riders, Restaurant Support Executives, City Managers and Marketing Coordinators across Pakistan.", applyLink:"https://www.foodpanda.pk/", isNew:false },
  { id:82, title:"Careem Pakistan – Driver Partners & Tech", org:"Careem", category:"Private", city:"Lahore / Karachi / Islamabad", edu:"Matric / BS Computer", deadline:"July 5, 2026", vacancies:"150", desc:"Careem is onboarding Driver Partners and hiring Software Engineers, Product Managers, and Operations Executives.", applyLink:"https://www.careem.com/", isNew:false },
  { id:83, title:"Daraz Pakistan – Technology & Business", org:"Daraz", category:"Private", city:"Lahore / Karachi", edu:"BS / Masters", deadline:"July 15, 2026", vacancies:"80", desc:"Daraz is hiring Android/iOS Developers, Data Scientists, Seller Support Officers, Marketing Managers and Finance Analysts.", applyLink:"https://www.daraz.pk/", isNew:true },
  { id:84, title:"Bykea – Operations & Tech Jobs", org:"Bykea", category:"Private", city:"Karachi / Lahore", edu:"Graduation / BS Computer", deadline:"June 28, 2026", vacancies:"60", desc:"Bykea is growing and needs Software Engineers, Android Developers, City Managers, and Customer Support Representatives.", applyLink:"https://bykea.com/", isNew:false },
  { id:85, title:"Mobilink Microfinance Bank – Branch Staff", org:"Mobilink Bank", category:"Private", city:"All Over Pakistan", edu:"Graduation / MBA", deadline:"July 12, 2026", vacancies:"200", desc:"Mobilink Microfinance Bank requires Relationship Officers, Branch Managers, Credit Officers, and IT support staff.", applyLink:"https://www.mobilinkbank.com/", isNew:false },
  { id:86, title:"Khushhalbank – Agriculture Loans Officers", org:"Khushhali Microfinance", category:"Private", city:"Punjab / Sindh", edu:"Graduation / BSc Agriculture", deadline:"July 8, 2026", vacancies:"100", desc:"Khushhali Microfinance Bank seeks Loan Officers, Branch Operations Staff and Agricultural Credit Analysts.", applyLink:"#", isNew:false },
  { id:87, title:"Nayapay – Fintech Startup Jobs", org:"NayaPay", category:"Private", city:"Karachi / Lahore", edu:"BS Computer Science / Finance", deadline:"July 5, 2026", vacancies:"40", desc:"NayaPay is a growing fintech hiring Backend/Frontend Engineers, Product Designers, Compliance Officers and Risk Analysts.", applyLink:"https://www.nayapay.com/", isNew:true },
  { id:88, title:"1LINK – Payment Systems Jobs", org:"1LINK", category:"Private", city:"Karachi", edu:"BE Computer / BS IT", deadline:"June 30, 2026", vacancies:"25", desc:"1LINK (Pvt) Ltd requires Software Developers, Business Analysts, Network Engineers, and IT Security Officers.", applyLink:"https://www.1link.net.pk/", isNew:false },
  { id:89, title:"Shaukat Khanum Hospital – Medical Staff 2026", org:"SKMCH", category:"Private", city:"Lahore / Peshawar / Karachi", edu:"MBBS / Nursing / Allied Health", deadline:"July 20, 2026", vacancies:"100", desc:"Shaukat Khanum Memorial Cancer Hospital requires Oncologists, Resident Doctors, Nurses, Physiotherapists, and Lab Scientists.", applyLink:"https://www.skm.org.pk/", isNew:true },
  { id:90, title:"Agha Khan University Hospital – Nursing & Medical", org:"AKUH", category:"Private", city:"Karachi / Islamabad", edu:"MBBS / BSN Nursing", deadline:"July 15, 2026", vacancies:"80", desc:"Aga Khan University Hospital requires Registered Nurses (BSN), Doctors (House Officers), Medical Technologists and Allied Health staff.", applyLink:"https://www.aku.edu/", isNew:false },
  { id:91, title:"Indus Hospital – Healthcare Workers", org:"Indus Hospital", category:"Private", city:"Karachi", edu:"MBBS / Nursing / Allied", deadline:"July 5, 2026", vacancies:"60", desc:"The Indus Hospital requires Medical Officers, Nurses, Radiology Technicians, Pharmacists and Health IT Officers.", applyLink:"https://www.indushospital.org.pk/", isNew:false },
  { id:92, title:"Punjab Employees Social Security – PESSI Jobs", org:"PESSI", category:"Government", city:"Punjab", edu:"MBBS / Graduation", deadline:"July 10, 2026", vacancies:"70", desc:"Punjab Employees Social Security Institution requires Medical Officers, Dispensers, Social Security Inspectors, and Clerks.", applyLink:"https://pessi.gov.pk/", isNew:false },
  { id:93, title:"AJK Public Service Commission – Various Posts", org:"AJK PSC", category:"Government", city:"Azad Kashmir", edu:"Graduation / Masters", deadline:"July 8, 2026", vacancies:"120", desc:"AJK Public Service Commission announces vacancies for Lecturers, Junior Administrators, Engineers and Accounts Officers.", applyLink:"https://ajkpsc.gov.pk/", isNew:false },
  { id:94, title:"Balochistan Public Service Commission – BPSC", org:"BPSC", category:"Government", city:"Balochistan", edu:"Graduation / Masters", deadline:"July 15, 2026", vacancies:"150", desc:"BPSC announces recruitment for various BS-11 to BS-17 posts in different departments of Balochistan Government.", applyLink:"https://bpsc.gob.pk/", isNew:true },
  { id:95, title:"Gilgit Baltistan – GBPSC Jobs 2026", org:"GBPSC", category:"Government", city:"Gilgit-Baltistan", edu:"Graduation / Masters", deadline:"July 20, 2026", vacancies:"100", desc:"Gilgit Baltistan Public Service Commission requires Subject Specialists, ESSEs, and Administrative Officers for various departments.", applyLink:"#", isNew:true },
  { id:96, title:"SPSC – Sindh Public Service Commission", org:"SPSC", category:"Government", city:"Sindh", edu:"Graduation / Masters", deadline:"July 25, 2026", vacancies:"400+", desc:"SPSC announces multiple vacancies including Civil Servants, Technical Officers, Medical Officers and Education posts across Sindh.", applyLink:"https://www.spsc.gov.pk/", isNew:true },
  { id:97, title:"HEC – Higher Education Commission Jobs", org:"HEC", category:"Government", city:"Islamabad", edu:"Masters / PhD", deadline:"July 8, 2026", vacancies:"35", desc:"Higher Education Commission requires Programme Officers, Research Analysts, IT Officers, and Quality Assurance Specialists.", applyLink:"https://www.hec.gov.pk/", isNew:false },
  { id:98, title:"PM Youth Programme – NAVTTC Trainers", org:"NAVTTC", category:"Government", city:"All Over Pakistan", edu:"DAE / Graduation", deadline:"July 10, 2026", vacancies:"200", desc:"NAVTTC under PM Youth Programme requires Vocational Trainers, IT Instructors, and Freelancing/E-commerce Trainers.", applyLink:"https://www.navttc.org/", isNew:true },
  { id:99, title:"Punjab IT Board – Technology Division Jobs", org:"PITB", category:"Government", city:"Lahore", edu:"BS/MS Computer Science", deadline:"July 18, 2026", vacancies:"60", desc:"Punjab Information Technology Board requires Software Developers, Mobile App Developers, UI/UX Designers and AI/ML Engineers.", applyLink:"https://pitb.gov.pk/", isNew:true },
  { id:100, title:"National Highway Authority – NHA Jobs", org:"NHA", category:"Government", city:"All Over Pakistan", edu:"BE Civil / Graduation", deadline:"July 5, 2026", vacancies:"80", desc:"National Highway Authority requires Civil Engineers, Surveyors, Quality Inspectors, Accounts Officers and Administrative Staff.", applyLink:"https://www.nha.gov.pk/", isNew:false }
];

// ============================================================
// GOVERNMENT SCHEMES DATA
// ============================================================
const SCHEMES_DATA = [
  { icon:"💰", title:"PM Youth Business Loan", desc:"Interest-free loans up to Rs. 500,000 for youth aged 21–45 to start/expand business.", badge:"Open" },
  { icon:"🎓", title:"Hunarmand Pakistan Scheme", desc:"Free technical & vocational training in IT, AI, Digital Marketing, E-commerce, and Freelancing.", badge:"Open" },
  { icon:"🏠", title:"Mera Pakistan Mera Ghar", desc:"Affordable housing loan scheme for low/middle-income families. 5% markup on Rs. 3.5 million loan.", badge:"Active" },
  { icon:"💻", title:"DigiSkills Training Programme", desc:"Free online courses in freelancing, digital marketing, Shopify, SEO, QuickBooks — 200,000+ seats.", badge:"Open" },
  { icon:"👩‍⚕️", title:"Sehat Sahulat Programme", desc:"Free health insurance up to Rs. 1 million per family for government employees and low-income people.", badge:"Active" },
  { icon:"🌾", title:"Kissan Card Scheme", desc:"Agricultural subsidy card for farmers offering Rs. 25,000 per acre for seeds, fertilizer and pesticides.", badge:"Active" },
  { icon:"🚗", title:"PM Electric Vehicle Policy", desc:"Subsidized electric vehicles and motorbikes for youth entrepreneurs in ride-hailing sector.", badge:"New" },
  { icon:"📱", title:"Kamyab Jawan Programme", desc:"Skill development, sports, internships, and startup support for youth aged 15–29 years.", badge:"Open" },
];

// ============================================================
// APP STATE
// ============================================================
let allJobs = [...BUILT_IN_JOBS];
let filteredJobs = [...allJobs];
let displayedCount = 10;
const PER_PAGE = 10;
let activeCategory = '';
let activeSearch = '';

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  setLiveDate();
  startTicker();
  renderSchemes();
  setupScrollTop();
  updateCategoryCounts();
  renderJobs();
  refreshStatsFromJobs();
  tryGoogleSheet();
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => { if(e.key === 'Enter') doSearch(); });
  }
  
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const mainNav = document.getElementById('mainNav');
      if (mainNav) mainNav.classList.toggle('open');
    });
  }
});

// ============================================================
// LIVE DATE
// ============================================================
function setLiveDate() {
  const d = new Date();
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  const dateEl = document.getElementById('live-date');
  if (dateEl) dateEl.textContent = d.toLocaleDateString('en-PK', opts);
}

// ============================================================
// NEWS TICKER
// ============================================================
function startTicker() {
  const items = allJobs.filter(j => j.isNew).slice(0, 8).map(j => `🔴 NEW: ${j.title} — ${j.org} — Deadline: ${j.deadline}`);
  const tickerEl = document.getElementById('ticker');
  if (tickerEl) tickerEl.textContent = items.join('   ●   ');
}

// ============================================================
// ANIMATED STATS
// ============================================================
function animateStats(customTargets) {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = customTargets?.[el.dataset.statKey] ?? +el.dataset.target;
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if(current >= target) clearInterval(timer);
    }, 30);
  });
}

function refreshStatsFromJobs() {
  const jobCount = allJobs.length;
  const orgCount = new Set(allJobs.map(j => j.org)).size;
  const cityCount = new Set(allJobs.flatMap(j => j.city.split('/').map(c => c.trim()))).size;
  animateStats({ jobs: jobCount, orgs: orgCount, cities: cityCount, hours: 24 });
}

// ============================================================
// RENDER SCHEMES
// ============================================================
function renderSchemes() {
  const list = document.getElementById('schemesList');
  if (!list) return;
  list.innerHTML = SCHEMES_DATA.map(s => `
    <div class="scheme-item">
      <div class="scheme-icon">${s.icon}</div>
      <div>
        <div class="scheme-title">${s.title}</div>
        <div class="scheme-desc">${s.desc}</div>
        <span class="scheme-badge">${s.badge}</span>
      </div>
    </div>
  `).join('');
}

// ============================================================
// CATEGORY COUNTS
// ============================================================
function updateCategoryCounts() {
  const cats = ['Government','Army','Navy','PAF','PPSC','FPSC','NTS','Private'];
  cats.forEach(cat => {
    const el = document.getElementById('cnt-' + cat);
    if(el) el.textContent = allJobs.filter(j => j.category === cat).length + ' Jobs';
  });
}

// ============================================================
// FILTER / SEARCH
// ============================================================
function doSearch() {
  const searchInput = document.getElementById('searchInput');
  activeSearch = searchInput ? searchInput.value.trim().toLowerCase() : '';
  activeCategory = '';
  applyFilters();
}

function filterCat(cat) {
  activeCategory = cat;
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  activeSearch = '';
  applyFilters();
  
  const heading = document.getElementById('jobsHeading');
  if (heading) heading.textContent = cat + ' Jobs — June 2026';
  
  const mainContent = document.querySelector('.main-content');
  if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
}

function filterTag(tag) {
  activeSearch = tag.toLowerCase();
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = tag;
  activeCategory = '';
  applyFilters();
  
  const heading = document.getElementById('jobsHeading');
  if (heading) heading.textContent = 'Jobs in ' + tag + ' — 2026';
  
  const mainContent = document.querySelector('.main-content');
  if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
}

function applyFilters() {
  const cityEl = document.getElementById('filterCity');
  const orgEl = document.getElementById('filterOrg');
  const eduEl = document.getElementById('filterEdu');
  
  const city = cityEl ? cityEl.value.toLowerCase() : '';
  const org = orgEl ? orgEl.value.toLowerCase() : '';
  const edu = eduEl ? eduEl.value.toLowerCase() : '';

  filteredJobs = allJobs.filter(j => {
    const text = (j.title + j.org + j.city + j.category + j.edu + j.desc).toLowerCase();
    const matchSearch = !activeSearch || text.includes(activeSearch);
    const matchCat = !activeCategory || j.category === activeCategory || j.org === activeCategory;
    const matchCity = !city || j.city.toLowerCase().includes(city);
    const matchOrg = !org || j.category.toLowerCase().includes(org) || j.org.toLowerCase().includes(org);
    const matchEdu = !edu || j.edu.toLowerCase().includes(edu);
    return matchSearch && matchCat && matchCity && matchOrg && matchEdu;
  });

  displayedCount = PER_PAGE;
  const noResEl = document.getElementById('noResults');
  if (noResEl) noResEl.style.display = filteredJobs.length ? 'none' : 'block';
  renderJobs();
}

function clearFilters() {
  activeSearch = '';
  activeCategory = '';
  
  const searchInput = document.getElementById('searchInput');
  const cityEl = document.getElementById('filterCity');
  const orgEl = document.getElementById('filterOrg');
  const eduEl = document.getElementById('filterEdu');
  const heading = document.getElementById('jobsHeading');
  const noResEl = document.getElementById('noResults');
  
  if (searchInput) searchInput.value = '';
  if (cityEl) cityEl.value = '';
  if (orgEl) orgEl.value = '';
  if (eduEl) eduEl.value = '';
  if (heading) heading.textContent = 'Latest Jobs – June 2026';
  if (noResEl) noResEl.style.display = 'none';
  
  filteredJobs = [...allJobs];
  displayedCount = PER_PAGE;
  renderJobs();
}

// ============================================================
// RENDER JOBS CARDS
// ============================================================
function renderJobs() {
  const grid = document.getElementById('jobsGrid');
  if (!grid) return;
  const slice = filteredJobs.slice(0, displayedCount);
  grid.innerHTML = slice.map(j => jobCardHTML(j)).join('');
  
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  if (loadMoreWrap) {
    loadMoreWrap.style.display = filteredJobs.length > displayedCount ? 'block' : 'none';
  }
}

function jobCardHTML(j) {
  const educationTag = j.edu ? j.edu.split('/')[0].trim() : 'N/A';
  return `
    <div class="job-card ${j.isNew ? 'new-badge' : ''}" onclick="openModal(${j.id})">
      <div class="job-org">${j.org}</div>
      <div class="job-title">${j.title}</div>
      <div class="job-meta">
        <div class="job-meta-item"><span class="icon">📍</span>${j.city}</div>
        <div class="job-meta-item"><span class="icon">🎓</span>${j.edu}</div>
        <div class="job-meta-item"><span class="icon">👥</span>${j.vacancies} Vacancies</div>
      </div>
      <div class="job-tags">
        <span class="job-tag">${j.category}</span>
        <span class="job-tag edu">${educationTag}</span>
      </div>
      <div class="job-deadline">⏰ Last Date: ${j.deadline}</div>
      <div class="job-footer">
        <button class="apply-btn" onclick="event.stopPropagation();window.open('${j.applyLink}','_blank')">Apply Now →</button>
      </div>
    </div>
  `;
}

function loadMore() {
  displayedCount += PER_PAGE;
  renderJobs();
}

// ============================================================
// HELPERS — safe HTML + full job details for modal
// ============================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeJob(j) {
  const org = j.org || 'Department';
  const deadline = j.deadline || 'See advertisement';
  return {
    ...j,
    postName: j.postName || 'Multiple Posts',
    gender: j.gender || 'Male & Female',
    ageLimit: j.ageLimit || 'As per official advertisement',
    applyProcedure: j.applyProcedure || 'Online Registration',
    domicile: j.domicile || j.city || 'All Over Pakistan',
    jobType: j.jobType || (j.category === 'Private' ? 'Private Sector' : 'Government / Contract'),
    howToApply: j.howToApply || `All interested candidates who wish to apply for ${org} must first check the eligibility criteria for the relevant post from the official advertisement. Eligibility criteria generally include age limit, education qualification, gender, quota policy, and other requirements defined by the department. Candidates are advised to read this post carefully to ensure they meet all required conditions before proceeding. To submit the application online, visit the official application portal and complete the form with accurate information. The last date to apply is ${deadline}.`,
    importantPoints: j.importantPoints || `New government job opportunities have been announced in ${org}, creating a great chance for candidates who want to start a career in the public sector.\nSeveral posts are available, and every position has specific requirements — carefully review the official advertisement.\nBefore applying, review education, age criteria, and quota policy as conditions vary by post.\nLast date to apply: ${deadline}.`,
    adImage: j.adImage || ''
  };
}

function formatMultiline(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function buildModalHTML(raw) {
  const j = normalizeJob(raw);
  const facts = [
    ['Post Name', j.postName || j.title],
    ['Gender', j.gender],
    ['Department', j.org],
    ['Education', j.edu],
    ['Age Limit', j.ageLimit],
    ['Apply Procedure', j.applyProcedure],
    ['Domicile', j.domicile],
    ['Job Type', j.jobType],
    ['Vacancies', j.vacancies],
    ['Location', j.city],
    ['Last Date', j.deadline]
  ];

  const factsRows = facts.map(([label, val]) =>
    `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(val || '—')}</td></tr>`
  ).join('');

  const points = j.importantPoints.split(/\n|\|/).filter(Boolean).map(p =>
    `<li>${escapeHtml(p.replace(/^[•\-]\s*/, ''))}</li>`
  ).join('');

  const adBlock = j.adImage
    ? `<img class="modal-ad-image" src="${escapeHtml(j.adImage)}" alt="Official advertisement — ${escapeHtml(j.title)}" loading="lazy">`
    : `<div class="modal-ad-placeholder">
        <div class="modal-ad-placeholder-icon">📰</div>
        <p><strong>Official Advertisement</strong><br>Upload your ad image URL in Google Sheet column <strong>adImage</strong>, or save image in your website folder and paste the link here.</p>
      </div>`;

  return `
    <div class="modal-header-banner">
      <div class="modal-org">${escapeHtml(j.org)} • ${escapeHtml(j.category)}</div>
      <h2 class="modal-title">${escapeHtml(j.title)}</h2>
      <div class="modal-badges">
        ${j.isNew ? '<span class="modal-badge urgent">🔴 NEW</span>' : ''}
        <span class="modal-badge">📍 ${escapeHtml(j.city)}</span>
        <span class="modal-badge">⏰ Last Date: ${escapeHtml(j.deadline)}</span>
      </div>
    </div>

    <h4 style="margin-top:4px;font-size:13px;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:.4px;">Important Points</h4>
    <table class="modal-facts-table">${factsRows}</table>

    <div class="modal-block">
      <h4>📋 Job Summary</h4>
      <p>${formatMultiline(j.desc)}</p>
    </div>

    <div class="modal-block">
      <h4>📝 How to Apply</h4>
      <p>${formatMultiline(j.howToApply)}</p>
    </div>

    <div class="modal-block">
      <h4>⚠ Important Information</h4>
      <ul>${points}</ul>
    </div>

    <div class="modal-wa-cta">
      <p>📢 Follow our WhatsApp Channel for daily job alerts — 100% Free!</p>
      <a href="https://whatsapp.com/channel/0029Vb8PW9dEVccDqgGfDg2w" target="_blank" rel="noopener" class="modal-wa-btn">Join WhatsApp Channel</a>
    </div>

    <div class="modal-ad-section">
      <h4>Official Advertisement</h4>
      ${adBlock}
    </div>

    <div class="modal-actions">
      <a href="${escapeHtml(j.applyLink)}" target="_blank" rel="noopener" class="modal-apply-btn">Apply Online →</a>
      <button type="button" class="modal-apply-btn" style="background:var(--accent);" onclick="closeModal()">Close</button>
    </div>
  `;
}

// ============================================================
// JOB DETAIL MODAL
// ============================================================
function openModal(id) {
  const j = allJobs.find(x => x.id === id);
  if(!j) return;

  const modalContent = document.getElementById('modalContent');
  if (!modalContent) return;

  modalContent.innerHTML = buildModalHTML(j);

  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// ============================================================
// SCROLL TOP BUTTON
// ============================================================
function setupScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}

// ============================================================
// GOOGLE SHEETS INTEGRATION
// ============================================================
async function tryGoogleSheet() {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  const link = document.getElementById('sheetsLink');

  if(!SHEET_ID || SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
    if (dot) dot.className = 'status-dot';
    if (txt) txt.textContent = 'Using built-in jobs — connect Google Sheet (see HOW-TO-UPDATE-JOBS.txt)';
    if (link) link.href = 'admin.html';
    if (link) link.textContent = 'Open Job Admin Panel →';
    refreshStatsFromJobs();
    return;
  }

  if (link) link.href = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

  try {
    if (dot) dot.className = 'status-dot';
    if (txt) txt.textContent = 'Connecting to Google Sheet…';
    
    const res = await fetch(SHEET_URL);
    if(!res.ok) throw new Error('Fetch status error');
    
    const csv = await res.text();
    const jobs = parseSheetCSV(csv);
    
    if(jobs.length > 0) {
      allJobs = jobs;
      filteredJobs = [...allJobs];
      displayedCount = PER_PAGE;
      updateCategoryCounts();
      renderJobs();
      startTicker();
      refreshStatsFromJobs();
      if (dot) dot.className = 'status-dot connected';
      if (txt) txt.textContent = `Live — ${jobs.length} jobs from Google Sheet`;
    } else {
      throw new Error('No clean records returned');
    }
  } catch(e) {
    if (dot) dot.className = 'status-dot error';
    if (txt) txt.textContent = 'Sheet not reachable — showing built-in jobs';
    refreshStatsFromJobs();
    console.warn("Sheet fetch failed, using built-in jobs: ", e.message);
  }
}

function parseSheetCSV(csv) {
  // Normalize line breaks and drop empty items
  const lines = csv.split(/\r?\n/).filter(l => l.trim());
  if(lines.length < 2) return [];
  
  // Clean header-omitted line map loop
  return lines.slice(1).map((line, i) => {
    const clean = [];
    let insideQuote = false;
    let entry = '';

    // Systematic character traversal to cleanly separate commas from string quotes
    for (let c = 0; c < line.length; c++) {
      let char = line[c];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        clean.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    clean.push(entry.trim());

    return {
      id: i + 1,
      title:       clean[1]  || '',
      org:         clean[2]  || '',
      category:    clean[3]  || 'Government',
      city:        clean[4]  || 'All Over Pakistan',
      edu:         clean[5]  || 'Graduation',
      deadline:    clean[6]  || '',
      vacancies:   clean[7]  || 'Multiple',
      desc:        clean[8]  || '',
      applyLink:   clean[9]  || '#',
      isNew:       clean[10] === 'TRUE' || clean[10] === 'true' || clean[10] === '1',
      isScheme:    clean[11] === 'TRUE',
      schemeDesc:  clean[12] || '',
      gender:          clean[13] || '',
      ageLimit:        clean[14] || '',
      applyProcedure:  clean[15] || '',
      domicile:        clean[16] || '',
      jobType:         clean[17] || '',
      howToApply:      clean[18] || '',
      importantPoints: clean[19] || '',
      adImage:         clean[20] || '',
    };
  }).filter(j => j.title);
}
// ============================================================
// MOUSE TRACKING — dot, ring & glow
// ============================================================
(function() {
  const glow = document.getElementById('cursorGlow');
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');
  if (!glow || !ring || !dot) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my, gx = mx, gy = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  document.addEventListener('mouseover', e => {
    const interactive = e.target.closest('a, button, .job-card, .cat-card, .scheme-item, input, select');
    ring.classList.toggle('hovering', !!interactive);
  });

  function animateCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();

// ============================================================
// HERO FLOATING PARTICLES
// ============================================================
(function() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    p.style.width  = (4 + Math.random() * 6) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration  = (6 + Math.random() * 10) + 's';
    p.style.animationDelay     = (Math.random() * 8) + 's';
    p.style.opacity = (0.1 + Math.random() * 0.3);
    container.appendChild(p);
  }
})();

// ============================================================
// WHATSAPP POPUP — shows on every page load
// ============================================================
function openWaPopup() {
  const overlay = document.getElementById('waPopupOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeWaPopup() {
  const overlay = document.getElementById('waPopupOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Show popup on every page load (after 1.2s delay so page loads first)
window.addEventListener('load', () => {
  setTimeout(openWaPopup, 1200);
});

// Close popup if user clicks the dark overlay background
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('waPopupOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeWaPopup();
    });
  }
});
