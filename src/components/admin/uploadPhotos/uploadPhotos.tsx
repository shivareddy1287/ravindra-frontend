import { useEffect, useState } from "react"
import "./uploadPhotos.css"
import { useFormik } from "formik"
import * as Yup from "yup"
import Sidebar from "../sidebar/sidebar"
import dayjs from "dayjs" // Import Dayjs type
import type { Dayjs } from "dayjs" // Import Dayjs type
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
// import { uploadPhotosAction } from "../../../redux/slices/photos/photosSlice"
import { useAppSelector } from "../../../app/hooks"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../../redux/store/store"
import CircleLoader from "../../../utils/Loaders/circleLoader"
import { toast } from "react-toastify"

declare global {
  interface Window {
    cloudinary: any // You can replace `any` with the actual Cloudinary widget type if available
  }
}

// Form Schema
const formSchema = Yup.object({
  userId: Yup.string().required("UserId is required"),
  date: Yup.mixed().required("Date is required"), // Use Yup.mixed for Day.js object
  image: Yup.array().min(1, "At least one image is required"),
})

const UploadPhotos: React.FC = () => {
  // const [leaderImgs, setLeaderImgs] = useState<string[]>([])
  // const [loadingImages, setLoadingImages] = useState<boolean>(false)
  const [loaded, setLoaded] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isDisabled, setIsDisabled] = useState(false)
  // const [pictureCapturedDate, setPictureCapturedDate] = useState("2024-01-01") // Default or user-selected date
  // const [pictureDate, setPictureDate] = useState("2024-02-01") // Default or user-selected date

  // const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { isUploaded } = useAppSelector((state: RootState) => state.photos)
  const { userAuth } = useAppSelector((state: RootState) => state.users)

  const formik = useFormik({
    initialValues: {
      userId: userAuth?._id || "",
      date: dayjs(),
      image: [] as File[],
    },
    validationSchema: formSchema,
    onSubmit: values => {
      toast.success("uploading") // Toast appears immediately

      const formData = new FormData()
      formData.append("userId", values.userId)
      formData.append("date", values.date.toISOString())

      values.image.forEach(img => {
        formData.append("image", img)
      })

      // dispatch(uploadPhotosAction(formData))
    },
  })

  // const handleProfileImgChange = async (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   if (e.target.files) {
  //     const files = Array.from(e.target.files)
  //     formik.setFieldValue("image", files)
  //     setLoadingImages(true)

  //     // Read files asynchronously and set preview images
  //     const readFiles = async (files: File[]) => {
  //       const promises = files.map(
  //         file =>
  //           new Promise<string>((resolve, reject) => {
  //             const reader = new FileReader()
  //             reader.onload = () => resolve(reader.result as string)
  //             reader.onerror = reject
  //             reader.readAsDataURL(file)
  //           }),
  //       )
  //       return Promise.all(promises)
  //     }

  //     const urls = await readFiles(files)
  //     setLeaderImgs(prev => [...prev, ...urls])
  //     setLoadingImages(false)
  //   }
  // }

  // clodinary direct upload start

  useEffect(() => {
    const uwScript = document.getElementById("uw")
    if (!loaded && !uwScript) {
      const script = document.createElement("script")
      script.setAttribute("async", "")
      script.setAttribute("id", "uw")
      script.src = "https://upload-widget.cloudinary.com/global/all.js"
      script.addEventListener("load", () => setLoaded(true))
      document.body.appendChild(script)
    }
  }, [loaded])

  const processResults = (error: any, result: any) => {
    if (result.event === "close") {
      setIsDisabled(false)
    }
    if (result && result.event === "success") {
      const secureUrl = result.info.secure_url
      const previewUrl = secureUrl.replace(
        "/upload/",
        "/upload/w_400/f_auto,q_auto/",
      )

      setUploadedImages(prevImages => [...prevImages, previewUrl])
      setIsDisabled(false)
    }
    if (error) {
      setIsDisabled(false)
    }
  }

  const cloudName = "dzrc9ejln"
  const uploadPreset = "ftqulvtb"

  const uploadWidget = () => {
    setIsDisabled(true)
    window.cloudinary.openUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "url"],
        tags: ["myphotoalbum-react"],
        clientAllowedFormats: ["image"],
        resourceType: "image",
        multiple: true, // Allow multiple photo selection
        context: {
          pictureCapturedDate: formik?.values?.date, // Add the captured date here
        },
      },
      processResults,
    )
  }

  // clodinary direct upload end

  // Navigate after successful upload
  useEffect(() => {
    if (isUploaded) {
      navigate("/dashboard")
    }
  }, [isUploaded, navigate])

  return (
    <div className="ad-cont">
      <Sidebar />
      <div className="db-cont">
        <form className="form" onSubmit={formik.handleSubmit}>
          <div className="sl-cont">
            <div className="flex-column">
              <label>Leader</label>
            </div>
            <div className="inputForm">
              <AccountBoxIcon />
              <select
                className="input"
                name="userId"
                value={formik.values.userId}
                onChange={formik.handleChange}
              >
                <option value="">
                  {userAuth?.firstName} {userAuth?.lastName}
                </option>
              </select>
              {formik.errors.userId && formik.touched.userId && (
                <div className="error">{formik.errors.userId}</div>
              )}
            </div>

            <div className="flex-column">
              <label>Date</label>
              <span>
                {formik.values.date
                  ? formik.values.date.format("DD-MMM-YYYY")
                  : ""}
              </span>
            </div>
            <div className="inputForm up-dp">
              <CalendarMonthIcon />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MMM-YYYY"
                  className="mui-date custom-datepicker up-d"
                  value={formik.values.date}
                  onChange={(date: Dayjs | null) => {
                    formik.setFieldValue("date", date)
                    // setPictureCapturedDate(date)
                  }}
                />
              </LocalizationProvider>
            </div>
            {/* <div>
              <button
                disabled={isDisabled}
                className={`btn btn-primary ${isDisabled ? "btn-disabled" : ""}`}
                type="button"
                onClick={uploadWidget}
              >
                {isDisabled ? "Opening Widget" : "Upload Image"}
              </button>
            </div> */}

            <div className="flex-column">
              <label>Upload Images</label>
            </div>
            <label
              className="custum-up-file-upload"
              htmlFor="file"
              onClick={uploadWidget}
            >
              <div className="up-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill=""
                  viewBox="0 0 24 24"
                >
                  <path
                    fill=""
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                  />
                </svg>
              </div>
              <div className="text">
                <span>
                  {/* Click to upload image */}
                  {isDisabled ? "Opening Widget" : "Click to Upload Image"}
                </span>
              </div>
              {/* <input
                type="file"
                id="file"
                multiple
                accept="image/*"
                onChange={handleProfileImgChange}
              /> */}
            </label>

            {/* Loading indicator for images */}
            {!uploadedImages ? (
              <div className="loading-indicator">
                <CircleLoader />
              </div>
            ) : (
              <div className="leader-imgs-cont">
                {uploadedImages.length > 0 &&
                  uploadedImages.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt="Preview"
                      className="uploaded-image"
                    />
                  ))}
              </div>
            )}

            {/* <button type="submit" className="button-submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Photos"}
            </button> */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadPhotos
