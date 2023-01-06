import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Figure,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner, Post } from "components";
import { useProvideAuth } from "hooks/useAuth";
import { useRequireAuth } from "hooks/useRequireAuth";
import axios from "utils/axiosConfig.js";
import { avatars } from "./RegisterPage";
import { toast } from "react-toastify";
import Avartars from "components/Avartars";

const UserDetailPage = () => {
  const { state } = useProvideAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null)

  const [data, setData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
    isSubmitting: false,
    errorMessage: null,
  });

  let navigate = useNavigate();
  let params = useParams();

  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await axios.get(`users/${params.uid}`);
        setLoading(false);
        setUser(userResponse.data);
      } catch (error) {
        toast.error(error.response.data.message)
      }
    };

    isAuthenticated && getUser();

  }, [params.uid, isAuthenticated]);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    // handle invalid or empty form

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    if (data.confirmPassword !== data.password) {
      toast.error("Your password does not match")
      return
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    try {
      // write code to call edit user endpoint 'users/:id'
      setLoading(true);

      const updatePassword = await axios.put(`/auth/users/${params.uid}`, data);

      setLoading(false);
      setUser(updatePassword.data);
      toast.success("New password Created")

      const {
        user: { uid, username },
      } = state;

      setValidated(false);
      // don't forget to update loading state and alert success
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: null,
      });

    } catch (error) {
      toast.error(error.response.data.message)

      setLoading(false);

      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.response.data.message,
      });

    }
  };

  const updateProfileImg = async () => {
    if (profileImage === null) {
      toast("Please select an avatar")
      return;
    }

    if (profileImage === user?.profile_image) {
      toast("Please select a new avatar")
      return;
    }

    try {
      setLoading(true);
      const updateProfileImg = await axios.put(`auth/users/avatar/${params.uid}`, { profileImage });

      setLoading(false);
      setUser(updateProfileImg.data);
    } catch (error) {

      setLoading(false);
      toast.error(error.response.data.message)
    }
  }

  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  if (loading) {
    return <LoadingSpinner full />;
  }

  const handleSelect = (index) => {
    if (avatars.indexOf(avatars[index]) === index) {
      setProfileImage(avatars[index])
    }
  }

  return (
    <>
      <Container className="clearfix">
        <Button
          variant="outline-info"
          onClick={() => {
            navigate(-1);
          }}
          style={{ border: "none", color: "#E5E1DF" }}
          className="mt-3 mb-3"
        >
          Go Back
        </Button>
        <Card bg="header" className="text-center">
          <Card.Body>
            <Figure
              className="bg-border-color rounded-circle overflow-hidden my-auto ml-2 p-1"
              style={{
                height: "50px",
                width: "50px",
                backgroundColor: "white",
              }}
            >
              {
                user?.profile_image.split("/").includes("static") ? (
                  <Figure.Image src={user?.profile_image} className="w-100 h-100" />
                ) : (
                  <Figure.Image src={`../uploads/${user?.profile_image}`} className="w-100 h-100" />
                )
              }
            </Figure>

            <Card.Title>{user?.username}</Card.Title>
            <Card.Title>{user?.email}</Card.Title>

            <div className='avatars'>
              <Avartars profileImage={profileImage} handleSelect={handleSelect} />
              <p onClick={updateProfileImg}>update Avatar</p>
            </div>

            {state.user?.username === user?.username && (
              <div
                onClick={() => setOpen(!open)}
                style={{ cursor: "pointer", color: "#BFBFBF" }}
              >
                Edit Password
              </div>
            )}

            {open && (
              <Container animation="false">
                <div className="row justify-content-center p-4">
                  <div className="col text-center">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleUpdatePassword}
                    >

                      <Form.Group>
                        <Form.Label htmlFor="currentPassword">Current Password</Form.Label>
                        <Form.Control
                          type="currentPassword"
                          name="currentPassword"
                          required
                          value={data.currentPassword}
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          New Password is required
                        </Form.Control.Feedback>
                        <Form.Text id="passwordHelpBlock" muted>
                          Must be 8-20 characters long.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group>
                        <Form.Label htmlFor="password">New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          required
                          value={data.password}
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          New Password is required
                        </Form.Control.Feedback>
                        <Form.Text id="passwordHelpBlock" muted>
                          Must be 8-20 characters long.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group>
                        <Form.Label htmlFor="confirmPassword">confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          required
                          value={data.confirmPassword}
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          confirm Password is required
                        </Form.Control.Feedback>
                        <Form.Text id="passwordHelpBlock" muted>
                          Must be 8-20 characters long.
                        </Form.Text>
                      </Form.Group>

                      {data.errorMessage && (
                        <span className="form-error">{data.errorMessage}</span>
                      )}
                      <Button type="submit" disabled={data.isSubmitting}>
                        {data.isSubmitting ? <LoadingSpinner /> : "Update"}
                      </Button>
                    </Form>
                  </div>
                </div>
              </Container>
            )}

          </Card.Body>
        </Card>
      </Container>
      <Container className="pt-3 pb-3">
        {user?.posts?.length !== 0 ? (
          user?.posts?.map((post) => (
            <Post key={post._id} post={post} userDetail />
          ))
        ) : (
          <div
            style={{
              marginTop: "75px",
              textAlign: "center",
            }}
          >
            No User Posts
          </div>
        )}
      </Container>
    </>
  );
};

export default UserDetailPage;
