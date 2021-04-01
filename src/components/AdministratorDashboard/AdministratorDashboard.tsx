import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import {  faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  Link, Redirect } from 'react-router-dom';
import api, { ApiResponse, getIdentity } from '../../api/api';
import { render } from 'react-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';


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
                <RoledMainMenu role="administrator" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faHome } /> Administrator Dashboard
                        </Card.Title>
                        <ul>
                          <li><Link to="/administrator/dashboard/category/">Categories</Link></li>
                          <li><Link to="/administrator/dashboard/feature/">Features</Link></li>
                          <li><Link to="/administrator/dashboard/article/">Articles</Link></li>
                          <li><Link to="/administrator/dashboard/orders/">Orders</Link></li>




                          
                        </ul>
                    </Card.Body>
                </Card>
              
            </Container>
  );
}




}
export default AdministratorDashboard;
