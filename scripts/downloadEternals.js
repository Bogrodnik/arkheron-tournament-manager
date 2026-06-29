import axios from "axios";
import fs from "fs";
import path from "path";


const eternals = [
"Dahla",
"Edani",
"Irenna",
"Ravah",
"Hollow",
"Leodin",
"Karriv",
"Rynshi",
"Vaton",
"Grimwold",
"Penelope",
"Tsu'bo"
];


const folder =
"./public/images/eternals";


if(!fs.existsSync(folder)){

fs.mkdirSync(folder,{recursive:true});

}



const client = axios.create({

headers:{

"User-Agent":
"Arkheron-Tournament-Manager"

}

});



function wait(ms){

return new Promise(
resolve=>setTimeout(resolve,ms)
);

}



async function downloadEternal(name){


const filename =
name
.toLowerCase()
.replace("'","")
+".png";


const savePath =
path.join(folder,filename);



if(fs.existsSync(savePath)){

console.log(
"Already exists:",
name
);

return;

}




console.log(
"Finding:",
name
);



const page =
await client.get(

`https://arkheron.wiki.gg/wiki/${name}`

);



const html = page.data;



const images =
[
...html.matchAll(
/https?:\/\/[^"' ]+\.(png|jpg|jpeg)/gi
)

];



if(images.length===0){

console.log(
"No image found:",
name
);

return;

}



const imageUrl =
images[0][0];



console.log(
"Downloading:",
imageUrl
);



const image =
await client.get(
imageUrl,
{
responseType:"arraybuffer"
}
);



fs.writeFileSync(
savePath,
image.data
);



console.log(
"Saved:",
name
);



}



async function run(){


for(const eternal of eternals){


try{

await downloadEternal(eternal);

await wait(5000);

}

catch(error){

console.log(
"Failed:",
eternal,
error.message
);


await wait(10000);

}


}



console.log(
"Finished downloading eternals"
);



}



run();