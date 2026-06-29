import axios from "axios";

const response = await axios.get(
"https://arkheron.wiki.gg/wiki/Dahla",
{
headers:{
"User-Agent":"Arkheron Tournament Manager"
}
}
);

console.log(response.status);