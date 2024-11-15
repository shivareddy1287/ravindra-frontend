import "./navbar.css"
import { MaxWidthWrapper } from "../../utils/maxWidthWrapper"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import type { RootState } from "../../redux/store/store"

const UserNavbar = () => {
  const navigate = useNavigate()

  const { userAuth, userDetails } = useAppSelector(
    (state: RootState) => state.users,
  )

  return (
    <div className="userNavbarcontwc">
      <MaxWidthWrapper className="custom-navbar-class">
        <div className="userNavbarcont">
          <div>
            <img
              alt="logo"
              onClick={() => {
                navigate("/")
              }}
              className="nav-logo"
              src="https://pbs.twimg.com/media/GIR8u5_W4AAqdDb.jpg"
            />
          </div>
          {/* <span onClick={() => navigate("/dashboard")}>dashboard</span> */}

          {userAuth ? (
            <span onClick={() => navigate("/know-your-leader")}>
              {userDetails ? (
                <>
                  {userDetails?.lastName} {userDetails?.firstName}{" "}
                </>
              ) : (
                <>
                  {" "}
                  {userAuth?.firstName} {userAuth?.lastName}{" "}
                </>
              )}
            </span>
          ) : (
            <span onClick={() => navigate("/login")}> Login</span>
          )}
          {/* <span
            onClick={() => {
              sessionStorage.removeItem("token")
              navigate("/login")
            }}
          >
            logout
          </span> */}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default UserNavbar
