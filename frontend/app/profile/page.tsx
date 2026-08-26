"use client";

import Userlayouts from "@/src/layouts/userlayouts";
import styles from "./index.module.css";
import clientServer, { BASE_URL } from "@/src/config";
import DashboardLayout from "@/src/layouts/DashboardLayouts";

import {
  getAboutUser,
} from "@/src/config/redux/action/authAction";

import {
  getAllPosts,
} from "@/src/config/redux/action/postAction";

import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

export default function ProfilePage() {

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const dispatch = useDispatch();

  const usernameRef = useRef(null);


  // =========================
  // Get User & Posts
  // =========================

  useEffect(() => {

    dispatch(
      getAboutUser({
        token: localStorage.getItem("token"),
      })
    );

    dispatch(getAllPosts());

  }, [dispatch]);


  // =========================
  // Set User Profile
  // =========================

  useEffect(() => {

    if (authState.user) {
      setUserProfile(authState.user);
    }

  }, [authState.user]);


  // =========================
  // Get User Posts
  // =========================

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


  // =========================
  // Work Input Change
  // =========================

  const handleWorkInputChange = (e) => {

    const { name, value } = e.target;

    setInputData({
      ...inputData,
      [name]: value,
    });

  };


  // =========================
  // Update Profile Picture
  // =========================

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
            "Content-Type":
              "multipart/form-data",
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

    }
  };


  // =========================
  // Update Profile
  // =========================

  const updateProfileData = async () => {

    try {

      await clientServer.post(
        "/user_update",
        {
          token: localStorage.getItem("token"),
          name: userProfile.userId.name,
        }
      );


      await clientServer.post(
        "/update_profile_data",
        {
          token: localStorage.getItem("token"),

          bio: userProfile.bio || "",

          currentPost:
            userProfile.currentPost || "",

          pastWork:
            userProfile.pastWork || [],

          education:
            userProfile.education || "",
        }
      );


      dispatch(
        getAboutUser({
          token: localStorage.getItem("token"),
        })
      );

      alert("Profile updated successfully!");

    } catch (error) {

      console.log(
        "Profile update error:",
        error
      );

    }
  };


  // =========================
  // Add Work
  // =========================

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


    setInputData({
      company: "",
      position: "",
      years: "",
    });

    setIsModalOpen(false);
  };


  // =========================
  // Remove Work
  // =========================

  const removeWork = (indexToRemove) => {

    const updatedWork =
      userProfile.pastWork.filter(
        (_, index) =>
          index !== indexToRemove
      );

    setUserProfile({
      ...userProfile,
      pastWork: updatedWork,
    });
  };


  // =========================
  // Download Resume
  // =========================

  const downloadResume = async () => {

    try {

      const response =
        await clientServer.get(
          `/user/download_resume?id=${userProfile.userId._id}`
        );

      window.open(
        `${BASE_URL}/${response.data.message}`,
        "_blank"
      );

    } catch (error) {

      console.log(
        "Resume download error:",
        error
      );

    }
  };


  return (

    <Userlayouts>

      <DashboardLayout>

        {authState.user &&
          userProfile?.userId && (

            <div className={styles.container}>


              {/* =================================
                  COVER SECTION
              ================================= */}

              <section
                className={styles.coverSection}
              >

                <img
                  className={styles.coverImage}
                  src={
                    userProfile.userId.coverPicture ||
                    "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1400&q=80"
                  }
                  alt="Profile cover"
                />


                {/* Cover Overlay */}

                <div
                  className={styles.coverOverlay}
                >
                  <span>
                    Profile
                  </span>
                </div>


                {/* Profile Picture */}

                <label
                  htmlFor="profilePictureUpload"
                  className={styles.profilePictureWrapper}
                >

                  <img
                    className={styles.profilePicture}
                    src={
                      userProfile.userId.profilePicture
                    }
                    alt="Profile"
                  />

                  <div
                    className={
                      styles.profilePictureOverlay
                    }
                  >
                    <span>
                      Edit Photo
                    </span>
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



              {/* =================================
                  PROFILE MAIN SECTION
              ================================= */}

              <section
                className={
                  styles.profileMainSection
                }
              >


                {/* =================================
                    PROFILE INFO
                ================================= */}

                <div
                  className={
                    styles.profileInfoCard
                  }
                >

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
                      ref={usernameRef}
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


                    {/* Resume */}

                    <button
                      className={
                        styles.resumeButton
                      }
                      onClick={downloadResume}
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


                  {/* =================================
                      BIO
                  ================================= */}

                  <div
                    className={styles.bioSection}
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
                      Tell people about your skills,
                      experience and interests.
                    </p>

                  </div>

                </div>



                {/* =================================
                    RECENT ACTIVITY
                ================================= */}

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

                    <h3>
                      Recent Activity
                    </h3>

                    <span>
                      {userPosts.length} Posts
                    </span>

                  </div>


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
                        ✨
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

                    <div
                      className={
                        styles.postsList
                      }
                    >

                      {userPosts.map(
                        (post) => (

                          <div
                            key={post._id}
                            className={
                              styles.postCard
                            }
                          >

                            {post.media !== "" &&
                              post.media && (

                                <img
                                  src={`${BASE_URL}/${post.media}`}
                                  alt="Post"
                                  className={
                                    styles.postImage
                                  }
                                />

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



              {/* =================================
                  WORK HISTORY
              ================================= */}

              <section
                className={
                  styles.workSection
                }
              >

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


                  <button
                    className={
                      styles.addWorkButton
                    }
                    onClick={() =>
                      setIsModalOpen(true)
                    }
                  >

                    <span>+</span>

                    Add Work

                  </button>

                </div>


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
                          key={index}
                          className={
                            styles.workHistoryCard
                          }
                        >

                          <div
                            className={
                              styles.workIcon
                            }
                          >
                            💼
                          </div>


                          <div
                            className={
                              styles.workDetails
                            }
                          >

                            <h4>
                              {work.position}
                            </h4>

                            <p
                              className={
                                styles.companyName
                              }
                            >
                              {work.company}
                            </p>

                            <span
                              className={
                                styles.workYears
                              }
                            >
                              {work.years}
                            </span>

                          </div>


                          <button
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

                  <div
                    className={
                      styles.emptyWork
                    }
                  >

                    <div>
                      💼
                    </div>

                    <h4>
                      No work experience added
                    </h4>

                    <p>
                      Add your professional
                      experience to make your
                      profile stronger.
                    </p>

                  </div>

                )}

              </section>



              {/* =================================
                  UPDATE PROFILE
              ================================= */}

              <div
                className={
                  styles.updateSection
                }
              >

                <button
                  onClick={updateProfileData}
                  className={
                    styles.updateProfileBtn
                  }
                >

                  Save & Update Profile

                </button>

              </div>

            </div>

          )}



        {/* =================================
            ADD WORK MODAL
        ================================= */}

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


              <div
                className={
                  styles.modalBody
                }
              >

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
                    placeholder="e.g. 2024 - Present"
                  />

                </div>


                <button
                  className={
                    styles.modalAddButton
                  }
                  onClick={addWork}
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