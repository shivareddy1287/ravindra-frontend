import { useEffect, useState } from "react"
import "./deletePhotos.css"
import Sidebar from "../sidebar/sidebar"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import type { Dayjs } from "dayjs"

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import type { RootState } from "../../../redux/store/store"
import {
  deletePhotosAction,
  fetchPhotosAction,
} from "../../../redux/slices/photos/photosSlice"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const DeletePhotos = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const maxDate = dayjs().add(0, "day")
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]) // State to track selected image IDs
  const [selectAll, setSelectAll] = useState(false) // State for "Select All" checkbox

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { allPhotos, isDeleted, deletedPhotos } = useAppSelector(
    (state: RootState) => state.photos,
  )

  const handleClickLeftDateBtn = () => {
    if (date) {
      const prevDate = date.subtract(1, "day")
      // alert(prevDate)
      setDate(prevDate)
    }
  }
  const handleClickRightDateBtn = () => {
    if (date) {
      const prevDate = date.add(1, "day")
      // alert(prevDate)
      setDate(prevDate)
    }
  }

  // Handle individual checkbox selection
  const handleCheckboxChange = (photoId: string) => {
    let updatingImgsLength = selectedImageIds?.length

    if (selectedImageIds.includes(photoId)) {
      updatingImgsLength -= 1

      setSelectedImageIds(selectedImageIds.filter(id => id !== photoId)) // Deselect
    } else {
      updatingImgsLength += 1

      setSelectedImageIds([...selectedImageIds, photoId]) // Select
    }

    const currentDateImagesLength = allPhotos?.filter(photo => {
      // Convert the photo date and the given date to just the date part
      const photoDate = new Date(photo?.date).toISOString().split("T")[0]
      const selectedDate = date ? date.toDate().toISOString().split("T")[0] : ""

      return photoDate === selectedDate
    }).length
    // toast(updatingImgsLength)
    if (currentDateImagesLength === updatingImgsLength) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }

  // Handle "Select All" checkbox
  const handleSelectAllChange = () => {
    console.log("s")

    if (selectAll) {
      // Deselect all images for the selected date
      const dateSpecificIds =
        allPhotos
          ?.filter(photo => {
            const photoDate = new Date(photo?.date).toISOString().split("T")[0]
            const selectedDate = date
              ? date.toDate().toISOString().split("T")[0]
              : ""
            return photoDate === selectedDate
          })
          ?.map(photo => photo._id) || []
      //
      const selImgs = selectedImageIds.filter(
        id => !dateSpecificIds.includes(id),
      )
      setSelectedImageIds(selImgs)
      //   deletePhotosAction(selImgs)
    } else {
      // Select all images for the selected date
      const dateSpecificIds =
        allPhotos
          ?.filter(photo => {
            const photoDate = new Date(photo?.date).toISOString().split("T")[0]
            const selectedDate = date
              ? date.toDate().toISOString().split("T")[0]
              : ""
            return photoDate === selectedDate
          })
          ?.map(photo => photo._id) || []
      //
      const selImgs = [...new Set([...selectedImageIds, ...dateSpecificIds])]
      setSelectedImageIds(selImgs) // Add unique IDs
      //   deletePhotosAction(selImgs) // Delete
    }
    setSelectAll(!selectAll) // Toggle select all state
  }

  const hadleDeleteSelectedImages = () => {
    console.log(selectedImageIds)

    if (selectedImageIds.length > 0) {
      dispatch(deletePhotosAction(selectedImageIds))
    } else {
      // alert("Please select images")
      toast.warning("Please select images")
    }
  }

  useEffect(() => {
    if (isDeleted) {
      // <Redirect to="/posts" />
      console.log(deletedPhotos)

      // console.log("update")
      toast.success(`Photos Deleted`, {
        autoClose: 3000, // Optional: Set the duration for how long the toast should be visible
      })
      navigate("/dashboard")
    }
  }, [isDeleted, navigate, deletedPhotos])

  // Fetch photos on component mount
  useEffect(() => {
    dispatch(fetchPhotosAction())
  }, [dispatch])

  return (
    <div className="ad-cont">
      <Sidebar />
      <div className="db-cont">
        <div className="form">
          <div className="db-det-cont">
            <div className="db-det-l-cont">
              {/* <img
                src={`data:image/jpeg;base64,${userAuth?.profilePhoto}`}
                alt="leaders"
              />{" "}
              <span>
                {userAuth?.firstName} {userAuth?.lastName}
              </span> */}
              <span className="back-btn" onClick={() => navigate("/dashboard")}>
                {" "}
                <ArrowBackIosNewRoundedIcon />
              </span>
              <div>
                <button
                  className="delete-btn-img"
                  //   onClick={() => console.log(selectedImageIds)}
                  onClick={hadleDeleteSelectedImages}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="db-det-r-cont">
              <div className="checkbox-cont">
                <input
                  type="checkbox"
                  className="input-checkbox"
                  id="selectCheckbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <label htmlFor="selectCheckbox">Select All Images</label>
              </div>
              <button
                type="button"
                onClick={handleClickLeftDateBtn}
                className="pn-btn"
              >
                <ArrowBackIosNewRoundedIcon />
              </button>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  format="DD-MMM-YYYY"
                  className="mui-date custom-datepicker" // Add custom class here
                  onChange={date => setDate(date)}
                  maxDate={maxDate}
                />
              </LocalizationProvider>
              <button
                type="button"
                onClick={handleClickRightDateBtn}
                className="pn-btn"
              >
                <ArrowForwardIosRoundedIcon className="pn-btn-icon" />
              </button>
            </div>
          </div>
          {allPhotos ? (
            <>
              <div className="db-imgs-cont">
                {allPhotos
                  ?.filter(photo => {
                    const photoDate = new Date(photo?.date)
                      .toISOString()
                      .split("T")[0]
                    const selectedDate = date
                      ? date.toDate().toISOString().split("T")[0]
                      : ""
                    return photoDate === selectedDate
                  })
                  ?.map(photo => (
                    <div
                      key={photo?._id}
                      className="delete-img-container selected-img-box"
                    >
                      <img src={photo?.image} alt="img" />
                      <br />
                      <input
                        type="checkbox"
                        className="input-checkbox"
                        checked={selectedImageIds.includes(photo._id)}
                        onChange={() => handleCheckboxChange(photo._id)}
                      />
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeletePhotos