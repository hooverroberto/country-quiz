const question = document.getElementById("question");
const questionImg = document.getElementById("question-img")
const choices = document.querySelectorAll(".choice")
const container = document.querySelector(".container")
const main = document.getElementById("main");
const imgAdventure = document.getElementById("img-adventure");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const containerTry = document.querySelector(".container-try")
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore")
const btnTryAgain = document.getElementById("try")


let score = 0 
let questionCounter = 0; 
let questionBase = [];
let availableQuestions = []; 
let currentQuestion = {}; 
let formattedQuestion = {};
let arr = []; 
let acceptingAnswers = false

const fetchData = async () => {
    try {
        const res = await fetch("https://restcountries.com/v2/all")
        const data = await res.json() 
        startGame(data)
    } catch (error) {
        console.log(error) 
    }
}

fetchData()
const aciertos = 1;
const MaxQuestions = 10;

const random = () => {
    arr = [];
    while (arr.length < 3) { 
        const random = Math.floor(Math.random() * 249); 
        if (arr.indexOf(random) === -1) {             
            arr.push(random);                        
        }
    }
}
const startGame = (data) => {
    questionCounter = 0;
    score = 0;
    questionBase = data
    availableQuestions = [...questionBase];
    getNewQuestion()
    main.classList.remove("hidden");
    containerTry.classList.add("hidden")
    imgAdventure.classList.remove("hidden");
    localStorage.setItem("mostRecentScore", score);
}

const getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MaxQuestions) {
        localStorage.setItem("mostRecentScore", score); 
        
        containerTry.classList.remove("hidden")
        return localStorage
    }
    questionCounter++;
    progressText.innerText = `${questionCounter} of ${MaxQuestions}`;
    random()
    

    let incorrectAnswersBase = []
    incorrectAnswersBase = [...questionBase]
    const questionIndex  = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex]

    const index = incorrectAnswersBase.indexOf(currentQuestion);
    if (index > -1) { 
        incorrectAnswersBase.splice(index, 1); 
    }

    const typeQuestion = Math.floor(Math.random() * 2)
    if(typeQuestion == 1) {
        questionImg.innerHTML = `<img src="${currentQuestion.flags.svg}" alt="">`
        question.innerHTML = `<h3> ¿A qué país le pertenece esta bandera? </h3>`
    } else if (currentQuestion.capital) {
        questionImg.innerHTML = ""
        question.innerHTML= `<h3>${currentQuestion.capital} su capital es: </h3>`
    } else { 
        questionImg.innerHTML = `<img src="${currentQuestion.flags.svg}" alt="">`
        question.innerHTML = `<h3> ¿A qué país le pertenece esta bandera? </h3>`
    }

    formattedQuestion = {};
    const incorrectAnswers = [ 
        incorrectAnswersBase[arr[0]].name, 
        incorrectAnswersBase[arr[1]].name,
        incorrectAnswersBase[arr[2]].name  
    ]
    const answerChoices = [...incorrectAnswers]
    formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
    answerChoices.splice(formattedQuestion.answer -1, 0, currentQuestion.name)
    answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index+1)] = choice; 
    })

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = formattedQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1) 
    acceptingAnswers = true
}  
choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return; 
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"]; 
        const classToApply = selectedAnswer == formattedQuestion.answer ? 'correct' : 'incorrect'
    
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => { 
            selectedChoice.parentElement.classList.remove(classToApply);
            if (classToApply === "correct") {
                incrementScore(aciertos)                            
            } else {                
                container.classList.add("hidden")
                main.classList.add("hidden");
                containerTry.classList.remove("hidden")                
                localStorage.setItem("mostRecentScore", score);
                finalScore.innerText = score;
                
                // return localStorage
            }
            getNewQuestion()
        }, 1000);        
    })
})



const incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

btnTryAgain.addEventListener("click", () => {      
    questionCounter = 0;   
    container.classList.remove("hidden")
    main.classList.remove("hidden");
    containerTry.classList.add("hidden")
    localStorage.clear()
    score = 0;
    scoreText.innerText = 0;
    fetchData()  
});