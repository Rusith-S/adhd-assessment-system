const activities = {
    A1: [
      {
        key: "A1:Q1",
        question: "What do you do when you feel angry?",
        answers: [
          { label: "Talk to someone", value: 2 },
          { label: "Take deep breaths", value: 1 },
          { label: "Hit something (to identify behavior patterns)", value: 3 },
        ],
      },
      {
        key: "A1:Q2",
        question: "What do you do when you got stuck and need help with homework?",
        answers: [
          { label: "Ask a teacher", value: 1 },
          { label: "Ask a parent", value: 3 },
          { label: "Get angry", value: 2 },
        ],
      },
      {
        key: "A1:Q3",
        question: "How do you feel when someone ask about you?",
        answers: [
          { label: "Happy", value: 3 },
          { label: "Calm", value: 1 },
          { label: "Angry", value: 2 },
        ],
      },
    ],
    A2: [
        {
            key: "A2:Q1",
            question: "If you see your friend drop their lunch, what should you do?",
            answers: [
              { label: "Help them pick it up", value: 2 },
              { label: "Laugh at them", value: 3 },
              { label: "Ignore and walk away", value: 1 },
            ],
        },
        {
            key: "A2:Q2",
            question: "The teacher asks a question, and you know the answer. Do you:",
            answers: [
                { label: "Raise your hand and wait to be called on", value: 1 },
                { label: "Shout out the answer immediately", value: 2 },
                { label: "Tell your friend the answer quietly", value: 3 },
        ],
        },
        {
            key: "A2:Q3",
            question: "Your friend accidentally breaks your toy. What do you do?",
            answers: [
                { label: "Stay calm and talk to them about it", value: 1 },
                { label: "Get angry and yell at them", value: 2 },
                { label: "Stop talking to them forever", value: 3 },
        ],
        },
        {
            key: "A2:Q4",
            question: "You have one cookie, but your friend doesn’t have any. What do you do?",
            answers: [
                { label: "Break the cookie in half and share it", value: 2 },
                { label: "Eat it quickly before they ask for it", value: 1 },
                { label: "Tell them to get their own cookie", value: 3 },
        ],
        },
        {
            key: "A2:Q5",
            question: "At a birthday party, someone cuts in front of you to get cake. How do you react?",
            answers: [
                { label: "Wait patiently for your turn", value: 3 },
                { label: "Push them back into their place", value: 1 },
                { label: "Complain loudly to everyone", value: 2 },
        ],
        },
    ],
    A3: [
        {
            key: "A3:Q1",
            question: "How does the child behave when waiting in line for their turn?",
            answers: [
                { label: "Waits patiently and quietly.", value: 1 },
                { label: "Fidgets but remains in line.", value: 3 },
                { label: "Tries to skip the line.", value: 2 },
            ],
        },
        {
            key: "A3:Q2",
            question: "How does the child respond to being given a difficult task?",
            answers: [
                { label: "Focuses and attempts to complete it.", value: 1 },
                { label: "Asks for help immediately.", value: 3 },
                { label: "Gets frustrated and gives up.", value: 2 },
            ],
        },
        {
            key: "A3:Q3",
            question: "What does the child do when they make a mistake during an activity?",
            answers: [
                { label: "Tries again and learns from the mistake.", value: 2 },
                { label: "Apologizes and asks for guidance.", value: 1 },
                { label: "Gets upset and refuses to continue.", value: 3 },
            ],
        },
        {
            key: "A3:Q4",
            question: "How does the child react when asked to share toys with peers?",
            answers: [
                { label: "Shares willingly and plays together.", value: 2 },
                { label: "Hesitates but eventually shares.", value: 1 },
                { label: "Refuses to share and becomes possessive.", value: 3 },
            ],
        },
        {
            key: "A3:Q5",
            question: "How does the child behave during group activities?",
            answers: [
                { label: "Collaborates well with others.", value: 1 },
                { label: "Participates but prefers to lead.", value: 3 },
                { label: "Distracts others or avoids participation.", value: 2 },
            ],
        },
    ],
    A4: [
        {
            key: "A4:Q1",
            question: "You find a lost wallet on the playground. What would you do?",
            answers: [
                { label: "Look for the owner and return it.", value: 3 },
                { label: "Take it to a teacher or an adult.", value: 2 },
                { label: "Keep it for yourself.", value: 1 },
            ],
        },
        {
            key: "A4:Q2",
            question: "You and your friend see a shiny balloon stuck in a tree. What should you do?",
            answers: [
                { label: "Ask an adult to help get it down.", value: 1 },
                { label: "Climb the tree carefully to get it.", value: 3 },
                { label: "Leave it alone and walk away.", value: 2 },
            ],
        },
        {
            key: "A4:Q3",
            question: "You’re in class, and the teacher is busy helping another student. You don’t understand the instructions. What do you do?",
            answers: [
                { label: "Wait patiently for the teacher to finish.", value: 3 },
                { label: "Ask a friend for help.", value: 1 },
                { label: "Start guessing and doing the work.", value: 2 },
            ],
        },
        {
            key: "A4:Q4",
            question: "During lunch, another student accidentally spills juice on your lunchbox. What is your response?",
            answers: [
                { label: "Say, “It’s okay” and clean it up together.", value: 2 },
                { label: "Get upset and demand they replace it.", value: 1 },
                { label: "Ignore it and eat the rest of your lunch.", value: 3 },
            ],
        },
        {
            key: "A4:Q5",
            question: "You see a small kitten hiding under a bench at the park. What would you do?",
            answers: [
                { label: "Check if the kitten is safe and try to help.", value: 3 },
                { label: "Tell an adult about it.", value: 1 },
                { label: "Ignore it and keep playing.", value: 2 },
            ],
        },
    ],
  };
  
  export default activities;
  