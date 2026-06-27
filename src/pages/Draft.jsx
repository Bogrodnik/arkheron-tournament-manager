import {useState} from "react";

import {eternals} from "../data/eternals";

import {draftOrder} from "../draftLogic";


export default function Draft(){


const [step,setStep] = useState(0);

const [selected,setSelected] = useState([]);



function choose(item){

setSelected([
...selected,
{
action:draftOrder[step],
item:item.name
}
]);


if(step < draftOrder.length-1){

setStep(step+1);

}

}



return(

<div>


<h2>
Eternal Draft
</h2>


<h3>
Current Action:
{draftOrder[step]}
</h3>


<div className="cards">


{

eternals.map(e=>(

<button

key={e.id}

onClick={()=>choose(e)}

disabled={
selected.some(
x=>x.item===e.name
)
}

>

{e.name}

</button>


))

}


</div>



<h3>
Draft Results
</h3>


{

selected.map((x,i)=>(

<p key={i}>

{x.action}:
{x.item}

</p>

))

}


</div>

)

}
