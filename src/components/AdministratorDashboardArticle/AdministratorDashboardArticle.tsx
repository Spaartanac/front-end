import React from 'react';
import { Alert, Button, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import {  faEdit, faHome, faListAlt, faListUl, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  Link, Redirect } from 'react-router-dom';
import api, { apiFile, ApiResponse, getIdentity } from '../../api/api';
import { render } from 'react-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ArticleType from '../../types/ArticleType';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import { features } from 'process';


interface AdministratorDashboardArticleState{

    isAdministratorLoggedIn: boolean;
    articles: ArticleType[];
    categories: CategoryType[];
    status: string[];

    addModal: {
      visible: boolean;
      message: string;

      name: string;
      categoryId: number;
      excerpt: string;
      description: string;
      status: string;
      isPromoted: number;
      price: number
      features: {
        use: number;
        featureId: number;
        name: string;
        value: string;
      }[];
    };
    editModal: {
      articleId?: number;
      visible: boolean;
      message: string;
      name: string;
      categoryId: number;
      excerpt: string;
      description: string;
      status: string;
      isPromoted: number;
      price: number
      features: {
        use: number;
        featureId: number;
        name: string;
        value: string;
      }[];

};

}

interface FeatureBaseType{
  featureId: number;
  name: string;
}

class  AdministratorDashboardArticle extends React.Component {
  state: AdministratorDashboardArticleState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
      articles: [],
      categories: [],
      status: [
          "available",
          "visible",
          "hidden",
      ],
      addModal: {
        visible: false,
        name: '',
        message: '',
        categoryId: 1,
        excerpt: '',
        description: '',
        status: 'available',
        isPromoted: 0,
        price: 0.01,
        features: [],
      }, 
      editModal: {
        visible: false,
        name: '',
        message: '',
        categoryId: 1,
        excerpt: '',
        description: '',
        status: 'available',
        isPromoted: 0,
        price: 0.01,
        features: [],
      }, 
    };
  }

 

  componentDidMount(){
    this.getArticles();
  }

  private async  getFeaturesByCategoryId(categoryId: number): Promise<FeatureBaseType[]>{
    return new Promise(resolve => {
      api('/api/feature/?filter=categoryId||$eq||' + categoryId + '/', 'get', {}, 'administrator')
      .then((res: ApiResponse) => {
        if (res.status === 'error' || res.status === 'login'){
            this.setLogginState(false);
            return resolve([]);
        }

        const features: FeatureBaseType[] = res.data.map((item: any) => ({
          featureId: item.featureId,
          name: item.name,
        }));

        resolve(features);
    })
    
        });
  }


  private getCategories(){
    api('/api/category/' , 'get', {}, 'administrator')
    .then((res: ApiResponse) => {
        if (res.status === 'error' || res.status === 'login'){
            this.setLogginState(false);
            return;
          }

    });
  }

  private putCategoriesInState(data: ApiCategoryDto[]){
    const categories = data.map(category => {
      return {
        categoryId: category.categoryId,
        name: category.name,
        parentCategoryId: category.parentCategoryId,
        imagePath: category.imagePath,

      };

    });

    const newState = Object.assign(this.state, {
      categories: categories,
    });

    this.setState(newState);

  }

  private setAddModalFeatureUse(featureId: number, use: boolean){
    const addFeatures: {featureId:number, use: number} [] = [...this.state.addModal.features];
    for(const feature of addFeatures){
      if(feature.featureId === featureId){
        feature.use = use ? 1 : 0;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        features: addFeatures,
      }),
      ));

  }

  private setAddModalFeatureValue(featureId: number, value: string){
    const addFeatures: {featureId:number, value: string} [] = [...this.state.addModal.features];
    for(const feature of addFeatures){
      if(feature.featureId === featureId){
        feature.value = value;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        features: addFeatures,
      }),
      ));
  }

  private setEditModalFeatureUse(featureId: number, use: boolean){
    const editFeatures: {featureId:number, use: number} [] = [...this.state.editModal.features];
    for(const feature of editFeatures){
      if(feature.featureId === featureId){
        feature.use = use ? 1 : 0;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
        features: editFeatures,
      }),
      ));

  }

  private setEditModalFeatureValue(featureId: number, value: string){
    const editFeatures: {featureId:number, value: string} [] = [...this.state.editModal.features];
    for(const feature of editFeatures){
      if(feature.featureId === featureId){
        feature.value = value;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
        features: editFeatures,
      }),
      ));
  }

  private setAddModalVisibleState(newState: boolean){
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
          visible: newState,
      }) 
    ));
  }

  private setAddModalStringFieldState(fieldName: string, newValue: string){
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
          [fieldName]: newValue,
      }) 
    ));
  }

  private setAddModalNumberFieldState(fieldName: string, newValue: any){
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
          [fieldName]: (newValue==='null') ? null : Number(newValue),
      }) 
    ));
  }

  private setEditModalVisibleState(newState: boolean){
    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
          visible: newState,
      }) 
    ));
  }

  private setEditModalStringFieldState(fieldName: string, newValue: string){
    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
          [fieldName]: newValue,
      }) 
    ));
  }

  private setEditModalNumberFieldState(fieldName: string, newValue: any){
    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
          [fieldName]: (newValue==='null') ? null : Number(newValue),
      }) 
    ));
  }
  

  private getArticles(){
    api('/api/article/?join=articleFeatures&join=features&join=articlePrices&join=photos&join=category' , 'get', {}, 'administrator')
    .then((res: ApiResponse) => {
        if (res.status === 'error' || res.status === 'login'){
            this.setLogginState(false);
            return;
          }
          this.putArticlesInState(res.data);
    });
  }


  private setLogginState(isLoggedIn: boolean){
      this.setState(Object.assign(this.state, {
        isAdministratorLoggedIn: isLoggedIn,
      }));
 
  }

  private putArticlesInState(data: ApiArticleDto[]){
    const articles = data.map(article => {
      return {
        articleId: article.articleId,
        name: article.name,
        excerpt: article.excerpt,
        description: article.description,
        imageUrl: article.photos[0].imagePath,
        price: article.articlePrices[article.articlePrices.length-1].price,
        status: article.status,
        isPromoted: article.isPromoted,
        articleFeatures: article.articleFeatures,
        features: article.features,
        articlePrices: article.articlePrices,
        photos: article.photos,
        category: article.category,
        categoryId: article.categoryId,

      };

    });

    this.setState(Object.assign(this.state, {
      articles: articles,
    }));

  }

  
