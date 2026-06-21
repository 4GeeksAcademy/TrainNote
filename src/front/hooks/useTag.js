import { useState } from "react";
import { getTags } from "../../services/tagService.js";
import { useNavigate } from "react-router-dom";
import { selectTagFromUser, selectTagFromForo } from "../../services/tagService.js";
import { BsTags } from "react-icons/bs";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const useTag = () =>{

    const { store, dispatch } = useGlobalReducer();
    const [selectedTag, setSelectedTag] = useState([]);

    const getDataTag = async () =>{
        try{
            const tagList = await getTags(dispatch);
        }catch (err) {
            setError(err.message || "Error en enlistar tags");
        }
    };

    const onSelectedTag = async (tag) =>{
        try{
            if (selectedTag.includes(tag.id)){
                setSelectedTag(selectedTag.filter(id => id !== tag.id));
            } else {
           setSelectedTag([...selectedTag, tag.id]); }
            
        }catch (err) {
            setError(err.message || "Error seleccionar tags");
        }
    }

    const handleSave = async () => {
        try{
            if (setSelectedTag.length === 0 ) {
                setError ('No hay tags seleccionadas')
                return
            }
            console.log(selectedTag);
            
           const res = await selectTagFromUser(selectedTag)
           console.log(res);
           
        }catch (err) {
            setError(err.message || "Error seleccionar tags");
        }
    }

    const handleSaveForo = async (foroId) => {
        try{
            if (setSelectedTag.length === 0 ) {
                return;
            }
            console.log(selectedTag);
            
           const res = await selectTagFromForo(foroId, selectedTag)
           console.log(res);
           
        }catch (err) {
            setError(err.message || "Error seleccionar tags");
        }
    }


    return{
       getDataTag,
       onSelectedTag,
       handleSave,
       selectedTag
       handleSaveForo
    };  

};