export type TagTier = 'public' | 'shared' | 'filter'

export interface TagEntry {
  name: string
  tier: TagTier
}

export const TAG_CATEGORIES: Record<string, Record<string, string[]>> = {
  popular: {
    'trending now': [
      'Bookworm', 'In therapy', 'Gamer', 'Cinephile', 'Neurodivergent',
      'Music nerd', 'Homebody', 'Dog parent', 'Cat parent', '420 friendly', 'BDSM',
      'Overthinker', 'Traveler', 'Fitness', 'Cottagecore', 'Dark academia',
      'Dry humor', 'Introvert', 'Foodie', 'True crime', 'LGBTQ+',
      'Polyamorous', 'Kink-curious', 'Non-binary', 'Sober curious',
      'Night Owl', 'Bisexual', 'Queer', 'Sex-positive', 'ENM',
    ],
  },
  interests: {
    'arts & culture': [
      'Cinephile', 'Theatre', 'Stand-up comedy', 'Photography', 'Writing',
      'Poetry', 'Design', 'Architecture', 'Art lover', 'Zine maker',
      'Music nerd', 'Classical music', 'Jazz', 'Opera', 'Musical theatre',
    ],
    'gaming & tech': [
      'Gamer', 'Tabletop RPG', 'D&D', 'Board games', 'Chess', 'Tech nerd',
      'Retro gaming', 'Speedrunning', 'Esports', 'Competitive gaming',
      'Warhammer', 'Magic: The Gathering',
    ],
    'books & ideas': [
      'Bookworm', 'Philosophy', 'History', 'Politics', 'Science',
      'True crime', 'Manga collector', 'Anime', 'Fan fiction writer',
      'Podcast addict', 'Journalism',
    ],
    'food & drink': [
      'Foodie', 'Cooking', 'Baking', 'Coffee snob', 'Wine',
      'Whiskey', 'Cocktails', 'Beer', 'Vegan cooking', 'Meal prep',
    ],
    'outdoors & sport': [
      'Hiking', 'Camping', 'Fishing', 'Rock climbing', 'Surfing',
      'Skiing', 'Cycling', 'Running', 'Martial arts', 'Boxing',
      'Skateboarding', 'Weightlifting', 'Yoga', 'Fitness', 'Crossfit', 'Swimming',
    ],
    'hobbies': [
      'Traveler', 'Gardening', 'Plants', 'Cars', 'Motorcycles',
      'Astronomy', 'Collecting', 'Sneakerhead', 'Thrifting', 'Vintage',
      'Antiques', 'DIY / maker', 'Fashion', 'Streetwear',
    ],
  },
  lifestyle: {
    'rhythm': [
      'Night owl', 'Early bird', 'Homebody', 'Always out',
      'Spontaneous', 'Planner', 'Routine lover', 'Minimalist', 'Slow living',
    ],
    'health': [
      'Sober', 'Sober curious', '420 friendly', 'Non-smoker',
      'Fitness routine', 'Vegan', 'Vegetarian', 'Clean eater',
    ],
    'personality': [
      'Introvert', 'Extrovert', 'Ambivert', 'Overthinker',
      'Dry humor', 'Empath', 'Old soul', 'Hopeless romantic', 'Adventurous',
    ],
    'work & life': [
      'Remote worker', 'Entrepreneur', 'Student', 'Career focused',
      'Work-life balance', 'City person', 'Van life', 'Festival season',
    ],
    'pets': [
      'Dog parent', 'Cat parent', 'Pet parent', 'Multiple pets',
    ],
    'mind & spirit': [
      'Neurodivergent', 'ADHD', 'Autistic', 'In therapy',
      'Chronic illness', 'Mental health advocate', 'Spiritual', 'Religious', 'Atheist',
    ],
  },
  identity: {
    'orientation': [
      'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Queer',
      'Asexual spectrum', 'Demisexual', 'LGBTQ+',
    ],
    'gender': [
      'Non-binary', 'Genderfluid', 'Trans', 'Intersex', 'Agender',
    ],
    'relationship style': [
      'Monogamous', 'Polyamorous', 'ENM', 'Relationship anarchy', 'Solo poly',
    ],
    'attachment & growth': [
      'Anxious attachment', 'Avoidant attachment', 'Secure attachment',
      'Working on myself', 'Recently out', 'Divorced', 'Single parent',
    ],
    'background': [
      'Immigrant', 'First-gen', 'Jewish', 'Muslim', 'Hindu',
      'Christian', 'Buddhist', 'Childfree by choice', 'Wants kids someday',
    ],
  },
  communities: {
    'kink & sex positivity': [
      'BDSM', 'Kink-curious', 'Dominant', 'Submissive', 'Switch',
      'Leather community', 'Fetish friendly', 'Sex-positive',
    ],
    'subcultures': [
      'Furry', 'Otherkin', 'Cosplay', 'Convention goer',
      'Rave / festival', 'Skater', 'Punk', 'Goth', 'Emo / scene',
    ],
    'aesthetics': [
      'Cottagecore', 'Dark academia', 'Goblincore', 'Witchcore',
      'Y2K', 'Softboy / softgirl', 'Streetwear',
    ],
    'spiritual & esoteric': [
      'Witchcraft / Wicca', 'Pagan', 'Occult', 'Tarot reader',
      'Astrology believer', 'MBTI obsessed', 'Paranormal interest',
    ],
    'music tribes': [
      'Metal', 'Hardcore', 'Post-rock', 'K-pop stan', 'Reggae',
      'Folk', 'Country', 'Trap', 'House', 'Techno', 'Drum & bass',
    ],
    'fandoms': [
      'Anime deep-cut', 'Webtoon reader', 'True crime obsessed',
      'Urban explorer', 'Firearms & shooting', 'Hunting & fishing',
    ],
  },
}

export const POPULAR_TAGS = new Set([
  'Bookworm', 'Gamer', 'Night owl', 'BDSM', 'Cinephile',
  'Music nerd', '420 friendly', 'Neurodivergent', 'LGBTQ+',
  'Homebody', 'Cottagecore', 'Dark academia', 'True crime',
  'Fitness', 'Dog parent', 'Overthinker',
])

export const CATEGORY_LABELS: Record<string, string> = {
  popular: 'Popular',
  interests: 'Interests',
  lifestyle: 'Lifestyle',
  identity: 'Identity',
  communities: 'Communities',
}

