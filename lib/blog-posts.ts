export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
  table?: { headers: string[]; rows: string[][] };
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  keywords: string[];
  relatedExamSlugs: string[];
  content: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  // Post 1: SSC CGL Photo & Signature Size Requirements 2026
  {
    slug: "ssc-cgl-photo-size-2026",
    title: "SSC CGL Photo & Signature Size Requirements 2026",
    description:
      "Complete guide to SSC CGL 2026 photo and signature size, format, and upload requirements. Avoid rejection with exact specs and step-by-step resizing instructions.",
    date: "2026-03-20",
    category: "Exam Requirements",
    keywords: [
      "ssc cgl photo size",
      "ssc cgl photo size 2026",
      "ssc cgl signature size",
      "ssc cgl photo requirements",
    ],
    relatedExamSlugs: ["ssc-cgl-photo-resizer", "ssc-cgl-signature-resizer"],
    content: [
      {
        heading: "SSC CGL 2026 Photo Requirements — Exact Specifications",
        paragraphs: [
          "The Staff Selection Commission (SSC) publishes strict photo specifications for the Combined Graduate Level (CGL) examination every year. For SSC CGL 2026, the photo requirements remain consistent with recent cycles, but even minor deviations can lead to form rejection. Understanding these specs before you upload is critical.",
          "Your photograph must be a recent colour passport-style image taken against a plain white or light-coloured background. The face should occupy roughly 70-80% of the frame, with both ears clearly visible. Caps, hats, and dark glasses are not permitted. Religious headwear is allowed only if it does not obscure facial features.",
        ],
        list: [
          "Dimensions: 100 × 120 pixels (width × height), equivalent to approximately 3.5 × 4.5 cm at 72 DPI",
          "File size: Between 20 KB and 50 KB",
          "Format: JPEG / JPG only",
          "Background: White or very light colour",
          "Name and date of photograph must be printed or stamped below the image",
          "The photograph should not be more than 3 months old from the date of application",
        ],
      },
      {
        heading: "SSC CGL 2026 Signature Requirements",
        paragraphs: [
          "Your signature must be done on a white sheet of paper with a black ink pen. Do not use gel pens or pencils — the scan often turns out faint or blurry. Sign in running hand; block/capital letters are explicitly not allowed.",
        ],
        list: [
          "Dimensions: 140 × 60 pixels (width × height)",
          "File size: Between 10 KB and 20 KB",
          "Format: JPEG / JPG only",
          "Ink colour: Black or dark blue",
          "Background: Plain white paper",
        ],
      },
      {
        heading: "Step-by-Step: How to Resize Your Photo for SSC CGL",
        paragraphs: [
          "Resizing a photo to exact pixel dimensions and file-size limits can be confusing if you try to do it in a generic image editor. FitPic's SSC CGL Photo Resizer handles the entire process in one step — crop, resize, and compress — all in your browser with zero uploads to any server.",
          "Here is the process:",
        ],
        list: [
          "Go to the SSC CGL Photo Resizer at fitpic.in/ssc-cgl-photo-resizer",
          "Upload your photograph (supports JPEG, PNG, HEIC, and WebP)",
          "Use the crop tool to frame your face correctly — the tool enforces the 100:120 aspect ratio automatically",
          "Click 'Download' — the image is resized to 100 × 120 px and compressed to 20-50 KB",
          "Verify the output by checking the file properties on your device before uploading to ssc.gov.in",
        ],
      },
      {
        heading: "How to Add Name & Date to Your Photo",
        paragraphs: [
          "SSC CGL requires that your name and the date the photograph was taken are printed below the image. Many candidates hand-write this before scanning, but that often produces uneven or illegible text. A better approach is to add the text digitally after scanning or photographing your image.",
          "Use the FitPic Name & Date Stamp tool at fitpic.in/name-date-stamp to overlay your name and the photograph date onto the image. The tool places the text below the photo in a clean, legible font and exports the final image in the correct dimensions and file size.",
        ],
      },
      {
        heading: "Common Rejection Reasons for SSC CGL Photos",
        paragraphs: [
          "Every year, thousands of SSC CGL applications are rejected or flagged during the document verification stage because of photo issues. Here are the five most common reasons:",
        ],
        list: [
          "Wrong file size — The photo exceeds 50 KB or is under 20 KB. This is the single most common rejection cause.",
          "Missing name and date — The printed name and photograph date are not visible below the image.",
          "Blurry or low-resolution image — Photos taken in poor lighting or with front-facing cameras at arm's length often lack sharpness.",
          "Non-white background — Cream, grey, or coloured backgrounds are flagged by automated validators on the SSC portal.",
          "Face not centred or too small — If the face occupies less than 70% of the frame, the photo may be rejected during verification.",
        ],
      },
      {
        heading: "Official SSC Resources",
        paragraphs: [
          "Always cross-check the latest notification on the official SSC website before submitting your application. Photo and signature requirements occasionally change between notification cycles.",
        ],
        list: [
          "SSC Official Website: ssc.gov.in",
          "SSC CGL 2026 Notification: Available at ssc.gov.in > Latest News after the official announcement",
          "SSC Candidate Login / Application Portal: ssc.gov.in > Apply",
        ],
      },
    ],
  },

  // Post 2: Photo Rejected in Government Exam Form? Complete Fix Guide 2026
  {
    slug: "photo-rejected-government-exam-fix",
    title: "Photo Rejected in Government Exam Form? Complete Fix Guide 2026",
    description:
      "Your exam form photo was rejected? Learn why government exam photos get rejected and how to fix them for SSC, UPSC, IBPS, NEET, JEE, and other exams.",
    date: "2026-03-18",
    category: "Guides",
    keywords: [
      "photo rejected government exam",
      "ssc photo rejected",
      "exam form photo correction",
      "upsc photo correction",
    ],
    relatedExamSlugs: [
      "ssc-cgl-photo-resizer",
      "upsc-photo-resizer",
      "ibps-sbi-photo-resizer",
    ],
    content: [
      {
        heading: "Why Government Exam Photos Get Rejected",
        paragraphs: [
          "Photo rejection is one of the most frustrating problems candidates face during online exam registration. The issue is almost always technical — the content of the photo may be perfectly fine, but the file does not meet the portal's automated validation rules. Understanding the specific reasons helps you fix the problem quickly.",
          "Here are the most common causes of rejection across all major Indian government exams:",
        ],
        list: [
          "File size out of range — Every exam specifies a minimum and maximum file size (e.g., 20-50 KB for SSC, 10-200 KB for UPSC). Even 1 KB over the limit triggers rejection.",
          "Wrong dimensions — Portals check pixel dimensions strictly. A 101 × 120 px image will fail a 100 × 120 px check.",
          "Wrong file format — Most portals accept only JPEG. Submitting PNG, WebP, or HEIC files causes instant rejection.",
          "Background not white — Automated tools on exam portals detect background colour. Off-white, grey, and blue backgrounds often fail.",
          "Image too blurry or dark — Portals may flag low-contrast or out-of-focus images.",
          "Face not clearly visible — Wearing glasses, caps, or having hair covering the face leads to manual rejection during verification.",
          "Missing name/date stamp — Exams like SSC require the candidate's name and photo date printed below the image.",
        ],
      },
      {
        heading: "Photo Correction Windows by Exam",
        paragraphs: [
          "If your photo has already been rejected after submission, don't panic. Most exam conducting bodies provide a correction window. The table below lists the correction policies for major exams. Always check the official notification for exact dates.",
        ],
        table: {
          headers: ["Exam", "Conducting Body", "Correction Window"],
          rows: [
            [
              "SSC (CGL, CHSL, GD, MTS)",
              "SSC",
              "Correction window opens 3-5 days after the application deadline. SSC announces exact dates in the notification.",
            ],
            [
              "UPSC (CSE, CDS, NDA)",
              "UPSC",
              "OTR (One Time Registration) system allows photo updates anytime before a specific application is submitted.",
            ],
            [
              "IBPS (PO, Clerk, SO)",
              "IBPS",
              "A 3-day correction window is usually provided about a week after registration closes.",
            ],
            [
              "NEET-UG",
              "NTA",
              "Correction window announced separately via neet.nta.nic.in — typically 3-4 days.",
            ],
            [
              "JEE Main",
              "NTA",
              "Correction window of 3-4 days is provided. Dates announced at jeemain.nta.nic.in.",
            ],
            [
              "RRB (NTPC, Group D)",
              "Railway Recruitment Boards",
              "Correction link sent via email/SMS. Usually 3-5 days.",
            ],
          ],
        },
      },
      {
        heading: "How to Fix a Rejected Photo — Step by Step",
        paragraphs: [
          "Follow these steps to correct your photo and re-upload during the correction window:",
        ],
        list: [
          "Check the rejection reason — Log in to the exam portal and look for the specific error message. Common messages include 'file size exceeds limit', 'invalid dimensions', or 'image not clear'.",
          "Use FitPic's Photo Validator at fitpic.in/photo-validator — Upload your photo and select the exam. The tool checks dimensions, file size, format, and aspect ratio against the exam's exact requirements and tells you what's wrong.",
          "Fix the photo using the appropriate FitPic resizer — Go to the exam-specific resizer (e.g., fitpic.in/ssc-cgl-photo-resizer or fitpic.in/upsc-photo-resizer). Upload, crop, and download the corrected version.",
          "Verify the fixed file — Check the downloaded file's properties on your phone or computer. Confirm the pixel dimensions and file size match the exam's requirements.",
          "Re-upload during the correction window — Log in to the exam portal, navigate to the photo upload section, and replace the rejected image with the corrected file.",
        ],
      },
      {
        heading: "Prevention: Check Before You Upload",
        paragraphs: [
          "The best strategy is to avoid rejection altogether. Before submitting your application, run your photo through FitPic's Photo Validator at fitpic.in/photo-validator. The tool simulates the exam portal's validation checks and flags any issues before you hit submit.",
          "This is especially important for exams like SSC and IBPS where the correction window is short and announced with little notice. If you miss the correction window, your application may be permanently rejected.",
        ],
      },
      {
        heading: "Tips for Getting It Right the First Time",
        paragraphs: [
          "Here are practical tips that eliminate most photo rejection issues:",
        ],
        list: [
          "Always use a dedicated exam photo resizer (like FitPic) instead of generic image editors — the tool enforces exact specs automatically.",
          "Take your photo against a plain white wall with good natural daylight. Avoid studio photos with coloured or gradient backgrounds unless you can get a white-background version.",
          "Use the rear camera of your phone, not the selfie camera. Rear cameras produce sharper, higher-resolution images.",
          "Do not apply any filters, beauty modes, or enhancements. Exam photos must look natural.",
          "For signature scans, use a black ballpoint pen on plain white paper. Scan or photograph in good light to maximise contrast.",
          "Keep a master copy of your resized photo and signature saved separately so you can re-upload quickly if needed.",
        ],
      },
    ],
  },

  // Post 3: Complete Exam Photo Size Guide 2026
  {
    slug: "exam-photo-size-guide-2026",
    title: "Complete Exam Photo Size Guide 2026 — All Government Exams",
    description:
      "Photo size requirements for every major Indian government exam in one place. SSC, UPSC, IBPS, Railway, NEET, JEE, State PSC, Police, PAN, Aadhaar, Passport — with exact specs.",
    date: "2026-03-15",
    category: "Guides",
    keywords: [
      "exam photo size guide",
      "government exam photo requirements 2026",
      "exam photo size chart",
    ],
    relatedExamSlugs: [
      "ssc-cgl-photo-resizer",
      "upsc-photo-resizer",
      "neet-photo-resizer",
    ],
    content: [
      {
        heading: "Why Exam Photo Specifications Matter",
        paragraphs: [
          "Every Indian government exam portal validates uploaded photos against strict technical requirements — pixel dimensions, file size, format, and sometimes background colour. A mismatch on any single parameter can get your application rejected, and correction windows are often short.",
          "This guide consolidates photo specifications for every major exam category in India as of 2026. Bookmark this page and refer to it whenever you fill out an exam application. All specs are verified against the most recent official notifications.",
        ],
      },
      {
        heading: "SSC Exams — Photo Specifications",
        paragraphs: [
          "The Staff Selection Commission uses consistent photo specs across most of its exams. The signature requirements are also uniform.",
        ],
        table: {
          headers: ["Exam", "Photo Size (px)", "File Size", "Signature Size (px)", "Sig File Size", "Resizer Link"],
          rows: [
            ["SSC CGL", "100 × 120", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ssc-cgl-photo-resizer"],
            ["SSC CHSL", "100 × 120", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ssc-chsl-photo-resizer"],
            ["SSC GD", "100 × 120", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ssc-gd-photo-resizer"],
            ["SSC MTS", "100 × 120", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ssc-mts-photo-resizer"],
          ],
        },
      },
      {
        heading: "UPSC Exams — Photo Specifications",
        paragraphs: [
          "UPSC uses the One Time Registration (OTR) system where candidates upload documents once. The photo specs are relatively generous in file size compared to SSC.",
        ],
        table: {
          headers: ["Exam", "Photo Size (px)", "File Size", "Format", "Resizer Link"],
          rows: [
            ["UPSC CSE (IAS)", "Min 200 × 230", "10-200 KB", "JPEG", "fitpic.in/upsc-photo-resizer"],
            ["UPSC CDS", "Min 200 × 230", "10-200 KB", "JPEG", "fitpic.in/upsc-photo-resizer"],
            ["UPSC NDA", "Min 200 × 230", "10-200 KB", "JPEG", "fitpic.in/upsc-photo-resizer"],
          ],
        },
      },
      {
        heading: "Banking Exams — Photo Specifications",
        paragraphs: [
          "IBPS and SBI exams share similar but not identical photo requirements. Pay close attention to file-size limits, which differ from SSC exams.",
        ],
        table: {
          headers: ["Exam", "Photo Size (px)", "File Size", "Signature Size (px)", "Sig File Size", "Resizer Link"],
          rows: [
            ["IBPS PO", "200 × 230", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ibps-sbi-photo-resizer"],
            ["IBPS Clerk", "200 × 230", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ibps-sbi-photo-resizer"],
            ["SBI PO", "200 × 230", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ibps-sbi-photo-resizer"],
            ["SBI Clerk", "200 × 230", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ibps-sbi-photo-resizer"],
            ["RBI Grade B", "200 × 230", "20-50 KB", "140 × 60", "10-20 KB", "fitpic.in/ibps-sbi-photo-resizer"],
          ],
        },
      },
      {
        heading: "Railway Exams — Photo Specifications",
        paragraphs: [
          "Railway Recruitment Boards have moved to online applications with strict photo validation. The specs below apply to the current cycle.",
        ],
        table: {
          headers: ["Exam", "Photo Size (px)", "File Size", "Format", "Resizer Link"],
          rows: [
            ["RRB NTPC", "Min 100 × 120", "20-50 KB", "JPEG", "fitpic.in/rrb-ntpc-photo-resizer"],
            ["RRB Group D", "Min 100 × 120", "20-50 KB", "JPEG", "fitpic.in/rrb-group-d-photo-resizer"],
            ["RRB ALP", "Min 100 × 120", "20-50 KB", "JPEG", "fitpic.in/rrb-alp-photo-resizer"],
          ],
        },
      },
      {
        heading: "Medical & Engineering Entrance Exams — Photo Specifications",
        paragraphs: [
          "NTA-conducted exams like NEET and JEE Main use a slightly different photo format. GATE, conducted by IITs, has its own specifications.",
        ],
        table: {
          headers: ["Exam", "Photo Size (px)", "File Size", "Format", "Resizer Link"],
          rows: [
            ["NEET-UG", "Min 200 × 230", "10-200 KB", "JPEG", "fitpic.in/neet-photo-resizer"],
            ["JEE Main", "Min 200 × 230", "10-200 KB", "JPEG/PNG", "fitpic.in/jee-main-photo-resizer"],
            ["GATE", "Min 200 × 230", "10-200 KB", "JPEG", "fitpic.in/gate-photo-resizer"],
          ],
        },
      },
      {
        heading: "State PSC Exams — Photo Specifications",
        paragraphs: [
          "State Public Service Commissions set their own photo requirements. Below are the most commonly searched state PSCs with their typical specs. Always verify with the latest official notification.",
        ],
        table: {
          headers: ["State PSC", "Photo Size (px)", "File Size", "Format", "Resizer Link"],
          rows: [
            ["BPSC (Bihar)", "250 × 250", "20-50 KB", "JPEG", "fitpic.in/bpsc-photo-resizer"],
            ["UPPSC (Uttar Pradesh)", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/uppsc-photo-resizer"],
            ["MPPSC (Madhya Pradesh)", "200 × 230", "20-100 KB", "JPEG", "fitpic.in/mppsc-photo-resizer"],
            ["RPSC (Rajasthan)", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/rpsc-photo-resizer"],
            ["WBPSC (West Bengal)", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/wbpsc-photo-resizer"],
            ["TNPSC (Tamil Nadu)", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/tnpsc-photo-resizer"],
            ["KPSC (Karnataka)", "200 × 230", "20-100 KB", "JPEG", "fitpic.in/kpsc-photo-resizer"],
            ["UKPSC (Uttarakhand)", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/ukpsc-photo-resizer"],
            ["GPSC (Gujarat)", "200 × 230", "20-100 KB", "JPEG", "fitpic.in/gpsc-photo-resizer"],
            ["HPSC (Haryana)", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/hpsc-photo-resizer"],
          ],
        },
      },
      {
        heading: "Police Recruitment Exams — Photo Specifications",
        paragraphs: [
          "Police recruitment in India is conducted at the state level. Most state police boards follow similar photo specs, though some have unique requirements.",
        ],
        table: {
          headers: ["Exam", "Photo Size (px)", "File Size", "Format", "Resizer Link"],
          rows: [
            ["UP Police", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/up-police-photo-resizer"],
            ["Bihar Police", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/bihar-police-photo-resizer"],
            ["MP Police", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/mp-police-photo-resizer"],
            ["Rajasthan Police", "200 × 230", "20-50 KB", "JPEG", "fitpic.in/rajasthan-police-photo-resizer"],
            ["Delhi Police", "100 × 120", "20-50 KB", "JPEG", "fitpic.in/delhi-police-photo-resizer"],
          ],
        },
      },
      {
        heading: "ID & Passport Documents — Photo Specifications",
        paragraphs: [
          "Government ID applications also have strict photo requirements. These are separate from exam forms but equally important.",
        ],
        table: {
          headers: ["Document", "Photo Size", "File Size", "Format", "Resizer Link"],
          rows: [
            ["PAN Card", "200 × 200 px", "20-50 KB", "JPEG", "fitpic.in/pan-card-photo-resizer"],
            ["Aadhaar Card", "200 × 200 px", "20-50 KB", "JPEG", "fitpic.in/aadhaar-photo-resizer"],
            ["Passport", "200 × 200 px (digital), 3.5 × 3.5 cm (print)", "10-300 KB", "JPEG", "fitpic.in/passport-photo-resizer"],
          ],
        },
      },
      {
        heading: "How to Use FitPic to Resize for Any Exam",
        paragraphs: [
          "FitPic supports all the exams listed above with dedicated resizer pages. Each page is pre-configured with the correct dimensions, file-size limits, and aspect ratio for that specific exam. All processing happens in your browser — your photos are never uploaded to any server.",
          "Visit fitpic.in, find your exam from the homepage, and resize your photo in under 30 seconds. It works on any phone, tablet, or computer with a modern browser.",
        ],
      },
    ],
  },

  // Post 4: How to Take a Perfect Exam Photo at Home with Your Phone
  {
    slug: "take-exam-photo-at-home-mobile",
    title: "How to Take a Perfect Exam Photo at Home with Your Phone",
    description:
      "Step-by-step guide to taking a government exam photo at home using your mobile phone. Setup, camera settings, lighting, and how to resize for upload.",
    date: "2026-03-12",
    category: "Tips",
    keywords: [
      "how to take passport photo at home",
      "exam photo with phone",
      "take photo for government exam mobile",
    ],
    relatedExamSlugs: ["ssc-cgl-photo-resizer", "upsc-photo-resizer"],
    content: [
      {
        heading: "What You Need",
        paragraphs: [
          "You do not need a professional studio or an expensive camera to take a valid exam photo. A smartphone camera with 5 megapixels or more (virtually every phone made after 2015) is sufficient. Here is everything you need:",
        ],
        list: [
          "A smartphone with a rear camera of 5 MP or higher",
          "A plain white wall or a white bedsheet hung flat — no wrinkles, no patterns",
          "Natural daylight — a window-facing spot during daytime is ideal",
          "A tripod, phone stand, or a friend to hold the phone steady at eye level",
          "A clean appearance — formal clothing, no caps or sunglasses",
        ],
      },
      {
        heading: "Setting Up the Shot",
        paragraphs: [
          "The setup is the most important part. A good setup eliminates 90% of the problems that cause exam photo rejection.",
          "Position yourself about 1 to 1.5 metres (roughly 4-5 feet) from the white wall. The camera should be at the same height as your face — not angled up or down. If you are using a tripod, set it on a table. If someone is helping you, ask them to hold the phone at your eye level.",
          "Face the light source. The best setup is to stand with a window directly in front of you (behind the camera). This gives soft, even illumination across your face without harsh shadows. Avoid standing with the window behind you — that creates a silhouette effect and darkens your face.",
          "Make sure the white wall behind you is evenly lit. If there are shadows on the wall, move away from it slightly or adjust the angle. The goal is a clean, bright white background with no visible shadows.",
        ],
      },
      {
        heading: "Camera Settings — What to Turn Off",
        paragraphs: [
          "Modern smartphone cameras apply aggressive processing by default — beautification, HDR, portrait mode, AI enhancement. All of these must be turned off for an exam photo. Here is how to configure your camera:",
        ],
        list: [
          "Turn off Beauty Mode / Face Smoothing — this is enabled by default on many phones (especially Xiaomi, Vivo, Oppo, Samsung). Go to camera settings and set beauty level to zero.",
          "Turn off Portrait Mode / Bokeh — portrait mode blurs the background, which can cause issues with background colour detection on exam portals.",
          "Turn off HDR — HDR merges multiple exposures and can create unnatural skin tones.",
          "Turn off Flash — flash creates harsh shadows and uneven lighting. Natural daylight is far superior.",
          "Use the rear camera, not the front/selfie camera — the rear camera has a higher resolution, better lens, and produces sharper images. The selfie camera also introduces a slight wide-angle distortion that makes your face look wider.",
          "Set the resolution to the highest available setting.",
          "Do not zoom in digitally. Move the phone closer instead if needed.",
        ],
      },
      {
        heading: "Taking the Photo",
        paragraphs: [
          "With the setup and camera configured, you are ready to take the shot. Follow these guidelines for the actual photo:",
        ],
        list: [
          "Face the camera directly — both ears should be visible. Do not tilt or turn your head.",
          "Keep a neutral, pleasant expression. A slight natural smile is acceptable; a wide grin is not.",
          "Keep your mouth closed.",
          "Eyes should be open and looking directly at the camera lens.",
          "Remove glasses unless you wear them at all times for medical reasons. If you keep them on, make sure there is no glare on the lenses.",
          "Hair should not cover your forehead or eyes.",
          "Wear a solid-coloured formal shirt or top. Avoid white clothing (it blends with the background) and avoid very bright patterns.",
          "Take multiple shots (at least 5-10) so you can pick the best one later.",
        ],
      },
      {
        heading: "After Taking: Resize to Exact Exam Requirements",
        paragraphs: [
          "The photo straight from your phone will be far too large — typically 3000 × 4000 pixels and several megabytes. Every exam requires specific dimensions (like 100 × 120 px for SSC or 200 × 230 px for UPSC) and file sizes (usually 20-50 KB).",
          "This is where FitPic comes in. Open the exam-specific resizer page (for example, fitpic.in/ssc-cgl-photo-resizer), upload your photo, use the built-in crop tool to frame your face correctly, and download the resized image. The tool handles dimension resizing, aspect-ratio enforcement, and file-size compression in one step.",
          "FitPic processes everything in your browser — your photo never leaves your device. This makes it safe to use even on public Wi-Fi or shared devices.",
        ],
      },
      {
        heading: "Common Mistakes to Avoid",
        paragraphs: [
          "Here are the mistakes candidates make most often when taking exam photos at home. Avoiding these will save you time and prevent rejection:",
        ],
        list: [
          "Using the selfie camera — this is the number one mistake. Selfie cameras produce lower quality images and introduce lens distortion.",
          "Applying filters — Instagram-style filters, even subtle ones, alter skin tone and contrast in ways that may not be acceptable.",
          "Wrong background — a cream-coloured wall, a patterned curtain, or a blue bedsheet will not pass background validation. Use a plain white surface.",
          "Low resolution — if you crop a large photo down to just the face and the original resolution was low, the result may be blurry. Always shoot at maximum resolution.",
          "Poor lighting — yellow artificial light (tungsten bulbs) gives your skin an orange cast. Natural daylight from a window is best.",
          "Standing too close to the wall — this casts a shadow behind you onto the wall. Stand 1-1.5 metres away from the background.",
        ],
      },
      {
        heading: "Adding Name & Date if Required",
        paragraphs: [
          "Some exams (notably SSC CGL, CHSL, GD, and MTS) require the candidate's name and the date the photograph was taken to be printed below the image. Do not try to handwrite this on a printout and re-scan — the result is almost always messy.",
          "Instead, use FitPic's Name & Date Stamp tool at fitpic.in/name-date-stamp. Enter your name and the date, and the tool places a clean, legible text strip below your photo. The output meets SSC's format and file-size requirements.",
        ],
      },
    ],
  },

  // Post 5: BPSC Photo & Signature Size Requirements 2026
  {
    slug: "bpsc-photo-size-2026",
    title: "BPSC Photo & Signature Size Requirements 2026",
    description:
      "Complete BPSC 2026 photo and signature specifications — dimensions, file size, format, and step-by-step upload guide for the BPSC online portal.",
    date: "2026-03-10",
    category: "Exam Requirements",
    keywords: [
      "bpsc photo size",
      "bpsc photo size 2026",
      "bpsc signature size",
      "bpsc photo requirements",
    ],
    relatedExamSlugs: ["bpsc-photo-resizer", "bpsc-signature-resizer"],
    content: [
      {
        heading: "BPSC 2026 Photo Requirements — Exact Specifications",
        paragraphs: [
          "The Bihar Public Service Commission (BPSC) conducts several competitive exams each year, including the flagship BPSC Combined Competitive Examination (CCE). For the 2026 cycle, the photo requirements follow BPSC's established standards. Since BPSC uses a square photo format unlike most other exams, candidates frequently run into issues when they use photos resized for SSC or UPSC.",
          "Your photograph must be a recent, colour, passport-style image with a plain white background. Your face should be clearly visible, centred in the frame, and occupy most of the image area. Both ears should be visible. Religious headwear is permitted as long as it does not cover facial features.",
        ],
        list: [
          "Dimensions: 250 × 250 pixels (square format — this is unique to BPSC)",
          "File size: Between 20 KB and 50 KB",
          "Format: JPEG / JPG only",
          "Background: Plain white",
          "The photo must be recent (taken within the last 6 months)",
          "Face should occupy 70-80% of the frame",
        ],
      },
      {
        heading: "BPSC 2026 Signature Requirements",
        paragraphs: [
          "The signature requirements for BPSC are consistent with most government exams. Use a black ballpoint pen on white paper. The signature should be in running handwriting — block letters are not accepted.",
        ],
        list: [
          "Dimensions: 140 × 60 pixels (width × height)",
          "File size: Between 10 KB and 20 KB",
          "Format: JPEG / JPG only",
          "Ink: Black or dark blue",
          "Background: Plain white paper",
          "The signature must match the one you will use on answer sheets and verification documents",
        ],
      },
      {
        heading: "Step-by-Step: Uploading on the BPSC Portal",
        paragraphs: [
          "The BPSC online application is available at bpsc.bih.nic.in. Here is the process for uploading your photo and signature:",
        ],
        list: [
          "Go to bpsc.bih.nic.in and click on the relevant exam notification link.",
          "Register with your email and mobile number, or log in if you already have an account.",
          "Fill in personal details, educational qualifications, and other required information.",
          "On the photo upload step, click 'Choose File' and select your resized 250 × 250 px JPEG photo.",
          "On the signature upload step, click 'Choose File' and select your 140 × 60 px JPEG signature.",
          "Preview the uploaded images. If either appears stretched, cropped incorrectly, or blurry, delete and re-upload.",
          "Submit the application and save/print the confirmation page.",
        ],
      },
      {
        heading: "How to Resize Your Photo for BPSC",
        paragraphs: [
          "BPSC's 250 × 250 px square format is different from the rectangular format used by SSC (100 × 120 px) and UPSC (200 × 230 px). You cannot reuse a photo resized for another exam — it will be the wrong aspect ratio.",
          "FitPic's BPSC Photo Resizer at fitpic.in/bpsc-photo-resizer is pre-configured for the exact BPSC specifications. The process is simple:",
        ],
        list: [
          "Open fitpic.in/bpsc-photo-resizer on your phone or computer.",
          "Upload your original photo (JPEG, PNG, HEIC, or WebP — any format is accepted as input).",
          "Use the crop tool to frame your face. The tool locks the aspect ratio to 1:1 (square) automatically.",
          "Click 'Download'. The image is resized to exactly 250 × 250 pixels and compressed to the 20-50 KB range.",
          "Check the output file properties to confirm the dimensions and size before uploading to the BPSC portal.",
        ],
      },
      {
        heading: "Common Rejection Reasons for BPSC",
        paragraphs: [
          "BPSC photo rejections follow patterns similar to other exams, with one important addition — the square format requirement catches many candidates off guard.",
        ],
        list: [
          "Wrong aspect ratio — Using a rectangular photo (from SSC or UPSC) instead of the required 250 × 250 square format. The BPSC portal will either reject it outright or stretch it, distorting your face.",
          "File size over 50 KB — Large photos straight from the camera will always exceed this limit. You must compress the image.",
          "Non-JPEG format — PNG, HEIC, or WebP files are not accepted. Always convert to JPEG before uploading.",
          "Blurry or dark photo — Photos taken in poor lighting conditions or with a front-facing camera at arm's length often lack sharpness.",
          "Coloured background — Only a plain white background is accepted. Off-white, cream, or blue backgrounds will be flagged.",
          "Face too small in the frame — If you use a full-body or half-body photo without cropping, the face will be too small for the 250 × 250 frame.",
        ],
      },
      {
        heading: "BPSC 2026 — General Guidance on Important Dates",
        paragraphs: [
          "BPSC announces exam notifications on its official website at bpsc.bih.nic.in. The 2026 exam calendar typically includes the BPSC CCE (Combined Competitive Examination), BPSC Teacher Recruitment, and various departmental exams.",
          "Check the BPSC website regularly for the latest notifications. Key dates to watch for include: notification release, application start date, application deadline, correction window, admit card release, and exam date. The correction window — if provided — is usually short (2-3 days), so it's best to get your photo right on the first attempt.",
          "For the most accurate and up-to-date information, always refer to the official BPSC notification at bpsc.bih.nic.in.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