private async addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>){
  this.setAddModalNumberFieldState('categoryId', event.target.value);

  const features = await this.getFeaturesByCategoryId(this.state.addModal.categoryId);
  const stateFeatures = features.map(feature => ({
    featureId: feature.featureId,
    name: feature.name,
    value: '',
    use: 0,

  }));

  this.setState(Object.assign(this.state,
    Object.assign(this.state.addModal, {
      features: stateFeatures,
    }),
    ));
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
                        <FontAwesomeIcon icon={ faListAlt } /> Articles
                        </Card.Title>
                        
                        <Table hover size="sm" bordered>
                          <thead>
                            <tr>
                              <th colSpan={6}></th>
                              <th className="text-center">
                                <Button variant="primary" size="sm"
                                  onClick={() => this.showAddModal()}>
                                  <FontAwesomeIcon icon={faPlus}/> Add
                                </Button>
                              </th>

                            </tr>
                            <tr>
                              <th className="text-right">ID</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Status</th>
                              <th>Promoted</th>
                              <th className="text-right">Price</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            { this.state.articles.map(article =>(
                              <tr>
                                <td className="text-right">{article.articleId}</td>
                                <td> {article.name} </td>
                                <td> {article.category?.name} </td>
                                <td> {article.status} </td>
                                <td> {article.isPromoted ? 'Yes' : 'No'} </td>
                                <td className="text-right"> {article.price} </td>
                                <td className="text-center"> 
                                <Link to={'/administrator/dashboard/photo' + article.articleId }
                                  className = "btn btn-sm btn-info mr-3">
                                </Link>

                                <Button variant="info" size="sm"
                                onClick={() => this.showEditModal(article)}>
                                  <FontAwesomeIcon icon={faEdit}/> Edit
                                </Button>
                                </td>


                              </tr>
                            ), this)}
                          </tbody>
                        </Table>
                    </Card.Body>
                </Card>
              
                <Modal size="lg" centered show={this.state.addModal.visible} 
                onHide={ () => this.setAddModalVisibleState(false) }
                onEntered= { () => { 
                  if(document.getElementById('add-photo'))
                {
                  const filePicker: any = document.getElementById('add-photo');
                    filePicker.value = '';
                } } } >
            <Modal.Header closeButton >
                <Modal.Title>
                              Add new article
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>  
            <Form.Group>
                <Form.Label htmlFor="add-categoryId">Category</Form.Label>
                <Form.Control id="add-categoryId" as="select" value={this.state.addModal.categoryId.toString()}
                  onChange= { (e) => this.addModalCategoryChanged(e as any)} >
                    {this.state.categories.map(category => (
                      <option value={category.categoryId?.toString()}>
                        {category.name}
                      </option>
                    )) }
                    </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="add-name">Name</Form.Label>
                <Form.Control id="add-name" type="text" value={this.state.addModal.name}
                  onChange= { (e) => this.setAddModalStringFieldState('name', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="add-excerpt">Short text</Form.Label>
                <Form.Control id="add-excerpt" type="text" value={this.state.addModal.excerpt}
                  onChange= { (e) => this.setAddModalStringFieldState('excerpt', e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="add-description">Detailed text</Form.Label>
                <Form.Control id="add-description" as="textarea" type="text" value={this.state.addModal.description}
                  onChange= { (e) => this.setAddModalStringFieldState('description', e.target.value)} 
                  rows= {10}/>
              </Form.Group>

                <Form.Group>
                <Form.Label htmlFor="add-price">Price</Form.Label>
                <Form.Control id="add-price" type="text" min={0.01} value={this.state.addModal.price} step={0.01}
                  onChange= { (e) => this.setAddModalNumberFieldState('price', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Button variant="primary" onClick= {() => this.doAddArticle()}>
                      <FontAwesomeIcon icon={faPlus}/> Add new article
                </Button>
              </Form.Group>
              { this.state.addModal.message ? (
                <Alert variant="danger" value={this.state.addModal.message} />
              ) : ''}
            </Modal.Body>
              </Modal>





              <Modal size="lg" centered show={this.state.editModal.visible} 
                onHide={ () => this.setEditModalVisibleState(false) }>
            <Modal.Header closeButton >
                <Modal.Title>
                              Edit  article
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>  
              <Form.Group>
                <Form.Label htmlFor="edit-name">Name</Form.Label>
                <Form.Control id="edit-name" type="text" value={this.state.editModal.name}
                  onChange= { (e) => this.setEditModalStringFieldState('name', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="edit-excerpt">Short text</Form.Label>
                <Form.Control id="edit-excerpt" type="text" value={this.state.editModal.excerpt}
                  onChange= { (e) => this.setEditModalStringFieldState('excerpt', e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="edit-description">Detailed text</Form.Label>
                <Form.Control id="edit-description" as="textarea" type="text" value={this.state.editModal.description}
                  onChange= { (e) => this.setEditModalStringFieldState('description', e.target.value)} 
                  rows= {10}/>
              </Form.Group>
              
               <Form.Group>
                <Form.Label htmlFor="edit-status">Status</Form.Label>
                <Form.Control id="edit-status" as="select" value={this.state.editModal.status.toString()}
                  onChange= { (e) => this.setEditModalStringFieldState('status', e.target.value)} >
                   <option value="available">Available</option>
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                    </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="edit-isPromoted">Promoted</Form.Label>
                <Form.Control id="edit-isPromoted" as="select" value={this.state.editModal.isPromoted.toString()}
                  onChange= { (e) => this.setEditModalNumberFieldState('isPromoted', e.target.value)} >
                  <option value="0">Not promoted</option>
                  <option value="1">Is promoted</option>
                    </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="edit-price">Price</Form.Label>
                <Form.Control id="edit-price" type="text" min={0.01} value={this.state.editModal.price} step={0.01}
                  onChange= { (e) => this.setEditModalNumberFieldState('price', e.target.value)} />
              </Form.Group>

                      <div>
                        { this.state.editModal.features.map(this.printEditModalFeatureInput, this) }
                      </div>
  

              <Form.Group>
                <Button variant="primary" onClick= {() => this.doEditArticle()}>
                      <FontAwesomeIcon icon={faSave}/> Edit new article
                </Button>
              </Form.Group>
              { this.state.editModal.message ? (
                <Alert variant="danger" value={this.state.editModal.message} />
              ) : ''}
            </Modal.Body>
              </Modal>


            </Container>
  );
}

private printAddModalFeatureInput(feature: any){
  return (
    <Form.Group>
      <Row>
        <Col xs="4" sm="1" className="text-center">
          <input type="checkbox" value="1" checked={feature.use === 1} 
            onChange={ (e) => this.setAddModalFeatureUse(feature.featureId, e.target.checked)}        />
        </Col>
        <Col xs="8" sm="3">
          
        {feature.name}
        </Col> 
        <Col xs="12" sm="8">
        <Form.Control type="text" value={ feature.value} 
        onChange={ (e) => this.setAddModalFeatureValue(feature.featureId, e.target.value)} />
        </Col> 
      </Row>
    </Form.Group>
  );
}

private printEditModalFeatureInput(feature: any){
  return (
    <Form.Group>
      <Row>
        <Col xs="4" sm="1" className="text-center">
          <input type="checkbox" value="1" checked={feature.use === 1} 
            onChange={ (e) => this.setEditModalFeatureUse(feature.featureId, e.target.checked)}        />
        </Col>
        <Col xs="8" sm="3">
          
        {feature.name}
        </Col> 
        <Col xs="12" sm="8">
        <Form.Control type="text" value={ feature.value} 
        onChange={ (e) => this.setEditModalFeatureValue(feature.featureId, e.target.value)} />
        </Col> 
      </Row>
    </Form.Group>
  );
}

private doAddArticle(){
  const filePicker: any = document.getElementById('add-photo');
  if(filePicker?.files.length === 0){
    this.setAddModalStringFieldState('message', 'You must select a file to upload!');
    return;
  }
  api('/api/article/', 'post', {
    categoryId: this.state.addModal.categoryId,
    name: this.state.addModal.name,
    excerpt: this.state.addModal.excerpt,
    description: this.state.addModal.description,
    price: this.state.addModal.price,
    features: this.state.addModal.features
    .filter(feature => feature.use === 1)
    .map(feature => ({
      featureId: feature.featureId,
      value: feature.value,
    })),


  }, 'administrator')
  .then(async(res: ApiResponse) => {
    if  (res.status === 'login'){
        this.setLogginState(false);
        return;
      }

      if(res.status === "error"){
        this.setAddModalStringFieldState('message', res.data);
        return;
      }

      const articleId: number = res.data.articleId;
    
      const file = filePicker.files[0];
     await this.uploadArticlePhoto(articleId, file)


      this.setAddModalVisibleState(false);
      this.getArticles();

  });
}

private async uploadArticlePhoto(articleId: number, file: File ){
  return await apiFile('/api/article/' + articleId  + '/uploadPhoto/', file, 'administrator');

}

private doEditArticle(){
api('/api/article/' + this.state.editModal.articleId, 'patch', {
  name: this.state.editModal.name,
  excerpt: this.state.editModal.excerpt,
  description: this.state.editModal.description,
  price: this.state.editModal.price,
  status: this.state.editModal.status,
  isPromoted: this.state.editModal.isPromoted,
  features: this.state.editModal.features
  .filter(feature => feature.use === 1)
  .map(feature => ({
    featureId: feature.featureId,
    value: feature.value,
  })),

}, 'administrator')
.then((res: ApiResponse) => {
  if  (res.status === 'login'){
      this.setLogginState(false);
      return;
    }

    if(res.status === "error"){
      this.setEditModalStringFieldState('message', res.data);
      return;
    }

    this.setEditModalVisibleState(false);
    this.getArticles();

});

}

private showAddModal(){
   this.setAddModalStringFieldState('name','');
   this.setAddModalStringFieldState('excerpt','');
   this.setAddModalStringFieldState('description', '');
   this.setAddModalStringFieldState('message', '');
   this.setAddModalNumberFieldState('categoryId', '1');
   this.setAddModalNumberFieldState('price', '0.01');



   this.setState(Object.assign(this.state,
    Object.assign(this.state.addModal, {
      features: [],
    }),
    ));

   this.setAddModalVisibleState(true);



}

private async showEditModal(article: ArticleType){

  this.setEditModalStringFieldState('name', String(article.name));
  this.setEditModalNumberFieldState('articleId', article.articleId);
  this.setEditModalStringFieldState('message', '');
  this.setEditModalStringFieldState('excerpt', String(article.excerpt));
  this.setEditModalStringFieldState('description', String(article.description));
  this.setEditModalStringFieldState('status', String(article.status));
  this.setEditModalNumberFieldState('price', article.price);
  this.setEditModalNumberFieldState('isPromoted', article.isPromoted);


  if(!article.categoryId){
      return;
  }

  const categoryId: number = article.categoryId;


  const allFeatures: any[]= await this.getFeaturesByCategoryId(categoryId)
  for(const apiFeature of allFeatures){
        apiFeature.use = 0;
        apiFeature.value = '';

    if(!article.articleFeatures){
      continue;
    }
    for (const articleFeature of article.articleFeatures){
      if(articleFeature.featureId === apiFeature.featureId){
        apiFeature.use = 1;
        apiFeature.value = articleFeature.value;

      }

    }
  }

  this.setState(Object.assign(this.state,
    Object.assign(this.state.editModal,{
      features: allFeatures,
    }),
    ));

  this.setEditModalVisibleState(true);

}


}
export default AdministratorDashboardArticle;
