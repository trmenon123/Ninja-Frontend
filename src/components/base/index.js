import React from "react";
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import { GateComponent, UserComponent} from '../lib';
import { HomeWidgetComponent , ComposeWidgetComponent} from '../widgets';

function Ninja(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GateComponent/> }/>
                <Route path="/user" element={<UserComponent/>}>
                    <Route path="home" element={<HomeWidgetComponent/>}/>
                    <Route path="compose" element={<ComposeWidgetComponent/>}/>
                </Route>
            </Routes>        
        </BrowserRouter>
    );
}


export default Ninja;