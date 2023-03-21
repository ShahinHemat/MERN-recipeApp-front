import { useState, useRef } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
    const userID = useGetUserID();
    const [cookies, _] = useCookies(['access_token']);
    const navigate = useNavigate();

    setTimeout(() => {
        if (!cookies.access_token) {
            navigate('/auth');
            return;
        };

    }, 1)

    const [recipe, setRecipe] = useState({
        name: "",
        description: '',
        ingredients: [],
        instructions: '',
        imageUrl: '',
        cookingTime: 0,
        userOwner: userID,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleIngredientChange = (e, idx) => {
        const { value } = e.target;
        const ingredients = recipe.ingredients;
        ingredients[idx] = value;
        setRecipe({ ...recipe, ingredients });
    };

    const ingredientRef = useRef(null);

    const addIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
        setTimeout(() => {
            ingredientRef.current.focus();
        }, 0);
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/recipes', recipe, { headers: { authorization: cookies.access_token } });
            alert('Recipe Created');
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="create-recipe">
            <h2>Create Recipe</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="name">Name</label>
                <input type='text' id='name' name="name" onChange={handleChange} />
                <label htmlFor="description">Description</label>
                <textarea id='description' name='description' onChange={handleChange}></textarea>

                <label htmlFor="ingredients">Ingredients</label>

                {recipe.ingredients.map((ingredient, idx) => (
                    <input key={idx} type='text' name='ingredients' value={ingredient} onChange={(e) => handleIngredientChange(e, idx)} ref={idx === recipe.ingredients.length - 1 ? ingredientRef : null} />
                ))}

                <button onClick={addIngredient} type='button'>Add Ingredient</button>

                <label htmlFor="instructions">Instructions</label>
                <textarea id="instructions" name="instructions" onChange={handleChange}></textarea>
                <label htmlFor="imageUrl">Image URL</label>
                <input type='text' id="imageUrl" name="imageUrl" onChange={handleChange} />
                <label htmlFor="cookingTime">Cooking Time (minutes)</label>
                <input type='number' id="cookingTime" name="cookingTime" onChange={handleChange} />

                <button type="submit">Create Recipe</button>
            </form>
        </div>
    );
};