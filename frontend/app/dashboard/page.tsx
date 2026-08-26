"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.css";

import {
  createPost,
  deletePost,
  getAllComments,
  incrementShare,
  getAllPosts,
  incrementPostLike,
  postComment,
} from "@/src/config/redux/action/postAction";

import {
  getAboutUser,
  getAllUsers,
} from "@/src/config/redux/action/authAction";

import {
  setTokenIsThere,
  setTokenIsNotThere,
} from "@/src/config/redux/reducer/authreducer";

import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";

import { resetPostId } from "@/src/config/redux/reducer/authreducer/postreducer";


/* =========================================================
   AVATAR WITH FALLBACK
========================================================= */

function AvatarWithFallback({
  src,
  name,
  size = "38px",
  className = "",
}: {
  src?: string | null;
  name?: string | null;
  size?: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgb(0,59,130), rgb(3,93,183))",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        {name?.charAt(0).toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={name || "Profile"}
      onError={() => setBroken(true)}
    />
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

export default function Dashboard() {
  const router = useRouter();

  const dispatch = useDispatch() as any;

  const authState = useSelector((state: any) => state.auth);

  const postState = useSelector((state: any) => state.posts);


  /* =========================================================
     TOKEN CHECK
  ========================================================= */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(setTokenIsThere());
    } else {
      dispatch(setTokenIsNotThere());
    }
  }, [dispatch]);


  /* =========================================================
     BODY SCROLL CONTROL FOR COMMENTS
  ========================================================= */

  useEffect(() => {
    if (postState.postId !== "") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [postState.postId]);


  /* =========================================================
     GET POSTS / USER / ALL USERS
  ========================================================= */

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());

      dispatch(
        getAboutUser({
          token: localStorage.getItem("token"),
        })
      );
    }

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [
    authState.isTokenThere,
    authState.all_profiles_fetched,
    dispatch,
  ]);


  /* =========================================================
     STATES
  ========================================================= */

  const [postContent, setPostContent] = useState("");

  const [fileContent, setFileContent] = useState<any>();

  const [commentText, setCommentText] = useState("");


  /* =========================================================
     CREATE POST
  ========================================================= */

  const handleUpload = async () => {
    await dispatch(
      createPost({
        file: fileContent,
        body: postContent,
      })
    );

    setPostContent("");

    setFileContent(null);

    dispatch(getAllPosts());
  };


  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (!authState.user) {
    return (
      <Userlayouts>
        <DashboardLayout>
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "#777",
            }}
          >
            Loading...
          </div>
        </DashboardLayout>
      </Userlayouts>
    );
  }


  /* =========================================================
     DASHBOARD UI
  ========================================================= */

  return (
    <Userlayouts>
      <DashboardLayout>

        <div className={styles.scrollComponent}>

          <div className={styles.wrapper}>


            {/* =================================================
                CREATE POST
            ================================================= */}

            <div
              className={`${styles.createPostContainer} ${
                postState.postId !== ""
                  ? styles.hiddenOnMobile
                  : ""
              }`}
            >

              <AvatarWithFallback
                className={styles.userProfile}
                src={
                  authState?.user?.userId?.profilePicture
                }
                name={
                  authState?.user?.userId?.name
                }
              />


              <textarea
                onChange={(e) =>
                  setPostContent(e.target.value)
                }
                value={postContent}
                placeholder="What's in your mind?"
                className={styles.textAreaOfContent}
              />


              <label htmlFor="fileUpload">

                <div className={styles.Fab}>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>

                </div>

              </label>


              <input
                onChange={(e) =>
                  setFileContent(
                    e.target.files?.[0]
                  )
                }
                type="file"
                hidden
                id="fileUpload"
              />


              {postContent.length > 0 && (

                <div
                  onClick={handleUpload}
                  className={styles.uploadButton}
                >
                  Post
                </div>

              )}

            </div>


            {/* =================================================
                POSTS CONTAINER
            ================================================= */}

            <div className={styles.postsContainer}>

              {[...(postState.posts || [])]

                /*
                 * IMPORTANT FIX:
                 * Agar kisi old/deleted user ka post hai
                 * aur post.userId null hai,
                 * to us post ko render nahi karenge.
                 */
                .filter((post) => post?.userId)

                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )

                .map((post) => {

                  return (

                    <div
                      key={post._id}
                      className={styles.singleCard}
                    >


                      {/* =================================================
                          POST PROFILE HEADER
                      ================================================= */}

                      <div
                        className={
                          styles.singleCard_profileContainer
                        }
                      >


                        <AvatarWithFallback
                          className={styles.userProfile}
                          src={
                            post?.userId?.profilePicture
                          }
                          name={
                            post?.userId?.name
                          }
                        />


                        <div
                          style={{
                            flex: 1,
                          }}
                        >


                          <div
                            style={{
                              display: "flex",
                              gap: "1.2rem",
                              justifyContent:
                                "space-between",
                            }}
                          >


                            <p
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              {post?.userId?.name ||
                                "Unknown User"}
                            </p>


                            {/* DELETE POST */}

                            {post?.userId?._id ===
                              authState?.user?.userId?._id && (

                              <div
                                onClick={async () => {

                                  await dispatch(
                                    deletePost({
                                      post_id:
                                        post._id,
                                    })
                                  );

                                  await dispatch(
                                    getAllPosts()
                                  );

                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              >

                                <svg
                                  style={{
                                    height: "1.4em",
                                    color: "red",
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                >

                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />

                                </svg>

                              </div>

                            )}

                          </div>


                          <p
                            style={{
                              color: "gray",
                            }}
                          >
                            @
                            {post?.userId?.username ||
                              "user"}
                          </p>


                          <p
                            style={{
                              paddingTop: "1.3rem",
                            }}
                          >
                            {post?.body}
                          </p>


                          {/* POST IMAGE */}

                          <div
                            className={
                              styles.singleCard_image
                            }
                          >

                            {post?.media &&
                            post.media !== "" ? (

                              <img
                                src={post.media}
                                alt="Post"
                              />

                            ) : null}

                          </div>


                          {/* =================================================
                              POST OPTIONS
                          ================================================= */}

                          <div
                            className={
                              styles.optionsContainer
                            }
                          >


                            {/* LIKE */}

                            <div
                              onClick={async () => {

                                await dispatch(
                                  incrementPostLike({
                                    post_id:
                                      post._id,
                                  })
                                );

                                dispatch(
                                  getAllPosts()
                                );

                              }}
                              className={
                                styles.singleOption_optionsContainer
                              }
                            >

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={
                                  post.likedBy?.includes(
                                    authState?.user?.userId?._id
                                  )
                                    ? "rgb(0,102,255)"
                                    : "none"
                                }
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke={
                                  post.likedBy?.includes(
                                    authState?.user?.userId?._id
                                  )
                                    ? "rgb(0,102,255)"
                                    : "currentColor"
                                }
                              >

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                />

                              </svg>


                              <p>
                                {post?.likes || 0}
                              </p>

                            </div>


                            {/* COMMENTS */}

                            <div
                              onClick={() => {

                                dispatch(
                                  getAllComments({
                                    post_id:
                                      post._id,
                                  })
                                );

                              }}
                              className={
                                styles.singleOption_optionsContainer
                              }
                            >

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                              >

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 1 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                />

                              </svg>


                              <p>
                                {post?.commentsCount ||
                                  0}
                              </p>

                            </div>


                            {/* SHARE */}

                            <div
                              onClick={async () => {

                                if (
                                  navigator.share
                                ) {

                                  try {

                                    await navigator.share(
                                      {
                                        title: `${
                                          post?.userId
                                            ?.name ||
                                          "User"
                                        } on Pro Connect`,

                                        text:
                                          post?.body ||
                                          "",

                                        url: `${window.location.origin}/view_profile/${
                                          post?.userId
                                            ?.username ||
                                          ""
                                        }`,
                                      }
                                    );

                                  } catch (err) {

                                    console.log(
                                      "Share cancelled or failed",
                                      err
                                    );

                                  }

                                } else {

                                  const text =
                                    encodeURIComponent(
                                      post?.body ||
                                        ""
                                    );

                                  const url =
                                    encodeURIComponent(
                                      "apnacollege.in"
                                    );

                                  const twitterURL =
                                    `http://twitter.com/intent/tweet?text=${text}&url=${url}`;

                                  window.open(
                                    twitterURL,
                                    "_blank"
                                  );

                                }


                                await dispatch(
                                  incrementShare({
                                    post_id:
                                      post._id,
                                  })
                                );

                                dispatch(
                                  getAllPosts()
                                );

                              }}
                              className={
                                styles.singleOption_optionsContainer
                              }
                            >

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                              >

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                />

                              </svg>


                              <p>
                                {post?.shareCount ||
                                  0}
                              </p>

                            </div>


                          </div>

                        </div>

                      </div>

                    </div>

                  );

                })}

            </div>

          </div>

        </div>


        {/* =================================================
            COMMENTS MODAL
        ================================================= */}

        {postState.postId !== "" && (

          <div>

            <div
              onClick={() =>
                dispatch(resetPostId())
              }
              className={styles.commentContainer}
            >

              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
                className={
                  styles.allCommenContainer
                }
              >


                {/* COMMENT HEADER */}

                <div
                  className={styles.commentHeader}
                >

                  <h3>Comments</h3>


                  <svg
                    onClick={() =>
                      dispatch(resetPostId())
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={styles.closeIcon}
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />

                  </svg>

                </div>


                {/* COMMENTS LIST */}

                <div
                  className={
                    styles.commentsListContainer
                  }
                >

                  {(!postState.comments ||
                    postState.comments.length === 0) && (

                    <h2>No Comments</h2>

                  )}


                  {postState.comments &&
                    postState.comments.length !== 0 && (

                      <div>

                        {postState.comments

                          /*
                           * Same null safety for comments.
                           * Agar comment.userId null hai,
                           * comment dashboard ko crash nahi karega.
                           */

                          .filter(
                            (comment) =>
                              comment?.userId
                          )

                          .map(
                            (
                              comment,
                              index
                            ) => {

                              return (

                                <div
                                  className={
                                    styles.singleComment
                                  }
                                  key={
                                    comment?._id ||
                                    index
                                  }
                                >

                                  <div
                                    className={
                                      styles.singleComment_profileContainer
                                    }
                                  >

                                    <AvatarWithFallback
                                      src={
                                        comment
                                          ?.userId
                                          ?.profilePicture
                                      }
                                      name={
                                        comment
                                          ?.userId
                                          ?.name
                                      }
                                    />


                                    <div>

                                      <p
                                        style={{
                                          fontWeight:
                                            "bold",
                                          fontSize:
                                            "1.2rem",
                                        }}
                                      >
                                        {comment
                                          ?.userId
                                          ?.name ||
                                          "Unknown User"}
                                      </p>


                                      <p>
                                        @
                                        {comment
                                          ?.userId
                                          ?.username ||
                                          "user"}
                                      </p>

                                    </div>

                                  </div>


                                  <p>
                                    {comment?.body}
                                  </p>

                                </div>

                              );

                            }
                          )}

                      </div>

                    )}

                </div>


                {/* COMMENT INPUT */}

                <div
                  className={
                    styles.postCommentContainer
                  }
                >

                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) =>
                      setCommentText(
                        e.target.value
                      )
                    }
                    placeholder="Comment"
                  />


                  <div
                    onClick={async () => {

                      if (
                        !commentText.trim()
                      ) {
                        return;
                      }

                      await dispatch(
                        postComment({
                          post_id:
                            postState.postId,

                          body:
                            commentText,
                        })
                      );


                      await dispatch(
                        getAllComments({
                          post_id:
                            postState.postId,
                        })
                      );


                      setCommentText("");

                    }}
                    className={
                      styles.postCommentContainer_commentBtn
                    }
                  >

                    <p>Comment</p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </DashboardLayout>
    </Userlayouts>
  );
}