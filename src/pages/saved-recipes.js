import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

export const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [showIngredients, setShowIngredients] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const userID = useGetUserID();

    useEffect(() => {
        const fetchSavedRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/${userID}`);
                setSavedRecipes(response.data.savedRecipes);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSavedRecipe();
    }, []);

    const handleIngredientsButtonClick = (recipeID) => {
        setShowIngredients(prevID => prevID === recipeID ? null : recipeID);
    }

    const handleInstructionsButtonClick = (recipeID) => {
        setShowInstructions(prevID => prevID === recipeID ? null : recipeID);
    }

    return (
        <div>
            <h1>My Saved Recipes</h1>
            <ul>
                {savedRecipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div>
                            <h2>{recipe.name}</h2>

                            <p><em>{recipe.description}</em></p>
                        </div>

                        <img src={recipe.imageUrl} />
                        <p>Cooking Time: {recipe.cookingTime} (minutes)</p>

                        <div className="saved-recipe-buttons-wrapper">
                        <button
                                onClick={() => handleIngredientsButtonClick(recipe._id)}
                            >
                                Ingredients
                            </button>

                            <button
                                onClick={() => handleInstructionsButtonClick(recipe._id)}
                            >
                                Instructions
                            </button>
                        </div>

                        <div className="saved-recipe-ingredients-instructions">
                        {showIngredients === recipe._id && recipe.ingredients.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                        ))}

                        {showInstructions === recipe._id && recipe.instructions.map((instruction, i) => (
                            <li key={i}>{i + 1}. {instruction}</li>
                        ))}
                        </div>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};