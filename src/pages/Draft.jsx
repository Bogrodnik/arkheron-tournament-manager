import { useState, useEffect } from "react";

import { eternals } from "../data/eternals";
import { draftOrder } from "../draftLogic";
import EternalCard from "../components/EternalCard";


export default function Draft(){


const [step,setStep] = useState(0);

const [draft,setDraft] = useState([]);


const [time,setTime] = useState(30);

const [running,setRunning] = useState(false);



const [team1Name,setTeam1Name] =
useState("TEAM ALPHA");


const [team2Name,setTeam2Name] =
useState("TEAM BETA");



const [score,setScore] =
useState({

team1:0,

team2:0

});



const [game,setGame] =
useState(1);






useEffect(()=>{


if(!running) return;


const timer = setInterval(()=>{


setTime(prev=>{


if(prev <= 1){


setRunning(false);



if(step < draftOrder.length - 1){

setStep(step + 1);

}


return 30;


}


return prev - 1;


});


},1000);



return ()=>clearInterval(timer);



},[running,step]);







function choose(item){



const action = draftOrder[step];



setDraft([

...draft,

{

action,

item:item.name

}

]);



setTime(30);



if(step < draftOrder.length - 1){

setStep(step+1);

}


}






function undo(){


if(draft.length === 0)
return;



const copy = [...draft];


copy.pop();


setDraft(copy);


setStep(Math.max(step-1,0));


setTime(30);


}








function resetDraft(){


setDraft([]);


setStep(0);


setTime(30);


setRunning(false);


}








function winGame(team){



if(team==="team1"){


setScore({

...score,

team1:score.team1+1

});


}

else{


setScore({

...score,

team2:score.team2+1

});


}



setGame(game+1);



}








return (


<div className="draft-container">



<h1>

DAHLA CUP ETERNAL DRAFT

</h1>





<div className="team-inputs">


<input

value={team1Name}

onChange={(e)=>setTeam1Name(e.target.value)}

/>



<input

value={team2Name}

onChange={(e)=>setTeam2Name(e.target.value)}

/>


</div>








<div className="series">


<h2>

BEST OF 5

</h2>


<h3>

{team1Name}

&nbsp;

{score.team1}

-

{score.team2}

&nbsp;

{team2Name}

</h3>



<p>

GAME {game}

</p>



<button onClick={()=>winGame("team1")}>

{team1Name} Wins

</button>



<button onClick={()=>winGame("team2")}>

{team2Name} Wins

</button>



</div>









<div className="timer">


<h2>

CURRENT TURN

</h2>



<h3>

{draftOrder[step]}

</h3>



<div className="clock">

{time}

</div>



<button

onClick={()=>setRunning(!running)}

>


{

running

?

"PAUSE"

:

"START TIMER"

}


</button>



<button

onClick={()=>setTime(30)}

>

RESET TIMER

</button>



</div>









<div className="teams">



<div className="team">


<h2>

{team1Name}

</h2>



{

draft.filter(
x=>x.action.includes("Team 1")
)
.map((x,i)=>(


<p key={i}>

{x.action}

<br/>

⚔️ {x.item}


</p>


))

}



</div>







<div className="team">


<h2>

{team2Name}

</h2>



{

draft.filter(
x=>x.action.includes("Team 2")
)
.map((x,i)=>(


<p key={i}>


{x.action}

<br/>


⚔️ {x.item}


</p>


))


}



</div>



</div>









<h2>

AVAILABLE ETERNALS

</h2>


<div className="cards">

  {eternals.map((e) => (
    <EternalCard
      key={e.id}
      eternal={e}
      disabled={draft.some((x) => x.item === e.name)}
      onClick={() => choose(e)}
    />
  ))}

</div>

<div className="controls">



<button onClick={undo}>

UNDO

</button>



<button onClick={resetDraft}>

RESET DRAFT

</button>



</div>







</div>



);


}