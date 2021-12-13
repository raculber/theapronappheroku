import React, { Component } from "react";
import { connect } from "react-redux";
import { useState } from "react";
import "antd/dist/antd.css";
import { Avatar } from "antd";
import "./Profile.css";
import ImageModal from "./ImageModal.js";
import { addUser, updateUser } from "../../store/auth-slice";
import axios from "axios";
import SavedRecipes from "../SavedRecipes/savedRecipes";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Default image
      profileImage: this.props.image,
      userId: this.props.userId,
    };
  }

  //Array of URL images
  imgArray = [
    "https://images.onlinelabels.com/images/clip-art/GDJ/Female%20Avatar%203-277087.png",
    "https://cdn3.iconfinder.com/data/icons/professions-1-4/132/16-512.png",
    "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Chef-512.png",
  ];

  getUserName() {
    const email = this.props.email;
    const parseEmail = email.split("@");
    const userName = parseEmail[0];
    return userName;
  }

  handlerImageChange = (profileImage, userId) => {
    console.log("There");
    this.setState({
      profileImage,
    });
    const userInfo = {
      userId: userId,
    };
    axios
      .post(`${process.env.REACT_APP_API_SERVICE_URL}/api/sign-in=`, userInfo)
      .then((res) => {
        // res.data.message will contain necessary info about why
        // sign up/in failed
        console.log(res);
        if (res.data.message) {
          // Handler server error in this code block
          console.log("Error!!");
        } else if (res.data.token) {
          const { dispatch } = this.props;
          dispatch(
            addUser({
              userId: res.data.result.userId,
              email: res.data.result.enteredEmail,
              image: profileImage,
            })
          );
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div className="profile">
        <div className="FavLabel">
          <h1>My Favorite Recipes</h1>
        </div>
        <div className="userBox">
          <div className="AvatarImage">
            <Avatar size={140} src={this.state.profileImage} />
          </div>
          <ImageModal
            handlerImageChange={this.handlerImageChange}
            pic1={this.imgArray[0]}
            pic2={this.imgArray[1]}
            pic3={this.imgArray[2]}
          />
          <div className="welcomeUser">Welcome {this.getUserName()}!</div>
        </div>
        <div className="MyFav">
          <SavedRecipes></SavedRecipes>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state.user.email);
  return {
    email: state.user.email,
    image: state.user.image,
    userId: state.user.userId,
  };
}

//function mapDispatchToProps(dispatch){
//  return{
//    image: dispatch.user.image
//}
//}

export default connect(mapStateToProps, null)(Profile);
