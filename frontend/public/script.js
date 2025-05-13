// Retrieve plant data from JSON file
function getPlantData() {
    fetch('plant-data.json')
        .then(response => response.json())  // Parse the JSON file
        .then(data => {
            // Render plant img + name
            const itemList = document.getElementById('planner-plant-list');
            data.plants.forEach(plant => {
                const plantFileName = plant.name.replace(" ", "-").toLowerCase();
                const listItem = document.createElement('li');
                listItem.innerHTML = `<img src="images/icons/plants/${plantFileName}.png" alt="">${plant.name}`;
                listItem.classList.add('plant-drag-drop');
                itemList.appendChild(listItem);
            });

            // Add eventListeners to display info when clicked
            const plantList = document.querySelectorAll('.planner-plant-list li');
            plantList.forEach(plant => {
                applyClickListener(plant);
            });
        })
        .catch(error => console.error('Error loading the JSON data:', error));
}

function applyClickListener(plant) {
    plant.addEventListener('click', () => {
        // Get name of plant clicked
        const plantName = plant.textContent.trim();
        displayPlantInfo(plantName);
    });
}

// Display info of plant passed
function displayPlantInfo(plantName) {
    // Fetch plant data from the JSON file
    fetch('plant-data.json')
        .then(response => response.json()) // Parse the JSON file
        .then(data => {
            const plant = data.plants.find(p => p.name === plantName);
            // Display the plant information
            const plantInfo = document.getElementById('plant-info');
            plantInfo.innerHTML = `
                <h2>${plant.name}</h2>
                <div><img src="images/icons/sun.png"><p>${plant.sunlight}</p></div>
                <div><img src="images/icons/water-droplet.png"><p>${plant.watering}</p></div>
                <div><img src="images/icons/season.png"><p>${plant.best_season}</p></div>
                <div><img src="images/icons/grass.png"><p>${plant.soil_type}</p></div>
                <div><img src="images/icons/thermometer.png"><p>${plant.climate}</p></div>
                <div><img src="images/icons/info.png"><p>${plant.additional_info}</p></div>
                `;
            document.querySelector('.plant-info-container>h1').scrollIntoView();
        })
        .catch(error => console.error('Error loading the JSON data:', error));
}

const icon = document.getElementById("icon");
const icon1 = document.getElementById("a");
const icon2 = document.getElementById("b");
const icon3 = document.getElementById("c");

icon.addEventListener('click', function () {
    icon1.classList.toggle('a');
    icon2.classList.toggle('c');
    icon3.classList.toggle('b');
});

function openNav() {
    document.getElementById("mySidenav").classList.toggle("open-nav");
}

function resetGrid() {
    const currentGrid = document.querySelector('.planner-selected').innerText;
    let currentGridClass;
    if (currentGrid == "Raised Garden Bed") {
        currentGridClass = "grid";
    }
    else if (currentGrid == "Vertical Planter") {
        currentGridClass = "vertical-planter";
    }
    else {
        currentGridClass = "balcony-planter";
    }
    const gridItems = document.querySelectorAll(`.${currentGridClass}>div`);
    gridItems.forEach(item => {
        item.innerHTML = "";
    });
}

function displayHandbookContent() {
    const handbookContent = document.getElementById("handbook-content");

    // Assuming the JSON is already available locally or via API endpoint
    fetch('handbook.json')
        .then(response => response.json()) // Parse the JSON file
        .then(data => {
            const handbookData = data.sections;

            handbookData.forEach(section => {
                // Create a section element
                const sectionElement = document.createElement('div');

                // Create a title for the section
                const sectionTitle = document.createElement('h1');
                sectionTitle.innerText = section.title;
                sectionElement.appendChild(sectionTitle);

                // Loop through each content item in the section
                section.content.forEach(contentItem => {
                    // Create a sub-title for each content item
                    const subTitle = document.createElement('h2');
                    subTitle.id = contentItem.subTitle.replaceAll(" ", "-").toLowerCase();
                    subTitle.innerText = contentItem.subTitle;
                    sectionElement.appendChild(subTitle);

                    // Create a description for each content item
                    const description = document.createElement('p');
                    description.innerText = contentItem.description;
                    sectionElement.appendChild(description);
                });

                // Append the section to the handbook content
                handbookContent.appendChild(sectionElement);
            });
        })
        .catch(error => console.error('Error loading the JSON data:', error));
}

function openPopup() {
    const popupContainer = document.querySelector('.quiz-popup-container');
    const popup = document.querySelector('.quiz-popup');
    popupContainer.classList.add('quiz-popup-open');
    document.body.offsetHeight;
    popup.style.opacity = 1;
    popupContainer.style.opacity = 1;
    document.querySelector('body').style.overflowY = "hidden";
}

function closePopup() {
    const popupContainer = document.querySelector('.quiz-popup-container');
    const popup = document.querySelector('.quiz-popup');
    popup.style.opacity = 0;
    popupContainer.style.opacity = 0;
    setTimeout(() => {
        popupContainer.classList.remove('quiz-popup-open');
    }, 500);
    document.querySelector('body').style.overflowY = "scroll";
}

