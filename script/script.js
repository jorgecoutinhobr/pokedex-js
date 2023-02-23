const c = (el)=>document.querySelector(el);
const f = (el)=>document.querySelectorAll(el);

// Dom objects
const mainScreen = c('.main-screen');
const pokeName = c('.poke-name');
const pokeId = c('.poke-id');
const pokeFrontImage = c('.poke-front-image');
const pokeBackImage = c('.poke-back-image');
const pokeTypeOne = c('.poke-type-one');
const pokeTypeTwo = c('.poke-type-two');
const pokeWeight = c('.poke-weight');
const pokeHeight = c('.poke-height');
const pokeListItems = f('.list-item');
const leftButton = c('.left-button');
const rightButton = c('.right-button');

// objects
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy' 
];

let nextUrl = null;
let prevUrl = null;
// Functions 



const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }
}



// Left side of screen
const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data =>{
    resetScreen();
    console.log(data)
    // console.log(data)
    mainScreen.classList.remove('hide');
    pokeName.textContent = capitalize(data['name']);
    pokeId.textContent = '#' + data['id'].toString().padStart(4, '0');
    pokeWeight.textContent = data['weight'];
    pokeHeight.textContent = data['height'];
    const dataTypes = data['types'];
    const dataFirstType = dataTypes[0];
    const dataSecondType = dataTypes[1];
    pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
   
    if(dataSecondType){
        pokeTypeTwo.classList.remove('hide');
        pokeTypeTwo.textContent = capitalize(dataSecondType["type"]['name']);
    } else {
        pokeTypeTwo.classList.add('hide');
        pokeTypeTwo.textContent = '';
    }
    pokeFrontImage.src = data['sprites']['front_default'] || '';
    pokeBackImage.src = data['sprites']['back_default'] || '';

    mainScreen.classList.add(dataFirstType['type']['name']);
    
}
)
}


// Right side of screen
const fetchPokeList = url => {
    fetch(url)
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        const { results, next, previous }  = data;
        prevUrl = previous;
        nextUrl = next;
        
        for (let i  = 0; i < pokeListItems.length; i++){
            const pokeListItem = pokeListItems[i];
            const resultData = results[i];
            if(resultData) {
                const { name, url } = resultData;
                const urlArray = url.split('/');
                const id = urlArray[urlArray.length - 2];
                pokeListItem.textContent = id + "." + capitalize(name);
            } else {
                pokeListItem.textContent = '';
            }
        }
    }
)
};  

const handleRightButtonClick = () => {
    if(nextUrl ){
        fetchPokeList(nextUrl);
    }
};
const handleLeftButtonClick = () => {
    if(prevUrl) {
        fetchPokeList(prevUrl)
    }
}
const handleListItemClick = (e) => {
    if(!e.target) return;

    const listItem = e.target;
    if(!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);

}


for(const pokeListItem of pokeListItems){
    pokeListItem.addEventListener('click', handleListItemClick)
}
leftButton.addEventListener("click", handleLeftButtonClick)
rightButton.addEventListener("click", handleRightButtonClick)
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20')