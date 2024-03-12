import { useState,useEffect } from "react";



const KEY = 'c7822448';


export function useMovies(query){ 
    const [movies, setMovies] = useState([]);
    const [isLoading,setIsLOading] = useState(false)
    const [error,setError] = useState('')



    useEffect(
        function () {
        const controller = new AbortController();
   
   
         async function fetchMovies(){
           try {
           setIsLOading(true)
           setError('')
         const res = await  fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,{signal:controller.signal});
         
         if(!res.ok) throw new Error('Something webt wrong with fetching moviews');
   
   
     
         const data = await res.json();
   
         console.log(data)
         if(data.Response === 'False') throw new Error ('Movie not found')
         
         setMovies(data.Search);
         setError('')
        
        
       }
       catch (err){
         console.error(err.message);
         if(err.name!== 'AbortError')
   {      setError(err.message)
   
   }
     } finally {
       setIsLOading(false);
   
     }
       
   }
   if(!query.length){
     setMovies([]);
     setError('')
     return
   }
       fetchMovies();
       return function(){
         controller.abort();
       }
       },[query]);

       return {movies,isLoading,error}
   



}