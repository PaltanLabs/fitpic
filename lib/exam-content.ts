export interface ExamContent {
  about: string;
  officialUrl: string;
  uploadSteps: string[];
  commonMistakes: string[];
  photoTips: string[];
}

export const EXAM_CONTENT: Record<string, ExamContent> = {
  "SSC CGL": {
    about:
      "The Staff Selection Commission Combined Graduate Level (SSC CGL) examination is conducted annually by SSC to recruit staff for Group B and Group C posts in various central government ministries, departments, and organizations. Posts include Tax Assistants, Auditors, Inspectors in CBI/Customs/Income Tax, and Statistical Investigators. The exam follows a four-tier structure with Tier-I and Tier-II being computer-based tests.",
    officialUrl: "https://ssc.gov.in",
    uploadSteps: [
      "Register on the SSC One Time Registration (OTR) portal at ssc.gov.in and complete your profile.",
      "Navigate to the SSC CGL application form from the 'Latest Notifications' section.",
      "In the 'Upload Documents' step, click 'Upload Photograph' and select your JPEG file (100x120 pixels, 20-50KB).",
      "Upload your signature in JPEG format (140x60 pixels, 10-20KB) with a white background.",
      "Preview the uploaded images in the application summary before final submission and fee payment.",
    ],
    commonMistakes: [
      "Uploading a photo without the candidate's name and date written below on the print, which SSC mandates for all its exams.",
      "Exceeding the 50KB file size limit for the photograph, causing the SSC OTR portal to reject the upload silently.",
      "Using a colored or patterned background instead of the plain white background required by SSC.",
      "Submitting a signature image with a colored background instead of signing on plain white paper and scanning it.",
    ],
    photoTips: [
      "Write your name and the date of the photograph on the lower portion of the printed photo before scanning, as SSC requires this on all uploaded photographs.",
      "Use natural daylight or a ring light to ensure even illumination on your face against the white background.",
      "Keep the photo recent (taken within the last 3 months) to avoid discrepancies during the SSC CGL document verification stage.",
      "Wear a collared shirt or formal attire since the same photo will appear on your SSC CGL admit card and score card.",
    ],
  },

  "SSC CHSL": {
    about:
      "The SSC Combined Higher Secondary Level (CHSL) exam recruits candidates who have passed Class 12 for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), Postal Assistant, Sorting Assistant, and Data Entry Operator posts across central government offices. The exam includes a computer-based test followed by a skill test or typing test depending on the post.",
    officialUrl: "https://ssc.gov.in",
    uploadSteps: [
      "Log in to the SSC OTR portal with your registered credentials at ssc.gov.in.",
      "Open the SSC CHSL notification and click 'Apply' to start the application form.",
      "Upload your photograph (JPEG, 100x120 px, 20-50KB) with your name and date printed below the image.",
      "Upload your scanned signature (JPEG, 140x60 px, 10-20KB) done with a black or dark blue ink pen.",
      "Verify both images in the preview section, then proceed to pay the application fee and submit.",
    ],
    commonMistakes: [
      "Forgetting to add name and date on the photograph, which is a mandatory SSC requirement that leads to application rejection.",
      "Uploading a photo with spectacles that cause glare, which can cause issues during CHSL biometric verification at exam centres.",
      "Using a phone camera in low light leading to grainy images that fail the SSC portal's quality check.",
      "Uploading the signature in PNG format instead of JPEG, which the SSC system does not accept.",
    ],
    photoTips: [
      "Take the photo in front of a plain white wall and ensure your face covers about 70% of the frame.",
      "Avoid wearing white clothing against the white background, as it makes the image look washed out on the CHSL admit card.",
      "Sign with a thick-tipped black pen on white paper for a clean, high-contrast signature scan.",
      "Check that both files are well under the size limits before uploading, as the SSC portal does not resize files automatically.",
    ],
  },

  "SSC GD": {
    about:
      "SSC GD Constable is a recruitment exam conducted by the Staff Selection Commission for General Duty posts in Central Armed Police Forces (CAPF) including BSF, CISF, CRPF, ITBP, SSB, NIA, and Assam Rifles. Candidates must be between 18-23 years with a Class 10 pass. The selection process includes a computer-based exam, physical efficiency test (PET), physical standard test (PST), and medical examination.",
    officialUrl: "https://ssc.gov.in",
    uploadSteps: [
      "Create or log in to your SSC OTR profile at ssc.gov.in.",
      "Find the SSC GD Constable notification under 'Latest Notifications' and begin the application.",
      "Upload a recent passport-size photograph (JPEG, 100x120 px, 20-50KB) with name and date written below.",
      "Upload a scanned signature (JPEG, 140x60 px, 10-20KB) on a white background.",
      "Double-check that the images are clearly visible in the preview, submit the form, and save the confirmation page.",
    ],
    commonMistakes: [
      "Using an old photograph that does not match current physical appearance, which causes problems during the GD physical test verification.",
      "Wearing caps, sunglasses, or head coverings (unless religious) in the photo, which SSC explicitly prohibits.",
      "Uploading a cropped photo from a group picture where the resolution is too low after cropping.",
      "Not maintaining the exact pixel dimensions (100x120), which causes the SSC portal to stretch or compress the image.",
    ],
    photoTips: [
      "Since SSC GD involves a physical test, ensure the photo is very recent so examiners can identify you easily during PET/PST.",
      "Keep both ears visible in the photograph as this is a common requirement for paramilitary force applications.",
      "Use a simple, clean-shaven look or maintain the same facial hair during the exam that you have in the photo.",
      "Ensure the photo has no shadows on the face, as SSC GD verification officers may reject unclear photographs.",
    ],
  },

  "SSC MTS": {
    about:
      "SSC Multi-Tasking Staff (MTS) is a recruitment for Group C non-gazetted, non-ministerial posts in various central government departments. The positions include peon, daftary, jamadar, junior gestetner operator, and safaiwala. It is open to candidates who have passed Class 10, making it one of the most accessible government exams. The selection includes a computer-based test followed by a physical efficiency test.",
    officialUrl: "https://ssc.gov.in",
    uploadSteps: [
      "Register on the SSC OTR (One Time Registration) portal if you have not already.",
      "Access the MTS application link from the active notifications on ssc.gov.in.",
      "In the document upload section, upload your photograph in JPEG format (100x120 px, 20-50KB) with name and date.",
      "Upload your signature scan in JPEG (140x60 px, 10-20KB) signed with black ink on white paper.",
      "Review the form, verify that images display correctly, pay the fee, and download the confirmation slip.",
    ],
    commonMistakes: [
      "Using a selfie taken at arm's length instead of a properly framed passport photo, which looks distorted.",
      "Compressing the photo too aggressively to meet the 50KB limit, resulting in visible JPEG artifacts.",
      "Not writing the candidate's name and date below the photograph as mandated by SSC guidelines.",
      "Uploading signature with part of the text cut off because the scan was not aligned properly.",
    ],
    photoTips: [
      "If you do not have access to a photo studio, use a white bedsheet as a background and take the photo with a smartphone in portrait mode.",
      "Ensure uniform lighting on both sides of the face to avoid harsh shadows that reduce image quality.",
      "The photo should show head to just below shoulders with the face centered in the frame.",
      "Use FitPic to add the required name and date stamp below the photo before uploading to the SSC MTS form.",
    ],
  },

  UPSC: {
    about:
      "The Union Public Service Commission (UPSC) conducts the Civil Services Examination (CSE) to recruit officers for the Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), and other central Group A and Group B services. It is considered India's most prestigious and competitive exam, consisting of Preliminary, Mains, and Interview stages. UPSC also conducts exams like CDS, NDA, CAPF, and Engineering Services.",
    officialUrl: "https://upsconline.nic.in",
    uploadSteps: [
      "Register on the UPSC One Time Registration (OTR) system at upsconline.nic.in by creating a new account.",
      "Complete the OTR profile with personal details, educational qualifications, and upload your photograph and signature.",
      "For the photograph, upload a JPEG file (2cm x 2.5cm at 300 DPI, 20-300KB) with a plain light/white background.",
      "Upload your signature in JPEG format (2cm x 7cm, 10-40KB) signed with black ink on white paper.",
      "When applying for CSE or other exams, the OTR images are auto-populated. Verify them before submitting the application.",
    ],
    commonMistakes: [
      "Uploading a photo that does not match the UPSC OTR specifications, which differ from SSC requirements in dimensions and file size limits.",
      "Using a photo older than 6 months, which UPSC may flag during the personality test (interview) stage.",
      "Not keeping a digital backup of the exact uploaded photo, which is needed again during the Mains application if the OTR system has issues.",
      "Uploading a signature with inconsistent style compared to what you will sign during the UPSC Mains exam and interview.",
    ],
    photoTips: [
      "Dress formally in the photograph since it appears on your UPSC admit card and will be the first impression during document verification.",
      "Use a light-colored or white background as specified in the UPSC OTR instructions.",
      "Ensure the photo is sharp and high resolution since UPSC prints it on multiple documents throughout the multi-stage process.",
      "Practice your signature to keep it consistent, as UPSC verifies signature matches across Prelims, Mains, and the Interview.",
    ],
  },

  "IBPS/SBI": {
    about:
      "The Institute of Banking Personnel Selection (IBPS) conducts common recruitment exams for Probationary Officers (PO), Clerks, Specialist Officers (SO), and Regional Rural Bank (RRB) positions across 19 participating public sector banks in India. IBPS exams are the primary gateway for banking careers, with lakhs of candidates appearing annually. The selection process typically includes Prelims, Mains, and Interview (for PO/SO posts).",
    officialUrl: "https://ibps.in",
    uploadSteps: [
      "Visit the IBPS official portal at ibps.in and click on the active recruitment notification link.",
      "Register with your basic details to generate a provisional registration number and password.",
      "In the photo upload section, upload a recent colour passport photograph in JPEG format (200x230 pixels, 20-50KB).",
      "Upload your scanned signature (140x60 pixels, 10-20KB) and left thumb impression (240x240 pixels, 20-50KB) in JPEG.",
      "Upload a handwritten declaration in English/Hindi (800x400 pixels, 50-100KB) as required by IBPS, then verify and submit.",
    ],
    commonMistakes: [
      "Forgetting to upload the left thumb impression, which is unique to IBPS applications and not required by most other exams.",
      "Not uploading the handwritten declaration that IBPS requires in addition to the standard photo and signature.",
      "Using a scanned printout of a digital photo instead of a direct digital photograph, which looks blurred on the IBPS admit card.",
      "Submitting signature dimensions that do not match the IBPS specification, as IBPS is strict about 140x60 pixel requirements.",
    ],
    photoTips: [
      "IBPS requires a colour photograph with a plain white background. Do not use light blue or cream backgrounds.",
      "The face should cover about 50-75% of the photograph frame, taken from the front with both ears visible.",
      "For the left thumb impression, use blue or black stamp ink on white paper and scan it at high contrast.",
      "Write the handwritten declaration neatly in one paragraph using black ink, as IBPS checks this for identity verification.",
    ],
  },

  "SBI PO": {
    about:
      "The State Bank of India Probationary Officer (SBI PO) exam is one of India's most sought-after banking recruitment exams. SBI recruits POs directly through its own exam process, separate from IBPS. Selected candidates undergo a two-year probation period and are posted across SBI branches nationwide. The exam has three phases: Preliminary (objective), Mains (objective + descriptive), and Group Exercise with Interview.",
    officialUrl: "https://sbi.co.in/web/careers",
    uploadSteps: [
      "Go to the SBI careers portal at sbi.co.in/web/careers and find the SBI PO recruitment notification.",
      "Click 'Apply Online' and register with your email and mobile number to get login credentials.",
      "Upload a recent colour passport photograph in JPEG (200x230 pixels, 20-50KB) with white background.",
      "Upload your signature (140x60 pixels, 10-20KB) and left thumb impression (240x240 pixels, 20-50KB).",
      "Upload a handwritten declaration as specified in the notification, preview all images, and submit with fee payment.",
    ],
    commonMistakes: [
      "Confusing SBI's own application portal with the IBPS portal. SBI PO applications are submitted on sbi.co.in, not ibps.in.",
      "Not uploading the handwritten declaration, which SBI PO specifically requires alongside photo and signature.",
      "Using a photo where the face is too small in the frame, making it hard to verify identity at the SBI exam centre.",
      "Uploading a thumb impression that is smudged or too faint, causing issues during SBI's biometric verification.",
    ],
    photoTips: [
      "SBI PO is a professional banking role, so dress in smart formals for your photograph to create a good impression.",
      "Ensure the photograph is taken within the last month, as SBI may compare it during the GE/Interview stage.",
      "For the thumb impression, press your left thumb firmly on stamp ink and then onto white paper in a single clean press.",
      "Save high-resolution originals of all uploaded documents, as SBI may require re-uploads if the system detects quality issues.",
    ],
  },

  "SBI Clerk": {
    about:
      "SBI Clerk (Junior Associate) recruitment is conducted by the State Bank of India to fill clerical cadre positions across its branches. The role involves customer service, data entry, cash handling, and front-desk banking operations. The exam has two stages: Preliminary and Mains, both computer-based objective tests. There is no interview for clerical posts, making the written score decisive.",
    officialUrl: "https://sbi.co.in/web/careers",
    uploadSteps: [
      "Visit sbi.co.in/web/careers, locate the Junior Associate (Clerk) notification, and click 'Apply Online'.",
      "Register with personal details, mobile number, and email to generate your registration number.",
      "Upload your passport-size colour photograph in JPEG (200x230 pixels, 20-50KB) against a white background.",
      "Upload signature (140x60 px, 10-20KB), left thumb impression (240x240 px, 20-50KB), and handwritten declaration.",
      "Review all uploaded documents in the preview page, pay the application fee, and save the printout.",
    ],
    commonMistakes: [
      "Using the same photo specifications as SSC exams (100x120 px) instead of SBI's required 200x230 pixels.",
      "Forgetting the handwritten declaration upload, which is mandatory for all SBI recruitment applications.",
      "Uploading a signature written in pencil or with a very thin pen, making it nearly invisible after scanning.",
      "Not checking the preview carefully, as SBI's portal sometimes crops images differently than expected.",
    ],
    photoTips: [
      "Since there is no interview for SBI Clerk, the photo on your admit card is the primary identification. Make sure it is clear and recognizable.",
      "Use a plain white background and ensure no other person or object is visible in the frame.",
      "Keep the image well-lit with the face clearly visible, as SBI exam centres verify identity by matching the admit card photo.",
      "Sign your name in a consistent style that you can reproduce at the exam centre, as SBI checks signature consistency.",
    ],
  },

  "RBI Grade B": {
    about:
      "The Reserve Bank of India (RBI) Grade B Officer exam recruits for the position of Assistant Manager in the General, DEPR (Department of Economic and Policy Research), and DSIM (Department of Statistics and Information Management) streams. It is one of the most prestigious banking exams in India with a rigorous three-phase selection: Phase I (objective), Phase II (objective + descriptive), and Interview. The role involves policy analysis, regulation, and central banking operations.",
    officialUrl: "https://rbi.org.in/Scripts/Careers.aspx",
    uploadSteps: [
      "Visit the RBI recruitment portal at opportunities.rbi.org.in and register for the Grade B examination.",
      "Fill in personal, educational, and experience details in the multi-step application form.",
      "Upload a recent passport photograph in JPEG format (200x230 pixels, 20-50KB) with a white background.",
      "Upload your signature (140x60 pixels, 10-20KB) and left thumb impression (240x240 pixels, 20-50KB) in JPEG.",
      "Verify all documents, pay the fee online, and download the completed application form for your records.",
    ],
    commonMistakes: [
      "Using the RBI main website (rbi.org.in) instead of the dedicated recruitment portal (opportunities.rbi.org.in) for applications.",
      "Uploading a casual photograph, which looks out of place for a central bank officer position during the interview.",
      "Not scanning the left thumb impression with sufficient contrast, leading to a faint image that fails validation.",
      "Submitting a photo with watermarks from a photo editing app still visible in the image.",
    ],
    photoTips: [
      "Dress in formal business attire as the same photograph will be used during the RBI Grade B interview panel process.",
      "Use a high-quality camera or visit a professional studio, as RBI Grade B is a premium posting and the photo reflects on your application.",
      "Ensure the background is plain white with no patterns, shadows, or other people visible.",
      "Keep a digital copy of the exact uploaded files, as RBI may ask for the same images during the interview verification.",
    ],
  },

  NEET: {
    about:
      "The National Eligibility cum Entrance Test (NEET-UG) is conducted by the National Testing Agency (NTA) for admission to MBBS, BDS, AYUSH, veterinary, and nursing courses across India. It is the single entrance exam for undergraduate medical admissions in all government and private medical colleges (except AIIMS and JIPMER, which are now merged into NEET). Over 20 lakh students appear for NEET annually, making it one of the largest entrance exams in the world.",
    officialUrl: "https://neet.nta.nic.in",
    uploadSteps: [
      "Register on the NTA website at neet.nta.nic.in by creating an account with your email and mobile number.",
      "Fill in the NEET-UG application form with personal, academic, and category details.",
      "Upload a recent passport-size photograph in JPEG/JPG (10-200KB) with the candidate's name and date printed on it.",
      "Upload a scanned signature (4-30KB), left hand thumb impression (10-50KB), and a Class 10 passing certificate (100-400KB).",
      "Choose up to four preferred exam city centres, pay the fee, and download the confirmation page.",
    ],
    commonMistakes: [
      "Using a postcard-size (4x6 inch) photo instead of passport-size (3.5x4.5cm) as required by NTA for NEET.",
      "Not printing the candidate's name and date on the photograph, which NTA mandates and checks during NEET admit card verification.",
      "Uploading the right thumb impression instead of the left hand thumb impression as specified by NTA.",
      "Using a photo with a dark or patterned background instead of a white or light-coloured background.",
    ],
    photoTips: [
      "NTA specifies that the photo must be taken within the last 3 months with the candidate's name and date of photograph printed below.",
      "80% of the photo area should show the face. Take a close-up with the camera at face height.",
      "For students wearing spectacles, ensure there is no glare on the lenses. NTA recommends removing spectacles if they cause reflection.",
      "Use a professional photo studio for NEET since the photo appears on the admit card and OMR sheet, and is used for identity verification at the exam centre.",
    ],
  },

  "JEE Main": {
    about:
      "JEE Main is conducted by the National Testing Agency (NTA) for admission to NITs, IIITs, and other centrally funded technical institutions. It also serves as the qualifying exam for JEE Advanced (IIT admission). The exam covers Paper 1 (B.E./B.Tech), Paper 2A (B.Arch), and Paper 2B (B.Planning). JEE Main is held twice a year, and the better of the two scores is considered for ranking.",
    officialUrl: "https://jeemain.nta.nic.in",
    uploadSteps: [
      "Visit jeemain.nta.nic.in and register with a valid email ID and mobile number.",
      "Complete the application form with personal details, academic qualifications, and choice of papers.",
      "Upload a recent passport-size colour photograph in JPEG/JPG format (10-200KB) with candidate name and date printed on it.",
      "Upload your scanned signature (4-30KB), left hand thumb impression (10-50KB), and a Category/PwD certificate if applicable.",
      "Select up to four preferred exam cities, verify the application, pay the fee, and download the confirmation.",
    ],
    commonMistakes: [
      "Uploading a photo without the candidate's name and date stamp, which NTA requires for all its exams including JEE Main.",
      "Not choosing the correct paper (Paper 1 for B.Tech, Paper 2A for B.Arch) during the application, which cannot be changed later.",
      "Compressing the photograph too much to fit the 200KB limit, resulting in a pixelated image on the admit card.",
      "Using a scanned copy of an old physical photograph instead of a fresh digital photo, which often looks blurry.",
    ],
    photoTips: [
      "Take a fresh photograph with your name and the date clearly written below, as NTA uses this for verification at the JEE Main exam centre.",
      "Wear a light-coloured shirt against the white background so there is contrast between you and the background.",
      "Ensure the image is well-focused on the face with both ears visible and no hair covering the forehead excessively.",
      "If appearing for both JEE Main sessions, use the same photograph for consistency during NTA's verification process.",
    ],
  },

  GATE: {
    about:
      "The Graduate Aptitude Test in Engineering (GATE) is jointly conducted by IISc Bangalore and seven IITs on a rotational basis. It tests comprehensive understanding of undergraduate engineering, technology, architecture, science, and humanities subjects. GATE scores are used for M.Tech/PhD admissions in IITs, NITs, and IISc, as well as for PSU recruitment by organizations like ONGC, NTPC, IOCL, BHEL, and GAIL. The score is valid for three years.",
    officialUrl: "https://gate2025.iitr.ac.in",
    uploadSteps: [
      "Visit the official GATE website (the URL changes yearly based on the organizing IIT, e.g., gate2025.iitr.ac.in).",
      "Register using GOAPS (GATE Online Application Processing System) with your email and phone number.",
      "Upload a recent passport-size photograph in JPEG/JPG (5-200KB) with a white background, without name/date stamp.",
      "Upload a scanned signature in JPEG (5-100KB) and a valid photo ID proof (PDF, 100-500KB).",
      "Select your GATE paper, up to three exam cities, pay the fee, and download the submitted application.",
    ],
    commonMistakes: [
      "Adding a name and date stamp to the GATE photo. Unlike NTA exams, GATE does NOT require name/date printed on the photograph.",
      "Using the wrong year's GATE portal. Each year a different IIT hosts GATE, and old URLs become inactive.",
      "Uploading a photo ID proof in JPEG instead of PDF format, which GOAPS requires for the ID document.",
      "Not keeping the original digital files, which are needed if the organizing IIT asks for correction during the verification window.",
    ],
    photoTips: [
      "GATE requires a clean passport photo with white background and no text overlays, unlike SSC/NTA exams.",
      "Wear formal or semi-formal attire since the photo is used on the GATE scorecard which you submit to IITs and PSUs.",
      "Ensure the photo matches your current appearance, as GATE exam centres verify identity strictly at entry.",
      "Keep the photo file under 200KB while maintaining high clarity, as GOAPS has strict size validation.",
    ],
  },

  BPSC: {
    about:
      "The Bihar Public Service Commission (BPSC) conducts the Combined Competitive Examination (CCE) for recruitment to various administrative and police services in Bihar, including Bihar Administrative Service (BAS), Bihar Police Service (BPS), and other state services. The exam has three stages: Preliminary (objective), Mains (descriptive), and Interview. BPSC also conducts recruitment for judicial services, school teachers, and other state-level posts.",
    officialUrl: "https://bpsc.bih.nic.in",
    uploadSteps: [
      "Register on the BPSC online portal at onlinebpsc.bihar.gov.in by creating a new user account.",
      "Fill in the application form with personal, educational, and domicile details.",
      "Upload a recent passport-size photograph in JPEG format (50-100KB) with a white or light background.",
      "Upload your scanned signature in JPEG format (20-50KB) signed with black ink on white paper.",
      "Verify all details, pay the application fee through the integrated payment gateway, and print the confirmation.",
    ],
    commonMistakes: [
      "Using SSC-style photo specifications (100x120 px) instead of BPSC's own size and resolution requirements as mentioned in the notification.",
      "Not checking the BPSC notification for exam-specific photo guidelines, which can vary between the CCE and teacher recruitment exams.",
      "Uploading a photo taken more than 6 months ago, which BPSC examiners may question during the Mains or Interview stage.",
      "Submitting a signature that is too stylized or illegible, as BPSC verification officers compare it with the signature on your documents.",
    ],
    photoTips: [
      "Visit a local photo studio in Bihar that is familiar with BPSC application requirements, as specifications can differ from central exams.",
      "Ensure clear visibility of facial features with no shadows, as BPSC exam halls verify identity carefully.",
      "Dress formally since the same photo will be used on the BPSC admit card and throughout the multi-stage examination process.",
      "Keep both a digital and printed copy of the uploaded photo for carrying to the exam centre as backup identification.",
    ],
  },

  UPPSC: {
    about:
      "The Uttar Pradesh Public Service Commission (UPPSC) conducts the Provincial Civil Service (PCS) examination for recruitment to Group A and Group B posts in the UP state government, including UP Administrative Service, UP Police Service, UP Finance & Accounts Service, and other allied services. With UP being India's most populous state, UPPSC exams see massive participation. The process includes Preliminary, Mains, and Interview stages.",
    officialUrl: "https://uppsc.up.nic.in",
    uploadSteps: [
      "Visit the UPPSC online portal at uppsc.up.nic.in and click on 'Candidate Registration' for new users.",
      "Complete the detailed application form including personal, educational, and category information.",
      "Upload a recent passport-size colour photograph in JPEG format (20-50KB) with a light-coloured background.",
      "Upload your scanned signature in JPEG (10-20KB) and a scanned left thumb impression if required by the notification.",
      "Review the complete application with uploaded images, pay the fee via net banking/UPI, and save the confirmation page.",
    ],
    commonMistakes: [
      "Not reading the specific UPPSC notification guidelines, as photo size requirements can vary between PCS, RO/ARO, and other exams.",
      "Uploading a photo with spectacles that have tinted lenses, which UPPSC does not allow in application photographs.",
      "Using a very low-resolution camera, resulting in pixelated images that look unclear on the UPPSC admit card.",
      "Signing with a gel pen that smudges easily, producing a blurred signature scan.",
    ],
    photoTips: [
      "UPPSC PCS is a multi-stage exam. Use a professional photo that you would be comfortable presenting at the Interview Board.",
      "Ensure the photo has even lighting with no red-eye effect, which commonly occurs with flash photography.",
      "Keep your expression neutral and natural with mouth closed, looking directly at the camera.",
      "Maintain the same appearance (glasses, facial hair, hairstyle) at the exam that you have in the uploaded photograph.",
    ],
  },

  MPSC: {
    about:
      "The Maharashtra Public Service Commission (MPSC) conducts the State Services Examination (Rajya Seva) and Subordinate Services Examination for recruitment to various administrative positions in the Maharashtra state government. Key posts include Deputy Collector, Deputy Superintendent of Police, Tahsildar, and Block Development Officer. The exam is conducted in Marathi and English, and includes Preliminary, Mains, and Interview stages.",
    officialUrl: "https://mpsc.gov.in",
    uploadSteps: [
      "Register on the MPSC online portal at mpsconline.gov.in by creating a profile with Aadhaar-linked details.",
      "Navigate to the active examination notification and click 'Apply Online'.",
      "Upload a recent passport-size photograph in JPEG format (15-40KB) with a plain white or light background.",
      "Upload your scanned signature in JPEG format (10-30KB) done with black ink.",
      "Complete the Marathi/English medium selection, verify details, pay the fee, and download the application receipt.",
    ],
    commonMistakes: [
      "Not realizing that MPSC's online portal (mpsconline.gov.in) is different from the information website (mpsc.gov.in).",
      "Uploading documents with Aadhaar details not matching the application form, as MPSC cross-verifies with Aadhaar.",
      "Using a photo where clothing blends with the background colour, making the image look washed out.",
      "Submitting the application without selecting the correct medium (Marathi/English), which affects the Mains paper language.",
    ],
    photoTips: [
      "MPSC interviews are conducted in person in Mumbai or Pune. Use a formal photo that represents your professional appearance.",
      "Ensure the photograph background is completely plain without any studio props or borders visible.",
      "The photo should show your full face from the front, not at an angle, with a neutral expression.",
      "If you wear spectacles daily, keep them on for the photo but ensure there is no glare on the lenses.",
    ],
  },

  TNPSC: {
    about:
      "The Tamil Nadu Public Service Commission (TNPSC) conducts the Group I, Group II, Group II-A, Group III, and Group IV examinations for recruitment to various state government posts in Tamil Nadu. Group I recruits for top administrative posts like Deputy Collector and DSP, while Group IV covers lower-level posts like Village Administrative Officer and Junior Assistant. Exams are conducted in Tamil and English, with a strong emphasis on Tamil Nadu-specific general knowledge.",
    officialUrl: "https://tnpsc.gov.in",
    uploadSteps: [
      "Register on the TNPSC One Time Registration (OTR) system at tnpscexams.in with your personal details.",
      "Complete the OTR profile including education, community certificate details, and upload your photograph and signature.",
      "Upload a recent colour photograph in JPEG format (20-50KB, 150x200 pixels) with white background.",
      "Upload a scanned signature in JPEG (10-20KB, 150x50 pixels) signed with black ink.",
      "Apply for specific exams through the OTR dashboard, verify pre-filled details, and submit with fee payment.",
    ],
    commonMistakes: [
      "Not completing the TNPSC OTR registration first, which is a prerequisite before applying to any TNPSC exam.",
      "Uploading a photo with dimensions different from TNPSC's specific 150x200 pixel requirement.",
      "Using a photo where the face is too small, not meeting TNPSC's guideline that the face should occupy most of the frame.",
      "Not keeping the OTR login credentials safe, as the same profile is used for all TNPSC exams.",
    ],
    photoTips: [
      "TNPSC uses the OTR photo across all Group exams, so invest in a high-quality, professional photograph.",
      "White background is mandatory for TNPSC. Off-white or cream will be flagged during certificate verification.",
      "Ensure the photo is recent and matches how you will look during the TNPSC exam, especially for Group I interviews.",
      "Resize accurately to 150x200 pixels before uploading, as TNPSC's system may distort non-conforming images.",
    ],
  },

  WBCS: {
    about:
      "The West Bengal Civil Service (WBCS) examination is conducted by the West Bengal Public Service Commission (WBPSC) for recruitment to Group A, B, C, and D posts in West Bengal state services. Group A posts include West Bengal Administrative Service (WBAS) and West Bengal Police Service (WBPS). The exam has Preliminary (MCQ), Mains (descriptive), Personality Test, and Medical Examination stages. It is the most competitive state-level exam in West Bengal.",
    officialUrl: "https://wbpsc.gov.in",
    uploadSteps: [
      "Register on the WBPSC portal at wbpsc.gov.in by clicking the 'One Time Registration' link.",
      "Complete your OTR profile with personal details, educational qualifications, and upload documents.",
      "Upload a recent passport-size photograph in JPEG format (5-40KB) with a light background.",
      "Upload your full signature in JPEG format (5-20KB) done with black ink on white paper.",
      "Apply for WBCS through the OTR dashboard, verify details, pay the application fee, and download the confirmation.",
    ],
    commonMistakes: [
      "Using a photo file larger than WBPSC's strict 40KB limit, which is smaller than most other commissions allow.",
      "Not completing OTR registration beforehand, as WBPSC requires this before applying to any exam.",
      "Uploading a photo with a dark background, which WBPSC may reject during the application scrutiny process.",
      "Ignoring the specific pixel dimension requirements mentioned in the WBCS notification, which WBPSC checks rigorously.",
    ],
    photoTips: [
      "WBPSC has a notably strict 40KB file size limit. Use FitPic to compress the image while preserving clarity.",
      "Take the photo against a light blue or white background as preferred by WBPSC.",
      "Ensure your face takes up at least 60-70% of the image area for clear identification.",
      "The same OTR photo will be used from Prelims through the Personality Test, so choose a professional, recent photograph.",
    ],
  },

  RPSC: {
    about:
      "The Rajasthan Public Service Commission (RPSC) conducts the Rajasthan Administrative Service (RAS) and Rajasthan Taxation Service (RTS) Combined Competitive Examination for state civil services. Key posts include RAS, RPS (Police), Rajasthan Accounts Service, and cooperative service positions. RPSC also recruits for School Lecturer, First Grade Teacher, and Senior Teacher positions. Exams are held in Hindi and English with Preliminary, Mains, and Interview stages.",
    officialUrl: "https://rpsc.rajasthan.gov.in",
    uploadSteps: [
      "Visit the RPSC SSO portal at sso.rajasthan.gov.in and log in using your Rajasthan SSO ID.",
      "Navigate to the RPSC exam notification and start the application process linked through SSO.",
      "Upload a recent passport-size photograph in JPEG format (20-50KB) with white or light background.",
      "Upload a scanned signature in JPEG (10-20KB) done with dark ink on white paper.",
      "Complete all form fields including Rajasthan domicile details, pay the fee via the RPSC payment gateway, and save the form.",
    ],
    commonMistakes: [
      "Not having a Rajasthan SSO ID, which is mandatory for accessing the RPSC application portal.",
      "Confusing RPSC's photo requirements with those of UPSC, as dimensions and file size limits differ.",
      "Uploading a photograph where the face is partially covered by a scarf or cap (unless for religious reasons).",
      "Not downloading the submitted application form, as RPSC does not always send email confirmations.",
    ],
    photoTips: [
      "Create your Rajasthan SSO ID first at sso.rajasthan.gov.in before attempting to apply on the RPSC portal.",
      "Use a clean white background and formal attire, as the photo accompanies your admit card and result documents.",
      "Ensure the photograph has sharp focus on the face with natural skin tones and no filters applied.",
      "Keep the original uncompressed photo file, as RPSC sometimes opens a correction window where re-upload may be needed.",
    ],
  },

  GPSC: {
    about:
      "The Gujarat Public Service Commission (GPSC) conducts the Gujarat Administrative Service (GAS) and Gujarat Civil Service (GCS) Combined Competitive Examination for Class I and Class II posts in Gujarat state services. Key positions include Deputy Collector, Deputy Superintendent of Police, Section Officer, and Mamlatdar. GPSC also recructs for engineering, medical, education, and other technical posts. The GAS/GCS exam has Preliminary, Mains, and Interview stages, conducted in Gujarati and English.",
    officialUrl: "https://gpsc.gujarat.gov.in",
    uploadSteps: [
      "Visit the GPSC OJAS portal at ojas.gujarat.gov.in to access the application system.",
      "Register with personal details and create your OJAS login credentials.",
      "Upload a recent passport-size photograph in JPEG format (10-50KB) with a plain white background.",
      "Upload a scanned signature in JPEG (10-30KB) done with black or dark blue ink.",
      "Fill in the complete application form, select the Class I/II examination, pay the fee, and generate the confirmation number.",
    ],
    commonMistakes: [
      "Going to gpsc.gujarat.gov.in for applying instead of the OJAS portal (ojas.gujarat.gov.in) where applications are actually submitted.",
      "Not having a valid OJAS account, which is required for all Gujarat government exam applications.",
      "Uploading a photograph taken in a studio with coloured backdrops instead of the required white background.",
      "Missing the application deadline, as GPSC does not usually extend dates and the OJAS portal becomes inaccessible after the cutoff.",
    ],
    photoTips: [
      "GPSC's OJAS portal has specific file size constraints. Ensure your photo is well within the 50KB limit while being visually clear.",
      "Dress in formal attire consistent with a state civil service position for a professional appearance.",
      "Ensure even lighting on both sides of the face without any shadows or harsh contrasts.",
      "If you wear spectacles, ensure they are non-reflective and do not obstruct your eyes in the photo.",
    ],
  },

  "Delhi Police": {
    about:
      "Delhi Police recruitment is conducted by the Staff Selection Commission (SSC) for the post of Constable (Executive) in Delhi Police. It is one of the most sought-after law enforcement positions due to Delhi being the national capital. The selection process includes a computer-based exam, physical endurance and measurement test, and medical examination. Delhi Police constables are deployed across the capital for law and order, traffic, and VIP security duties.",
    officialUrl: "https://ssc.gov.in",
    uploadSteps: [
      "Register on the SSC One Time Registration portal at ssc.gov.in (Delhi Police recruitment is through SSC).",
      "Navigate to the 'Delhi Police Constable' notification from the active examinations list.",
      "Upload a passport-size photograph (JPEG, 100x120 px, 20-50KB) with name and date printed below.",
      "Upload a signature scan (JPEG, 140x60 px, 10-20KB) with a white background.",
      "Submit the application ensuring all SSC guidelines are met, as Delhi Police follows SSC's standard format.",
    ],
    commonMistakes: [
      "Looking for a separate Delhi Police recruitment portal. Delhi Police Constable recruitment is handled entirely through SSC.",
      "Not adding name and date on the photograph, which SSC mandates for all its exams including Delhi Police.",
      "Wearing caps, goggles, or accessories that obscure facial features, which will cause rejection during the physical test verification.",
      "Not maintaining a recent photo that matches current physical appearance, critical since Delhi Police has a physical measurement test.",
    ],
    photoTips: [
      "Since Delhi Police selection involves physical tests, ensure the photo is very recent and matches your current look.",
      "Follow all SSC photograph guidelines, including the name and date stamp below the photo.",
      "Keep both ears fully visible and ensure a front-facing, straight posture in the photograph.",
      "Use a plain white background with good lighting, and avoid any photo filters or enhancements.",
    ],
  },

  "UP Police": {
    about:
      "Uttar Pradesh Police recruitment is conducted by the UP Police Recruitment and Promotion Board (UPPRPB) for posts including Constable, Sub-Inspector (SI), and other ranks. Given UP's large population, these recruitments see massive applications, often exceeding 25 lakh candidates. The selection involves a written exam, physical standard test (PST), physical efficiency test (PET), document verification, and medical examination.",
    officialUrl: "https://uppbpb.gov.in",
    uploadSteps: [
      "Visit the UPPRPB official portal at uppbpb.gov.in and find the active recruitment notification.",
      "Click 'Apply Online' and register with your Aadhaar number, mobile number, and email.",
      "Upload a recent colour passport photograph in JPEG format (10-50KB) with a white or light blue background.",
      "Upload a scanned signature in JPEG (5-20KB) and a thumb impression if specified in the notification.",
      "Verify all personal details, upload documents, pay the fee, and save the application printout.",
    ],
    commonMistakes: [
      "Using an old photograph that does not match current appearance, causing identification issues during UP Police physical tests.",
      "Not reading the specific UPPRPB notification, as photo specs can differ between Constable and SI recruitments.",
      "Uploading a photo with a busy background taken at home instead of a proper passport photo with a plain background.",
      "Not saving the application printout, as UPPRPB requires it to be carried during document verification.",
    ],
    photoTips: [
      "UP Police physical tests verify identity strictly. Your photo must closely match how you look on the day of the test.",
      "Use a white or very light blue background as these are the most commonly accepted options for UP Police.",
      "Ensure the photograph is sharp and well-lit, taken within the last one month before applying.",
      "For Sub-Inspector posts, dress in smart attire for the photo as it is used throughout the multi-stage selection.",
    ],
  },

  RRB: {
    about:
      "The Railway Recruitment Boards (RRBs) conduct recruitment exams under the umbrella of RRB NTPC (Non-Technical Popular Categories) for posts such as Station Master, Goods Guard, Commercial Apprentice, Traffic Assistant, and Senior Clerk in Indian Railways. There are 21 regional RRBs across India handling these recruitments. The selection process includes CBT-1, CBT-2, Typing Skill Test/Computer-Based Aptitude Test, Document Verification, and Medical Examination.",
    officialUrl: "https://rrbcdg.gov.in",
    uploadSteps: [
      "Visit your regional RRB website (e.g., rrbcdg.gov.in for New Delhi region) and find the NTPC notification.",
      "Register using the centralized RRB recruitment portal with email, mobile, and Aadhaar details.",
      "Upload a colour passport photograph in JPEG (20-50KB) with a clear white background showing the face prominently.",
      "Upload a signature scan in JPEG (10-20KB) and a scanned copy of the candidate's 10th marksheet.",
      "Select preferred exam language, RRB region, and post preferences. Pay the fee and save the application.",
    ],
    commonMistakes: [
      "Applying through the wrong regional RRB. You must apply through the RRB of the region where you want to be posted.",
      "Using different photos for CBT-1 and CBT-2 stages, which creates verification inconsistencies.",
      "Not uploading the 10th class certificate/marksheet, which RRBs require during the application itself.",
      "Exceeding file size limits by uploading uncompressed studio photographs.",
    ],
    photoTips: [
      "RRBs conduct exams across multiple stages over many months. Use a recent, professional photo that will remain accurate throughout.",
      "White background is mandatory. Ensure there are no shadows or objects in the background.",
      "Keep the photo formal and clean since Railway jobs are government positions with strict identity protocols.",
      "Ensure the photo shows your natural face clearly, as RRBs use facial recognition at some exam centres.",
    ],
  },

  "RRB Group D": {
    about:
      "RRB Group D recruitment is for Level 1 posts in Indian Railways, including Track Maintainer Grade IV, Helper/Assistant in Electrical, Mechanical, Signal and Telecommunication departments, and other entry-level positions. It is one of the largest recruitments in the world, with crores of applicants in recent years. The selection involves a Computer Based Test (CBT), Physical Efficiency Test (PET), Document Verification, and Medical Examination.",
    officialUrl: "https://rrbcdg.gov.in",
    uploadSteps: [
      "Go to your regional RRB website and find the Group D (Level 1) recruitment notification.",
      "Register on the centralized RRB portal with your Aadhaar, email, and mobile number.",
      "Upload a colour passport photograph in JPEG (20-50KB) with a white background and face clearly visible.",
      "Upload a scanned signature (JPEG, 10-20KB) and other documents like Aadhaar and educational certificates as listed.",
      "Choose your preferred RRB region and railway zones, pay the application fee, and download the confirmation.",
    ],
    commonMistakes: [
      "Using a very low-resolution photo from a feature phone camera, which looks unclear on the admit card.",
      "Selecting the wrong RRB region, which determines your exam centre location and eventual posting zone.",
      "Not carrying a printout of the application with the uploaded photo to the PET, which RRBs require for verification.",
      "Uploading a signature that is inconsistent with your natural handwriting, causing issues during document verification.",
    ],
    photoTips: [
      "RRB Group D involves physical tests. Make sure the photo matches your current appearance closely.",
      "Use a simple white background and ensure good lighting. Many RRB Group D applicants face rejection for poor-quality photos.",
      "Take the photo from the front with a neutral expression and both ears visible.",
      "If you use FitPic for resizing, verify the output matches the exact specifications before uploading to the RRB portal.",
    ],
  },

  "RRB ALP": {
    about:
      "RRB Assistant Loco Pilot (ALP) and Technician recruitment is for technical positions in Indian Railways responsible for operating and maintaining locomotives, electrical systems, mechanical equipment, and signaling infrastructure. ALP candidates undergo rigorous training at Zonal Railway Training Institutes before being assigned to loco running duties. Selection includes CBT-1, CBT-2, Computer-Based Aptitude Test (only for ALP), Document Verification, and Medical Examination with stringent visual acuity standards.",
    officialUrl: "https://rrbcdg.gov.in",
    uploadSteps: [
      "Access the RRB ALP/Technician notification from your regional RRB website.",
      "Register on the RRB application portal with your ITI/Diploma details, Aadhaar, and contact information.",
      "Upload a recent colour passport photo in JPEG (20-50KB) with a white background.",
      "Upload your signature scan (JPEG, 10-20KB) and ITI/Diploma certificate scan as required.",
      "Select your preferred ALP or Technician trade, choose the RRB zone, pay the fee, and submit.",
    ],
    commonMistakes: [
      "Applying for ALP without having the required ITI/Diploma qualification, which leads to rejection at document verification.",
      "Not knowing that ALP has an additional Computer-Based Aptitude Test (CBAT) stage unlike other RRB posts.",
      "Uploading a photo with spectacles when you may need to pass the strict medical eye test for ALP (direct vision acuity requirements).",
      "Using a group photo crop that results in another person's shoulder being visible at the edge of the image.",
    ],
    photoTips: [
      "ALP posts have strict medical standards especially for eyesight. Use a photo that shows your natural appearance without spectacles if possible.",
      "Railway medical examiners compare your photo carefully. Ensure it is recent and taken in good lighting conditions.",
      "Use a white background and formal attire for a professional appearance on your railway identity documents.",
      "Keep the file size comfortably within the 50KB limit while ensuring facial details are sharp and clear.",
    ],
  },

  "India Post GDS": {
    about:
      "India Post Gramin Dak Sevak (GDS) recruitment is conducted by the Department of Posts for positions including Branch Postmaster (BPM), Assistant Branch Postmaster (ABPM), and Dak Sevak in rural post offices across India. GDS is a unique position as it is not a regular government post but provides allowances, and selection is based purely on Class 10 marks with no written exam. Applications are handled through the dedicated India Post GDS portal, with separate cycles for different postal circles.",
    officialUrl: "https://indiapostgdsonline.gov.in",
    uploadSteps: [
      "Visit the India Post GDS portal at indiapostgdsonline.gov.in during the active recruitment cycle.",
      "Register with your Aadhaar number, mobile number, and email ID to create a login.",
      "Upload a recent passport-size photograph in JPEG (20-50KB) with white background and clear visibility of face.",
      "Upload a scanned signature in JPEG (10-20KB) and Class 10 marksheet as a PDF or JPEG.",
      "Select the postal division, post office preferences (up to 10), and submit the form. No fee is charged for GDS.",
    ],
    commonMistakes: [
      "Missing the application window, as India Post GDS cycles are short (usually 15-20 days) and vary by postal circle.",
      "Not selecting enough post office preferences, which reduces your chances of allotment in the merit-based selection.",
      "Uploading a Class 10 marksheet with poor scan quality, as India Post verifies marks directly from the uploaded document.",
      "Using a photo where the background is off-white or light grey instead of the specified white.",
    ],
    photoTips: [
      "India Post GDS selection has no exam or interview, so your application documents are the only basis. Ensure a clean, professional photo.",
      "Use a plain white background with the face occupying most of the frame area.",
      "Take the photo in natural daylight for the most accurate skin tones and clarity.",
      "Since GDS posts are in rural areas, many applicants use phone cameras. Ensure the phone is steady and the lighting is even.",
    ],
  },

  "Kerala PSC": {
    about:
      "The Kerala Public Service Commission (Kerala PSC) conducts recruitment for various state government departments, public sector undertakings, and autonomous bodies in Kerala. It recruits for posts ranging from Last Grade Servants to senior administrative positions, teachers, police constables, and technical posts. Kerala PSC uses an online one-time registration system through its Thulasi portal, and candidates can apply for multiple posts using a single profile.",
    officialUrl: "https://keralapsc.gov.in",
    uploadSteps: [
      "Register on the Kerala PSC Thulasi portal at thulasi.psc.kerala.gov.in with your personal details.",
      "Complete the one-time profile with photo, signature, educational qualifications, and community details.",
      "Upload a recent colour passport photograph in JPEG format (10-30KB, 150x200 pixels) with light-coloured background.",
      "Upload your scanned signature in JPEG format (5-15KB, 150x50 pixels) signed with dark ink.",
      "Browse active notifications from the Thulasi dashboard, click 'Apply' for desired posts, confirm, and submit.",
    ],
    commonMistakes: [
      "Not registering on the Thulasi portal first, which is a prerequisite for applying to any Kerala PSC notification.",
      "Uploading a photo larger than the strict 30KB limit that Kerala PSC enforces on the Thulasi portal.",
      "Using a photo with dimensions different from the required 150x200 pixels, which the system may reject.",
      "Not updating the Thulasi profile photo when it becomes older than 6 months, as Kerala PSC recommends regular updates.",
    ],
    photoTips: [
      "Kerala PSC's Thulasi portal has strict file size limits (30KB for photo). Use FitPic to compress while maintaining clarity.",
      "A light-coloured background (white or light grey) is recommended by Kerala PSC for the profile photograph.",
      "Keep the photo current, as Kerala PSC uses the same image across multiple exam hall tickets.",
      "Resize to exactly 150x200 pixels before uploading, as the Thulasi portal enforces strict dimensional validation.",
    ],
  },

  "PAN Card": {
    about:
      "The Permanent Account Number (PAN) is a ten-digit alphanumeric identifier issued by the Income Tax Department of India to individuals, companies, and entities. PAN is mandatory for filing income tax returns, opening bank accounts, and conducting high-value financial transactions. Applications for new PAN or corrections/updates are processed through NSDL (now Protean e-Gov) and UTIITSL portals. Both Form 49A (for Indian citizens) and Form 49AA (for foreign citizens) require photo and signature uploads.",
    officialUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    uploadSteps: [
      "Visit the NSDL/Protean portal or UTIITSL portal and select 'New PAN' or 'Changes/Correction in PAN'.",
      "Fill in Form 49A with personal details, address, and contact information.",
      "Upload a recent colour photograph in JPEG format (2-100KB, 3.5cm x 2.5cm equivalent) with white background.",
      "Upload your scanned signature in JPEG format (2-100KB, 2cm x 4.5cm equivalent) on white paper.",
      "Submit the form with fee payment and either e-sign with Aadhaar OTP or send physical documents to NSDL.",
    ],
    commonMistakes: [
      "Uploading a photo that does not match the name on the PAN application, which causes processing delays at NSDL.",
      "Using a photo with poor contrast where the face is not clearly distinguishable, which NSDL may reject during processing.",
      "Not matching the signature with the one on supporting documents (like bank account), causing verification failure.",
      "Applying through unofficial third-party websites instead of the official NSDL or UTIITSL portals.",
    ],
    photoTips: [
      "PAN card photos are used for lifelong financial identity. Invest in a clear, professional photograph taken at a studio.",
      "Use a white background with the face clearly visible, as this photo will be printed on your PAN card.",
      "Ensure the photo is recent and accurately represents your appearance, as banks verify PAN identity in person.",
      "Sign naturally and consistently, as this signature will be cross-referenced with your bank and tax records for years.",
    ],
  },

  Aadhaar: {
    about:
      "Aadhaar is a 12-digit unique identification number issued by the Unique Identification Authority of India (UIDAI) to every resident of India. It is based on biometric data (fingerprints, iris scan, and facial photograph) and demographic information. Aadhaar serves as proof of identity and address for accessing government schemes, subsidies, banking, and mobile services. Aadhaar enrollment and updates are done through authorized enrollment centres and the UIDAI self-service portal.",
    officialUrl: "https://uidai.gov.in",
    uploadSteps: [
      "For online photo update, visit myaadhaar.uidai.gov.in and log in with your Aadhaar number and OTP.",
      "Navigate to 'Update Aadhaar' and select 'Update Photo and Other Details'.",
      "Upload a recent passport-size photograph in JPEG format (20-100KB) with white background.",
      "Verify your details, pay the update fee (if applicable), and submit the request.",
      "For new enrollment or biometric update, visit the nearest Aadhaar Seva Kendra where the photo is captured live.",
    ],
    commonMistakes: [
      "Trying to update the Aadhaar photo online when a biometric update (which requires visiting an enrollment centre) is needed.",
      "Using a photo where the face is partially covered, which UIDAI rejects since Aadhaar is a biometric identity document.",
      "Not carrying original supporting documents when visiting an Aadhaar Seva Kendra for photo or demographic update.",
      "Confusing the self-service photo update portal (myaadhaar.uidai.gov.in) with the general UIDAI information website.",
    ],
    photoTips: [
      "Aadhaar is India's most fundamental ID. Use a clear, well-lit photo that will remain recognizable for years.",
      "Plain white background is mandatory. No head coverings unless for religious reasons, with face fully visible.",
      "If visiting an Aadhaar Seva Kendra for live photo capture, dress neatly as the photo is taken on the spot.",
      "For online photo updates, ensure the image matches your current biometric data (facial features) already on record with UIDAI.",
    ],
  },

  Passport: {
    about:
      "Indian passports are issued by the Ministry of External Affairs through the Passport Seva portal and Passport Seva Kendras (PSKs) across India. Applications for new passports, renewals, and re-issues are processed online through the Passport Seva portal. India issues three types of passports: ordinary (blue), official (white), and diplomatic (red). The photograph for the passport application must meet strict International Civil Aviation Organization (ICAO) standards for facial biometrics.",
    officialUrl: "https://passportindia.gov.in",
    uploadSteps: [
      "Register on the Passport Seva portal at passportindia.gov.in and log in to your account.",
      "Fill out the passport application form (fresh/renewal) with personal, family, and address details.",
      "Upload a recent colour photograph in JPEG format (10-300KB, 3.5cm x 3.5cm equivalent, 350x350 px) with white background.",
      "The photo must comply with ICAO standards: frontal view, neutral expression, eyes open, mouth closed, no spectacles.",
      "Book an appointment at the nearest PSK/POPSK, pay the fee, and carry printed documents to the appointment.",
    ],
    commonMistakes: [
      "Not following ICAO standards, which are stricter than other Indian exam/ID photo requirements (e.g., no spectacles allowed).",
      "Using a photo with a non-white background. Passport Seva strictly requires a plain white background.",
      "Uploading a photo where the head is tilted, face is not centered, or shadows fall on the face or background.",
      "Using a photo where the head size is too small or too large relative to the 3.5cm x 3.5cm frame.",
    ],
    photoTips: [
      "Passport photos follow ICAO standards: face must cover 70-80% of the frame, both eyes visible, neutral expression, no spectacles.",
      "Use a plain white background with diffused, even lighting. No shadows should be visible anywhere in the image.",
      "The photo must be taken within the last 3 months. PSK officers may reject outdated photographs during verification.",
      "Do not wear white clothing against the white background, as it makes the boundary invisible. Wear a dark or colored top.",
    ],
  },

  "Delhi Judicial Service": {
    about:
      "The Delhi Judicial Service examination is conducted by the Delhi High Court for recruitment of judges at the level of Civil Judge (Junior Division) in the Delhi subordinate judiciary. Candidates must hold an LLB degree and be enrolled as an advocate with the Bar Council of India. The selection process includes a Preliminary Examination (objective), Mains Examination (descriptive on law subjects), viva voce (interview), and medical examination. It is one of the most prestigious judicial service exams in India.",
    officialUrl: "https://delhihighcourt.nic.in",
    uploadSteps: [
      "Visit the Delhi High Court website at delhihighcourt.nic.in and navigate to the 'Recruitment' section.",
      "Find the Delhi Judicial Service notification and click on the online application link (usually hosted on a third-party portal).",
      "Upload a recent passport-size colour photograph in JPEG format (20-100KB) with a white or light background.",
      "Upload a scanned signature in JPEG (10-50KB) done with black or blue ink on white paper.",
      "Fill in educational qualifications including LLB details and Bar Council enrollment number, pay the fee, and submit.",
    ],
    commonMistakes: [
      "Not checking the Delhi High Court website regularly, as judicial service notifications are published infrequently and have short application windows.",
      "Uploading a casual photograph for a judicial service exam where professionalism in appearance is expected throughout the selection.",
      "Forgetting to mention Bar Council enrollment details, which are mandatory for Delhi Judicial Service eligibility.",
      "Using a photo with an unprofessional background, as Delhi High Court interviewers may form impressions from application documents.",
    ],
    photoTips: [
      "This is a judicial service position. Wear formal attire (preferably Western formals or appropriate legal attire) in the photograph.",
      "Use a clean white background with professional studio lighting for the most formal appearance.",
      "Maintain the same appearance (glasses, facial hair) at the exam and viva voce that you have in the uploaded photograph.",
      "Ensure the photo conveys a serious, professional demeanor appropriate for a future judicial officer of the Delhi courts.",
    ],
  },
};
