import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Win from './components/Win'
import Lose from './components/Lose'

let cardsClicked = [];

function App() {

  // State to hold the array of Pokémon image URLs
  const [cardArray, setCardArray] = useState([]);
  const totalPokemon = 1000; // Total number of Pokémon to choose from
  const numCards = 10;       // How many Pokémon you want to display

  const fetchPokemonImages = async () => {
    // Generate an array of unique random Pokémon IDs
    const randomIDs = [];
    while (randomIDs.length < numCards) {
      const id = Math.floor(Math.random() * totalPokemon) + 1; // Random number between 1 and totalPokemon
      if (!randomIDs.includes(id)) {
        randomIDs.push(id);
      }
    }

    // Fetch data for all random IDs concurrently using Promise.all
    const pokemonPromises = randomIDs.map(id =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
    );

    try {
      const pokemonData = await Promise.all(pokemonPromises);
      // Map the fetched data to get the image URL (sprites.front_default)
      const images = pokemonData.map(poke => poke.sprites.other["official-artwork"].front_default);
      const names = pokemonData.map(poke => poke.name);

      const result = [];

      for (let i in names){
        result.push(
          {
            image: images[i],
            name: names[i],
          }
        )
      }

      setCardArray(result);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  }

  useEffect(() => {
    // Function to fetch unique Pokémon images on Load
    fetchPokemonImages();
  }, []); // Empty dependency array runs this effect once when the component mounts

  const [count, setCount] = useState(0);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  const clearCardsClicked = () => {
    cardsClicked = [];
  }

  const wingame = () => {
    console.log("game won!");
    setWin(true);
  }

  const losegame = () => {
    console.log("game lost at: " + count);
    setLose(true);
  }

  const resetGame = () => {
    setCount(0);
    setWin(false);
    setLose(false);

    fetchPokemonImages();
  }

  const randomize = (array) => {
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }

  const addCount = (id) => {
    // Check if this id has been clicked on
    if (cardsClicked.includes(id)) {
      // If yes, lose the game
      losegame();
      clearCardsClicked();
    }
    else {
      // if not, continue game and increase score
      setCount((count) => count + 1);
      cardsClicked.push(id);
      setCardArray(randomize(cardArray));
    }
  }
  
  useEffect(() => {
    // if reached max, score, win game
    if (numCards === count){
      wingame();
      clearCardsClicked();
    }
  }, [count])

  return (
    <div className='flex flex-col items-center'>
      <p>Click on the cards to get points. If you click on the same card twice, you lose.</p>
      <p className="card">Points Counter: <span>{count}</span></p>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
        {cardArray.map(({image, name}, index) => (
          <button key={name} onClick={() => {addCount(name)}} className='flex flex-col items-center justify-center'>
            <img src={image} alt={name} className='flex-1 object-contain'/>
            <p>{name}</p>
          </button>
        ))}
      </div>
      <Win win={win} resetGame={resetGame}/>
      <Lose lose={lose} resetGame={resetGame} score={count}/>
    </div>
  )
}

export default App
