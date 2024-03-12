import { callback, useEffect, useRef,useState } from "react";
import './index.css'
import Star from "./Star"
import { useMovies } from "./UseMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);






  const KEY = 'c7822448';



  export default function App() {
    const [query,setQuery] = useState('')
    const [selectedId , setSelectedId] = useState(null)
    const {movies,isLoading,error}=useMovies(query)
     

    const [watched,setWatched]=useLocalStorageState([],"watched")
   // const [watched, setWatched] = useState([]);

   // not passing arguments inside the functio of use function
   

    function handleSelectedMOvie(id){
  setSelectedId((selectedId) => (id===selectedId ? null : id))    }

  function CloseMovie(){
    setSelectedId(null);
  }
  function hadleDeleteWatched(id){
    setWatched(watched=>watched.filter((movie)=>movie.imdbID !==id))
  }
   function hadleAddWatched(movie){
    setWatched(watched=>[...watched,movie])

   // localStorage.setItem('watched',(JSON.stringify([...watched,movie])))
   }
   
   
    




 
    return (
      <>
          <Navbar  ><Logo/> <Search query={query} setQuery={setQuery}/> <NumResults movies={movies}/> </Navbar>
          <Main >
            <Box >
              {/*
    isLoading ? <Loader/> :<MovieList movies={movies}/>*/}
    {isLoading && <Loader/>}
       {!isLoading && !error && <MovieList  movies={movies} onSelectMovie = {handleSelectedMOvie}/> }
       {error && <ErrorMessage message={error}/>}
    
    
    
    </Box>
              
            <Box >
              
              
       { selectedId? <SelectedMovie 
       Onclose = {CloseMovie} 
       selectedId={selectedId}
       onAddWatched = { hadleAddWatched}
       watched={watched}
       /> :    
       <>       
       <WatchedSummary watched={watched} />
       <WatchedMOvieList onCloseWatched={hadleDeleteWatched} watched={watched}/>
       </>   
      }
      
      </Box>
          
          </Main>
  
      </>
    );
  }
  
  function Loader(){
    return <p>It is Loading</p>
  }

  function ErrorMessage({message}){ 
    return <p className="error">
      {message}
    </p>
  }


function Navbar({children}){
  
 

return(
  <nav className="nav-bar">
      {children}
      </nav>
)

}


function Logo(){
  return( <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>)
}

function NumResults({movies}){
  return(
    <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
  )
}

function Search ({query,setQuery}){

 // useEffect(function(){
   // const el= document.querySelector('.search');
   // el.focus();
 // },[])
 const  inputEl = useRef(null)

 useKey('Enter',function(){
  setQuery('');
  inputEl.current.focus();
 })




  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value) }
    ref={inputEl}
  />
  )
}



function Main({children}){

  return(
    
    <main className="main">
     {children}
   
  </main>
  )
 }


 function Box({children}){
  const [isOpen, setIsOpen] = useState(true);

 


return(
  <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  {isOpen && children}
   

</div>

) }


function MovieList({movies,onSelectMovie}){

 
  return(
    <ul className="list">
    {movies?.map((movie) => (
     <Movie onSelectMovie={onSelectMovie} movie={movie}/>
    ))}
  </ul>
  )
}

function Movie({movie,onSelectMovie}){
  return(
    <li  onClick={()=>onSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
  )
}



function SelectedMovie({selectedId , Onclose,onAddWatched,watched}){ 
  const [ movie,setMovie ] = useState({})
  const [isLoading,setIsLOading] = useState(false);
  const [userRating,setUserRating] = useState('');


  const countRef = useRef(0)


  useEffect(
    function(){
         
     if(userRating) countRef.current = countRef.current++;
    


    },[userRating]
  )

 const isWatched = watched.map((movie)=>movie.imdbID).includes(selectedId)

 const watchedUserRating = watched.find(movie=>movie.imdbID===selectedId)?.userRating
 console.log(isWatched)


    
 
  const {
    Title:title ,
    Year: year , 
    Poster:poster,
    Runtime:runtime,
    imdbRating,
    Plot:plot,
    Released:released,
    Actors:actors,
    Director:director, 
    Genre:genre } = movie;

// eslint disable 
// if(imdbRating >8)[isTop,setTop] = useState(true)
    
//if(imdbRating > 8) return <p>Greatest evedr!</p>

  //cosnt [isTop,setTop] = useState(imdbRating>8);
 // console.log(isTop)


  //useEffect(function(){
   //setTop(imdbRating>8)
 // },[imdbRating])



  const [avgRating, setavgRating] = useState(0);

    function handleAdd(){
      const newMovie = {
        imdbID:selectedId,
        title,
        year,
        poster,
        imdbRating:Number(imdbRating),
        userRating : userRating,
        runtime : Number( runtime.split('').at(0)),
        countRatingDecisions : countRef.current
      }
      onAddWatched(newMovie);
   //   Onclose();
       setavgRating(Number(imdbRating))
       setavgRating((avgRating)=>(avgRating + userRating / 2))
    }

   
 useKey('Escape',Onclose);

  useEffect(function (){
   async function getMOvieDetails(){
    setIsLOading(true)
    const res = await  fetch(
      `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json(); 
    setMovie(data);
    setIsLOading(false)

   }
   getMOvieDetails();
  },[selectedId])


   useEffect(function(){
    document.title=  "Movie : " +movie.imdbID

    return function(){
      document.title = 'usePopcorn'
    }
   },[movie.imdbID])

   
  return(
    <div className="details">
      {isLoading ? <Loader/> :
      
      <>
     
      <header>

   
      
      <button className="btn-back" onClick={Onclose}>&larr;</button>
      <img src={poster} alt={`Poster of ${movie} movie`}/>
      <div className="detail-overview">
        <h2>{title}</h2>
        <p>
          {released} &bull; {runtime}
        </p>
      <p>{genre}</p>
      <p><span>star</span>{imdbRating}</p>
      </div>
      </header>
      <p>{avgRating}</p>
      <section>
        <div className="rating">

      {!isWatched ? 
      <>
      <Star maxRating={10}  
        size={24} 
        onSetRating={setUserRating}
        />
        {
          userRating>0 &&
          <button className="btn-add" onClick={handleAdd}>Add to list</button>
        }</>
         
      
      :
      <p>You rated this movie {watchedUserRating}</p>
}
        </div>
        <p><em>{plot}</em></p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>

      </section>
      </>
      
  }
    </div>
  )

}





 function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));


  return(  <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating.toFixed(2)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(2)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>)
 }

function WatchedMOvieList({watched,onCloseWatched}){

  return(
    
    <ul className="list">
    {watched.map((movie) => (
      <WatchedMovie movie={movie} onCloseWatched={onCloseWatched}/>
    ))}
  </ul>
  )
}


function WatchedMovie({movie,onCloseWatched}){

return(<li key={movie.imdbID}>
  <img src={movie.poster} alt={`${movie.title} poster`} />
  <h3>{movie.title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.runtime} min</span>
    </p>
    <button onClick={()=>onCloseWatched(movie.imdbID)}>X</button>
  </div>
</li>)
}