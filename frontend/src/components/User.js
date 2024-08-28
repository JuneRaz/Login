import { Link } from "react-router-dom"

const User = () => {
    return (
        <section>
            <h1>Admins Page</h1>
            <br />
            <p>You must have been assigned an User role.</p>
            <div className="flexGrow">
                <Link to="/Home">Home</Link>
            </div>
        </section>
    )
}

export default User;