// Product page content of the Gau Sampurna website prototype, generated from the live product pages
// (gausampurna.com/products/<handle>, November 2026) by a one-off script; images are the store's own
// originals from the site repo's gs-products folder, resized to WebP in
// public/prototypes/gau-website/products/<id>/. Regenerate rather than hand-edit.
export type ProductContent = {
  overview: string[];
  description: string;
  gallery: string[];
  usps: { title: string; image: string | null }[];
  benefits: string[];
  dosages: { who: string; dose: string }[];
  howTo: { title: string; steps: string; image: string | null }[];
  info: { title: string; content: string }[];
  ingredients: { name: string; qty: string }[];
  ingredientsBasis: string;
  faqs: { q: string; a: string }[];
  reviews: { name: string; district: string; state: string; verified: boolean; rating: number; challenge: string; text: string }[];
};

export const PRODUCT_CONTENT: Record<string, ProductContent> = {
  "dairy-fortune": {
    "overview": [
      "Dairy Fortune Complete Cattle Feed Supplement, Enhances Milk Yield & Fat %, Improves Digestion & Breeding Health, All-in-One Nutrition for Cows"
    ],
    "description": "Dairy Fortune is a complete feed supplement designed for all stages of a cow's lifecycle—calf, heifer, milking, pregnant, and dry cows. Enriched with cow-specific minerals, essential vitamins, liver tonics, rumenotorics, toxin binders, and natural bypass fat and protein, it fulfills micronutrient needs, enhances milk production and quality, and supports optimal breeding health.",
    "gallery": [
      "/prototypes/gau-website/products/dairy-fortune/g1.webp",
      "/prototypes/gau-website/products/dairy-fortune/g2.webp",
      "/prototypes/gau-website/products/dairy-fortune/g3.webp",
      "/prototypes/gau-website/products/dairy-fortune/g4.webp",
      "/prototypes/gau-website/products/dairy-fortune/g5.webp"
    ],
    "usps": [
      {
        "title": "Higher Fat & SNF",
        "image": "/prototypes/gau-website/products/dairy-fortune/usp1.webp"
      },
      {
        "title": "Better Digestion",
        "image": "/prototypes/gau-website/products/dairy-fortune/usp2.webp"
      },
      {
        "title": "Strong Immunity",
        "image": "/prototypes/gau-website/products/dairy-fortune/usp3.webp"
      },
      {
        "title": "Successsful Insemination",
        "image": "/prototypes/gau-website/products/dairy-fortune/usp4.webp"
      },
      {
        "title": "More Milk",
        "image": "/prototypes/gau-website/products/dairy-fortune/usp5.webp"
      }
    ],
    "benefits": [
      "Improves body condition score (BCS), enhances coat shine, and prevents hoof-related problems.",
      "Optimizes feed intake, reduces bad vices, and controls aflatoxin levels in milk.",
      "Enhances milk production, improving milk fat percentage and SNF levels.",
      "Supports reproductive health by preventing repeat breeding and boosting conception rates.",
      "Prevents subclinical and clinical mastitis, promoting udder health."
    ],
    "dosages": [
      {
        "who": "Breeding Heifers",
        "dose": "200 grams/day"
      },
      {
        "who": "Cows/Buffaloes (15L/day)",
        "dose": "350–400 grams/day"
      },
      {
        "who": "Dairy Cows/Buffalo",
        "dose": "100–150 grams/day"
      },
      {
        "who": "Calves",
        "dose": "25–50 grams/day"
      },
      {
        "who": "Cows Producing 20L/day",
        "dose": "400–500 grams/day \nAbove 20L Milk (extra 5L) +100 grams/day for every 5L"
      },
      {
        "who": "Non-Breeding Heifers",
        "dose": "100 grams/day"
      },
      {
        "who": "Cows/Buffaloes (10L/day)",
        "dose": "300–350 grams/day"
      }
    ],
    "howTo": [
      {
        "title": "Feeding Methods",
        "steps": "Mix the prescribed amount of Dairy Fortune with a little water and jaggery powder (optional).Shape the mixture into small balls weighing around 150–200 grams.Feed the balls directly to the cow or buffalo.",
        "image": "/prototypes/gau-website/products/dairy-fortune/how1.webp"
      },
      {
        "title": "Feeding Methods",
        "steps": "Dissolve the prescribed quantity of Dairy Fortune in water.Stir thoroughly to ensure proper mixing.Feed the solution directly to the animal.",
        "image": "/prototypes/gau-website/products/dairy-fortune/how2.webp"
      },
      {
        "title": "Feeding Methods",
        "steps": "Add Dairy Fortune to regular cattle feed or concentrate feed.Mix thoroughly to ensure even distribution.Provide it during regular feeding times.",
        "image": "/prototypes/gau-website/products/dairy-fortune/how3.webp"
      },
      {
        "title": "Feeding Methods",
        "steps": "Sprinkle the prescribed dose of Dairy Fortune onto the fodder or TMR.Mix well to coat the feed evenly.Feed as part of the animal’s regular diet.",
        "image": "/prototypes/gau-website/products/dairy-fortune/how4.webp"
      }
    ],
    "info": [
      {
        "title": "Option 1: One-time Feeding",
        "content": "Feed the prescribed full dose of Dairy Fortune once daily, preferably in the morning after milking."
      },
      {
        "title": "Option 2: Split Doses",
        "content": "Divide the daily dose into two equal portions:Feed half in the morning after milking.Feed the other half in the evening after milking."
      },
      {
        "title": "Best Practices for Feeding",
        "content": "Always provide fresh, clean drinking water alongside Dairy Fortune feeding.Ensure the mixture (if using water or fodder) is consumed fully by the animal.Stick to the recommended dosage for optimal results.Introduce Dairy Fortune gradually if feeding it for the first time, over 3–5 days"
      }
    ],
    "ingredients": [
      {
        "name": "Vitamin A",
        "qty": "na"
      },
      {
        "name": "Vitamin D3",
        "qty": "na"
      },
      {
        "name": "Vitamin E",
        "qty": "na"
      },
      {
        "name": "Beta Carotene",
        "qty": "na"
      },
      {
        "name": "Vitamin B3/Nicotinamide",
        "qty": "na"
      },
      {
        "name": "Biotin",
        "qty": "na"
      },
      {
        "name": "Cobalt",
        "qty": "na"
      },
      {
        "name": "Copper",
        "qty": "na"
      },
      {
        "name": "Iron",
        "qty": "na"
      },
      {
        "name": "Iodine",
        "qty": "na"
      },
      {
        "name": "Chromium",
        "qty": "na"
      },
      {
        "name": "Selenium",
        "qty": "na"
      },
      {
        "name": "Manganese",
        "qty": "na"
      },
      {
        "name": "Calcium",
        "qty": "na"
      },
      {
        "name": "Phosphorus",
        "qty": "na"
      },
      {
        "name": "Sulphur",
        "qty": "na"
      },
      {
        "name": "Magnesium",
        "qty": "na"
      },
      {
        "name": "Herbal Rumino toric",
        "qty": "na"
      },
      {
        "name": "Myco-Toxin Binder",
        "qty": "na"
      },
      {
        "name": "RP-Lysine & Metheonine",
        "qty": "na"
      },
      {
        "name": "Liver Tonic & Liver Health Booster",
        "qty": "na"
      },
      {
        "name": "Immunity &Udder Health Booster",
        "qty": "na"
      },
      {
        "name": "Natural Bypass Fat & Protein",
        "qty": "na"
      },
      {
        "name": "Rumen Buffers",
        "qty": "na"
      }
    ],
    "ingredientsBasis": "",
    "faqs": [
      {
        "q": "Can Dairy Fortune improve milk fat and SNF content?",
        "a": "Yes, Dairy Fortune is formulated to improve milk fat% and SNF% by providing balanced nutrients and reducing metabolic stress in cows.\n"
      },
      {
        "q": "What is Dairy Fortune?",
        "a": "Dairy Fortune is a scientifically formulated complete feed supplement designed to address common challenges in dairy farming, such as low milk yield, poor milk quality, fertility issues, and cow health problems."
      },
      {
        "q": "How does Dairy Fortune improve milk yield?",
        "a": "Dairy Fortune contains chelated minerals, bypass protein, bypass fat, and herbal galactagogues that enhance feed efficiency and metabolism, leading to a noticeable increase in milk yield within 7–14 days."
      },
      {
        "q": "How long does it take to see results after using Dairy Fortune?",
        "a": "Farmers typically see improvements in milk yield within 7–14 days and better skin coat and overall body condition within 2 months of continuous feeding."
      },
      {
        "q": "How should I feed Dairy Fortune to my cows and buffaloes?",
        "a": "Feed Dairy Fortune daily according to the recommended dosage\nStage Dose\n10L/day milk yield 300–350 grams/day\n15L/day milk yield 350–400 grams/day\n20L/day milk yield 400–500 grams/day\nAbove 20L milk yield +100 grams/day for every extra 5L\nBreeding Heifers 200 grams/day\nNon-Breeding Heifers 100 grams/day\nCalves 25–50 grams/day"
      },
      {
        "q": "Is Dairy Fortune safe for all stages of cows and buffaloes?",
        "a": "Yes, Dairy Fortune is safe for all physiological stages, including calves, heifers, milking cows, and dry cows. It is scientifically balanced to meet the nutritional needs of all animals"
      },
      {
        "q": "Does Dairy Fortune help with fertility problems like anestrous and repeat breeding?",
        "a": "Yes, Dairy Fortune improves estrous symptoms and conception rates by addressing mineral deficiencies, hormonal imbalances, and overall nutritional gaps when fed continuously for 3 months.\n"
      },
      {
        "q": "Can Dairy Fortune reduce mastitis and hoof problems?",
        "a": "Dairy Fortune includes antioxidants, udder health enhancers, and chelated minerals, which help reduce the incidence of subclinical mastitis and hoof problems like lameness and foot rot."
      },
      {
        "q": "Does Dairy Fortune contain any harmful chemicals or antibiotics?",
        "a": "No, Dairy Fortune is free from harmful chemicals and antibiotics. It is made from high-quality natural and scientifically selected ingredients.\n"
      }
    ],
    "reviews": [
      {
        "name": "Ramesh Naik",
        "district": "Uttara Kannada",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Repeat breeding problem.",
        "text": "Dairy Fortune supported better breeding health and helped reduce repeat breeding issues."
      },
      {
        "name": "Geetha M",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Fluctuating milk yield.",
        "text": "After feeding Dairy Fortune, my cow’s milk production became more consistent."
      },
      {
        "name": "Prakash Gowda",
        "district": "Mysuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 3,
        "challenge": "Poor feed intake.",
        "text": "The product helped improve feed intake and overall performance of my dairy animals."
      },
      {
        "name": "Kavitha S",
        "district": "Chikkamagaluru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Frequent udder health issues.",
        "text": "Dairy Fortune helped maintain udder health and supported better milk hygiene."
      },
      {
        "name": "Mahesh Reddy",
        "district": "Kolar",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Low productivity and poor health.",
        "text": "My animals looked healthier, and milk production improved gradually."
      },
      {
        "name": "Renuka Patil",
        "district": "Bagalkot",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Low milk fat value.",
        "text": "The milk fat improved, which helped me get better value from the dairy collection center."
      },
      {
        "name": "Nagaraj Poojari",
        "district": "Udupi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Weakness and low milk quality.",
        "text": "Dairy Fortune gave good results in improving milk quality and animal strength."
      },
      {
        "name": "Sunitha K",
        "district": "Chitradurga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Mineral deficiency signs.",
        "text": "This supplement helped reduce common deficiency symptoms in my cows."
      },
      {
        "name": "Ashok Kumar",
        "district": "Tumakuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Low dairy income due to poor yield.",
        "text": "Dairy Fortune helped improve daily milk output and farm income."
      },
      {
        "name": "Savitha R",
        "district": "Ramanagara",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Irregular feeding and unstable milk yield.",
        "text": "My cow’s appetite and milk consistency improved after regular use."
      },
      {
        "name": "Shankar Patil",
        "district": "Belagavi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Low milk yield, seasonal drop in production",
        "text": "Milk yield has improved slightly and consistency is better than before. Works well with regular usage."
      },
      {
        "name": "Manjunath Hegde",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Managing multiple supplements, animal weakness",
        "text": "This product replaced multiple supplements for me. Animals look healthier and milk output is steady."
      },
      {
        "name": "Ramesh Gowda",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "High feed cost, inconsistent milk fat levels",
        "text": "After using Dairy Fortune, I noticed improvement in milk fat within 10 days. My cows are eating better and overall production has become more stable."
      },
      {
        "name": "Manjunath Gowda",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 3,
        "challenge": "Low milk yield and poor fat percentage.",
        "text": "After using Dairy Fortune regularly, my cow’s milk yield improved and the milk fat percentage also became better."
      },
      {
        "name": "Shobha Patil",
        "district": "Belagavi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Weak body condition and reduced feed intake.",
        "text": "Dairy Fortune helped improve my cow’s overall health, appetite, and body condition."
      },
      {
        "name": "Basavaraj K",
        "district": "Davanagere",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Low SNF and inconsistent milk quality.",
        "text": "I noticed better milk quality and improved SNF levels after continuous use."
      },
      {
        "name": "Lakshmi Hegde",
        "district": "Shivamogga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Dull coat and low energy.",
        "text": "My cow became more active, and the coat shine improved within a few weeks."
      }
    ]
  },
  "immune-fortune": {
    "overview": [
      "Immune Fortune Cattle Immunity Booster, Strengthens Disease Resistance & Overall Health, Supports Recovery & Productivity"
    ],
    "description": "Immune Fortune is a specialized formulation that boosts animal immunity, helping them resist diseases and recover quickly from stress and infections. It supports better vaccination response and enhances milk production. This product also improves adaptability to environmental and managemental challenges.",
    "gallery": [
      "/prototypes/gau-website/products/immune-fortune/g1.webp",
      "/prototypes/gau-website/products/immune-fortune/g2.webp",
      "/prototypes/gau-website/products/immune-fortune/g3.webp",
      "/prototypes/gau-website/products/immune-fortune/g4.webp",
      "/prototypes/gau-website/products/immune-fortune/g5.webp",
      "/prototypes/gau-website/products/immune-fortune/g6.webp",
      "/prototypes/gau-website/products/immune-fortune/g7.webp",
      "/prototypes/gau-website/products/immune-fortune/g8.webp"
    ],
    "usps": [
      {
        "title": "Faster Repear Infections",
        "image": "/prototypes/gau-website/products/immune-fortune/usp1.webp"
      },
      {
        "title": "Faster Illness Recovery",
        "image": "/prototypes/gau-website/products/immune-fortune/usp2.webp"
      },
      {
        "title": "Better Vaccine Response",
        "image": "/prototypes/gau-website/products/immune-fortune/usp3.webp"
      },
      {
        "title": "Summer Resilience",
        "image": "/prototypes/gau-website/products/immune-fortune/usp4.webp"
      },
      {
        "title": "Strong Immunity",
        "image": "/prototypes/gau-website/products/immune-fortune/usp5.webp"
      }
    ],
    "benefits": [
      "Helps animals adapt to various stress conditions, including environmental, managemental, and disease-related challenges like FMD and LSD.\nSpeeds up recovery from general diseases and infections.\nOptimizes milk production by reducing heat stress.\nImproves immune response for better disease resistance and vaccination outcomes.\nAids in quicker recovery from conditions such as mastitis and metritis."
    ],
    "dosages": [
      {
        "who": "Adult Cattle/Buffalo",
        "dose": "Up to 400 kg body weight: 20–30 ml per day for 7–10 days\n450 kg and above body weight: 40–50 ml per day for 7–10 days"
      },
      {
        "who": "Calves",
        "dose": "3–5 ml per day for 7–10 days"
      },
      {
        "who": "Heifers",
        "dose": "10–20 ml per day for 7–10 days"
      }
    ],
    "howTo": [
      {
        "title": "Step 1",
        "steps": "Shake the bottle well before use.",
        "image": "/prototypes/gau-website/products/immune-fortune/how1.webp"
      },
      {
        "title": "Step 2",
        "steps": "Administer directly or mix with feed or water as advised.(Follow the veterinarian's recommendation for specific cases or extended use. Ensure the container is tightly closed after every use.)",
        "image": "/prototypes/gau-website/products/immune-fortune/how2.webp"
      }
    ],
    "info": [
      {
        "title": "",
        "content": "\"Administer as per the recommended dose based on the animal's weight and condition\""
      }
    ],
    "ingredients": [
      {
        "name": "Vitamin E",
        "qty": "60 mg"
      },
      {
        "name": "Vitamin C",
        "qty": "75 mg"
      },
      {
        "name": "Amino Acids",
        "qty": "150 mg"
      },
      {
        "name": "Omega Fats",
        "qty": "5 mg"
      },
      {
        "name": "Sodium Chloride",
        "qty": "40 mg"
      },
      {
        "name": "Potassium Chloride",
        "qty": "35 mg"
      },
      {
        "name": "Selenium",
        "qty": "10 mcg"
      },
      {
        "name": "Manganese Sulphate",
        "qty": "15 mg"
      },
      {
        "name": "Amla, Phyllanthus niruri, & Withania somnifera",
        "qty": "65 mg"
      },
      {
        "name": "Stabilizers",
        "qty": "qs (quantity sufficient)"
      }
    ],
    "ingredientsBasis": "Composition of Immune Fortune (per 20 ml)",
    "faqs": [
      {
        "q": "How should Immune Fortune be stored?",
        "a": "Store it in a cool, dry place, away from direct sunlight. Ensure the container is tightly closed after each use."
      },
      {
        "q": "Is Immune Fortune suitable for organic farming practices?",
        "a": "Yes, Immune Fortune contains natural ingredients like Amla, Phyllanthus niruri, and Withania somnifera, making it suitable for organic farming."
      },
      {
        "q": "What is Immune Fortune, and how does it benefit my animals?",
        "a": "Immune Fortune is a liquid feed supplement that boosts immunity, helps animals recover from diseases and stress, and enhances overall performance, including milk production.\n"
      },
      {
        "q": "How should I administer Immune Fortune to my cattle or buffalo?",
        "a": "Administer 20–30 ml daily for animals weighing up to 400 kg and 40–50 ml daily for animals above 450 kg, for 7–10 days. It can be given directly or mixed with feed or water.\n"
      },
      {
        "q": "Can Immune Fortune be given to calves and heifers?",
        "a": "Yes, calves should be given 3–5 ml per day, and heifers should receive 10–20 ml per day for 7–10 days."
      },
      {
        "q": "What are the key benefits of using Immune Fortune?",
        "a": "It strengthens immunity, improves recovery from diseases like mastitis and metritis, reduces stress, optimizes milk production, and enhances disease resistance."
      },
      {
        "q": "When should I use Immune Fortune for my animals?",
        "a": "Use during stressful conditions such as environmental changes, illness, vaccination, calving, or heat stress. It’s also beneficial for general health improvement and performance enhancement."
      },
      {
        "q": "Is Immune Fortune safe for all types of livestock?",
        "a": "Yes, it is safe for cattle, buffaloes, calves, and heifers. However, consult a veterinarian for other livestock or specific concerns."
      },
      {
        "q": "Can Immune Fortune be used alongside other feed supplements?",
        "a": "Yes, it can be safely used alongside other feed or mineral supplements. Ensure you follow the recommended dosage."
      },
      {
        "q": "How soon can I expect to see results after starting Immune Fortune?",
        "a": "Improvements in immunity, stress tolerance, and overall performance are typically noticeable within 7–10 days of consistent use."
      }
    ],
    "reviews": [
      {
        "name": "Kavitha Nair",
        "district": "Chikkamagaluru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Managing herd health, mixed livestock",
        "text": "Using for both cows and goats. Health issues have reduced and productivity has improved."
      },
      {
        "name": "Rafiq Ahmed",
        "district": "Belagavi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Weak immunity, rainy season issues",
        "text": "Useful especially during monsoon. Animals seem more active and healthier overall."
      },
      {
        "name": "Suresh Bhat",
        "district": "Mysuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 3,
        "challenge": "Frequent infections, seasonal diseases",
        "text": "Cows are getting sick less often now. Milk production is stable even during weather changes."
      },
      {
        "name": "Manjunath Gowda",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Frequent seasonal health issues.",
        "text": "Immune Fortune helped my cows stay healthy during seasonal changes."
      },
      {
        "name": "Shobha Patil",
        "district": "Belagavi",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Weakness after illness.",
        "text": "My animals recovered faster from weakness after using Immune Fortune."
      },
      {
        "name": "Basavaraj K",
        "district": "Davanagere",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Stress and low immunity.",
        "text": "It improved immunity and helped animals remain active even during stress."
      },
      {
        "name": "Lakshmi Hegde",
        "district": "Shivamogga",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Weakness after vaccination.",
        "text": "Immune Fortune helped after vaccination and supported better health response."
      },
      {
        "name": "Ramesh Naik",
        "district": "Uttara Kannada",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Heat stress during summer.",
        "text": "It helped reduce heat stress and kept my cows comfortable."
      },
      {
        "name": "Geetha M",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Low appetite and tiredness.",
        "text": "After using Immune Fortune, my cow’s appetite and activity improved."
      },
      {
        "name": "Farmer",
        "district": "",
        "state": "Karnataka",
        "verified": true,
        "rating": 3,
        "challenge": "",
        "text": ""
      },
      {
        "name": "Prakash Gowda",
        "district": "Mysuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 3,
        "challenge": "Poor general health.",
        "text": "My animals looked stronger and healthier within a short time."
      },
      {
        "name": "Kavitha S",
        "district": "Chikkamagaluru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Slow recovery during mastitis.",
        "text": "Immune Fortune supported faster recovery during mastitis treatment."
      },
      {
        "name": "Mahesh Reddy",
        "district": "Kolar",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Milk drop during weather change.",
        "text": "It was useful during weather changes and helped maintain milk production."
      },
      {
        "name": "Renuka Patil",
        "district": "Bagalkot",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Weak calves.",
        "text": "My calves showed better strength after regular use as advised."
      },
      {
        "name": "Nagaraj Poojari",
        "district": "Udupi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Low disease resistance.",
        "text": "Immune Fortune helped improve disease resistance in my herd."
      },
      {
        "name": "Sunitha K",
        "district": "Chitradurga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Management stress in animals.",
        "text": "The animals became more active and recovered quickly from stress."
      },
      {
        "name": "Ashok Kumar",
        "district": "Tumakuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Reduced milk due to summer heat.",
        "text": "I used it during summer, and my cows handled heat stress better."
      }
    ]
  },
  "gau-dip": {
    "overview": [
      "Gau Dip Teat Dip Solution for Cattle, Prevents Mastitis & Bacterial Infection, Improves Udder Hygiene & Milk Safety"
    ],
    "description": "Gau-DIP Teat Dip is a unique lactic acid-based formulation designed to protect dairy cows' teats and udders from mastitis-causing microbes. It combines the power of sorbitol, lactic acid, and sodium salts to promote teat health and reduce the risk of infections, providing a natural alternative to chemical agents",
    "gallery": [
      "/prototypes/gau-website/products/gau-dip/g1.webp",
      "/prototypes/gau-website/products/gau-dip/g2.webp",
      "/prototypes/gau-website/products/gau-dip/g3.webp",
      "/prototypes/gau-website/products/gau-dip/g4.webp",
      "/prototypes/gau-website/products/gau-dip/g5.webp",
      "/prototypes/gau-website/products/gau-dip/g6.webp",
      "/prototypes/gau-website/products/gau-dip/g7.webp",
      "/prototypes/gau-website/products/gau-dip/g8.webp"
    ],
    "usps": [
      {
        "title": "Higher milk rate",
        "image": "/prototypes/gau-website/products/gau-dip/usp1.webp"
      },
      {
        "title": "Prevents Mastitis",
        "image": "/prototypes/gau-website/products/gau-dip/usp2.webp"
      },
      {
        "title": "No Milk Withdrawl",
        "image": "/prototypes/gau-website/products/gau-dip/usp3.webp"
      },
      {
        "title": "Heal Cracked Teats",
        "image": "/prototypes/gau-website/products/gau-dip/usp4.webp"
      },
      {
        "title": "Cleaner Milk",
        "image": "/prototypes/gau-website/products/gau-dip/usp5.webp"
      }
    ],
    "benefits": [
      "Prevents Mastitis by combating harmful bacteria.\nPromotes Teat Health with moisturizing and healing properties.\nNon-Toxic & Natural for chemical-free udder care.\nReduces Infection Risk and lowers mastitis rates.\nSupports Milk Hygiene by minimizing bacteria transfer during milking."
    ],
    "dosages": [
      {
        "who": "",
        "dose": "For optimal results, dip the teats in undiluted Gau-DIP, covering up to three-quarters of their length"
      }
    ],
    "howTo": [
      {
        "title": "Pre-Milking",
        "steps": "Step 1: Dip the teats in undiluted Gau-DIP, covering up to two-thirds of the teat's length.                                                                                                                                                                                                                                   \nStep 2:  Allow it to act for 30 seconds before milking.",
        "image": "/prototypes/gau-website/products/gau-dip/how1.webp"
      },
      {
        "title": "Post-Milking",
        "steps": "Step 1: Immediately dip the teats in undiluted Gau-DIP, covering the full length of the teat to disinfect and protect against mastitis-causing bacteria.After Use: Always wash your hands after handling the product and use dip cups for application",
        "image": "/prototypes/gau-website/products/gau-dip/how2.webp"
      }
    ],
    "info": [
      {
        "title": "",
        "content": "Clean Milk Production Protocols:Personal Hygiene: Wash hands thoroughly with warm water and soap before handling the animal.Animal Restraint: Safely restrain the animal using appropriate methods (travis, rope, metal bars).Udder Wash: Wash the udder with lukewarm water to maintain hygiene and remove dirt.Strip Yield: Discard the first 1–2 strips of milk to minimize infection risk.Pre-Dipping: Apply Gau-Dip or a similar solution to sanitize the teats.Udder Wiping: Use a clean, dry towel or cloth to wipe the udder and stimulate milking hormones.Milking Method: Use a milking machine or hand-milking technique for high-quality milk.Post-Dipping: Apply Gau-Dip post-milking to prevent infection and protect against mastitis"
      }
    ],
    "ingredients": [
      {
        "name": "Sorbito",
        "qty": "NA"
      },
      {
        "name": "Lactic Acid",
        "qty": "NA"
      },
      {
        "name": "Sodium Citrate/Sodium Chlorite",
        "qty": "NA"
      }
    ],
    "ingredientsBasis": "Composition of Gau-DIP Teat Dip",
    "faqs": [
      {
        "q": "How should Gau-DIP be applied to dairy animals?",
        "a": " Dip the teats in undiluted Gau-DIP, covering up to two-thirds of the teat's length pre-milking and the full length post-milking."
      },
      {
        "q": "Can Gau-DIP be used on all dairy animals?",
        "a": " Yes, Gau-DIP is safe for use on all dairy animals, including cows."
      },
      {
        "q": "How often should Gau-DIP be used?",
        "a": " Gau-DIP should be applied both pre- and post-milking for optimal protection against mastitis-causing bacteria."
      },
      {
        "q": "Is Gau-DIP safe for milk production?",
        "a": " Yes, Gau-DIP is a non-toxic, natural product and does not affect milk quality or safety."
      },
      {
        "q": "Can Gau-DIP be diluted for use?",
        "a": "No, Gau-DIP should be used undiluted for best results.\n"
      },
      {
        "q": "What should I do if Gau-DIP comes into contact with my eyes?",
        "a": "Rinse immediately with plenty of water if the product comes into contact with eyes.\n"
      },
      {
        "q": "Can Gau-DIP help with existing teat injuries?",
        "a": "Yes, Gau-DIP helps soothe and protect injured teats, promoting healing and reducing the risk of infection."
      },
      {
        "q": "Is it necessary to wash the teats after using Gau-DIP?",
        "a": " No, the product does not need to be washed off after application. It can stay on the teats for continuous protection.\n"
      },
      {
        "q": "How should Gau-DIP be stored?",
        "a": "Store Gau-DIP in a cool, dry place, away from direct sunlight.\n"
      },
      {
        "q": "Can Gau-DIP be used with other teat disinfectants?",
        "a": " It’s recommended to use Gau-DIP as the sole teat disinfectant to avoid any potential chemical interactions."
      }
    ],
    "reviews": [
      {
        "name": "Dinesh Gowda",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Mastitis issues, udder infections",
        "text": "Mastitis cases have reduced significantly after using Gau Dip. Very effective for udder hygiene."
      },
      {
        "name": "Harish Reddy",
        "district": "Tumakuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Poor hygiene practices, milk contamination",
        "text": "Simple to use and effective. Milk quality has improved and infections are under control."
      },
      {
        "name": "Imran Pasha",
        "district": "Bengaluru Rural",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "High vet costs, recurring udder problems",
        "text": "Reduced dependency on treatments. Regular use has improved cow health and lowered expenses."
      },
      {
        "name": "Manjunath Gowda",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Frequent mastitis.",
        "text": "Gau Dip helped reduce mastitis cases in my dairy farm."
      },
      {
        "name": "Shobha Patil",
        "district": "Belagavi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Poor teat hygiene.",
        "text": "I use Gau Dip after milking, and teat hygiene has improved well."
      },
      {
        "name": "Basavaraj K",
        "district": "Davanagere",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Teat infection risk.",
        "text": "Gau Dip is easy to apply and helps protect teats from infection."
      },
      {
        "name": "Lakshmi Hegde",
        "district": "Shivamogga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Dry and rough teats.",
        "text": "It helped keep the teats soft and healthy after regular use."
      },
      {
        "name": "Ramesh Naik",
        "district": "Uttara Kannada",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Hygiene issues during milking.",
        "text": "Milk hygiene improved because we started using Gau Dip before and after milking."
      },
      {
        "name": "Geetha M",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Infection around teats.",
        "text": "Gau Dip reduced infection risk and gave better udder care results."
      },
      {
        "name": "Prakash Gowda",
        "district": "Mysuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 3,
        "challenge": "Maintaining clean milk production.",
        "text": "It is a good product for daily clean milk production practice."
      },
      {
        "name": "Kavitha S",
        "district": "Chikkamagaluru",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Small cracks on teats.",
        "text": "Gau Dip helped soothe minor teat cracks and kept the udder healthier."
      },
      {
        "name": "Mahesh Reddy",
        "district": "Kolar",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Udder health complaints.",
        "text": "Since using Gau Dip, we have seen fewer udder-related complaints."
      },
      {
        "name": "Renuka Patil",
        "district": "Bagalkot",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Hygiene maintenance during milking.",
        "text": "Gau Dip is useful for maintaining hygiene in both hand milking and machine milking."
      },
      {
        "name": "Nagaraj Poojari",
        "district": "Udupi",
        "state": "Karnataka",
        "verified": true,
        "rating": 3,
        "challenge": "Difficulty following udder hygiene routine.",
        "text": "The product is simple to use and gives confidence in udder hygiene."
      },
      {
        "name": "Sunitha K",
        "district": "Chitradurga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Bacterial contamination risk.",
        "text": "Gau Dip helped reduce bacteria transfer during milking and supported clean milk."
      },
      {
        "name": "Ashok Kumar",
        "district": "Tumakuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Mastitis-causing germs after milking.",
        "text": "Regular use of Gau Dip helped protect my cows from mastitis-causing germs."
      }
    ]
  },
  "bovi-vita": {
    "overview": [
      "Bovi Vita Multivitamin Liquid for Cattle, Boosts Energy, Appetite & Overall Health, Daily Nutritional Supplement for Cows & Buffaloes"
    ],
    "description": "multivitamin and mineral liquid feed supplement for live stock",
    "gallery": [
      "/prototypes/gau-website/products/bovi-vita/g1.webp",
      "/prototypes/gau-website/products/bovi-vita/g2.webp",
      "/prototypes/gau-website/products/bovi-vita/g3.webp",
      "/prototypes/gau-website/products/bovi-vita/g4.webp",
      "/prototypes/gau-website/products/bovi-vita/g5.webp",
      "/prototypes/gau-website/products/bovi-vita/g6.webp",
      "/prototypes/gau-website/products/bovi-vita/g7.webp"
    ],
    "usps": [],
    "benefits": [
      "for weight gain and faster growth of poultry & cattle\nHelpful in production and Maintains overall health,                                                                                                                                                                             helps in healthy pregnancy improves fertiity & milk production of cattle                                                                                                                                                 should be given for immunity building & fighting agaist diseases\nIt should be given during any kind of stress in livestock."
    ],
    "dosages": [
      {
        "who": "cattle",
        "dose": "20 ml daily"
      },
      {
        "who": "calves",
        "dose": "5ml daily"
      },
      {
        "who": "sheep and goat",
        "dose": "5 ml daily"
      }
    ],
    "howTo": [
      {
        "title": "step 1",
        "steps": "Take Bovi vita as per the recommended dose using a syringe.                                                   ",
        "image": "/prototypes/gau-website/products/bovi-vita/how1.webp"
      },
      {
        "title": "step 2",
        "steps": "The measured Bovi vita can be directly drenched to the animal.Alternatively, it can be mixed with the animal’s feed.",
        "image": "/prototypes/gau-website/products/bovi-vita/how2.webp"
      }
    ],
    "info": [],
    "ingredients": [
      {
        "name": "vitamin A",
        "qty": "250000 IU"
      },
      {
        "name": "vitamin D3",
        "qty": "30000 IU"
      },
      {
        "name": "vitamin E",
        "qty": "150 mg"
      },
      {
        "name": "vitamin C",
        "qty": "500mg"
      },
      {
        "name": "vitamin B1",
        "qty": "10mg"
      },
      {
        "name": "vitamin B2",
        "qty": "3mg"
      },
      {
        "name": "vitamin B3",
        "qty": "80mg"
      },
      {
        "name": "vitamin B6",
        "qty": "3mg"
      },
      {
        "name": "vitamin B12",
        "qty": "100mcg"
      },
      {
        "name": "iron",
        "qty": "200mg"
      },
      {
        "name": "zinc",
        "qty": "70mg"
      },
      {
        "name": "selenium",
        "qty": "50ppm"
      },
      {
        "name": "biotin",
        "qty": "25mcg"
      },
      {
        "name": "Lysine",
        "qty": "75mg"
      },
      {
        "name": "choline chloride",
        "qty": "50mg"
      },
      {
        "name": "methionine",
        "qty": "50mg"
      },
      {
        "name": "aspartic acid",
        "qty": "5mg"
      },
      {
        "name": "threonine",
        "qty": "5mg"
      },
      {
        "name": "glutamine",
        "qty": "6mg"
      },
      {
        "name": "glysine",
        "qty": "7mg"
      },
      {
        "name": "inositol",
        "qty": "1mg"
      },
      {
        "name": "alanine",
        "qty": "5mg"
      }
    ],
    "ingredientsBasis": "each 5 ml contains",
    "faqs": [],
    "reviews": [
      {
        "name": "Rakesh Gowda",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Weak animals, low energy levels",
        "text": "Animals became more active after regular use. Good vitamin support for daily feeding."
      },
      {
        "name": "Imtiyaz Khan",
        "district": "Tumakuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Nutritional gaps, dull coat condition",
        "text": "Improved overall health and coat quality. Works well along with regular feed."
      },
      {
        "name": "Chandrashekhar R",
        "district": "Davanagere",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Stress in animals, low productivity",
        "text": "Helps reduce stress and improves productivity. Seen visible improvement in herd condition."
      }
    ]
  },
  "udder-fortune": {
    "overview": [
      "Udder Fortune H Udder Health Supplement, Prevents Mastitis, Improves Milk Quality & Udder Strength, Essential for Dairy Cattle"
    ],
    "description": "an effective feed suplement for udder development and udder health it contains all the vitamins that are necessary for the development of strong udder in heifers. and helps in recovery from mastitis",
    "gallery": [
      "/prototypes/gau-website/products/udder-fortune/g1.webp",
      "/prototypes/gau-website/products/udder-fortune/g2.webp",
      "/prototypes/gau-website/products/udder-fortune/g3.webp",
      "/prototypes/gau-website/products/udder-fortune/g4.webp",
      "/prototypes/gau-website/products/udder-fortune/g5.webp",
      "/prototypes/gau-website/products/udder-fortune/g6.webp",
      "/prototypes/gau-website/products/udder-fortune/g7.webp"
    ],
    "usps": [],
    "benefits": [
      "Support udder health and immunity.\n-Maintains milk quality.\n-Support animal health and production.\n-provides adeqate amount of vitamin H which is required for udder development in heifers"
    ],
    "dosages": [
      {
        "who": "Cattle, heifer & Buffalo",
        "dose": "10 ml per day\nOr as directed by the Veterinarian"
      }
    ],
    "howTo": [
      {
        "title": "step 2",
        "steps": "The measured Udder fortune H can be directly drenched to the animal.Alternatively, it can be mixed with the animal’s feed.",
        "image": "/prototypes/gau-website/products/udder-fortune/how1.webp"
      },
      {
        "title": "step 1",
        "steps": "Take the Udder Fortune H as per the recommended dose using a syringe.                ",
        "image": "/prototypes/gau-website/products/udder-fortune/how2.webp"
      }
    ],
    "info": [],
    "ingredients": [
      {
        "name": "Vitamin H",
        "qty": "500 mcg"
      },
      {
        "name": "Vitamin A",
        "qty": "25,000 IU"
      },
      {
        "name": "Vitamin D3",
        "qty": "10.500 IU"
      },
      {
        "name": "Vitamin E",
        "qty": "55 mg"
      },
      {
        "name": "Selenium",
        "qty": "6 mcg"
      },
      {
        "name": "Vitamin C",
        "qty": "5 mg"
      },
      {
        "name": "Vitamin B12",
        "qty": "1 mcg"
      },
      {
        "name": "Excipients",
        "qty": "q.s."
      },
      {
        "name": "Purified Water",
        "qty": "q.s."
      }
    ],
    "ingredientsBasis": "Each ml. contains",
    "faqs": [],
    "reviews": [
      {
        "name": "Sunitha R",
        "district": "Shivamogga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Concern about future milk production.",
        "text": "Very useful for heifers before first calving."
      },
      {
        "name": "Nagaraj B",
        "district": "Chitradurga",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Poor body condition.",
        "text": "Udder health improved and animals looked stronger."
      },
      {
        "name": "Mahesh Gowda",
        "district": "Ramanagara",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Udder weakness.",
        "text": "My cows recovered better from udder-related stress and maintained production."
      },
      {
        "name": "Girish Kulkarni",
        "district": "Belagavi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Heat and irritation in udder",
        "text": "Provides cooling effect and relief. Useful for regular udder care."
      },
      {
        "name": "Mahesh B",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Udder swelling, irritation",
        "text": "Very effective in reducing swelling and keeping udder healthy. Quick visible results."
      },
      {
        "name": "Nagesh Gowda",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Frequent udder infections",
        "text": "Helps prevent infections and keeps udder condition stable. Good addition to routine."
      },
      {
        "name": "Ramesh Gowda",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Poor udder growth in heifers.",
        "text": "Udder Fortune H helped improve udder development in my heifers. After calving, milk production was better than expected."
      },
      {
        "name": "Shankar Patil",
        "district": "Belagavi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Repeated udder health issues.",
        "text": "I noticed healthier udders and better milk quality after regular use."
      },
      {
        "name": "Manjunath H",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Weak udder development.",
        "text": "Excellent product for maintaining udder health in young dairy animals"
      },
      {
        "name": "Lakshmi N",
        "district": "Mysuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Delayed udder development.",
        "text": "My heifers showed visible improvement within a month."
      },
      {
        "name": "Pradeep Kumar",
        "district": "Tumakuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Low udder immunity.",
        "text": "Milk quality improved and animals stayed healthier."
      },
      {
        "name": "Veeresh Patil",
        "district": "Vijayapura",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Underdeveloped udder.",
        "text": "Excellent support for first-calving heifers."
      },
      {
        "name": "Deepa K",
        "district": "Kolar",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Low production potential.",
        "text": "Improved udder condition and animal productivity."
      },
      {
        "name": "Suresh Naik",
        "district": "Uttara Kannada",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Slow heifer development.",
        "text": "Worth the investment for dairy farmers."
      }
    ]
  },
  "bovi-hep": {
    "overview": [
      "Bovi Hep Liver Tonic for Cattle, Improves Digestion, Detox & Feed Efficiency, Supports Better Milk Production"
    ],
    "description": "Bovihep is liver suplement used for boosting liver heath. It is a powerful blend of choline,amino acids, vitamins and herbs there by protecting the animals liver",
    "gallery": [
      "/prototypes/gau-website/products/bovi-hep/g1.webp",
      "/prototypes/gau-website/products/bovi-hep/g2.webp",
      "/prototypes/gau-website/products/bovi-hep/g3.webp",
      "/prototypes/gau-website/products/bovi-hep/g4.webp",
      "/prototypes/gau-website/products/bovi-hep/g5.webp",
      "/prototypes/gau-website/products/bovi-hep/g6.webp",
      "/prototypes/gau-website/products/bovi-hep/g7.webp"
    ],
    "usps": [
      {
        "title": "Faster Conception",
        "image": "/prototypes/gau-website/products/bovi-hep/usp1.webp"
      },
      {
        "title": "Summer Resilience",
        "image": "/prototypes/gau-website/products/bovi-hep/usp2.webp"
      },
      {
        "title": "Liver Detox",
        "image": "/prototypes/gau-website/products/bovi-hep/usp3.webp"
      },
      {
        "title": "Liver Repair",
        "image": "/prototypes/gau-website/products/bovi-hep/usp4.webp"
      },
      {
        "title": "More Milk Daily",
        "image": "/prototypes/gau-website/products/bovi-hep/usp5.webp"
      }
    ],
    "benefits": [
      "Protect Liver From Feed/water Related Toxins/contaminants.                                                                                                                                                  Optimises the Utilisation of Feed Ingredients.\nHelps to Counter the Heptatic Damage caused By Deworming agents.\nHelps to Improve Milk Production.\nHelps to increase Fat Percentage.\nImproves Fat Metabolism."
    ],
    "dosages": [
      {
        "who": "cows and buffalo",
        "dose": "5-10mL/per day"
      },
      {
        "who": "sheep and goat",
        "dose": "3-5mL/per day"
      }
    ],
    "howTo": [
      {
        "title": "step 1",
        "steps": "Take the Bovi hep as per the recommended dose using a syringe.      ",
        "image": "/prototypes/gau-website/products/bovi-hep/how1.webp"
      },
      {
        "title": "step 2",
        "steps": "The measured Bovi hep can be directly drenched to the animal.Alternatively, it can be mixed with the animal’s feed.",
        "image": "/prototypes/gau-website/products/bovi-hep/how2.webp"
      }
    ],
    "info": [],
    "ingredients": [
      {
        "name": "Tricholine Citrate",
        "qty": "1200mg"
      },
      {
        "name": "Choline Chloride",
        "qty": "160mg"
      },
      {
        "name": "L Lysine",
        "qty": "20mg"
      },
      {
        "name": "DL Methionine",
        "qty": "20mg"
      },
      {
        "name": "Glycine",
        "qty": "10mg"
      },
      {
        "name": "Protein Hydrolysate",
        "qty": "1000mg"
      },
      {
        "name": "Liver Fraction",
        "qty": "100mg"
      },
      {
        "name": "Liver Extract",
        "qty": "800mg"
      },
      {
        "name": "Yeast Extract",
        "qty": "10mg"
      },
      {
        "name": "Sorbitol",
        "qty": "200mg"
      },
      {
        "name": "Copper Sulphate",
        "qty": "100mg"
      },
      {
        "name": "Vitamin B12",
        "qty": "10mcg"
      },
      {
        "name": "Niacin",
        "qty": "5mg"
      },
      {
        "name": "D Pantothenate",
        "qty": "2mg"
      },
      {
        "name": "L-Caritine",
        "qty": "10mcg"
      },
      {
        "name": "Biotin",
        "qty": "10mcg"
      },
      {
        "name": "Vitamin E",
        "qty": "10mg"
      },
      {
        "name": "Kalmegh Extract",
        "qty": "1000mcg"
      },
      {
        "name": "Silymarin (Milk Thistle Extract)",
        "qty": "12mg"
      },
      {
        "name": "Excipients",
        "qty": "q.s"
      }
    ],
    "ingredientsBasis": "Each 10 ml provides",
    "faqs": [],
    "reviews": [
      {
        "name": "Ashok Reddy",
        "district": "Tumakuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Liver issues, low feed intake",
        "text": "Improved appetite and digestion. Animals are eating properly now and look healthier."
      },
      {
        "name": "Prakash Naik",
        "district": "Shivamogga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Poor metabolism, low energy",
        "text": "Gradual improvement in metabolism. Works well over continuous usage."
      },
      {
        "name": "Irfan Pasha",
        "district": "Bengaluru Rural",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Toxin-related health issues",
        "text": "Very helpful in detox support. Animals recovered faster and became more active."
      },
      {
        "name": "Geetha R",
        "district": "Mysuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Poor appetite.",
        "text": "Feed intake improved significantly after using Bovi Hep."
      },
      {
        "name": "Prakash Shetty",
        "district": "Udupi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Low milk yield.",
        "text": "My cows became more active and milk production increased."
      },
      {
        "name": "Mallikarjun K",
        "district": "Davanagere",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Weakness after deworming.",
        "text": "Excellent liver tonic. Recovery after deworming was faster."
      },
      {
        "name": "Basavaraj M",
        "district": "Vijayapura",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Low milk fat.",
        "text": "Fat percentage in milk improved after continuous use."
      },
      {
        "name": "Veeresh P",
        "district": "Koppal",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Digestive issues.",
        "text": "Animals looked healthier and digestion improved."
      },
      {
        "name": "Sunitha R",
        "district": "Shivamogga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Liver stress due to feed issues.",
        "text": "Very effective for maintaining liver health in dairy cattle."
      },
      {
        "name": "Nagaraj B",
        "district": "Chitradurga",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Digestive disorders.",
        "text": "Noticeable improvement in digestion and productivity."
      },
      {
        "name": "Mahesh Gowda",
        "district": "Ramanagara",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Reduced appetite during summer.",
        "text": "Good support for cows during stressful periods."
      },
      {
        "name": "Deepa K",
        "district": "Kolar",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Poor health and dullness.",
        "text": "Animals became healthier within a few weeks."
      },
      {
        "name": "Anand Kulkarni",
        "district": "Dharwad",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Reduced feed efficiency.",
        "text": "Reliable product for improving liver function."
      },
      {
        "name": "Kavitha M",
        "district": "Chikkamagaluru",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Declining milk yield.",
        "text": "Milk production improved after continuous use."
      }
    ]
  },
  "achala": {
    "overview": [
      "Achala Milk Replacer for Calves, Nutrient-Rich Formula for Early Growth, Improves Immunity & Survival Rate"
    ],
    "description": "Achala milk replacer is a specially formulated, nutrient-rich powdered or liquid feed designed to replace maternal milk for young animals primarily calves in order to ecomonically utilize the milk produced from the cows,",
    "gallery": [
      "/prototypes/gau-website/products/achala/g1.webp",
      "/prototypes/gau-website/products/achala/g2.webp",
      "/prototypes/gau-website/products/achala/g3.webp",
      "/prototypes/gau-website/products/achala/g4.webp",
      "/prototypes/gau-website/products/achala/g5.webp",
      "/prototypes/gau-website/products/achala/g6.webp",
      "/prototypes/gau-website/products/achala/g7.webp",
      "/prototypes/gau-website/products/achala/g8.webp"
    ],
    "usps": [
      {
        "title": "No diarrhea",
        "image": "/prototypes/gau-website/products/achala/usp1.webp"
      },
      {
        "title": "Saves Mothers Milk",
        "image": "/prototypes/gau-website/products/achala/usp2.webp"
      },
      {
        "title": "Faster Calf Growth",
        "image": "/prototypes/gau-website/products/achala/usp3.webp"
      },
      {
        "title": "Early Weaning",
        "image": "/prototypes/gau-website/products/achala/usp4.webp"
      },
      {
        "title": "High Protein Formula",
        "image": "/prototypes/gau-website/products/achala/usp5.webp"
      }
    ],
    "benefits": [],
    "dosages": [],
    "howTo": [],
    "info": [],
    "ingredients": [],
    "ingredientsBasis": "",
    "faqs": [],
    "reviews": [
      {
        "name": "Lokesh reddy",
        "district": "Chigatagere",
        "state": "Karnataka",
        "verified": false,
        "rating": 1,
        "challenge": "Order not received delivery guy is telling that he will deliver tomorrow from 5days he is telling the same but not received any thing really very bad and also with out trust we have done the payment but not received the product really bad company reputation will go if you guys do like this very bad we will never book again and also will post in social media about this doing fake",
        "text": "Order not received delivery guy is telling that he will deliver tomorrow form 5days he is telling the same but not received any thing really very bad and also with out trust we have done the payment but not received the product really bad company reputation will go if you guys do like this and also will post on social media  regarding this fraud happened and will post and will inform for our farmers"
      },
      {
        "name": "Deepak Shetty",
        "district": "Udupi",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Insufficient mother milk, calf nutrition",
        "text": "Very useful when natural milk is not enough. Calves are growing well and staying healthy."
      },
      {
        "name": "Lokanath Gowda",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Feeding management, early calf care",
        "text": "Easy to prepare and feed. Good support for early-stage calf nutrition."
      },
      {
        "name": "Sameer Ahmed",
        "district": "Kolar",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Weak calf growth, dependency on milk",
        "text": "Improved calf strength and growth rate. Reliable alternative feeding option."
      },
      {
        "name": "Shivakumar N",
        "district": "Kolar",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Slow calf growth.",
        "text": "Calves gained weight steadily and remained active."
      },
      {
        "name": "Nandini Gowda",
        "district": "Chikkaballapur",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Feeding management of young calves.",
        "text": "Easy to prepare and calves accepted it well."
      },
      {
        "name": "Mahesh Gowda",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "High feeding costs.",
        "text": "Excellent alternative to whole milk feeding."
      },
      {
        "name": "Basavaraj Gowda",
        "district": "Mandya",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Slow calf growth and poor weight gain.",
        "text": "Achala Milk Replacer helped my calves grow faster and maintain good health. I noticed steady weight gain within a few weeks."
      },
      {
        "name": "Manjunath Patil",
        "district": "Belagavi",
        "state": "Karnataka",
        "verified": true,
        "rating": 5,
        "challenge": "Difficulty managing calf feeding.",
        "text": "Easy to prepare and feed. My calves adapted to it very quickly."
      },
      {
        "name": "Shobha Naik",
        "district": "Uttara Kannada",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Weak calves after birth.",
        "text": "Calves remained active and healthy throughout the feeding period."
      },
      {
        "name": "Ramesh Hegde",
        "district": "Shivamogga",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "High calf feeding expenses.",
        "text": "Very economical compared to feeding whole milk."
      },
      {
        "name": "Kavitha Gowda",
        "district": "Hassan",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Underweight calves.",
        "text": "Calves showed excellent body condition and growth."
      },
      {
        "name": "Prakash Shetty",
        "district": "Udupi",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Inconsistent growth.",
        "text": "Good quality product. Calves gained weight consistently."
      },
      {
        "name": "Deepa R",
        "district": "Mysuru",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Weak immunity in calves.",
        "text": "My calves became stronger and healthier within one month."
      },
      {
        "name": "Veeresh Kulkarni",
        "district": "Vijayapura",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Insufficient milk for calves.",
        "text": "Excellent alternative during milk shortage periods."
      },
      {
        "name": "Nagaraj Patil",
        "district": "Koppal",
        "state": "Karnataka",
        "verified": true,
        "rating": 4,
        "challenge": "Rising feeding expenses.",
        "text": "Helped reduce feeding costs while maintaining calf growth."
      }
    ]
  }
};
