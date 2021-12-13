import React, { Component } from 'react'
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd'
import "./Profile.css"
import "./Profile"
import Profile from './Profile'


class ImageModal extends Component {
    constructor(props){
        super(props);
        this.state={
            visible: false,
            imgArray: [props.pic1, props.pic2, props.pic3]
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    
    
    
    render(){
        const imageMapper = this.state.imgArray.map((image,index) => {
            return(
                <img src={image}
                    onClick={() => this.props.handlerImageChange(image)}
                    height='48px'
                />
            )
        })

        return(
            <div className="ImageProfile">
                <div className="ButtonModal">
                    <Button ghost onClick={this.showModal} size='small'>
                        Change Pic
                    </Button>
                </div>
                <Modal
                    title="Profile Picture Changer"
                    visible={this.state.visible} 
                    onOk={this.handleOk} 
                    onCancel={this.handleCancel}
                >
                    {imageMapper}
                </Modal>{" "}
            </div>
        );
    }
}

export default ImageModal