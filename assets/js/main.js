const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;
let pokemons = [];

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}" onclick="showPokemonDetails(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}



function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((newPokemons = []) => {
        pokemons = [...pokemons, ...newPokemons];
        const newHtml = newPokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

function showPokemonDetails(pokemonNumber) {
  
    document.querySelectorAll('.pokemon').forEach(pokemon => {
        pokemon.classList.add('minimized');
    });

   
    const pokemon = pokemons.find(pokemon => pokemon.number === pokemonNumber);
    if (pokemon) {
        const detailHtml = `
            <button id="closeDetailButton">✖</button>
            <div class="pokemon-detail ${pokemon.type}">
                <h2>${pokemon.name} (#${pokemon.number})</h2>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
                <p>Type: ${pokemon.types.join(', ')}</p>
                <p>Height: ${pokemon.height / 10} m</p>
                <p>Weight: ${pokemon.weight / 10} kg</p>
                <p>Abilities: ${pokemon.abilities.join(', ')}</p>
            </div>
        `;
        const detailContainer = document.getElementById('pokemonDetail');
        detailContainer.innerHTML = detailHtml;
        detailContainer.style.display = 'block';

     
        document.querySelector(`.pokemon[data-number="${pokemonNumber}"]`).classList.remove('minimized');
    }
}

function closePokemonDetails() {
 
    document.querySelectorAll('.pokemon').forEach(pokemon => {
        pokemon.classList.remove('minimized');
    });

   
    document.getElementById('pokemonDetail').style.display = 'none';
}


document.getElementById('pokemonDetail').addEventListener('click', (event) => {
    if (event.target.id === 'closeDetailButton') {
        closePokemonDetails();
    }
})

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});