import React, { Component } from 'react';
import axios from "axios";
class SmartDropDown extends Component {
    constructor(props){
        super(props);

        //REF's
        this.userInputRef = React.createRef();
        this.floatingDropDownPanel = React.createRef();
        this.dropDownIcon = React.createRef();
        this.dropDownPanelRef = React.createRef();
        
        //Binds
        this.ShowPopUp = this.ShowPopUp.bind(this);        
        this.handleSelectedOption = this.handleSelectedOption.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.postNewValueToParent = this.postNewValueToParent.bind(this);
    }
    
    ShowPopUp = (event) => {
        event.stopPropagation();
        this.floatingDropDownPanel.current.classList.add("show");
        this.dropDownIcon.current.classList.remove("close");
        this.dropDownIcon.current.classList.add("open");
        this.userInputRef.current.focus();
        this.userInputRef.current.value="";
        this.props.resetCountryList();
    }
    HidePopUp = () => {
        this.floatingDropDownPanel.current.classList.remove("show");
        this.dropDownIcon.current.classList.add("close");
        this.dropDownIcon.current.classList.remove("open");
    }
    handleSelectedOption = (event) => {
        event.stopPropagation();
        if(!event.target.textContent.includes("not found")){
            this.props.setSelectedValue(event.target.textContent);
        }else{
            this.props.setSelectedValue("")
        }
        this.HidePopUp();
    }
    postNewValueToParent = (event) => {
        event.stopPropagation();
        this.props.handleAddBtnForAdmin(this.userInputRef.current.value)
        this.props.setSelectedValue(this.userInputRef.current.value);
        this.userInputRef.current.value = "";
    }
    render() {
        var adminAddBtn = "";
        if(  this.props.privilege == 1 && this.props.countrylist.length == 1 && this.props.countrylist[0]["name"].includes("not found")){
           adminAddBtn =  <button onClick={(event)=>{event.stopPropagation(); this.postNewValueToParent(event)}}>Add & Select</button>;
        }

        return (
            <>
                <div ref={this.dropDownPanelRef} className="dd-main-panel">
                    <div className="dd-main-panel-content" onClick={(event)=>{this.ShowPopUp(event)}}>
                        <div className="dd-panel">
                            <div className="dd-panel-content">
                                <p className="dd-selected-content">Please select countries</p>
                            </div>
                            <div ref={this.dropDownIcon} className="drop-down-icon close" >&lt;</div>
                        </div>
                        <div className="dd-float-panel" ref={this.floatingDropDownPanel} >
                            <div className="dd-search-panel">
                                <input type="text" 
                                ref={this.userInputRef} 
                                onChange={(event)=>{this.props.fnFilteredValue(event.target.value)}}
                                ></input>
                            </div>
                            <div className="dd-float-option-panel">
                                {
                                    this.props.countrylist.map((item,index)=>
                                        <div key={index}
                                            onClick={(event)=>{event.stopPropagation(); this.handleSelectedOption(event)}} className="option">
                                            <p>{item.name}</p>
                                            {adminAddBtn}
                                        </div>
                                    )
                                }
                                <div className="option no-hover">
                                    <span></span>
                                    <span onClick={(event)=>{event.stopPropagation(); this.props.loadMoreOptions()}}> {this.props.noOfItems} more</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    componentDidMount(){
       document.addEventListener('mousedown', this.handleClickOutside);
    }
    handleClickOutside = (event) =>{
        if(this.dropDownPanelRef && this.dropDownPanelRef.current  &&  !this.dropDownPanelRef.current.contains(event.target)){
            this.HidePopUp();           
        }
    }
}
export default SmartDropDown;