import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Alert, Button, Card, Col, Container, Form, FormControl } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import api, { saveRefreshToken, saveToken, ApiResponse, saveIdentity } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';




interface AdministratorLoginPageState {
    username: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;

}

export default class AdministratorLoginPage extends React.Component {
    state: AdministratorLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>){
        const newState = Object.assign(this.state, {
            [ event.target.id ]: event.target.value,
        });

        this.setState(newState);
    }

    private setErrorMessage(message: string){
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });
    }

    private setLogginState(isLoggedIn: boolean){
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });
    }

    private doLogin(){
        api('auth/administrator/login', 'post', {
            username: this.state.username,
            password: this.state.password,
        }
        )
        .then( (res: ApiResponse) => {
            if (res.status === 'error'){
                console.log(res.data);
                return;
            }
            
            if(res.status === 'ok'){
               if( res.data.statusCode !== undefined) {
                   let message = '';
                   switch (res.data.statusCode){
                       case -3001: message = 'Unknown username!'; break;
                       case -3002: message = 'Bad password'; break;

                   }

                   this.setErrorMessage(message);
                   return;

               }

               saveToken('administrator',res.data.token);
               saveRefreshToken('administrator',res.data.refreshToken);
               saveIdentity('administrator', res.data.identity);

               // Preusmeravanje korisnika.... /#/

               this.setLogginState(true);

            }
        });
    }
    render(){

        if(this.state.isLoggedIn === true){
            return (
                <Redirect to = "/administrator/dashboard" />
            ); 
        }

        return (
            <Container>
                        <RoledMainMenu role="visitor" />

                <Col md= { { span: 6, offset: 3 } }>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faSignInAlt } /> Administrator login
                        </Card.Title>
                        <Card.Text>
                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="username">Username: </Form.Label>
                                    <Form.Control type="username" id="username" 
                                                  value={ this.state.username }  
                                                  onChange= { event => this.formInputChanged(event as any)  }/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password: </Form.Label>
                                    <Form.Control type="password" id="password"
                                                  value={ this.state.password } 
                                                  onChange= { event => this.formInputChanged(event as any) }/>
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary"
                                            onClick={ () => this.doLogin() }>
                                        Log in
                                    </Button>
                                </Form.Group>
                            </Form>
                            <Alert variant="danger" 
                                    className={ this.state.errorMessage ? '' : 'd-none'}>
                                {  this.state.errorMessage }
                            </Alert>
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Container>
        );
    }
}