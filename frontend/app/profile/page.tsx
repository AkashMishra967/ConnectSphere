"use client";

import Userlayouts from "@/src/layouts/userlayouts";
import styles from "./index.module.css";
import clientServer, { BASE_URL } from "@/src/config";
import DashboardLayout from "@/src/layouts/DashboardLayouts";

import { getAboutUser } from "@/src/config/redux/action/authAction";
import { getAllPosts } from "@/src/config/redux/action/postAction";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProfilePage() {

  // =========================================
  // REDUX STATE
  // =========================================

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  // =========================================
  // LOCAL STATE
  // =========================================

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const usernameRef = useRef(null);

  // =========================================
  // GET USER PROFILE + POSTS
  // =========================================

  useEffect(() => {

    dispatch(
      getAboutUser({
        token: localStorage.getItem("token"),
      })
    );

    dispatch(getAllPosts());

  }, [dispatch]);


  // =========================================
  // SET USER PROFILE
  // =========================================

  useEffect(() => {

    if (authState.user) {

      setUserProfile(authState.user);

    }

  }, [authState.user]);


  // =========================================
  // GET USER POSTS
  // =========================================

  useEffect(() => {

    if (userProfile?.userId?.username) {

      const posts = postState.posts.filter((post) => {

        return (
          post.userId?.username ===
          userProfile.userId.username
        );

      });

      setUserPosts(posts);

    }

  }, [postState.posts, userProfile]);


  // =========================================
  // WORK INPUT CHANGE
  // =========================================

  const handleWorkInputChange = (e) => {

    const { name, value } = e.target;

    setInputData({
      ...inputData,
      [name]: value,
    });

  };


  // =========================================
  // UPDATE PROFILE PICTURE
  // =========================================

  const updateProfilePicture = async (file) => {

    if (!file) return;

    try {

      const formData = new FormData();

      formData.append(
        "profile_picture",
        file
      );

      formData.append(
        "token",
        localStorage.getItem("token")
      );

      await clientServer.post(
        "/update_profile_picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(
        getAboutUser({
          token: localStorage.getItem("token"),
        })
      );

    } catch (error) {

      console.log(
        "Profile picture update error:",
        error
      );

      alert(
        "Profile picture update nahi ho paya."
      );

    }

  };


  // =========================================
  // DOWNLOAD RESUME
  // =========================================

  const downloadResume = async () => {

    try {

      /*
        IMPORTANT:

        Window ko click ke immediately baad open
        kar rahe hain.

        Isse Chrome popup blocker ke chance
        kam ho jaate hain.
      */

      const newWindow = window.open(
        "",
        "_blank"
      );


      const response =
        await clientServer.get(
          `/user/download_resume?id=${userProfile.userId._id}`
        );


      const resumePath =
        response?.data?.message;


      if (!resumePath) {

        alert(
          "Resume nahi mila."
        );

        if (newWindow) {
          newWindow.close();
        }

        return;
      }


      /*
        BASE_URL ke end me "/" ho ya na ho,
        dono cases handle honge.
      */

      const cleanBaseUrl =
        BASE_URL.replace(/\/$/, "");


      const cleanResumePath =
        String(resumePath).replace(
          /^\//,
          ""
        );


      const resumeUrl =
        `${cleanBaseUrl}/${cleanResumePath}`;


      console.log(
        "Resume URL:",
        resumeUrl
      );


      /*
        New tab already open hai,
        ab usko actual resume URL par bhejo.
      */

      if (newWindow) {

        newWindow.location.href =
          resumeUrl;

      } else {

        /*
          Agar browser ne popup block kar diya
          to current window me open kar do.
        */

        window.location.href =
          resumeUrl;

      }

    } catch (error) {

      console.log(
        "Resume download error:",
        error
      );

      alert(
        "Resume download nahi ho pa raha hai."
      );

    }

  };


  // =========================================
  // UPDATE PROFILE DATA
  // =========================================

  const updateProfileData = async () => {

    try {

      /*
        Update name
      */

      await clientServer.post(
        "/user_update",
        {
          token:
            localStorage.getItem("token"),

          name:
            userProfile.userId.name,
        }
      );


      /*
        Update remaining profile data
      */

      await clientServer.post(
        "/update_profile_data",
        {

          token:
            localStorage.getItem("token"),

          bio:
            userProfile.bio || "",

          currentPost:
            userProfile.currentPost || "",

          pastWork:
            userProfile.pastWork || [],

          education:
            userProfile.education || "",

        }
      );


      /*
        Get updated profile
      */

      dispatch(
        getAboutUser({
          token:
            localStorage.getItem("token"),
        })
      );


      alert(
        "Profile updated successfully!"
      );

    } catch (error) {

      console.log(
        "Profile update error:",
        error
      );

      alert(
        "Profile update nahi ho paya."
      );

    }

  };


  // =========================================
  // ADD WORK
  // =========================================

  const addWork = () => {

    if (
      !inputData.company.trim() ||
      !inputData.position.trim() ||
      !inputData.years.trim()
    ) {

      alert(
        "Please fill all work details."
      );

      return;
    }


    setUserProfile({

      ...userProfile,

      pastWork: [

        ...(userProfile.pastWork || []),

        {
          company:
            inputData.company.trim(),

          position:
            inputData.position.trim(),

          years:
            inputData.years.trim(),
        },

      ],

    });


    /*
      Clear form
    */

    setInputData({
      company: "",
      position: "",
      years: "",
    });


    /*
      Close modal
    */

    setIsModalOpen(false);

  };


  // =========================================
  // DELETE WORK
  // =========================================

  const removeWork = (indexToRemove) => {

    const updatedWork =
      (userProfile.pastWork || []).filter(
        (_, index) =>
          index !== indexToRemove
      );


    setUserProfile({

      ...userProfile,

      pastWork:
        updatedWork,

    });

  };


  // =========================================
  // RETURN UI
  // =========================================

  return (

    <Userlayouts>

      <DashboardLayout>

        {/* =========================================
            PROFILE PAGE
        ========================================= */}

        {authState.user &&
          userProfile?.userId && (

            <div
              className={
                styles.container
              }
            >


              {/* =========================================
                  COVER SECTION
              ========================================= */}

              <section
                className={
                  styles.coverSection
                }
              >

                <img
                  className={
                    styles.coverImage
                  }

                  src={
                    userProfile.userId.coverPicture ||
                    "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1400&q=80"
                  }

                  alt="Profile cover"
                />


                {/* Cover Overlay */}

                <div
                  className={
                    styles.coverOverlay
                  }
                >

                  <span>
                    Profile
                  </span>

                </div>


                {/* =========================================
                    PROFILE PICTURE
                ========================================= */}
<label
  htmlFor="profilePictureUpload"
  className={styles.profilePictureWrapper}
>
  {userProfile.userId.profilePicture ? (
    <img
      className={styles.profilePicture}
      src={userProfile.userId.profilePicture}
      alt="Profile"
      onError={(e) => {
        e.target.onerror = null;
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "flex";
      }}
    />
  ) : null}
  <div 
    className={styles.profilePicture}
    style={{
      display: userProfile.userId.profilePicture ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, rgb(0,59,130), rgb(3,93,183))",
      color: "white",
      fontSize: "2.5rem",
      fontWeight: "bold"
    }}
  >
    {userProfile.userId.name?.charAt(0).toUpperCase()}
  </div>

  <div className={styles.profilePictureOverlay}>
    <span>Edit Photo</span>
  </div>
</label>
                <input
                  hidden
                  type="file"
                  id="profilePictureUpload"
                  accept="image/*"

                  onChange={(e) => {

                    updateProfilePicture(
                      e.target.files[0]
                    );

                  }}
                />

              </section>



              {/* =========================================
                  PROFILE MAIN SECTION
              ========================================= */}

              <section
                className={
                  styles.profileMainSection
                }
              >


                {/* =========================================
                    PROFILE INFORMATION
                ========================================= */}

                <div
                  className={
                    styles.profileInfoCard
                  }
                >


                  {/* =========================================
                      NAME + USERNAME
                  ========================================= */}

                  <div
                    className={
                      styles.profileIdentity
                    }
                  >

                    <input

                      className={
                        styles.nameEdit
                      }

                      type="text"

                      value={
                        userProfile.userId.name ||
                        ""
                      }

                      onChange={(e) => {

                        setUserProfile({

                          ...userProfile,

                          userId: {

                            ...userProfile.userId,

                            name:
                              e.target.value,

                          },

                        });

                      }}

                    />


                    <p

                      className={
                        styles.username
                      }

                      contentEditable

                      suppressContentEditableWarning

                      ref={
                        usernameRef
                      }

                      onBlur={(e) => {

                        setUserProfile({

                          ...userProfile,

                          userId: {

                            ...userProfile.userId,

                            username:
                              e.target.innerText
                                .replace("@", "")
                                .trim(),

                          },

                        });

                      }}

                    >

                      @{userProfile.userId.username}

                    </p>


                    {/* =========================================
                        RESUME BUTTON
                    ========================================= */}

                    <button

                      type="button"

                      className={
                        styles.resumeButton
                      }

                      onClick={
                        downloadResume
                      }

                    >

                      <svg
                        xmlns="http://www.w3.org/2000/svg"

                        fill="none"

                        viewBox="0 0 24 24"

                        strokeWidth="1.8"

                        stroke="currentColor"
                      >

                        <path

                          strokeLinecap="round"

                          strokeLinejoin="round"

                          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"

                        />

                      </svg>


                      Download Resume

                    </button>

                  </div>



                  {/* =========================================
                      ABOUT / BIO
                  ========================================= */}

                  <div
                    className={
                      styles.bioSection
                    }
                  >

                    <div
                      className={
                        styles.sectionHeading
                      }
                    >

                      <h3>
                        About
                      </h3>

                      <span>
                        Bio
                      </span>

                    </div>


                    <textarea

                      className={
                        styles.bioTextarea
                      }

                      value={
                        userProfile.bio || ""
                      }

                      placeholder="Write something about yourself..."

                      onChange={(e) => {

                        setUserProfile({

                          ...userProfile,

                          bio:
                            e.target.value,

                        });

                      }}

                      rows={5}

                    />


                    <p
                      className={
                        styles.bioHint
                      }
                    >

                      Tell people about your
                      skills, experience and
                      interests.

                    </p>

                  </div>

                </div>



                {/* =========================================
                    RECENT ACTIVITY
                ========================================= */}

                <div
                  className={
                    styles.activityCard
                  }
                >

                  <div
                    className={
                      styles.sectionHeading
                    }
                  >
                    <h4>
                      Recent Activity
                    </h4>

                    <span>
                      {userPosts.length} Posts
                    </span>
                  </div>
                  {/* No Posts */}

                  {userPosts.length === 0 ? (

                    <div
                      className={
                        styles.emptyActivity
                      }
                    >
                      <div
                        className={
                          styles.emptyIcon
                        }
                      >
                      </div>
                      <h4>
                        No activity yet
                      </h4>
                      <p>
                        Your recent posts will
                        appear here.
                      </p>
                    </div>

                  ) : (

                    /* Posts */
                    <div
                      className={
                        styles.postsList
                      }
                    >
                      {userPosts.map(
                        (post) => (
                          <div
                            key={
                              post._id
                            }
                            className={
                              styles.postCard
                            }
                          >
                            {post.media !== "" &&
                              post.media && (
                               <img src={post.media}alt="Post"className={styles.postImage}/>
                              )}
                            <p
                              className={
                                styles.postText
                              }
                            >
                              {post.body}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </section>
              {/* =========================================
                  WORK HISTORY SECTION
              ========================================= */}

              <section
                className={
                  styles.workSection
                }
              >


                {/* Work Header */}

                <div
                  className={
                    styles.workHeader
                  }
                >

                  <div>

                    <h3>
                      Work History
                    </h3>

                    <p>
                      Add your professional
                      experience
                    </p>

                  </div>


                  {/* Add Work */}

                  <button

                    type="button"

                    className={
                      styles.addWorkButton
                    }

                    onClick={() =>
                      setIsModalOpen(true)
                    }

                  >

                    <span>
                      +
                    </span>

                    Add Work

                  </button>

                </div>



                {/* =========================================
                    WORK LIST
                ========================================= */}

                {userProfile.pastWork?.length >
                0 ? (

                  <div
                    className={
                      styles.workHistoryContainer
                    }
                  >

                    {userProfile.pastWork.map(
                      (work, index) => (

                        <div

                          key={
                            index
                          }

                          className={
                            styles.workHistoryCard
                          }

                        >

                          {/* Work Icon */}

                          <div
                            className={
                              styles.workIcon
                            }
                          >
                            💼
                          </div>


                          {/* Work Details */}

                          <div
                            className={
                              styles.workDetails
                            }
                          >

                            <h4>

                              {
                                work.position
                              }

                            </h4>


                            <p
                              className={
                                styles.companyName
                              }
                            >

                              {
                                work.company
                              }

                            </p>


                            <span
                              className={
                                styles.workYears
                              }
                            >

                              {
                                work.years
                              }

                            </span>

                          </div>


                          {/* Delete */}

                          <button

                            type="button"

                            className={
                              styles.deleteWorkButton
                            }

                            onClick={() =>
                              removeWork(index)
                            }

                            title="Remove work"

                          >

                            ×

                          </button>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  /* No Work */

                  <div
                    className={
                      styles.emptyWork
                    }
                  >

                    <div>
                      💼
                    </div>


                    <h4>
                      No work experience
                      added
                    </h4>


                    <p>
                      Add your professional
                      experience to make your
                      profile stronger.
                    </p>

                  </div>

                )}

              </section>



              {/* =========================================
                  UPDATE PROFILE
              ========================================= */}

              <div
                className={
                  styles.updateSection
                }
              >

                <button

                  type="button"

                  onClick={
                    updateProfileData
                  }

                  className={
                    styles.updateProfileBtn
                  }

                >

                  Save & Update Profile

                </button>

              </div>

            </div>

          )}



        {/* =========================================
            ADD WORK MODAL
        ========================================= */}

        {isModalOpen && (

          <div

            className={
              styles.modalOverlay
            }

            onClick={() =>
              setIsModalOpen(false)
            }

          >


            <div

              className={
                styles.modalContainer
              }

              onClick={(e) =>
                e.stopPropagation()
              }

            >


              {/* =========================================
                  MODAL HEADER
              ========================================= */}

              <div
                className={
                  styles.modalHeader
                }
              >

                <div>

                  <h3>
                    Add Work Experience
                  </h3>

                  <p>
                    Add your professional
                    experience
                  </p>

                </div>


                <button

                  type="button"

                  className={
                    styles.closeModalButton
                  }

                  onClick={() =>
                    setIsModalOpen(false)
                  }

                >

                  ×

                </button>

              </div>



              {/* =========================================
                  MODAL BODY
              ========================================= */}

              <div
                className={
                  styles.modalBody
                }
              >


                {/* Company */}

                <div
                  className={
                    styles.formGroup
                  }
                >

                  <label>
                    Company
                  </label>


                  <input

                    onChange={
                      handleWorkInputChange
                    }

                    value={
                      inputData.company
                    }

                    name="company"

                    className={
                      styles.inputField
                    }

                    type="text"

                    placeholder="e.g. HCL Technologies"

                  />

                </div>



                {/* Position */}

                <div
                  className={
                    styles.formGroup
                  }
                >

                  <label>
                    Position
                  </label>


                  <input

                    onChange={
                      handleWorkInputChange
                    }

                    value={
                      inputData.position
                    }

                    name="position"

                    className={
                      styles.inputField
                    }

                    type="text"

                    placeholder="e.g. Software Developer"

                  />

                </div>



                {/* Years */}

                <div
                  className={
                    styles.formGroup
                  }
                >

                  <label>
                    Duration / Year
                  </label>


                  <input

                    onChange={
                      handleWorkInputChange
                    }

                    value={
                      inputData.years
                    }

                    name="years"

                    className={
                      styles.inputField
                    }

                    type="text"

                    placeholder="e.g. 2025 - Present"

                  />

                </div>



                {/* Add */}

                <button

                  type="button"

                  className={
                    styles.modalAddButton
                  }

                  onClick={
                    addWork
                  }

                >

                  Add Experience

                </button>

              </div>

            </div>

          </div>

        )}

      </DashboardLayout>

    </Userlayouts>

  );

}