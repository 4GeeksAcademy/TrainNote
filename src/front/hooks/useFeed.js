import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { getForos } from "../../services/foroService";
import { getMyFollow } from "../../services/followService";
import { getTagsFromUser } from "../../services/tagService";

export const useFeed = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const searchFromUrl = queryParams.get("search") || "";

  const [foros, setForos] = useState([]);
  const [followForos, setFollowForos] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadForos();
    loadFollowForos();
    loadUserTags();
  }, []);

  const loadForos = async () => {
    try {
      const data = await getForos();

      console.log("FOROS:", data);

      setForos(data);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowForos = async () => {
    try {
      const data = await getMyFollow();

      setFollowForos(data.slice(-3).reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const loadUserTags = async () => {
    try {
      const data = await getTagsFromUser(user?.id);

      setUserTags(data);
    } catch (error) {
      console.log(error);
    }
  };

  const allTags = [...new Set(foros.flatMap((foro) => foro.tags ?? []))];

  const filteredForos = foros.filter((foro) => {
    const matchSearch = foro.title
      .toLowerCase()
      .includes(searchFromUrl.toLowerCase());

    const matchTag = activeTag === "" || (foro.tags ?? []).includes(activeTag);

    return matchSearch && matchTag;
  });

  const myForos = foros
    .filter((foro) => Number(foro.user_id) === Number(user?.id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    loading,
    filteredForos,
    myForos,
    followForos,
    userTags,
    loadFollowForos,
    allTags,
    activeTag,
    setActiveTag,
  };
};
