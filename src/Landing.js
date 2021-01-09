import React,{ Component } from "react";
import "./Style.css";
import {Switch, Route, Link, Redirect } from "react-router-dom"; 
import SmartDropDown from "./components/SmartDropDown";
import axios from "axios";
import * as constValues from "./components/ConstData";

class Landing extends Component{
    constructor(props){
        super(props);
        //Refs
        this.selectedCountry = React.createRef();

        //state
        this.state = {
            countryList : [],
            filteredList : []
        }
    }
    
    addAndSelectHandler = () =>{
        let newValue = this.userInputRef.current.value;
        axios.post("http://localhost:20400/add", {name : newValue}).
            then((res)=>{
                this.getCountryList();
            })
            .catch((err)=>{});
        }
        
    render(){
        let remainingOptions = 0;
        if(this.state.filteredList.length > 0){
            remainingOptions = ((this.state.countryList.length - this.state.filteredList.length) > constValues.OP_SIZE)?(constValues.OP_SIZE):(this.state.countryList.length - this.state.filteredList.length)
        }

        

        return(
            <div className="main">
                <div className="main-page">
                    <div className="left-panel">
                        <div className="route-options-wrapper">
                            <div className="route-option">
                                <p><Link to="/admin">admin</Link></p>
                            </div>
                            <div className="route-option">
                                <p><Link to="/user">user</Link></p>
                            </div>
                        </div>
                    </div>
                    <div className="content-panel">
                        <p className="selected-country-title"><span>Selected Country : </span><span ref={this.selectedCountry}></span></p>
                        <Switch>
                        <Route exact path="/" render={()=> {return <Redirect to="/admin" />}}></Route>

                        <Route exact path="/admin" render={()=>
                            <SmartDropDown
                            handleAddBtnForAdmin={this.handleAddBtnForAdmin} 
                            countrylist={this.state.filteredList} 
                            noOfItems= {remainingOptions}
                            privilege= {constValues.ROLE_ADMIN}
                            setSelectedValue={this.setSelectedCountry} 
                            fnFilteredValue ={this.fnFilteredValue}
                            resetCountryList = {this.resetCountryList}
                            loadMoreOptions = {this.loadMoreOptions}
                            />}>
                        </Route>
                        <Route exact path="/user" render={()=>{
                            return(
                                <SmartDropDown
                                handleAddBtnForAdmin={this.handleAddBtnForAdmin} 
                                countrylist={this.state.filteredList} 
                                noOfItems= {remainingOptions}
                                privilege= {constValues.ROLE_USER}
                                setSelectedValue={this.setSelectedCountry} 
                                fnFilteredValue ={this.fnFilteredValue}
                                resetCountryList = {this.resetCountryList}
                                loadMoreOptions = {this.loadMoreOptions}
                                />
                            )
                            }}>
                            </Route>
                        </Switch>
                    </div>        
                </div>
            </div>
        )
    }
                    
    componentDidMount(){
        this.getCountryList();
    }
    loadMoreOptions = (event) =>{
            let spliceCount = (
                (this.state.filteredList.length+constValues.OP_SIZE) < this.state.countryList.length)?
                (this.state.filteredList.length+constValues.OP_SIZE):
                (this.state.countryList.length);
                
            this.setState({
                filteredList : this.state.countryList.slice(0,spliceCount)
            })
    }
    setSelectedCountry = (value) =>{
        if(!value.includes("not found")){
            this.selectedCountry.current.textContent = value;
        }else{
            this.selectedCountry.current.textContent = "";
        }
    }
    getCountryList = () =>{
        axios.get("http://localhost:20400/listcountries").
    then((res)=>{
        this.setState({
            countryList :res.data.data
        });
          this.loadMoreOptions();
    }).catch((err)=>{
            console.log(err);
        });
    }

    handleAddBtnForAdmin = (newValue) =>{
        axios.post(
            "http://localhost:20400/add",
            {name : newValue}
            ,{ headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }}).
            then((res)=>{
                this.getCountryList()
            })
            .catch((err)=>{});
        }
        
        fnFilteredValue = (userInputValue) =>{
            let countryies= this.state.countryList.filter((country)=>{
                return country.name.toLowerCase().includes(userInputValue);
            });
            
            if(countryies.length == 0){
                let value = '"'+userInputValue+'"'+" not found";
                countryies.push({name:value});
            }
            
            this.setState({
                filteredList : countryies
            })       
        }

        resetCountryList = () =>{
            this.setState({
                filteredList : []
            },()=>{
                this.loadMoreOptions();
            })
        }
    }
    export default Landing;