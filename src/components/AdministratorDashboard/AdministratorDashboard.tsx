import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import {  faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  Redirect } from 'react-router-dom';
import api, { ApiResponse, getIdentity } from '../../api/api';
import { render } from 'react-dom';


interface AdministratorDashboardState{

    isAdministratorLoggedIn: boolean;

}


class  AdministratorDashboard extends React.Component {
  state: AdministratorDashboardState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
    };
  }

  componentWillMount(){
    this.getMyData();
  }


  componentWillUpdate(){
    this.getMyData();

  }

  private getMyData(){
    api('/api/administrator/' , 'get', {}, 'administrator')
    .then((res: ApiResponse) => {
        if (res.status === 'error' || res.status === 'login'){
            this.setLogginState(false);
            return;
          }

    });
  }


  private setLogginState(isLoggedIn: boolean){
      this.setState(Object.assign(this.state, {
        isAdministratorLoggedIn: isLoggedIn,
      }));
 
  }


  render(){

    if(this.state.isAdministratorLoggedIn === false){
      return (
        <Redirect to="/administrator/login" />
      );
    }

  
    return (
      <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faHome } /> TAdministrator Dashboard
                        </Card.Title>
                        ...
                    </Card.Body>
                </Card>
              
            </Container>
  );
}




}
export default AdministratorDashboard;
