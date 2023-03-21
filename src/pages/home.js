import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

export const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [cookies, _] = useCookies(['access_token']);
    const [showIngredients, setShowIngredients] = useState(false);

    const userID = useGetUserID();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get('http://localhost:3001/recipes');
                setRecipes(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSavedRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
                setSavedRecipes(response.data.savedRecipes);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecipe();
        if (cookies.access_token) fetchSavedRecipe();
    }, []);

    const saveRecipe = async (recipeID) => {
        try {
            const response = await axios.put('http://localhost:3001/recipes', { recipeID, userID }, { headers: { authorization: cookies.access_token } });
            setSavedRecipes(response.data.savedRecipes)
        } catch (err) {
            console.error(err);
        }
    };

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    return (
        <div>
            <h1 id="home-heading">All Recipes</h1>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div>
                            <h2>{recipe.name}</h2>
                            {/* <div>{recipe.ingredients}</div> */}

                            <button
                                onClick={() => saveRecipe(recipe._id)}
                                disabled={isRecipeSaved(recipe._id)}
                            >
                                {isRecipeSaved(recipe._id) ? 'Saved' : 'Save'}
                            </button>


                            <button
                                onClick={() => showIngredients ? setShowIngredients(false) : setShowIngredients(true)}
                            >
                                Ingredients</button>
                        </div>

                        {showIngredients && recipe.ingredients.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                        ))}

                        <div className="instructions">
                            <p>{recipe.instructions}</p>
                        </div>
                        <img src={recipe.imageUrl} />
                        <p>Cooking Time: {recipe.cookingTime} (minutes)</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};