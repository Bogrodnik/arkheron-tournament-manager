import {Link} from "react-router-dom";


export default function Sidebar(){

return(

<nav className="sidebar">

<h2>
MENU
</h2>


<Link to="/">
Dashboard
</Link>


<Link to="/draft">
Draft
</Link>


<Link to="/builder">
Team Builder
</Link>


<Link to="/settings">
Settings
</Link>


</nav>

)

}