function progressBar() {
    const bar = document.getElementsByClassName("progress-bar-foreground")[0];
    const width = parseFloat(bar.style.width);
    let nextWidth = width;
    let id = setInterval(frame, 33.333);
    function frame() {
        if (nextWidth >= width + 33.333) {
            clearInterval(id);
        }
        else {
            nextWidth++;
            bar.style.width = nextWidth + '%';
        }
    }
    if (width >= 99) {
        bar.style.width = "100%";
    }
}

const questionChoices = [
    ["Dry", "Temperate"],
    ["Partial Sun", "Sunny"],
    ["Spring/Fall", "Summer"]
];

const questions = ["What climate does your area have?",
    "How much sunlight does your area receive?",
    "What season do you want to harvest your plants by?"
];
let question = 1;
let score = 0;
let clear = false;
let plantCriteria = [];
async function quiz() {
    const form = document.getElementsByClassName("quiz")[0];
    const btn = document.getElementsByClassName("quizBtn")[0];
    const txt = document.getElementById("quizTxt");
    let options = form.querySelectorAll('input[name="solarQuiz"]');
    let labels = form.getElementsByClassName("quizLbl");
    let labelsTxt = document.getElementsByClassName("quizLblTxt");
    let questionTxt = document.getElementById("questionTxt");
    if (clear == false) {
        let selectedOption, selectedLabel;
        for (let i = 0; i < options.length; i++) {
            if (options[i].checked) {
                selectedOption = i;
                selectedLabel = labels[i];
                break;
            }
        }
        plantCriteria.push(selectedOption);
        btn.innerText = "Next";
        clear = true;

        if (question == 3) {
            progressBar();
            btn.innerText = "Submit";
            btn.disabled = true;
            btn.className += " btnDisabled";
            for (let i = 0; i < plantCriteria.length; i++) {
                plantCriteria[i] = questionChoices[i][plantCriteria[i]];
            }
            const matchedPlants = await findPlants(plantCriteria);
            console.log(matchedPlants);
            console.log(plantCriteria);
            if (localStorage.getItem("user") != "guest") {
                uploadQuizResults( localStorage.getItem("user"), plantCriteria, matchedPlants);
            }
            showQuizAnswers(matchedPlants);
            return 0;
        }

        question++;
    }


    else {
        btn.innerText = "Submit";
        txt.innerText = "";
        questionTxt.innerText = questions[question - 1];
        for (let i = 0; i < labels.length; i++) {
            labels[i].className = "quizLbl";
            options[i].checked = false;
            labelsTxt[i].textContent = questionChoices[question - 1][i];
        }
        progressBar();
        clear = false;
    }
}

function findPlants(criteria) {
    return fetch('plant-quiz-data.json')
        .then(response => response.json()) // Parse the JSON file
        .then(data => {
            const plants = data.plants;
            const matchingPlants = plants.filter(plant => plant.climate === criteria[0] && plant.sunlight === criteria[1] && plant.season === criteria[2]);
            return matchingPlants;
        })
        .catch(error => console.error('Error loading the JSON data:', error));
}

function showQuizAnswers(matchedPlants) {
    fetch('plant-data.json')
        .then(response => response.json()) // Parse the JSON file
        .then(data => {
            const infoContainer = document.querySelector('.quiz-content');
            infoContainer.innerHTML = "<h3>Here are the best plant(s) for you based on your area!</h3>";
            for (let i = 0; i < matchedPlants.length; i++) {
                const plantName = matchedPlants[i].name;
                const plant = data.plants.find(p => p.name === plantName);
                const plantFileName = plant.name.replace(" ", "-").toLowerCase();
                const infoBox = document.createElement('div');
                infoBox.innerHTML = `<img src="images/icons/plants/${plantFileName}.png" alt="">${plant.name}`;
                infoBox.classList.add('quiz-plant-results');
                infoContainer.appendChild(infoBox);
            }
            infoContainer.classList.add('quiz-plant-results-open');
            infoContainer.querySelectorAll('.quiz-plant-results').forEach(plant => {
                plant.addEventListener('click', () => {
                    closePopup();
                    displayPlantInfo(plant.textContent.trim());
                });
            });
        })
        .catch(error => console.error('Error loading the JSON data:', error));
}

function openProfile() {
    if (localStorage.getItem("user") == "guest") {
        window.location.href = "login.html";
        return;
    }
    window.location.href = "profile.html";
}

async function uploadQuizResults(email, plantCriteria, matchedPlants) {
    const plantCriteriaObj = { climate: plantCriteria[0], sunlight: plantCriteria[1], season: plantCriteria[2] };
    let matchedPlantNames = matchedPlants.map(plant => plant.name);
    const response = await fetch('https://bloom-space.onrender.com/saveQuizResults', { //for deployment
    // const response = await fetch('http://localhost:3000/saveQuizResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, plantCriteriaObj, matchedPlantNames })
    });

    const result = await response.json();
}