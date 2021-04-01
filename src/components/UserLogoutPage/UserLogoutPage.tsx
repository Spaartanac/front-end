import React from 'react';
import { Redirect } from 'react-router';
import { removeTokenData } from '../../api/api';

interface UserLogoutPageState{
    done: boolean;
}


export class UserLogoutPage extends React.Component{
    state: UserLogoutPageState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            done: false,
        };
    }

    finished(){
        this.setState({
            done: true,
        });
    }

    render() {
        if(this.state.done){
            return <Redirect to="/user/login/" />
        }

        return(
            <p>Logging out...</p>
        );
    }

    componentDidMount(){
        this.doLogout();
    }

    componentDidUpdate(){
        this.doLogout();
    }

   doLogout(){
       removeTokenData("user");
       this.finished();
   }

}