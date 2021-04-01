import React from 'react';
import { Alert, Button, Card, Col, Container, Form, Modal, Nav, Row, Table } from 'react-bootstrap';
import {  faBackward, faEdit, faHome, faImages, faListAlt, faListUl, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  Link, Redirect } from 'react-router-dom';
import api, { apiFile, ApiResponse, getIdentity } from '../../api/api';
import { render } from 'react-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import FeatureType from '../../types/FeatureType';
import ApiFeatureDto from '../../dtos/ApiFeatureDto';
import PhotoType from '../../types/PhotoType';
import { ApiConfig } from '../../config/api.config';

interface AdministratorDashboardPhotoProperties {

  match: {
      params: {
          aId: number;
      }
  }


}



interface AdministratorDashboardPhotoState{

    isAdministratorLoggedIn: boolean;
    photos: PhotoType[];



}


class  AdministratorDashboardPhoto extends React.Component<AdministratorDashboardPhotoProperties> {
  state: AdministratorDashboardPhotoState;

  constructor(props: Readonly<AdministratorDashboardPhotoProperties>){
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
      photos: [],
    };
  }

  componentDidMount(){
    this.getPhotos();
  }

  componentDidUpdate(oldProps: any){
  if(this.props.match.params.aId === oldProps.match.params.aId){
    return;
  }
 this.getPhotos();
  }



  private getPhotos(){
    api('/api/article/?filter=categoryId||$eq||' + this.props.match.params.aId +'/?join=photos'  , 'get', {}, 'administrator')
    .then((res: ApiResponse) => {
        if (res.status === 'error' || res.status === 'login'){
            this.setLogginState(false);
            return;
          }
          this.putPhotosInState(res.data.photos);

    });
  }


  private setLogginState(isLoggedIn: boolean){
      this.setState(Object.assign(this.state, {
        isAdministratorLoggedIn: isLoggedIn,
      }));
 
  }

  private putPhotosInState(data: PhotoType[]){

    this.setState(Object.assign(this.state, {
      photos: data,
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
                        <FontAwesomeIcon icon={ faImages } /> Photos
                        </Card.Title>

                        <Nav className="mb-3">
                          <Nav.Item>
                            <Link to="/administrator/dashboard/article" className="btn btn-sm btn-info">
                              <FontAwesomeIcon icon={faBackward} />
                            </Link>
                          </Nav.Item>
                        </Nav>
                      <Row>
                        {this.state.photos.map(this.printSinglePhoto, this)}
                        
                      </Row>
                      <Form className="mt-5">
                        <p><strong>Add a new photo to this article </strong></p>
                        <Form.Group>
                          <Form.Label htmlFor="add-photo">New article photo</Form.Label>
                          <Form.File id="add-photo" />
                        </Form.Group>
                        <Form.Group>
                          <Button variant="primary"
                          onClick={() => this.doUpload()}>
                            <FontAwesomeIcon icon={faPlus} /> Upload photo
                          </Button>
                        </Form.Group>
                      </Form>
                    </Card.Body>
                </Card>

            </Container>
  );
}

private printSinglePhoto(photo: PhotoType){
  return(
    <Col xs="12" sm="6" md="4" lg="3">
      <Card>
        <Card.Body>
          <img alt={photo.photoId + "Photo"}
          src = {ApiConfig.PHOTO_PATH + 'thumb/' + photo.imagePath}
          className = "w-100"/>
        </Card.Body>
        <Card.Footer>
          {this.state.photos.length > 1 ? (
            <Button variant="danger" block
            onClick={() => this.deletePhoto(photo.photoId)}>
              <FontAwesomeIcon icon={faMinus} />
            </Button>
          ): ''}
        </Card.Footer>
      </Card>
    </Col>
  )
}

private async doUpload(){
  const filePicker: any = document.getElementById('add-photo');
  if(filePicker?.files.length === 0){
    return;
  }
  const file = filePicker.files[0];
  await this.uploadArticlePhoto(this.props.match.params.aId, file);
  filePicker.value = '';

  this.getPhotos();
}



private async uploadArticlePhoto(articleId: number, file: File ){
  return await apiFile('/api/article/' + articleId  + '/uploadPhoto/', file, 'administrator');

}

private deletePhoto(photoId: number){

if(!window.confirm('Are you sure?')){
  return;
}

  api('/api/article/' + this.props.match.params.aId + '/deletePhoto/' +photoId + '/', 'delete', {}, 'administrator')
  .then((res: ApiResponse) => {
    if(res.status === "error" || res.status === "login"){
      this.setLogginState(false);
      return;
    }
    this.getPhotos();
  })

}


}
export default AdministratorDashboardPhoto;
