import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { register } from "./frontend_customer/src/actions/userActions";
import Message from "./frontend_customer/src/components/Message";
import axios from "axios";

function RegisterPage({ history, variant }) {
  const [userInfo, setUserInfo] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  // reducer
  const userRegisterReducer = useSelector((state) => state.userRegisterReducer);
  const { error } = userRegisterReducer;
  const handleChangeUserInfo = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleChangeUserProfile = (e) => {
    setUserProfile(e.target.files[0]);
  };
  const submitHandler = (e) => {
    console.log(userInfo);
    console.log(userProfile);
    const formData = new FormData();
    formData.append("name", userInfo.name);
    formData.append("phone", userInfo.phone);
    formData.append("email", userInfo.email);
    formData.append("password", userInfo.password);
    formData.append("profile", userProfile);
    axios
      .post(`http://localhost:7000/customer/Register`, formData)
      .then((response) => {
        console.log(response.data);
        if (response.data.success == true) {
          //   setInsertModal(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Sign Up</h1>
          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Username</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="enter your username"
                name="name"
                onChange={handleChangeUserInfo}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="enter your email"
                name="email"
                onChange={handleChangeUserInfo}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                name="password"
                type="password"
                placeholder="enter your password"
                onChange={handleChangeUserInfo}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="passwordConfirm">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                required
                name="phone"
                type="number"
                placeholder="Enter your contact number"
                onChange={handleChangeUserInfo}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="passwordConfirm">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                required
                name="profile"
                type="file"
                placeholder="Enter your contact number"
                onChange={handleChangeUserProfile}
              ></Form.Control>
            </Form.Group>

            <Button onClick={submitHandler} variant="primary">
              Sign Up
            </Button>
          </Form>

          <Row className="py-3">
            <Col>
              Already have an account?
              <Link to={`/login`}> Login</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default RegisterPage;
