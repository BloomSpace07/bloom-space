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