import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

export const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [cookies, _] = useCookies(['access_token']);
    const [showIngredients, setShowIngredients] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const deleteRecipe = async (recipeID) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3001/recipes/${recipeID}`, { headers: { authorization: cookies.access_token } });
                const response = await axios.get('http://localhost:3001/recipes');
                setRecipes(response.data);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleIngredientsButtonClick = (recipeID) => {
        setShowIngredients(prevID => prevID === recipeID ? null : recipeID);
    }

    const handleInstructionsButtonClick = (recipeID) => {
        setShowInstructions(prevID => prevID === recipeID ? null : recipeID);
    }

    const savedButtonStyle = {
        backgroundColor: 'green',
    };

    return (
        <div>
            <div id="search-for-recipe">
                <label htmlFor="recipe-search">Search Recipes: </label>
                <input
                    type="text"
                    id="recipe-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredRecipes.length === 0 ? (
                <p>No Recipes To Show</p>
            ) : (
                <ul>
                    {filteredRecipes.map((recipe) => (
                        <li key={recipe._id}>
                            <div>
                                <h2>{recipe.name}</h2>

                                <p><em>{recipe.description}</em></p>

                            </div>

                            <img src={recipe.imageUrl} />
                            <p>Cooking Time: {recipe.cookingTime} (minutes)</p>

                            <div className="ingredients-instructions-div">
                                <button
                                    id="ingredients-button"
                                    onClick={() => handleIngredientsButtonClick(recipe._id)}
                                >
                                    Ingredients
                                </button>

                                <button
                                    id="instructions-button"
                                    onClick={() => handleInstructionsButtonClick(recipe._id)}
                                >
                                    Instructions
                                </button>

                                <button
                                    className={`${isRecipeSaved(recipe._id) ? 'saved' : ''}`}
                                    id="save-button"
                                    onClick={() => saveRecipe(recipe._id)}
                                    disabled={isRecipeSaved(recipe._id)}
                                    style={isRecipeSaved(recipe._id) ? savedButtonStyle : {}}
                                >
                                    {isRecipeSaved(recipe._id) ? 'Saved' : 'Save'}
                                </button>


                                {userID === "6419b78fa0aff4173d96e89a" || userID === "64345f8f058709d3a68f4f4a" ? (
                                    <button id="delete-button" onClick={() => deleteRecipe(recipe._id)}>Delete</button>
                                ) : null}
                            </div>

                            <div className="list-ingredients-instructions">
                                {showIngredients === recipe._id && recipe.ingredients.map((ingredient, i) => (
                                    <li key={i}><em>{ingredient}</em></li>
                                ))}

                                {showInstructions === recipe._id && recipe.instructions.map((instruction, i) => (
                                    <li key={i}>{i + 1}. {instruction}</li>
                                ))}
                            </div>


                        </li>
                    ))}
                </ul>)}
        </div>
    );
};